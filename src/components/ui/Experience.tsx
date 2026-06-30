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
  const experiences = (data.experiences as ExperienceEntry[])
    .slice()
    .sort((a, b) => a.priority - b.priority);

  const scrollGallery = (direction: "left" | "right") => {
    if (galleryRef.current) {
      galleryRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div id="experience" className="py-10 md:py-16 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-[24px] md:text-[32px] font-extrabold tracking-tight text-foreground mb-1">
          Work Experience
        </h2>
        <p className="text-muted-foreground text-[13px] md:text-[15px] mb-8 md:mb-10">
          Outcomes shipped, not hours logged.
        </p>

        {/* Timeline — no card boxes, just a vertical rule + content */}
        <div className="relative pl-4 md:pl-6">
          {/* vertical line */}
          <div className="absolute left-0 top-2 bottom-2 w-px bg-border" />

          <div className="flex flex-col gap-6 md:gap-8">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                onClick={() => setSelectedExp(exp)}
                className="relative cursor-pointer group"
              >
                {/* dot on the line */}
                <div className="absolute -left-4 md:-left-6 top-1.5 w-2 h-2 rounded-full bg-border group-hover:bg-primary transition-colors" />

                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-[10px] md:text-[11px] font-bold text-primary tracking-wider uppercase">
                    {exp.category}
                  </span>
                  <span className="text-[11px] md:text-[12px] text-muted-foreground font-medium">
                    {exp.period}
                  </span>
                </div>

                <h3 className="text-[16px] md:text-[20px] font-bold tracking-tight text-foreground leading-tight group-hover:text-primary transition-colors">
                  {exp.title}
                </h3>
                <p className="text-[12px] md:text-[14px] text-muted-foreground font-medium mb-2">
                  {exp.org}
                </p>

                <p className="text-[12px] md:text-[14px] leading-[1.5] text-foreground/70 mb-2 max-w-[55ch]">
                  {exp.impact}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {exp.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[10px] md:text-[11px] font-semibold text-muted-foreground/80">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedExp && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:p-6 bg-black/50 overflow-y-auto"
          onClick={() => setSelectedExp(null)}
        >
          <div
            className="bg-background w-full max-w-2xl my-auto rounded-2xl border border-border relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 right-0 p-4 flex justify-end z-20">
              <button
                onClick={() => setSelectedExp(null)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Close"
              >
                <X size={20} className="text-foreground" />
              </button>
            </div>

            <div className="px-6 md:px-10 pb-10 md:pb-12">
              <span className="text-[10px] md:text-[11px] font-bold text-primary tracking-wider uppercase mb-3 inline-block">
                {selectedExp.category}
              </span>

              <h2 className="text-[24px] md:text-[32px] font-extrabold tracking-tight mb-1 text-foreground">
                {selectedExp.title}
              </h2>
              <p className="text-[14px] md:text-[16px] font-medium text-muted-foreground mb-6">
                {selectedExp.org} · {selectedExp.period}
              </p>

              {selectedExp.photos && selectedExp.photos.length > 0 && (
                <div className="relative mb-6 group/gallery">
                  <button
                    onClick={() => scrollGallery("left")}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-lg bg-background border border-border opacity-0 group-hover/gallery:opacity-100 transition-opacity"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <div
                    ref={galleryRef}
                    className="flex overflow-x-auto gap-3 pb-2 snap-x scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                  >
                    {selectedExp.photos.map((photo: string, i: number) => (
                      <img
                        key={i}
                        src={photo}
                        alt={`${selectedExp.title} screenshot ${i + 1}`}
                        className="h-48 sm:h-56 w-auto rounded-lg object-contain border border-border snap-start shrink-0"
                        loading="lazy"
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => scrollGallery("right")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-lg bg-background border border-border opacity-0 group-hover/gallery:opacity-100 transition-opacity"
                    aria-label="Scroll right"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}

              <div className="space-y-3 mb-6">
                <p className="text-[15px] md:text-[17px] leading-[1.6] text-foreground font-medium">
                  {selectedExp.impact}
                </p>
                <p className="text-[13px] md:text-[15px] leading-[1.6] text-muted-foreground">
                  {selectedExp.context}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-[11px] font-bold text-foreground/80 uppercase tracking-wider mb-3">
                  Core Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedExp.tags.map((tag: string) => (
                    <span key={tag} className="text-primary bg-primary/10 px-3 py-1.5 rounded-lg text-[12px] font-semibold border border-primary/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {selectedExp.caseStudySlug && (
                <Link
                  to={`/case-study/${selectedExp.caseStudySlug}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-bold text-primary-foreground transition-opacity hover:opacity-90"
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
