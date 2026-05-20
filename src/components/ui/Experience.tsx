import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import data from "../../content/experience.json";

interface ExperienceEntry {
  id: string;
  category: string;
  title: string;
  org: string;
  period: string;
  impact: string;
  context: string;
  tags: string[];
  priority: number;
  caseStudySlug?: string;
  photos?: string[];
}

export default function Experience() {
  const [selectedExp, setSelectedExp] = useState<ExperienceEntry | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const experiences = (data.experiences as ExperienceEntry[])
    .slice()
    .sort((a, b) => a.priority - b.priority);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

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
    <div id="experience" className="py-10 md:py-16 px-3 md:px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-6 md:mb-12 px-2 md:px-4">
          <div>
            <h2 className="text-[28px] md:text-[40px] font-semibold tracking-[-0.02em] text-foreground">Work Experience</h2>
            <p className="text-muted-foreground mt-1 md:mt-2 text-[12px] md:text-[16px] font-medium">Outcomes shipped, not hours logged.</p>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => scroll("left")}
              className="p-1.5 md:p-3 rounded-full liquid-glass hover:bg-primary/10 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-1.5 md:p-3 rounded-full liquid-glass hover:bg-primary/10 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-3 md:gap-8 pt-3 md:pt-6 pb-5 md:pb-8 px-2 md:px-4 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
        >
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="min-w-[220px] md:min-w-[400px] flex flex-col liquid-glass p-4 md:p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer group snap-start"
              onClick={() => setSelectedExp(exp)}
            >
              <div className="mb-3 md:mb-6">
                <span className="bg-primary/10 text-primary px-2 py-0.5 md:px-3 md:py-1 rounded-[4px] md:rounded-[6px] text-[9px] md:text-[12px] font-bold tracking-tight uppercase">
                  {exp.category}
                </span>
              </div>

              <h3 className="text-[15px] md:text-[22px] font-semibold mb-0.5 md:mb-1 tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight">
                {exp.title}
              </h3>
              <p className="text-[13px] md:text-[17px] font-medium text-foreground/80 mb-2 md:mb-4">
                {exp.org}
              </p>
              <p className="text-[11px] md:text-[14px] text-muted-foreground mb-3 md:mb-6 font-semibold tracking-wide">
                {exp.period}
              </p>

              <p className="text-[12px] md:text-[15px] leading-[1.5] text-foreground font-semibold mb-2 md:mb-3 line-clamp-3">
                {exp.impact}
              </p>
              <p className="text-[11px] md:text-[13px] leading-[1.5] text-muted-foreground mb-4 md:mb-8 flex-grow line-clamp-2">
                {exp.context}
              </p>

              <div className="flex flex-wrap gap-1 md:gap-2 mt-auto">
                {exp.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="bg-muted text-foreground/70 px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-[4px] text-[9px] md:text-[11px] font-semibold border border-border/30">
                    {tag}
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
                aria-label="Close"
              >
                <X size={24} className="text-foreground" />
              </button>
            </div>

            <div className="px-10 pb-12">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-[6px] text-[12px] font-bold tracking-widest uppercase mb-4 inline-block">
                {selectedExp.category}
              </span>

              <h2 className="text-[32px] sm:text-[40px] font-bold tracking-tight mb-2 text-foreground">
                {selectedExp.title}
              </h2>
              <p className="text-[18px] font-semibold text-muted-foreground mb-8">
                {selectedExp.org} • {selectedExp.period}
              </p>

              {selectedExp.photos && selectedExp.photos.length > 0 && (
                <div className="relative mb-8 group/gallery">
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
                        alt={`${selectedExp.title} screenshot ${i + 1}`}
                        className="h-48 sm:h-56 w-auto rounded-lg object-contain border border-border/20 snap-start shrink-0 backdrop-blur-sm bg-black/5 dark:bg-white/5"
                        loading="lazy"
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => scrollGallery("right")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 text-foreground shadow-md backdrop-blur-md border border-border/50 opacity-0 group-hover/gallery:opacity-100 transition-all hover:scale-110"
                    aria-label="Scroll right"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}

              <div className="space-y-3 mb-8">
                <p className="text-[18px] leading-[1.6] text-foreground font-semibold">
                  {selectedExp.impact}
                </p>
                <p className="text-[15px] leading-[1.6] text-muted-foreground">
                  {selectedExp.context}
                </p>
              </div>

              <div className="mb-8">
                <h4 className="text-[14px] font-bold text-foreground/90 uppercase tracking-widest mb-4">Core Technologies</h4>
                <div className="flex flex-wrap gap-3">
                  {selectedExp.tags.map((tag) => (
                    <span key={tag} className="bg-primary/10 text-primary px-4 py-2 rounded-[8px] text-[13px] font-bold border border-primary/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {selectedExp.caseStudySlug && (
                <Link
                  to={`/case-study/${selectedExp.caseStudySlug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-[14px] font-bold text-white transition-opacity hover:opacity-90"
                >
                  Read full case study <ExternalLink size={14} />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
