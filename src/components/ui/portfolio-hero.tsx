import React, { useState, useEffect, useRef, useMemo } from "react";
import { ChevronDown, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
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
            filter: inView ? "blur(0px)" : "blur(10px)",
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
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState("HOME");
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  useEffect(() => {
    const sectionIds = ["home", "about", "experience", "projects", "skills", "contact"];

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id.toUpperCase());
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const menuItems = [
    { label: "HOME", href: "#home" },
    { label: "ABOUT", href: "#about" },
    { label: "EXPERIENCE", href: "#experience" },
    { label: "PROJECTS", href: "#projects" },
    { label: "SKILLS", href: "#skills" },
    { label: "CONTACT", href: "#contact" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-background text-black dark:text-foreground transition-colors duration-500 overflow-hidden">
      {/* Liquid Glass Navbar */}
      <div className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-6">
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative flex items-center p-1.5 liquid-glass border-border/10 shadow-apple"
          style={{ maxWidth: "fit-content" }}
        >
          <nav className="flex items-center gap-1">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`relative px-4 py-2 text-[13px] font-bold tracking-tight rounded-full transition-colors duration-300 z-10 ${activeTab === item.label ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                onMouseEnter={() => setHoveredTab(item.label)}
                onMouseLeave={() => setHoveredTab(null)}
                onClick={() => setActiveTab(item.label)}
              >
                {item.label}
                {/* Liquid sliding background */}
                {hoveredTab === item.label && (
                  <motion.div
                    layoutId="navbar-hover"
                    className="absolute inset-0 bg-white/10 dark:bg-black/20 rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
                {activeTab === item.label && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-primary/10 rounded-full -z-20 border border-primary/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </a>
            ))}

            {/* Vertical Divider */}
            <div className="w-px h-4 bg-border/20 mx-2" />

            {/* Theme Toggle inside Pill */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors relative"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon size={18} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </nav>
        </motion.header>
      </div>

      <main className="relative min-h-screen flex flex-col items-center justify-center">
        <div className="relative w-full px-4 text-center mt-20 select-none">

          {/* PANDE – top row */}
          <BlurText
            text="PANDE"
            delay={100}
            animateBy="letters"
            direction="top"
            className="font-bold text-[80px] sm:text-[120px] md:text-[160px] lg:text-[200px] leading-[0.85] tracking-[-0.04em] uppercase text-black dark:text-foreground inline-flex flex-wrap justify-center"
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
            className="font-bold text-[80px] sm:text-[120px] md:text-[160px] lg:text-[200px] leading-[0.85] tracking-[-0.04em] uppercase text-black dark:text-foreground inline-flex flex-wrap justify-center"
          />
        </div>

        <div className="mt-16 w-full px-6 flex flex-col items-center gap-8">
          <BlurText
            text="Data Scientist & AI Specialist • 900+ Hours ML Training"
            delay={150}
            animateBy="words"
            direction="top"
            className="text-[17px] sm:text-[19px] md:text-[21px] font-medium tracking-tight text-neutral-600 dark:text-muted-foreground text-center"
          />


        </div>

        <button
          type="button"
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-neutral-500 dark:text-muted-foreground hover:text-black dark:hover:text-foreground transition-colors duration-300 pointer-events-auto"
          aria-label="Scroll down"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </main>
    </div>
  );
}