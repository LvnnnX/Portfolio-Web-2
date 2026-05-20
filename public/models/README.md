# Models

Drop the ONNX-exported YOLOv8 weights here as `fruit-ninja.onnx`.

## Export checklist (per `docs/CLAUDE.md` Phase 3)

- Export with **dynamic axes off**.
- Apply **INT8 quantization** where it doesn't tank accuracy.
- Confirm size **≤ 25 MB**. If larger, deploy a Hugging Face Space and embed via iframe instead.

## Quick Ultralytics export

```bash
yolo export model=runs/detect/best.pt format=onnx imgsz=416 dynamic=False simplify=True
```

For INT8 quantisation, follow Ultralytics' `--int8` flag with a calibration dataset.

## After dropping the file

The Playground UI auto-detects it via `HEAD /models/fruit-ninja.onnx`. No code change needed — the inference helper at `src/lib/yolov8-inference.ts` falls back to mock mode while the file is missing and switches to real inference (WebGPU then WASM) once it's deployed.
