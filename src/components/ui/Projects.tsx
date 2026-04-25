import { useState, useRef } from "react";
import { X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import data from "../../../experience.json";

interface Project {
  id: number;
  emoji: string;
  title: string;
  role: string;
  period: string;
  category: string;
  description: string | string[];
  techStack: string[];
}

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const projects = data.projects as Project[];

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
    <div id="projects" className="py-10 md:py-16 px-3 md:px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-6 md:mb-12 px-2 md:px-4">
          <div>
            <h2 className="text-[28px] md:text-[40px] font-semibold tracking-[-0.02em] text-foreground">Featured Projects</h2>
            <p className="text-muted-foreground mt-1 md:mt-2 text-[12px] md:text-[16px] font-medium">Selected works in AI & Web.</p>
          </div>
          <div className="flex gap-1.5">
            <button 
              onClick={() => scroll("left")}
              className="p-1.5 md:p-3 rounded-full liquid-glass hover:bg-primary/10 transition-colors"
            >
              <ChevronLeft size={16} md:size={20} />
            </button>
            <button 
              onClick={() => scroll("right")}
              className="p-1.5 md:p-3 rounded-full liquid-glass hover:bg-primary/10 transition-colors"
            >
              <ChevronRight size={16} md:size={20} />
            </button>
          </div>
        </div>
        
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-3 md:gap-8 pt-3 md:pt-6 pb-5 md:pb-8 px-2 md:px-4 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
        >
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="min-w-[220px] md:min-w-[400px] flex flex-col liquid-glass p-4 md:p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer group snap-start"
              onClick={() => setSelectedProject(project)}
            >
              <div className="text-[24px] md:text-[40px] mb-3 md:mb-6 transform transition-transform group-hover:scale-110 duration-300">
                {project.emoji}
              </div>
              
              <div className="mb-2 md:mb-4">
                <span className="text-[9px] md:text-[12px] font-bold text-primary tracking-widest uppercase">
                  {project.category}
                </span>
              </div>
              
              <h3 className="text-[16px] md:text-[24px] font-bold mb-1 md:mb-2 tracking-tight text-foreground transition-colors group-hover:text-primary leading-tight">
                {project.title}
              </h3>
              
              <p className="text-[12px] md:text-[14px] font-semibold text-muted-foreground mb-3 md:mb-6">
                {project.role} • {project.period}
              </p>
              
              <p className="text-[12px] md:text-[15px] leading-[1.5] text-muted-foreground mb-4 md:mb-8 flex-grow line-clamp-3 md:line-clamp-4">
                {Array.isArray(project.description) ? project.description[0] : project.description}
              </p>
              
              <div className="flex flex-wrap gap-1 md:gap-2 mt-auto">
                {project.techStack.slice(0, 3).map((tech) => (
                  <span key={tech} className="bg-muted px-2 py-0.5 md:px-2.5 md:py-1 rounded-[4px] md:rounded-[6px] text-[9px] md:text-[11px] font-bold text-foreground/60 border border-border/20">
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="mt-4 md:mt-8 text-primary font-bold text-[11px] md:text-[14px] flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                Details <ExternalLink size={10} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modern Liquid Glass Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:p-6 backdrop-blur-xl bg-black/40 animate-in fade-in duration-300 overflow-y-auto"
          onClick={() => setSelectedProject(null)}
        >
          <div 
            className="liquid-glass w-full max-w-2xl my-auto slide-in-from-bottom-8 duration-500 relative flex flex-col"
            style={{ borderRadius: '32px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 right-0 p-6 flex justify-end z-20">
              <button 
                onClick={() => setSelectedProject(null)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={24} className="text-foreground" />
              </button>
            </div>
            
            <div className="px-10 pb-12">
              <div className="text-[64px] mb-8">{selectedProject.emoji}</div>
              <span className="text-primary font-bold text-[14px] tracking-widest uppercase mb-2 block">
                {selectedProject.category}
              </span>
              <h2 className="text-[40px] font-bold tracking-tight mb-2 text-foreground">
                {selectedProject.title}
              </h2>
              <p className="text-[18px] font-semibold text-muted-foreground mb-8">
                {selectedProject.role} • {selectedProject.period}
              </p>
              
              <div className="space-y-6 text-[17px] leading-[1.7] text-foreground/90 font-medium whitespace-pre-wrap">
                {Array.isArray(selectedProject.description) 
                  ? selectedProject.description.map((p, i) => <p key={i}>{p}</p>)
                  : <p>{selectedProject.description}</p>
                }
              </div>
              
              <div className="mt-12">
                <h4 className="text-[14px] font-bold text-foreground/90 uppercase tracking-widest mb-4">Core Technologies</h4>
                <div className="flex flex-wrap gap-3 mb-10">
                  {selectedProject.techStack.map((tech) => (
                    <span key={tech} className="bg-primary/10 text-primary px-4 py-2 rounded-[8px] text-[13px] font-bold border border-primary/20">
                      {tech}
                    </span>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}