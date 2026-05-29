import type { ComponentType, ReactElement } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEO from "../components/seo/SEO";
import NotFoundPage from "./NotFoundPage";
import { Byline } from "../blog/components/Byline";
import { Eyebrow } from "../blog/components/Eyebrow";
import { Masthead } from "../blog/components/Masthead";
import "../blog/styles/editorial.css";

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

interface PostModule { default: ComponentType; frontmatter?: PostFrontmatter }
const modules = import.meta.glob<PostModule>("../content/posts/*.mdx", { eager: true });
const posts = new Map<string, PostModule>();
for (const [path, mod] of Object.entries(modules)) {
  const slug = mod.frontmatter?.slug ?? path.split("/").pop()?.replace(/\.mdx$/, "");
  if (slug) posts.set(slug, mod);
}

const formatDate = (iso: string): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
};

const formatEdition = (raw: string | number | undefined): string => {
  if (raw === undefined || raw === null || raw === "") return "EDISI —";
  const n = typeof raw === "number" ? raw : Number(raw);
  return Number.isFinite(n) ? `EDISI ${String(Math.floor(n)).padStart(2, "0")}` : String(raw);
};

const buildEyebrow = (eyebrow: string | string[] | undefined, tags: string[] | undefined): string => {
  if (Array.isArray(eyebrow)) return eyebrow.map((t) => t.toUpperCase()).join(" · ");
  if (typeof eyebrow === "string" && eyebrow.length > 0) return eyebrow.toUpperCase();
  if (tags && tags.length > 0) return tags.slice(0, 2).map((t) => t.toUpperCase()).join(" · ");
  return "BLOG";
};

export default function WritingPostPage(): ReactElement {
  const { slug } = useParams<{ slug: string }>();
  const mod = slug ? posts.get(slug) : undefined;
  if (!mod) return <NotFoundPage />;

  const MDX = mod.default;
  const fm = mod.frontmatter ?? {};
  const summary = fm.excerpt ?? fm.description ?? "";
  const readTime = fm.readingTime ?? fm.readTime;
  const niceDate = formatDate(fm.date ?? "");
  const title = fm.title ?? slug ?? "Blog";

  return (
    <main className="editorial-shell">
      <SEO title={title} description={summary} path={`/blog/${slug}`} type="article" publishedTime={fm.date} />
      <article className="editorial-page">
        <Link to="/blog" className="editorial-back"><ArrowLeft size={12} /> Semua tulisan</Link>
        <Masthead edition={formatEdition(fm.edition)} date={niceDate} />
        <Eyebrow>{buildEyebrow(fm.eyebrow, fm.tags)}</Eyebrow>
        <h1 className="editorial-title">{title}</h1>
        {summary ? <p className="editorial-deck">{summary}</p> : null}
        <Byline author={fm.author ?? "Pande Gede Dani Wismagatha"} date={niceDate} readTime={readTime} />
        <div className="editorial-body"><MDX /></div>
      </article>
    </main>
  );
}
