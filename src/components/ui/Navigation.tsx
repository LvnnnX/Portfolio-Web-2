import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { label: "HOME", href: "#home" },
  { label: "ABOUT", href: "#about" },
  { label: "PROJECTS", href: "#projects" },
  { label: "TOOLS", href: "#tools" },
  { label: "SKILLS", href: "#skills" },
  { label: "CONTACT", href: "#contact" },
];

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-fit">
      <div className={`liquid-glass px-2 md:px-4 py-1.5 md:py-2 flex items-center gap-2 md:gap-6 transition-all duration-500 ${scrolled ? 'scale-100' : 'scale-105'}`}>
        <div className="text-lg md:text-xl font-bold px-2 text-primary hidden xs:block">
          <a href="#home">DG</a>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="px-4 py-2 rounded-xl text-[13px] font-bold tracking-wide hover:bg-primary/10 hover:text-primary transition-all"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Mobile Toggle Icons/Labels */}
        <div className="flex md:hidden items-center gap-1">
          {NAV_ITEMS.slice(0, 3).map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="px-2 py-1.5 rounded-lg text-[10px] font-black tracking-tighter hover:text-primary transition-all"
            >
              {item.label}
            </a>
          ))}
          <button
            className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors ml-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-3 liquid-glass p-3 md:hidden flex flex-col gap-1"
            >
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="px-3 py-2.5 rounded-lg text-[12px] font-bold tracking-wide hover:bg-primary/10 hover:text-primary transition-all text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}