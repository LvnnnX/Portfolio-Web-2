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
  exploring: "Eksplorasi",
  "in-progress": "Sedang dikerjakan",
  shelved: "Ditunda",
};

export default function PlannedWebsitePage() {
  return (
    <main className="planned">
      <SEO
        title="Proyek yang Direncanakan"
        description="Prototipe dan eksplorasi desain untuk proyek-proyek yang sedang aku rencanakan."
        path="/planned-website"
      />

      <article className="planned-article">
        <Link to="/" className="planned-back">
          <ArrowLeft size={12} /> Kembali
        </Link>

        <p className="planned-eyebrow">Rencana · Prototipe</p>

        <h1 className="planned-title">Proyek yang direncanakan</h1>

        <p className="planned-deck">
          Mockup HTML untuk proyek yang sedang aku rencanakan. Tiap kartu
          membuka desain mandiri — masih tahap awal, kadang kasar, tapi
          jujur soal posisinya di pipeline.
        </p>

        {projects.length === 0 ? (
          <p className="planned-empty">
            Belum ada prototipe. Tambahkan file HTML ke{" "}
            <code>public/plan/</code> dan entry baru di{" "}
            <code>src/content/planned-projects.json</code> untuk menampilkannya di sini.
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
                        Lihat <ArrowUpRight size={11} />
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
