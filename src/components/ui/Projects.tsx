import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import data from "../../content/projects.json";

interface ProjectLinks {
  repo: string | null;
  live: string | null;
}

interface Project {
  id: string;
  tier: 1 | 2;
  caseStudySlug?: string;
  emoji: string;
  title: string;
  role: string;
  period: string;
  category: string;
  impact: string;
  context: string;
  techStack: string[];
  metrics?: Record<string, string | number>;
  links?: ProjectLinks;
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
            <p className="text-muted-foreground mt-1 md:mt-2 text-[12px] md:text-[16px] font-medium">Selected works in AI &amp; Web.</p>
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
          {projects.map((project) => (
            <div
              key={project.id}
              className="min-w-[220px] md:min-w-[400px] flex flex-col liquid-glass p-4 md:p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer group snap-start"
              onClick={() => setSelectedProject(project)}
            >
              <div className="text-[24px] md:text-[40px] mb-3 md:mb-6 transform transition-transform group-hover:scale-110 duration-300">
                {project.emoji}
              </div>

              <div className="mb-2 md:mb-4 flex items-center gap-2">
                <span className="text-[9px] md:text-[12px] font-bold text-primary tracking-widest uppercase">
                  {project.category}
                </span>
                {project.tier === 1 && (
                  <span className="text-[8px] md:text-[10px] font-bold text-[color:var(--color-accent,#B8422E)] tracking-widest uppercase">
                    · Case study
                  </span>
                )}
              </div>

              <h3 className="text-[16px] md:text-[24px] font-bold mb-1 md:mb-2 tracking-tight text-foreground transition-colors group-hover:text-primary leading-tight">
                {project.title}
              </h3>

              <p className="text-[12px] md:text-[14px] font-semibold text-muted-foreground mb-3 md:mb-6">
                {project.role} • {project.period}
              </p>

              <p className="text-[12px] md:text-[15px] leading-[1.5] text-foreground font-semibold mb-2 md:mb-3 line-clamp-3">
                {project.impact}
              </p>
              <p className="text-[11px] md:text-[13px] leading-[1.5] text-muted-foreground mb-4 md:mb-8 flex-grow line-clamp-2">
                {project.context}
              </p>

              <div className="flex flex-wrap gap-1 md:gap-2 mt-auto">
                {project.techStack.slice(0, 3).map((tech) => (
                  <span key={tech} className="bg-muted px-2 py-0.5 md:px-2.5 md:py-1 rounded-[4px] md:rounded-[6px] text-[9px] md:text-[11px] font-bold text-foreground/60 border border-border/20">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-4 md:mt-8 text-primary font-bold text-[11px] md:text-[14px] flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                {project.tier === 1 ? "Read case study" : "Details"} <ExternalLink size={10} />
              </div>
            </div>
          ))}
        </div>
      </div>

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
                aria-label="Close"
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

              <div className="space-y-3 mb-10">
                <p className="text-[18px] leading-[1.6] text-foreground font-semibold">
                  {selectedProject.impact}
                </p>
                <p className="text-[15px] leading-[1.6] text-muted-foreground">
                  {selectedProject.context}
                </p>
              </div>

              <div className="mb-10">
                <h4 className="text-[14px] font-bold text-foreground/90 uppercase tracking-widest mb-4">Core Technologies</h4>
                <div className="flex flex-wrap gap-3">
                  {selectedProject.techStack.map((tech) => (
                    <span key={tech} className="bg-primary/10 text-primary px-4 py-2 rounded-[8px] text-[13px] font-bold border border-primary/20">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {selectedProject.tier === 1 && selectedProject.caseStudySlug && (
                  <Link
                    to={`/case-study/${selectedProject.caseStudySlug}`}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-[14px] font-bold text-white transition-opacity hover:opacity-90"
                  >
                    Read full case study <ExternalLink size={14} />
                  </Link>
                )}
                {selectedProject.links?.repo && !selectedProject.links.repo.startsWith("TODO") && (
                  <a
                    href={selectedProject.links.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-muted px-5 py-3 text-[14px] font-bold text-foreground transition-colors hover:bg-muted/80"
                  >
                    Repo <ExternalLink size={14} />
                  </a>
                )}
                {selectedProject.links?.live && !selectedProject.links.live.startsWith("TODO") && (
                  <a
                    href={selectedProject.links.live}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-muted px-5 py-3 text-[14px] font-bold text-foreground transition-colors hover:bg-muted/80"
                  >
                    Live <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
