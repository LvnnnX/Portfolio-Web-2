import { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import data from "../../content/projects.json";
import Reveal from "./Reveal";
import Modal from "./Modal";

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

// Tinted backgrounds per category — no white cards
const TINTS: Record<string, string> = {
  "Computer Vision": "bg-primary/5",
  "AI / ML": "bg-primary/5",
  "Web App": "bg-foreground/5",
  "Game": "bg-foreground/5",
};

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const projects = data.projects as Project[];

  return (
    <div id="projects" className="py-10 md:py-16 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <h2 className="text-[24px] md:text-[32px] font-extrabold tracking-tight text-foreground mb-1">
            Case Studies &amp; Shipping Notes
          </h2>
          <p className="text-muted-foreground text-[13px] md:text-[15px] mb-8 md:mb-10">
            Selected works in AI &amp; Web.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-10">
          {projects.map((project, i) => {
            const tint = TINTS[project.category] ?? "bg-muted";
            const featured = project.tier === 1;
            return (
              <Reveal key={project.id} delay={i * 0.06}>
                <div
                  role="button"
                  tabIndex={0}
                  aria-haspopup="dialog"
                  onClick={() => setSelectedProject(project)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedProject(project);
                    }
                  }}
                  className={`${tint} p-4 md:p-6 cursor-pointer rounded-xl group text-left w-full outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${featured ? "md:col-span-2" : ""}`}
                >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] md:text-[11px] font-bold text-primary tracking-wider uppercase">
                    {project.category}
                  </span>
                  {featured && (
                    <span className="text-[9px] md:text-[10px] font-bold text-foreground/40 tracking-wider uppercase">
                      Featured
                    </span>
                  )}
                </div>

                <h3 className="text-[16px] md:text-[20px] font-bold tracking-tight text-foreground leading-tight mb-1 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>

                <p className="text-[11px] md:text-[13px] font-medium text-muted-foreground mb-3">
                  {project.role} · {project.period}
                </p>

                <p className="text-[12px] md:text-[14px] leading-[1.5] text-foreground/70 mb-3 line-clamp-2">
                  {project.impact}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.slice(0, 4).map((tech: string) => (
                    <span key={tech} className="text-[10px] md:text-[11px] font-semibold text-muted-foreground/80">
                      {tech}
                    </span>
                  ))}
                </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {selectedProject && (
        <Modal
          title={selectedProject.title}
          onClose={() => setSelectedProject(null)}
        >
            <div className="px-6 md:px-10 pb-10 md:pb-12">
              <span className="text-primary font-bold text-[11px] tracking-wider uppercase mb-2 block">
                {selectedProject.category}
              </span>
              <h2 className="text-[28px] md:text-[36px] font-extrabold tracking-tight mb-1 text-foreground">
                {selectedProject.title}
              </h2>
              <p className="text-[14px] md:text-[16px] font-medium text-muted-foreground mb-6">
                {selectedProject.role} · {selectedProject.period}
              </p>

              <div className="space-y-3 mb-8">
                <p className="text-[15px] md:text-[17px] leading-[1.6] text-foreground font-medium">
                  {selectedProject.impact}
                </p>
                <p className="text-[13px] md:text-[15px] leading-[1.6] text-muted-foreground">
                  {selectedProject.context}
                </p>
              </div>

              <div className="mb-8">
                <h4 className="text-[11px] font-bold text-foreground/80 uppercase tracking-wider mb-3">
                  Core Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.techStack.map((tech: string) => (
                    <span key={tech} className="text-primary bg-primary/10 px-3 py-1.5 rounded-lg text-[12px] font-semibold border border-primary/20">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {selectedProject.tier === 1 && selectedProject.caseStudySlug && (
                  <Link
                    to={`/case-study/${selectedProject.caseStudySlug}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-bold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Read full case study <ExternalLink size={14} />
                  </Link>
                )}
                {selectedProject.links?.repo && !selectedProject.links.repo.startsWith("TODO") && (
                  <a
                    href={selectedProject.links.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2.5 text-[13px] font-bold text-foreground transition-colors hover:bg-muted/80"
                  >
                    Repo <ExternalLink size={14} />
                  </a>
                )}
                {selectedProject.links?.live && !selectedProject.links.live.startsWith("TODO") && (
                  <a
                    href={selectedProject.links.live}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2.5 text-[13px] font-bold text-foreground transition-colors hover:bg-muted/80"
                  >
                    Live <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
        </Modal>
      )}
    </div>
  );
}
