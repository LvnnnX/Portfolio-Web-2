import { useState, useRef } from "react";
import { X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import data from "../../../experience.json";

interface ExperienceData {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string;
  category: string;
  skills: string[];
  photos?: string[];
}

export default function Experience() {
  const [selectedExp, setSelectedExp] = useState<ExperienceData | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const experiences = data.experiences as ExperienceData[];

  const scrollGallery = (direction: "left" | "right") => {
    if (galleryRef.current) {
      const scrollAmount = 300;
      galleryRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div id="experience" className="py-16 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-[40px] font-semibold tracking-[-0.02em] mb-12 text-foreground text-center">Work Experience</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {experiences.map((exp) => (
            <div 
              key={exp.id} 
              className="flex flex-col liquid-glass p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer group"
              onClick={() => setSelectedExp(exp)}
            >
              <div className="mb-6">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-[6px] text-[12px] font-bold tracking-tight uppercase">
                  {exp.category}
                </span>
              </div>
              
              <h3 className="text-[22px] font-semibold mb-1 tracking-tight text-foreground group-hover:text-primary transition-colors">
                {exp.role}
              </h3>
              <p className="text-[17px] font-medium text-foreground/80 mb-4">
                {exp.company}
              </p>
              <p className="text-[14px] text-muted-foreground mb-6 font-semibold tracking-wide">
                {exp.period}
              </p>
              
              {/* Description - truncated in view */}
              <p className="text-[15px] leading-[1.6] text-muted-foreground mb-8 flex-grow line-clamp-4 whitespace-pre-wrap">
                {exp.description}
              </p>
              
              {/* Skills - Limited in card view */}
              <div className="flex flex-wrap gap-2 mt-auto">
                {exp.skills.slice(0, 3).map((skill: string) => (
                  <span key={skill} className="bg-muted text-foreground/70 px-2.5 py-1 rounded-[5px] text-[11px] font-semibold border border-border/30">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Added Read More button */}
              <div className="mt-8 text-primary font-bold text-[14px] flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                Read More <ExternalLink size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modern Liquid Glass Modal (Experience) */}
      {selectedExp && (
        <div 
          className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:p-6 backdrop-blur-xl bg-black/40 animate-in fade-in duration-300 overflow-y-auto"
          onClick={() => setSelectedExp(null)}
        >
          <div 
            className="liquid-glass w-full max-w-2xl my-auto slide-in-from-bottom-8 duration-500 relative flex flex-col"
            style={{ borderRadius: '32px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 right-0 p-6 flex justify-end z-20">
              <button 
                onClick={() => setSelectedExp(null)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={24} className="text-foreground" />
              </button>
            </div>
            
            <div className="px-10 pb-12">
              {/* Specific Vertical Order: 1. Logo (Category), 2. Title, 3. Photo, 4. Description, 5. Core Tech */}
              
              {/* 1. Logo / Type */}
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-[6px] text-[12px] font-bold tracking-widest uppercase mb-4 inline-block">
                {selectedExp.category}
              </span>
              
              {/* 2. Title (Role, Company, Period) */}
              <h2 className="text-[32px] sm:text-[40px] font-bold tracking-tight mb-2 text-foreground">
                {selectedExp.role}
              </h2>
              <p className="text-[18px] font-semibold text-muted-foreground mb-8">
                {selectedExp.company} • {selectedExp.period}
              </p>
              
              {/* 3. Photo */}
              {selectedExp.photos && selectedExp.photos.length > 0 && (
                <div className="relative mb-8 group/gallery">
                  {/* Left Button */}
                  <button 
                    onClick={() => scrollGallery("left")}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 text-foreground shadow-md backdrop-blur-md border border-border/50 opacity-0 group-hover/gallery:opacity-100 transition-all hover:scale-110"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div 
                    ref={galleryRef}
                    className="flex overflow-x-auto gap-3 pb-2 snap-x scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                  >
                    {selectedExp.photos.map((photo, i) => (
                      <img 
                        key={i} 
                        src={photo} 
                        alt={`Screenshot ${i + 1}`} 
                        className="h-48 sm:h-56 w-auto rounded-lg object-contain border border-border/20 snap-start shrink-0 backdrop-blur-sm bg-black/5 dark:bg-white/5" 
                        loading="lazy"
                      />
                    ))}
                  </div>

                  {/* Right Button */}
                  <button 
                    onClick={() => scrollGallery("right")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 text-foreground shadow-md backdrop-blur-md border border-border/50 opacity-0 group-hover/gallery:opacity-100 transition-all hover:scale-110"
                    aria-label="Scroll right"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}

              {/* 4. Description */}
              <div className="space-y-6 text-[17px] leading-[1.7] text-foreground/90 font-medium whitespace-pre-wrap mb-12">
                {selectedExp.description}
              </div>
              
              {/* 5. Core Tech */}
              <div>
                <h4 className="text-[14px] font-bold text-foreground/90 uppercase tracking-widest mb-4">Core Technologies</h4>
                <div className="flex flex-wrap gap-3">
                  {selectedExp.skills.map((skill) => (
                    <span key={skill} className="bg-primary/10 text-primary px-4 py-2 rounded-[8px] text-[13px] font-bold border border-primary/20">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* View Case Study button completely removed */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
