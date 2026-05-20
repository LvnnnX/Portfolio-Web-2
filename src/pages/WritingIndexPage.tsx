import type { ComponentType } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/seo/SEO";
import "../blog/styles/editorial.css";

interface PostFrontmatter {
  slug?: string;
  title?: string;
  date?: string;
  excerpt?: string;
  description?: string;
  tags?: string[];
  edition?: string | number;
}

interface PostModule {
  default: ComponentType;
  frontmatter?: PostFrontmatter;
}

const modules = import.meta.glob<PostModule>(
  "../content/posts/*.mdx",
  { eager: true },
);

interface PostMeta {
  slug: string;
  title: string;
  date: string;
  deck: string;
  tags: string[];
  edition: string;
}

const formatEdition = (raw: string | number | undefined, fallbackIndex: number): string => {
  if (raw === undefined || raw === null || raw === "") {
    return `EDISI ${String(fallbackIndex).padStart(2, "0")}`;
  }
  const n = typeof raw === "number" ? raw : Number(raw);
  if (Number.isFinite(n)) return `EDISI ${String(Math.floor(n)).padStart(2, "0")}`;
  return String(raw);
};

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

const sorted = Object.entries(modules)
  .map(([path, mod]) => {
    const fileSlug = path.split("/").pop()?.replace(/\.mdx$/, "") ?? "";
    const fm = mod.frontmatter ?? {};
    return {
      _date: fm.date ?? "",
      _fmEdition: fm.edition,
      slug: fm.slug ?? fileSlug,
      title: fm.title ?? fileSlug,
      date: fm.date ?? "",
      deck: fm.excerpt ?? fm.description ?? "",
      tags: fm.tags ?? [],
    };
  })
  .sort((a, b) => (a._date < b._date ? 1 : -1));

const posts: PostMeta[] = sorted.map((p, i) => ({
  slug: p.slug,
  title: p.title,
  date: p.date,
  deck: p.deck,
  tags: p.tags,
  edition: formatEdition(p._fmEdition, sorted.length - i),
}));

export default function WritingIndexPage() {
  return (
    <main className="editorial">
      <SEO
        title="Blog"
        description="Catatan tentang ekonomi, hukum, teknologi, dan apa pun yang layak ditulis pelan-pelan."
        path="/blog"
      />
      <div className="editorial__content">
        <header className="editorial-masthead">
          <span className="editorial-masthead__brand">DANIWISMAGATHA.MY.ID / BLOG</span>
          <span className="editorial-masthead__meta">{posts.length} edisi</span>
        </header>

        <p className="editorial-eyebrow" style={{ marginBlockStart: "32px" }}>
          Katalog
        </p>
        <h1 className="editorial-headline">Blog</h1>
        <p className="editorial-deck">
          Esai pendek tentang ekonomi, hukum, teknologi, dan hal-hal yang layak dipikir lebih dari satu kali.
        </p>

        {posts.length === 0 ? (
          <p style={{ fontFamily: 'var(--serif)', color: 'var(--ink-soft)' }}>
            Belum ada edisi.
          </p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {posts.map((post) => (
              <li key={post.slug}>
                <Link to={`/blog/${post.slug}`} className="editorial-card">
                  <div className="editorial-card__meta">
                    <span className="editorial-card__edition">{post.edition}</span>
                    <span>{formatDate(post.date)}</span>
                  </div>
                  {post.tags.length > 0 && (
                    <p className="editorial-card__eyebrow">
                      {post.tags.slice(0, 3).join(" · ")}
                    </p>
                  )}
                  <h2 className="editorial-card__headline">{post.title}</h2>
                  {post.deck && <p className="editorial-card__deck">{post.deck}</p>}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <footer className="editorial-pagefoot">
          <span>DANIWISMAGATHA.MY.ID/BLOG</span>
          <span>v1.0</span>
        </footer>
      </div>
    </main>
  );
}
