import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEO from "../components/seo/SEO";
import "../blog/styles/case-study.css";

interface PostFrontmatter {
  slug?: string;
  title?: string;
  date?: string;
  excerpt?: string;
  description?: string;
  tags?: string[];
  readingTime?: string;
  author?: string;
}

interface PostModule {
  frontmatter?: PostFrontmatter;
  default: React.ComponentType;
}

const modules = import.meta.glob<PostModule>(
  "../content/tech-news/*.mdx",
  { eager: true },
);

const formatDate = (iso: string): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function TechNewsPostPage() {
  const { slug } = useParams<{ slug: string }>();

  const entry = Object.entries(modules).find(([path, mod]) => {
    const fileSlug = path.split("/").pop()?.replace(/\.mdx$/, "") ?? "";
    const fmSlug = mod.frontmatter?.slug ?? fileSlug;
    return fmSlug === slug;
  });

  if (!entry) {
    return <Navigate to="/tech-news" replace />;
  }

  const [, mod] = entry;
  const fm = mod.frontmatter ?? {};
  const Content = mod.default;

  const title = fm.title ?? slug ?? "Tech News";
  const date = fm.date ?? "";
  const tags = fm.tags ?? [];
  const readingTime = fm.readingTime ?? "";
  const description = fm.excerpt ?? fm.description ?? "";

  return (
    <main className="cs cs--tech-news">
      <SEO
        title={title}
        description={description}
        path={`/tech-news/${slug}`}
      />

      <article className="cs-article">
        <Link to="/tech-news" className="cs-back">
          <ArrowLeft size={12} /> Kembali ke Tech News
        </Link>

        <p className="cs-eyebrow">
          <span>TECH NEWS · AI CURATED</span>
          {date && formatDate(date) !== "—" && (
            <span className="cs-eyebrow__period" aria-label="published">
              · {formatDate(date)}
            </span>
          )}
          {readingTime && (
            <span className="cs-eyebrow__period" aria-label="reading time">
              · {readingTime}
            </span>
          )}
        </p>

        <h1 className="cs-title">{title}</h1>

        {description && <p className="cs-deck">{description}</p>}

        <div className="cs-grid">
          <div className="cs-body" style={{ gridColumn: "1 / -1" }}>
            {tags.length > 0 && (
              <div className="cs-tags">
                {tags.map((tag) => (
                  <span className="cs-tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <Content />
          </div>
        </div>
      </article>
    </main>
  );
}
