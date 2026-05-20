import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";

export interface CaseStudyMetric {
  label: string;
  value: string;
}

export interface CaseStudyFrontmatter {
  slug: string;
  title: string;
  summary: string;
  cover?: string;
  repo?: string | null;
  live?: string | null;
  period?: string;
  metrics?: CaseStudyMetric[];
  tags?: string[];
}

interface CaseStudyLayoutProps {
  frontmatter: CaseStudyFrontmatter;
  children: ReactNode;
}

export default function CaseStudyLayout({ frontmatter, children }: CaseStudyLayoutProps) {
  const { title, summary, cover, repo, live, period, metrics, tags } = frontmatter;
  const hasRepo = repo && !repo.startsWith("TODO");
  const hasLive = live && !live.startsWith("TODO");

  return (
    <article className="relative pt-28 md:pt-32 pb-16 md:pb-24 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[12px] md:text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Back to home
        </Link>

        <p className="text-[10px] md:text-[12px] font-bold tracking-[0.12em] uppercase text-[color:var(--color-accent,#B8422E)] mb-3">
          Case study{period ? ` · ${period}` : ""}
        </p>

        <h1 className="text-[34px] md:text-[48px] font-bold tracking-[-0.025em] leading-[1.1] text-foreground mb-4">
          {title}
        </h1>

        <p className="text-[16px] md:text-[18px] leading-[1.6] text-muted-foreground mb-8">
          {summary}
        </p>

        {cover && (
          <div className="mb-10 rounded-[20px] overflow-hidden border border-border/30">
            <img
              src={cover}
              alt={title}
              className="w-full h-auto object-cover"
              loading="eager"
            />
          </div>
        )}

        {metrics && metrics.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-10">
            {metrics.map((m) => (
              <div key={m.label} className="liquid-glass rounded-[14px] p-4 md:p-5">
                <p className="text-[10px] md:text-[12px] font-semibold tracking-[0.12em] uppercase text-muted-foreground mb-1">
                  {m.label}
                </p>
                <p className="text-[20px] md:text-[24px] font-bold tracking-tight text-foreground">
                  {m.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-muted text-foreground/80 px-3 py-1.5 rounded-full text-[11px] md:text-[12px] font-semibold border border-border/30"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="prose prose-invert max-w-none case-study-prose">
          {children}
        </div>

        {(hasRepo || hasLive) && (
          <div className="mt-12 pt-8 border-t border-border/30 flex flex-wrap gap-3">
            {hasRepo && (
              <a
                href={repo!}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-muted px-5 py-3 text-[13px] font-bold text-foreground transition-colors hover:bg-muted/80"
              >
                Repo <ExternalLink size={14} />
              </a>
            )}
            {hasLive && (
              <a
                href={live!}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-[13px] font-bold text-white transition-opacity hover:opacity-90"
              >
                Live demo <ExternalLink size={14} />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
