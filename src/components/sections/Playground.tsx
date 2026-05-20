import { useCallback, useEffect, useRef, useState } from "react";
import { Upload, Loader2, AlertCircle } from "lucide-react";
import {
  detect,
  type Detection,
  type InferenceResult,
} from "../../lib/yolov8-inference";

const ACCEPT = "image/png,image/jpeg,image/webp";
const PALETTE = [
  "#0071E3",
  "#34C759",
  "#FF9F0A",
  "#FF3B30",
  "#B8422E",
  "#5E5CE6",
  "#BF5AF2",
];

interface CanvasSize {
  w: number;
  h: number;
}

export default function Playground() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InferenceResult | null>(null);
  const [canvasSize, setCanvasSize] = useState<CanvasSize>({ w: 0, h: 0 });

  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const drawOverlay = useCallback(
    (detections: Detection[]) => {
      const canvas = canvasRef.current;
      const img = imgRef.current;
      if (!canvas || !img) return;

      const rect = img.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      setCanvasSize({ w: rect.width, h: rect.height });

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const scaleX = rect.width / img.naturalWidth;
      const scaleY = rect.height / img.naturalHeight;

      ctx.font = "600 12px 'SF Pro Text', Inter, system-ui";
      ctx.textBaseline = "top";

      detections.forEach((det) => {
        const color = PALETTE[det.classId % PALETTE.length];
        const x = det.x * scaleX;
        const y = det.y * scaleY;
        const w = det.width * scaleX;
        const h = det.height * scaleY;

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);

        const labelText = `${det.label} ${(det.score * 100).toFixed(0)}%`;
        const padding = 4;
        const metrics = ctx.measureText(labelText);
        const labelW = metrics.width + padding * 2;
        const labelH = 18;
        ctx.fillStyle = color;
        ctx.fillRect(x, Math.max(0, y - labelH), labelW, labelH);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(labelText, x + padding, Math.max(0, y - labelH) + 3);
      });
    },
    [],
  );

  const runInference = useCallback(async () => {
    const img = imgRef.current;
    if (!img || !img.complete) return;
    setBusy(true);
    setError(null);
    try {
      const res = await detect(img);
      setResult(res);
      drawOverlay(res.detections);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Inference failed");
    } finally {
      setBusy(false);
    }
  }, [drawOverlay]);

  // Re-draw on window resize so the overlay stays aligned with the displayed image.
  useEffect(() => {
    const handler = () => {
      if (result) drawOverlay(result.detections);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [result, drawOverlay]);

  const onFile = (file: File | null) => {
    if (!file) return;
    setResult(null);
    setError(null);
    const url = URL.createObjectURL(file);
    setImageUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  };

  const onImageLoad = () => {
    void runInference();
  };

  const epLabel = (ep: InferenceResult["executionProvider"]) => {
    switch (ep) {
      case "webgpu":
        return "WebGPU";
      case "wasm":
        return "WASM";
      case "mock":
        return "Mock";
    }
  };

  return (
    <div id="playground" className="py-12 md:py-20 px-4 md:px-6 relative">
      <div className="max-w-5xl mx-auto">
        <p className="text-[10px] md:text-[12px] font-bold tracking-[0.12em] uppercase text-[color:var(--color-accent,#B8422E)] mb-3">
          Live demo
        </p>
        <h2 className="text-[28px] md:text-[40px] font-semibold tracking-[-0.02em] text-foreground mb-3">
          Playground
        </h2>
        <p className="text-[13px] md:text-[16px] leading-[1.6] text-muted-foreground max-w-[640px] mb-8 md:mb-10">
          Drop a fruit-or-bomb image. The YOLOv8 detector runs in your browser via{" "}
          <code className="font-mono text-[12px] md:text-[14px]">onnxruntime-web</code>, with WebGPU
          when available and WASM as a fallback.
        </p>

        <div className="liquid-glass rounded-[28px] p-5 md:p-8 flex flex-col gap-5">
          <div className="flex flex-wrap gap-3 items-center">
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT}
              hidden
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-[13px] md:text-[14px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              disabled={busy}
            >
              <Upload size={14} /> Choose image
            </button>
            {imageUrl && (
              <button
                type="button"
                onClick={() => void runInference()}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-full bg-muted px-5 py-3 text-[13px] md:text-[14px] font-bold text-foreground transition-colors hover:bg-muted/80 disabled:opacity-50"
              >
                {busy ? <Loader2 size={14} className="animate-spin" /> : null}
                {busy ? "Running…" : "Re-run"}
              </button>
            )}
          </div>

          <div className="relative rounded-[20px] overflow-hidden border border-border/30 bg-black/20 min-h-[240px] md:min-h-[360px] flex items-center justify-center">
            {!imageUrl && (
              <p className="text-[12px] md:text-[14px] text-muted-foreground px-4 text-center">
                Pick an image to see real-time detection.
              </p>
            )}
            {imageUrl && (
              <div className="relative w-full">
                <img
                  ref={imgRef}
                  src={imageUrl}
                  alt="Inference target"
                  onLoad={onImageLoad}
                  className="block w-full h-auto"
                />
                <canvas
                  ref={canvasRef}
                  width={canvasSize.w}
                  height={canvasSize.h}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 md:gap-4">
            <div className="rounded-[14px] bg-muted/40 p-3 md:p-4">
              <p className="text-[10px] md:text-[11px] font-semibold tracking-[0.12em] uppercase text-muted-foreground mb-1">
                Latency
              </p>
              <p className="text-[16px] md:text-[20px] font-mono font-bold text-foreground">
                {result ? `${result.latencyMs.toFixed(1)} ms` : "—"}
              </p>
            </div>
            <div className="rounded-[14px] bg-muted/40 p-3 md:p-4">
              <p className="text-[10px] md:text-[11px] font-semibold tracking-[0.12em] uppercase text-muted-foreground mb-1">
                Backend
              </p>
              <p className="text-[16px] md:text-[20px] font-mono font-bold text-foreground">
                {result ? epLabel(result.executionProvider) : "—"}
              </p>
            </div>
            <div className="rounded-[14px] bg-muted/40 p-3 md:p-4">
              <p className="text-[10px] md:text-[11px] font-semibold tracking-[0.12em] uppercase text-muted-foreground mb-1">
                Detections
              </p>
              <p className="text-[16px] md:text-[20px] font-mono font-bold text-foreground">
                {result ? result.detections.length : "—"}
              </p>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-[14px] bg-[color:var(--color-danger,#FF3B30)]/10 border border-[color:var(--color-danger,#FF3B30)]/30 p-3 text-[12px] md:text-[13px] text-foreground">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {result?.executionProvider === "mock" && (
            <p className="text-[11px] md:text-[12px] text-muted-foreground italic">
              Note: real ONNX weights aren&apos;t deployed yet — these are placeholder boxes so the UI can be exercised. Drop <code className="font-mono">public/models/fruit-ninja.onnx</code> to switch to live inference.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
