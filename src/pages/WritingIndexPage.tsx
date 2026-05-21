import { Link } from "react-router-dom";
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
  edition?: string | number;
  readingTime?: string;
}

const modules = import.meta.glob<{ frontmatter?: PostFrontmatter }>(
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
  readingTime: string;
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
      readingTime: fm.readingTime ?? "",
    };
  })
  .sort((a, b) => (a._date < b._date ? 1 : -1));

const posts: PostMeta[] = sorted.map((p, i) => ({
  slug: p.slug,
  title: p.title,
  date: p.date,
  deck: p.deck,
  tags: p.tags,
  readingTime: p.readingTime,
  edition: formatEdition(p._fmEdition, sorted.length - i),
}));

export default function WritingIndexPage() {
  return (
    <main className="cs">
      <SEO
        title="Blog"
        description="Catatan tentang ekonomi, hukum, teknologi, dan apa pun yang layak ditulis pelan-pelan."
        path="/blog"
      />

      <article className="cs-article">
        <Link to="/" className="cs-back">
          <ArrowLeft size={12} /> Kembali
        </Link>

        <p className="cs-eyebrow">
          <span>Catatan · Esai</span>
        </p>

        <h1 className="cs-title">Tulisan</h1>

        <p className="cs-deck">
          Catatan tentang ekonomi, kebijakan publik, dan hal-hal yang
          butuh lebih dari satu kali baca untuk dipahami.
        </p>

        {posts.length === 0 ? (
          <p style={{ color: "var(--cs-ink-soft)" }}>Belum ada tulisan.</p>
        ) : (
          <ul className="blog-list">
            {posts.map((post) => (
              <li key={post.slug} className="blog-row">
                <Link to={`/blog/${post.slug}`} className="blog-row__link">
                  <div className="blog-row__meta">
                    <span className="blog-row__edition">{post.edition}</span>
                    <span className="blog-row__date">
                      {formatDate(post.date)}
                      {post.readingTime ? ` · ${post.readingTime}` : ""}
                    </span>
                  </div>
                  <h2 className="blog-row__title">{post.title}</h2>
                  {post.deck && <p className="blog-row__deck">{post.deck}</p>}
                  {post.tags.length > 0 && (
                    <div className="blog-row__tags">
                      {post.tags.slice(0, 4).map((t) => (
                        <span key={t} className="blog-row__tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </article>
    </main>
  );
}

