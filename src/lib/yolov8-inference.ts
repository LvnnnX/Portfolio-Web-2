/**
 * YOLOv8 inference helper for the in-browser ML playground.
 *
 * - Lazy-loads onnxruntime-web only when first used (so the home route stays light).
 * - Tries WebGPU first, falls back to WASM (per CLAUDE.md §3 / SRS NFR-3).
 * - Falls back to "mock mode" with synthetic boxes when the model file is missing,
 *   so the UI is fully testable before the real .onnx is dropped into public/models/.
 */

export interface Detection {
  x: number;
  y: number;
  width: number;
  height: number;
  score: number;
  classId: number;
  label: string;
}

export interface InferenceResult {
  detections: Detection[];
  latencyMs: number;
  executionProvider: "webgpu" | "wasm" | "mock";
  inputWidth: number;
  inputHeight: number;
}

const MODEL_URL = "/models/fruit-ninja.onnx";
const INPUT_SIZE = 416;
// Fruit Ninja class set (matches the case study). Order must match the model output.
const CLASS_LABELS = [
  "apple",
  "banana",
  "watermelon",
  "pineapple",
  "kiwi",
  "orange",
  "bomb",
];

let sessionPromise: Promise<InferenceSession | null> | null = null;

interface InferenceSession {
  run: (input: Float32Array) => Promise<{ output: Float32Array; shape: number[] }>;
  executionProvider: "webgpu" | "wasm";
}

async function loadSession(): Promise<InferenceSession | null> {
  // Probe the model first — if it's not deployed yet, return null so callers can fall back to mock mode.
  const head = await fetch(MODEL_URL, { method: "HEAD" }).catch(() => null);
  if (!head?.ok) return null;

  const ort = await import("onnxruntime-web");

  const tryProvider = async (
    provider: "webgpu" | "wasm",
  ): Promise<InferenceSession | null> => {
    try {
      const session = await ort.InferenceSession.create(MODEL_URL, {
        executionProviders: [provider],
      });
      return {
        executionProvider: provider,
        run: async (input) => {
          const tensor = new ort.Tensor("float32", input, [1, 3, INPUT_SIZE, INPUT_SIZE]);
          const inputName = session.inputNames[0];
          const outputName = session.outputNames[0];
          const feeds = { [inputName]: tensor };
          const results = await session.run(feeds);
          const out = results[outputName];
          return { output: out.data as Float32Array, shape: out.dims as number[] };
        },
      };
    } catch (err) {
      console.warn(`[yolov8] ${provider} unavailable:`, err);
      return null;
    }
  };

  return (await tryProvider("webgpu")) ?? (await tryProvider("wasm"));
}

function getSession(): Promise<InferenceSession | null> {
  if (!sessionPromise) sessionPromise = loadSession();
  return sessionPromise;
}

/** Letterbox an image into a 416×416 RGB Float32Array (CHW, 0..1). */
function letterbox(image: HTMLImageElement | HTMLCanvasElement): {
  data: Float32Array;
  scale: number;
  padX: number;
  padY: number;
} {
  const canvas = document.createElement("canvas");
  canvas.width = INPUT_SIZE;
  canvas.height = INPUT_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  const srcW = "naturalWidth" in image ? image.naturalWidth : image.width;
  const srcH = "naturalHeight" in image ? image.naturalHeight : image.height;
  const scale = Math.min(INPUT_SIZE / srcW, INPUT_SIZE / srcH);
  const drawW = Math.round(srcW * scale);
  const drawH = Math.round(srcH * scale);
  const padX = Math.floor((INPUT_SIZE - drawW) / 2);
  const padY = Math.floor((INPUT_SIZE - drawH) / 2);

  ctx.fillStyle = "#727272";
  ctx.fillRect(0, 0, INPUT_SIZE, INPUT_SIZE);
  ctx.drawImage(image, padX, padY, drawW, drawH);

  const { data } = ctx.getImageData(0, 0, INPUT_SIZE, INPUT_SIZE);
  const out = new Float32Array(3 * INPUT_SIZE * INPUT_SIZE);
  const channelSize = INPUT_SIZE * INPUT_SIZE;
  for (let i = 0; i < channelSize; i++) {
    const r = data[i * 4] / 255;
    const g = data[i * 4 + 1] / 255;
    const b = data[i * 4 + 2] / 255;
    out[i] = r;
    out[channelSize + i] = g;
    out[channelSize * 2 + i] = b;
  }

  return { data: out, scale, padX, padY };
}

