import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEO from "../components/seo/SEO";
import { Eyebrow } from "../blog/components/Eyebrow";
import "../blog/styles/editorial.css";

interface PostFrontmatter {
  slug?: string;
  title?: string;
  date?: string;
  excerpt?: string;
  description?: string;
  tags?: string[];
  edition?: string | number;
  readingTime?: string;
  readTime?: string;
}

const modules = import.meta.glob<{ frontmatter?: PostFrontmatter }>("../content/posts/*.mdx", { eager: true });

interface PostMeta {
  slug: string;
  title: string;
  date: string;
  deck: string;
  tags: string[];
  edition: string;
  readTime: string;
}

const formatEdition = (raw: string | number | undefined, fallbackIndex: number): string => {
  if (raw === undefined || raw === null || raw === "") return `EDISI ${String(fallbackIndex).padStart(2, "0")}`;
  const n = typeof raw === "number" ? raw : Number(raw);
  return Number.isFinite(n) ? `EDISI ${String(Math.floor(n)).padStart(2, "0")}` : String(raw);
};

const formatDate = (iso: string): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
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
      readTime: fm.readingTime ?? fm.readTime ?? "",
    };
  })
  .sort((a, b) => (a._date < b._date ? 1 : -1));

const posts: PostMeta[] = sorted.map((p, i) => ({
  slug: p.slug,
  title: p.title,
  date: p.date,
  deck: p.deck,
  tags: p.tags,
  readTime: p.readTime,
  edition: formatEdition(p._fmEdition, sorted.length - i),
}));

export default function WritingIndexPage(): ReactElement {
  return (
    <main className="editorial-shell">
      <SEO title="Blog" description="Catatan tentang ekonomi, hukum, teknologi, dan hal-hal yang layak ditulis pelan-pelan." path="/blog" />
      <article className="editorial-page">
        <Link to="/" className="editorial-back"><ArrowLeft size={12} /> Kembali</Link>
        <Eyebrow>Catatan · Esai</Eyebrow>
        <h1 className="editorial-title">Tulisan</h1>
        <p className="editorial-deck">Catatan tentang ekonomi, kebijakan publik, dan hal-hal yang butuh lebih dari satu kali baca untuk dipahami.</p>
        {posts.length === 0 ? <p className="editorial-body">Belum ada tulisan.</p> : (
          <ul className="editorial-list">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link to={`/blog/${post.slug}`} className="editorial-card">
                  <div className="editorial-card__meta">
                    <span className="editorial-card__edition">{post.edition}</span>
                    <span>{formatDate(post.date)}{post.readTime ? ` · ${post.readTime}` : ""}</span>
                  </div>
                  <h2 className="editorial-card__title">{post.title}</h2>
                  {post.deck ? <p className="editorial-card__deck">{post.deck}</p> : null}
                  {post.tags.length > 0 ? <p className="editorial-card__tags">{post.tags.slice(0, 3).join(" · ")}</p> : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </article>
    </main>
  );
}
