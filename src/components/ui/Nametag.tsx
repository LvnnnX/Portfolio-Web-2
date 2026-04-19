import { useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// ── Layout constants ────────────────────────────────────────────────
const CARD_W = 154;
const CARD_H = 278;
const CONTAINER_W = 210;
const CONTAINER_H = 440;
const ANCHOR_X = CONTAINER_W / 2;       // fixed rope anchor (SVG coords)
const ANCHOR_Y = 4;                       // visually centered in upper bar
const REST_CARD_X = (CONTAINER_W - CARD_W) / 2;  // card left at rest
const REST_CARD_Y = ANCHOR_Y + 72;               // card top at rest

export default function Nametag() {
  // ── Framer Motion spring physics ───────────────────────────────────
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // "Rubbery elastic" spring – low damping = bouncy
  const springCfg = { stiffness: 260, damping: 16, mass: 1.1 };
  const springX = useSpring(rawX, springCfg);
  const springY = useSpring(rawY, springCfg);

  // Slight tilt from horizontal displacement
  const rotate = useTransform(springX, [-120, 0, 120], [-14, 0, 14]);

  // ── Lanyard SVG ────────────────────────────────────────────────────
  const ropeRef = useRef<SVGPathElement>(null);
  const chainRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const CARD_TOP_CX = REST_CARD_X + CARD_W / 2; // card center X at rest

    const draw = () => {
      const sx = springX.get();
      const sy = springY.get();

      // Attachment point inside card grommet hole (offset by card's spring movement)
      const attachX = CARD_TOP_CX + sx;
      const attachY = REST_CARD_Y + 20 + sy;

      // Drooping control point – gravity effect
      const ctrlX = (ANCHOR_X + attachX) / 2;
      const ctrlY = ANCHOR_Y + (attachY - ANCHOR_Y) * 0.55;

      const d = `M ${ANCHOR_X} ${ANCHOR_Y} Q ${ctrlX} ${ctrlY} ${attachX} ${attachY}`;
      ropeRef.current?.setAttribute("d", d);
      chainRef.current?.setAttribute("d", d);
    };

    const unX = springX.on("change", draw);
    const unY = springY.on("change", draw);
    draw();
    return () => { unX(); unY(); };
  }, [springX, springY]);

  // ── Drag handling ──────────────────────────────────────────────────
  const dragging = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startCard = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true;
    startMouse.current = { x: e.clientX, y: e.clientY };
    startCard.current = { x: rawX.get(), y: rawY.get() };
    e.preventDefault();
  }, [rawX, rawY]);

  // Touch support
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    dragging.current = true;
    startMouse.current = { x: t.clientX, y: t.clientY };
    startCard.current = { x: rawX.get(), y: rawY.get() };
  }, [rawX, rawY]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      rawX.set(startCard.current.x + (e.clientX - startMouse.current.x));
      rawY.set(startCard.current.y + (e.clientY - startMouse.current.y));
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.current) return;
      const t = e.touches[0];
      rawX.set(startCard.current.x + (t.clientX - startMouse.current.x));
      rawY.set(startCard.current.y + (t.clientY - startMouse.current.y));
    };
    const onUp = () => {
      dragging.current = false;
      rawX.set(0);  // spring snaps back
      rawY.set(0);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [rawX, rawY]);

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div
      className="relative select-none flex-shrink-0 !overflow-visible z-50"
      style={{ width: CONTAINER_W, height: CONTAINER_H }}
    >
      {/* ── SVG Lanyard ────────────────────────────────────────────── */}
      <svg
        className="absolute inset-0 pointer-events-none overflow-visible"
        width={CONTAINER_W}
        height={CONTAINER_H}
        viewBox={`0 0 ${CONTAINER_W} ${CONTAINER_H}`}
        style={{ zIndex: 1 }}
      >
        {/* Ceiling bar */}
        <rect
          x={ANCHOR_X - 18} y={0}
          width={36} height={8}
          rx={4}
          fill="rgba(255,255,255,0.25)"
        />

        {/* Rope shadow / depth */}
        <path
          ref={chainRef}
          stroke="rgba(0,0,0,0.25)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />

        {/* Main rope */}
        <path
          ref={ropeRef}
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Hook / grommet at anchor */}
        <circle cx={ANCHOR_X} cy={ANCHOR_Y} r={5}
          fill="rgba(255,255,255,0.5)"
          stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"
        />
      </svg>

      {/* ── Card ──────────────────────────────────────────────────── */}
      <motion.div
        className="absolute cursor-grab active:cursor-grabbing"
        style={{
          left: REST_CARD_X,
          top: REST_CARD_Y,
          width: CARD_W,
          height: CARD_H,
          x: springX,
          y: springY,
          rotate,
          zIndex: 2,
          borderRadius: 24,
          touchAction: "none",
        }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        whileTap={{ scale: 1.04 }}
      >
        {/* Glassmorphism card body */}
        <div
          className="w-full h-full liquid-glass overflow-hidden flex flex-col"
          style={{ borderRadius: 24 }}
        >
          {/* Grommet hole */}
          <div className="flex justify-center pt-3 flex-shrink-0">
            <div
              className="w-4 h-4 rounded-full shadow-inner"
              style={{
                background: "rgba(0,0,0,0.55)",
                border: "2px solid rgba(255,255,255,0.25)",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.1)",
              }}
            />
          </div>

          {/* ── Badge header strip ─────────────────────────────── */}
          <div
            className="mx-3 mt-2 rounded-[10px] flex items-center justify-center py-1 flex-shrink-0"
            style={{ background: "rgba(41,151,255,0.15)", border: "1px solid rgba(41,151,255,0.25)" }}
          >
            <span className="text-[9px] font-bold tracking-[0.18em] uppercase text-primary">
              Portfolio
            </span>
          </div>

          {/* ── Profile Photo ──────────────────────────────────── */}
          <div className="px-3 pt-2 flex-shrink-0">
            <div
              className="w-full overflow-hidden"
              style={{ borderRadius: 14, aspectRatio: "3 / 3.8" }}
            >
              <img
                src="/images/DSCF5041 copy.jpg"
                alt="Pande Dani"
                className="w-full h-full object-cover object-top"
                draggable={false}
              />
            </div>
          </div>

          {/* ── Name & title ───────────────────────────────────── */}
          <div className="px-4 pt-2 pb-3 text-center flex-1 flex flex-col justify-between">
            <div>
              <p className="font-extrabold text-[13px] text-foreground tracking-tight leading-tight">
                Pande Dani
              </p>
              <p className="text-[10px] text-primary font-semibold mt-0.5 tracking-wide">
                Data Scientist & AI
              </p>
            </div>

            {/* ── Bottom barcode-style decoration ─────────── */}
            <div
              className="mt-2 pt-2 flex flex-col items-center gap-1"
              style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
            >
              {/* Fake barcode lines */}
              <div className="flex gap-[2px] items-end h-4">
                {[3, 5, 2, 6, 4, 3, 5, 2, 4, 6, 3, 5, 2, 4, 5].map((h, i) => (
                  <div
                    key={i}
                    className="bg-foreground/30"
                    style={{ width: 1.5, height: h * 2, borderRadius: 1 }}
                  />
                ))}
              </div>
              <p className="text-[8px] text-muted-foreground font-mono tracking-widest">
                #PDGDW-2025
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
