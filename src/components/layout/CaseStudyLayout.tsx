import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import "../../blog/styles/case-study.css";

const GithubGlyph = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

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

const SECTION_NAV: { id: string; label: string }[] = [
  { id: "problem", label: "Problem" },
  { id: "data", label: "Data" },
  { id: "approach", label: "Approach" },
  { id: "results", label: "Results" },
  { id: "lessons-learned", label: "Lessons learned" },
  { id: "links", label: "Links" },
];

export default function CaseStudyLayout({ frontmatter, children }: CaseStudyLayoutProps) {
  const { title, summary, repo, live, period, metrics, tags } = frontmatter;
  const hasRepo = repo && !repo.startsWith("TODO");
  const hasLive = live && !live.startsWith("TODO");

  // First metric is the marquee number; remaining go in the row.
  const marqueeStat = metrics?.[0];
  const otherStats = metrics?.slice(1) ?? [];

  return (
    <main className="cs">
      <article className="cs-article">
        <Link to="/" className="cs-back">
          <ArrowLeft size={12} /> Back to portfolio
        </Link>

        <p className="cs-eyebrow">
          <span>Case study</span>
          {period && (
            <span className="cs-eyebrow__period" aria-label="period">
              · {period}
            </span>
          )}
        </p>

        <h1 className="cs-title">{title}</h1>

        {summary && <p className="cs-deck">{summary}</p>}

        {metrics && metrics.length > 0 && (
          <section className="cs-stats" aria-label="Key metrics">
            {marqueeStat && (
              <div className="cs-stat">
                <span className="cs-stat__value cs-stat__value--accent">
                  {marqueeStat.value}
                </span>
                <span className="cs-stat__label">{marqueeStat.label}</span>
              </div>
            )}
            {otherStats.map((m) => (
              <div className="cs-stat" key={m.label}>
                <span className="cs-stat__value">{m.value}</span>
                <span className="cs-stat__label">{m.label}</span>
              </div>
            ))}
          </section>
        )}

        <div className="cs-grid">
          <nav className="cs-nav" aria-label="In-page navigation">
            <p className="cs-nav__title">In this case study</p>
            <ul className="cs-nav__list">
              {SECTION_NAV.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="cs-nav__link">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="cs-body">
            {tags && tags.length > 0 && (
              <div className="cs-tags">
                {tags.map((tag) => (
                  <span className="cs-tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {children}

            <div className="cs-rail">
              {hasLive && (
                <a
                  className="cs-rail__btn cs-rail__btn--primary"
                  href={live!}
                  target="_blank"
                  rel="noreferrer"
                >
                  Live demo <ArrowUpRight size={14} />
                </a>
              )}
              {hasRepo && (
                <a
                  className="cs-rail__btn cs-rail__btn--ghost"
                  href={repo!}
                  target="_blank"
                  rel="noreferrer"
                >
                  <GithubGlyph /> Source code
                </a>
              )}
              <Link to="/" className="cs-rail__btn cs-rail__btn--ghost">
                <ArrowLeft size={14} /> Back to portfolio
              </Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