function iou(a: Detection, b: Detection): number {
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.width, b.x + b.width);
  const y2 = Math.min(a.y + a.height, b.y + b.height);
  const intersection = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  const union = a.width * a.height + b.width * b.height - intersection;
  return union <= 0 ? 0 : intersection / union;
}

/** Greedy class-aware NMS. */
function nms(detections: Detection[], iouThreshold = 0.45): Detection[] {
  const sorted = [...detections].sort((a, b) => b.score - a.score);
  const kept: Detection[] = [];
  for (const det of sorted) {
    const overlap = kept.find((k) => k.classId === det.classId && iou(k, det) > iouThreshold);
    if (!overlap) kept.push(det);
  }
  return kept;
}

/**
 * Decode YOLOv8 raw output (anchor-free, [1, 4+nClasses, N]) into Detection[]
 * in **letterboxed image space** (0..INPUT_SIZE). Caller maps back to source.
 */
function decode(output: Float32Array, shape: number[], confidenceThreshold = 0.25): Detection[] {
  // Expected shape: [1, 4 + numClasses, numAnchors]
  if (shape.length !== 3) return [];
  const numChannels = shape[1];
  const numAnchors = shape[2];
  const numClasses = numChannels - 4;
  const detections: Detection[] = [];

  for (let i = 0; i < numAnchors; i++) {
    let bestClass = -1;
    let bestScore = 0;
    for (let c = 0; c < numClasses; c++) {
      const score = output[(4 + c) * numAnchors + i];
      if (score > bestScore) {
        bestScore = score;
        bestClass = c;
      }
    }
    if (bestScore < confidenceThreshold || bestClass < 0) continue;

    const cx = output[0 * numAnchors + i];
    const cy = output[1 * numAnchors + i];
    const w = output[2 * numAnchors + i];
    const h = output[3 * numAnchors + i];

    detections.push({
      x: cx - w / 2,
      y: cy - h / 2,
      width: w,
      height: h,
      score: bestScore,
      classId: bestClass,
      label: CLASS_LABELS[bestClass] ?? `class_${bestClass}`,
    });
  }

  return nms(detections);
}

/** Map detections from letterboxed 416×416 space back to source image coordinates. */
function unletterbox(
  dets: Detection[],
  scale: number,
  padX: number,
  padY: number,
): Detection[] {
  return dets.map((d) => ({
    ...d,
    x: (d.x - padX) / scale,
    y: (d.y - padY) / scale,
    width: d.width / scale,
    height: d.height / scale,
  }));
}

/** Return random plausible boxes so the UI is testable before a real model is shipped. */
function mockDetect(image: HTMLImageElement): Detection[] {
  const w = image.naturalWidth;
  const h = image.naturalHeight;
  const count = 2 + Math.floor(Math.random() * 3);
  const out: Detection[] = [];
  for (let i = 0; i < count; i++) {
    const bw = Math.round(w * (0.12 + Math.random() * 0.18));
    const bh = Math.round(h * (0.14 + Math.random() * 0.2));
    const x = Math.round(Math.random() * (w - bw));
    const y = Math.round(Math.random() * (h - bh));
    const classId = Math.floor(Math.random() * CLASS_LABELS.length);
    out.push({
      x,
      y,
      width: bw,
      height: bh,
      score: 0.55 + Math.random() * 0.4,
      classId,
      label: CLASS_LABELS[classId],
    });
  }
  return out;
}

export async function detect(image: HTMLImageElement): Promise<InferenceResult> {
  const session = await getSession();
  const inputWidth = image.naturalWidth;
  const inputHeight = image.naturalHeight;

  if (!session) {
    // Mock path — model not deployed yet.
    const start = performance.now();
    // Tiny artificial delay so latency feels real to the eye.
    await new Promise((r) => setTimeout(r, 60 + Math.random() * 40));
    const detections = mockDetect(image);
    return {
      detections,
      latencyMs: performance.now() - start,
      executionProvider: "mock",
      inputWidth,
      inputHeight,
    };
  }

  const start = performance.now();
  const { data, scale, padX, padY } = letterbox(image);
  const { output, shape } = await session.run(data);
  const decoded = decode(output, shape);
  const remapped = unletterbox(decoded, scale, padX, padY);
  return {
    detections: remapped,
    latencyMs: performance.now() - start,
    executionProvider: session.executionProvider,
    inputWidth,
    inputHeight,
  };
}
