import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";

interface NavItem {
  label: string;
  to: string;
}

const ITEMS: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "Writing", to: "/writing" },
];

export default function Navigation() {
  const location = useLocation();
  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("dark"),
  );
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const isActive = (to: string) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  return (
    <div className="fixed top-3 md:top-6 left-0 right-0 z-[100] flex justify-center px-2 md:px-6 pointer-events-none">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative flex items-center p-1 md:p-1.5 liquid-glass border-border/10 shadow-apple pointer-events-auto"
        style={{ maxWidth: "fit-content" }}
      >
        <nav className="flex items-center gap-0 md:gap-1">
          {ITEMS.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`relative px-2.5 py-1.5 md:px-4 md:py-2 text-[10px] md:text-[13px] font-bold tracking-tight rounded-full transition-colors duration-300 z-10 whitespace-nowrap ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
                onMouseEnter={() => setHovered(item.label)}
                onMouseLeave={() => setHovered(null)}
              >
                {item.label}
                {hovered === item.label && (
                  <motion.div
                    layoutId="navbar-hover"
                    className="absolute inset-0 bg-white/10 dark:bg-black/20 rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
                {active && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-primary/10 rounded-full -z-20 border border-primary/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}

          <div className="w-px h-3 md:h-4 bg-border/20 mx-1 md:mx-2" />

          <button
            onClick={() => setIsDark((v) => !v)}
            className="p-1.5 md:p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors relative"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
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
                  <Moon className="w-[14px] h-[14px] md:w-[18px] md:h-[18px]" />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="w-[14px] h-[14px] md:w-[18px] md:h-[18px]" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </nav>
      </motion.header>
    </div>
  );
}
