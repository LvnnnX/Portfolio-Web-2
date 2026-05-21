import type { ComponentType } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEO from "../components/seo/SEO";
import NotFoundPage from "./NotFoundPage";
import "../blog/styles/case-study.css";

interface PostFrontmatter {
  slug?: string;
  title?: string;
  date?: string;
  excerpt?: string;
  description?: string;
  readingTime?: string;
  readTime?: string;
  tags?: string[];
  author?: string;
  edition?: string | number;
  eyebrow?: string | string[];
}

interface PostModule {
  default: ComponentType;
  frontmatter?: PostFrontmatter;
}

const modules = import.meta.glob<PostModule>(
  "../content/posts/*.mdx",
  { eager: true },
);

const posts = new Map<string, PostModule>();
for (const [path, mod] of Object.entries(modules)) {
  const slug =
    mod.frontmatter?.slug ?? path.split("/").pop()?.replace(/\.mdx$/, "");
  if (slug) posts.set(slug, mod);
}

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

const buildEyebrow = (
  eyebrow: string | string[] | undefined,
  tags: string[] | undefined,
): string => {
  if (Array.isArray(eyebrow)) return eyebrow.map((t) => t.toUpperCase()).join(" · ");
  if (typeof eyebrow === "string" && eyebrow.length > 0) return eyebrow.toUpperCase();
  if (tags && tags.length > 0) return tags.slice(0, 2).map((t) => t.toUpperCase()).join(" · ");
  return "BLOG";
};

export default function WritingPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const mod = slug ? posts.get(slug) : undefined;

  if (!mod) return <NotFoundPage />;

  const MDX = mod.default;
  const fm = mod.frontmatter ?? {};
  const summary = fm.excerpt ?? fm.description ?? "";
  const readTime = fm.readingTime ?? fm.readTime;
  const eyebrowLabel = buildEyebrow(fm.eyebrow, fm.tags);
  const niceDate = formatDate(fm.date ?? "");

  return (
    <main className="cs">
      <SEO
        title={fm.title ?? slug!}
        description={summary}
        path={`/blog/${slug}`}
        type="article"
        publishedTime={fm.date}
      />

      <article className="cs-article">
        <Link to="/blog" className="cs-back">
          <ArrowLeft size={12} /> Semua tulisan
        </Link>

        <p className="cs-eyebrow">
          <span>{eyebrowLabel}</span>
          {niceDate && niceDate !== "—" && (
            <span className="cs-eyebrow__period" aria-label="published">
              · {niceDate}
            </span>
          )}
          {readTime && (
            <span className="cs-eyebrow__period" aria-label="reading time">
              · {readTime}
            </span>
          )}
        </p>

        <h1 className="cs-title">{fm.title ?? slug}</h1>

        {summary && <p className="cs-deck">{summary}</p>}

        <div className="cs-grid">
          <div className="cs-body" style={{ gridColumn: "1 / -1" }}>
            {fm.tags && fm.tags.length > 0 && (
              <div className="cs-tags">
                {fm.tags.map((tag) => (
                  <span className="cs-tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <MDX />
          </div>
        </div>
      </article>
    </main>
  );
}
