import { useRef } from "react";
import { 
  Code2, 
  Terminal, 
  Cpu, 
  Database, 
  Cloud, 
  Layout, 
  Blocks, 
  Sparkles, 
  BarChart, 
  Mic2, 
  FileCode2, 
  Layers,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { motion } from "framer-motion";

const GitHubIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className || "w-6 h-6"}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const CATEGORIES = [
  {
    title: "Language",
    items: [
      { name: "Python", icon: <Terminal className="text-yellow-500" /> },
      { name: "C++", icon: <Code2 className="text-blue-600" /> },
      { name: "TypeScript", icon: <Code2 className="text-blue-400" /> },
      { name: "JavaScript", icon: <Code2 className="text-yellow-400" /> },
      { name: "HTML", icon: <Layout className="text-orange-500" /> },
      { name: "CSS", icon: <Layout className="text-blue-500" /> },
      { name: "SQL", icon: <Database className="text-blue-500" /> },
    ],
  },
  {
    title: "Tools",
    items: [
      { name: "Pandas", icon: <BarChart className="text-blue-800" /> },
      { name: "NumPy", icon: <Cpu className="text-blue-500" /> },
      { name: "Openpyxl", icon: <FileCode2 /> },
      { name: "Rapidminer", icon: <Cpu /> },
      { name: "Matplotlib", icon: <BarChart className="text-orange-500" /> },
      { name: "Seaborn", icon: <BarChart /> },
      { name: "Plotly", icon: <BarChart className="text-blue-400" /> },
      { name: "Dash", icon: <BarChart /> },
      { name: "TensorFlow", icon: <Cpu className="text-orange-600" /> },
      { name: "Keras", icon: <Cpu className="text-red-600" /> },
      { name: "Scikit-learn", icon: <Cpu /> },
      { name: "Keras-tuner", icon: <Cpu /> },
      { name: "Catboost", icon: <Cpu /> },
      { name: "Librosa", icon: <Mic2 className="text-purple-500" /> },
      { name: "PyAudio", icon: <Mic2 /> },
      { name: "SpeechRecognition", icon: <Mic2 /> },
      { name: "Pydub", icon: <Mic2 /> },
      { name: "Soundfile", icon: <Mic2 /> },
      { name: "GitHub", icon: <GitHubIcon /> },
      { name: "Vercel", icon: <Cloud /> },
      { name: "Azure", icon: <Cloud className="text-blue-500" /> },
      { name: "VS Code", icon: <Code2 /> },
      { name: "Jupyter", icon: <Terminal className="text-orange-500" /> },
      { name: "Vite", icon: <Blocks className="text-purple-400" /> },
    ],
  },
  {
    title: "Tech Stack",
    items: [
      { name: "React", icon: <Blocks className="text-blue-400" /> },
      { name: "Next.js", icon: <Blocks /> },
      { name: "Flask", icon: <Terminal /> },
      { name: "Tailwind", icon: <Layout className="text-teal-400" /> },
      { name: "Framer Motion", icon: <Blocks className="text-purple-500" /> },
      { name: "Lucide React", icon: <Blocks /> },
      { name: "Three.js", icon: <Blocks className="text-white" /> },
      { name: "Gemini AI", icon: <Sparkles className="text-purple-400" /> },
      { name: "MCP", icon: <Layers /> },
      { name: "RAG", icon: <Layers /> },
      { name: "OpenAI Connector", icon: <Cpu /> },
      { name: "PySerial", icon: <Terminal /> },
    ],
  },
];

export default function Tools() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div id="tools" className="py-12 px-6 relative z-40">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12 px-4">
          <div>
            <h2 className="text-[40px] font-bold tracking-[-0.02em] text-foreground">Stack & Toolbox</h2>
            <p className="text-muted-foreground mt-2 font-medium">Categorized technologies I work with.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => scroll("left")}
              className="p-3 rounded-full liquid-glass hover:bg-primary/10 transition-colors"
            >
              <ChevronLeft />
            </button>
            <button 
              onClick={() => scroll("right")}
              className="p-3 rounded-full liquid-glass hover:bg-primary/10 transition-colors"
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-3 md:gap-8 pb-5 md:pb-8 px-2 md:px-4 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
        >
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="min-w-[220px] md:min-w-[450px] snap-start"
            >
              <div className="liquid-glass p-4 md:p-8 h-full flex flex-col">
                <h3 className="text-lg md:text-2xl font-bold mb-4 md:mb-8 text-primary flex items-center gap-2 md:gap-3">
                  <span className="w-6 md:w-8 h-[2px] bg-primary/30" /> {cat.title}
                </h3>
                
                <div className="grid grid-cols-3 gap-2 md:gap-4 max-h-[180px] md:max-h-[240px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
                  {cat.items.map((item) => (
                    <div 
                      key={item.name}
                      className="flex flex-col items-center p-2 md:p-4 rounded-xl md:rounded-2xl bg-foreground/[0.03] border border-foreground/[0.05] hover:bg-foreground/[0.06] transition-colors h-[70px] md:h-[100px] justify-center"
                    >
                      <div className="text-lg md:text-2xl mb-1 md:mb-2">
                        {item.icon}
                      </div>
                      <span className="text-[9px] md:text-[11px] font-bold text-center leading-tight">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
