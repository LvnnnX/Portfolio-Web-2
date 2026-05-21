import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import SEO from "../components/seo/SEO";
import data from "../content/planned-projects.json";
import "../blog/styles/planned.css";

interface PlannedProject {
  slug: string;
  title: string;
  description: string;
  file: string;
  thumbnail?: string;
  tags?: string[];
  status?: "exploring" | "in-progress" | "shelved";
}

interface PlannedProjectsFile {
  projects: PlannedProject[];
}

const { projects } = data as PlannedProjectsFile;

const STATUS_LABEL: Record<NonNullable<PlannedProject["status"]>, string> = {
  exploring: "Exploring",
  "in-progress": "In progress",
  shelved: "Shelved",
};

export default function PlannedWebsitePage() {
  return (
    <main className="planned">
      <SEO
        title="Planned Websites"
        description="Future projects in their prototype stage — design explorations and HTML mockups for sites I'm planning to build."
        path="/planned-website"
      />

      <article className="planned-article">
        <Link to="/" className="planned-back">
          <ArrowLeft size={12} /> Back to portfolio
        </Link>

        <p className="planned-eyebrow">Planning · Prototypes</p>

        <h1 className="planned-title">Planned websites</h1>

        <p className="planned-deck">
          Static HTML mockups for projects I&apos;m planning to build. Each
          card opens its own self-contained design — early-stage, sometimes
          rough, always honest about where it sits in the pipeline.
        </p>

        {projects.length === 0 ? (
          <p className="planned-empty">
            No prototypes published yet. Drop an HTML file into{" "}
            <code>public/plan/</code> and add an entry to{" "}
            <code>src/content/planned-projects.json</code> to surface it here.
          </p>
        ) : (
          <ul className="planned-grid">
            {projects.map((p) => (
              <li key={p.slug}>
                <a
                  href={`/plan/${p.file}`}
                  target="_blank"
                  rel="noreferrer"
                  className="planned-card"
                >
                  {p.thumbnail && (
                    <div className="planned-card__thumb">
                      <img src={p.thumbnail} alt="" loading="lazy" />
                    </div>
                  )}
                  <div className="planned-card__body">
                    <div className="planned-card__meta">
                      {p.status && (
                        <span className="planned-card__status">
                          {STATUS_LABEL[p.status]}
                        </span>
                      )}
                      <span className="planned-card__open">
                        Open <ArrowUpRight size={11} />
                      </span>
                    </div>
                    <h2 className="planned-card__title">{p.title}</h2>
                    <p className="planned-card__desc">{p.description}</p>
                    {p.tags && p.tags.length > 0 && (
                      <div className="planned-card__tags">
                        {p.tags.map((t) => (
                          <span key={t} className="planned-card__tag">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </article>
    </main>
  );
}
