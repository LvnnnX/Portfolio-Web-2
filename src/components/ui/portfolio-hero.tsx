import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";

interface BlurTextProps {
  text: string;
  delay?: number;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  className?: string;
  style?: React.CSSProperties;
}

const BlurText = React.memo(({
  text,
  delay = 50,
  animateBy = "words",
  direction = "top",
  className = "",
  style,
}: BlurTextProps) => {
  const [inView, setInView] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  );
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.1 }
    );

    const element = ref.current;
    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const segments = useMemo(() => {
    return animateBy === "words" ? text.split(" ") : text.split("");
  }, [text, animateBy]);

  return (
    <p ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {segments.map((segment, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            filter: inView ? "blur(0px)" : (isMobile ? "none" : "blur(10px)"),
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : `translateY(${direction === "top" ? "-20px" : "20px"})`,
            transition: `all 0.5s ease-out ${i * delay}ms`,
          }}
        >
          {segment}
          {animateBy === "words" && i < segments.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </p>
  );
});

BlurText.displayName = "BlurText";

export default function PortfolioHero() {
  return (
    <div className="min-h-screen bg-white dark:bg-background text-black dark:text-foreground transition-colors duration-500 overflow-hidden">
      <main className="relative min-h-screen flex flex-col items-center justify-center">
        <div className="relative w-full px-4 text-center mt-20 select-none">

          {/* PANDE – top row */}
          <BlurText
            text="PANDE"
            delay={100}
            animateBy="letters"
            direction="top"
            className="font-extrabold text-[80px] sm:text-[120px] md:text-[160px] lg:text-[200px] leading-[0.85] tracking-[-0.04em] uppercase text-black dark:text-foreground inline-flex flex-wrap justify-center"
          />

          {/* Middle row: oval image in the gap between the names */}
          <div className="flex items-center justify-center" style={{ marginTop: "clamp(-50px, -6.5vw, -110px)", marginBottom: "clamp(-50px, -6.5vw, -110px)", position: "relative", zIndex: 10 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="liquid-glass overflow-hidden cursor-pointer transition-transform duration-500 hover:scale-[1.04]"
                style={{
                  width: "clamp(120px, 15vw, 240px)",
                  height: "clamp(170px, 21vw, 350px)",
                  borderRadius: "40px",
                }}
              >
                <img
                  src="/images/hero_img.jpg"
                  alt="Profile – Pande Dani"
                  className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </motion.div>
          </div>

          {/* DANI – bottom row */}
          <BlurText
            text="DANI"
            delay={100}
            animateBy="letters"
            direction="top"
            className="font-extrabold text-[80px] sm:text-[120px] md:text-[160px] lg:text-[200px] leading-[0.85] tracking-[-0.04em] uppercase text-black dark:text-foreground inline-flex flex-wrap justify-center"
          />
        </div>

        <div className="mt-16 w-full px-6 flex flex-col items-center gap-6">
          <BlurText
            text="Computer Vision & Applied ML Engineer — Building Vision Systems for Real-World Automation"
            delay={120}
            animateBy="words"
            direction="top"
            className="text-[15px] sm:text-[17px] md:text-[19px] font-medium tracking-tight text-neutral-600 dark:text-muted-foreground text-center max-w-[720px]"
          />

          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-2">
            <div className="text-center">
              <p className="text-[22px] md:text-[28px] font-extrabold tracking-tight text-foreground">4+</p>
              <p className="text-[10px] md:text-[11px] font-semibold tracking-[0.12em] uppercase text-muted-foreground">Years Coding</p>
            </div>
            <div className="text-center">
              <p className="text-[22px] md:text-[28px] font-extrabold tracking-tight text-foreground">8+</p>
              <p className="text-[10px] md:text-[11px] font-semibold tracking-[0.12em] uppercase text-muted-foreground">Production Deployments</p>
            </div>
            <div className="text-center">
              <p className="text-[22px] md:text-[28px] font-extrabold tracking-tight text-foreground">3.98</p>
              <p className="text-[10px] md:text-[11px] font-semibold tracking-[0.12em] uppercase text-muted-foreground">GPA</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};