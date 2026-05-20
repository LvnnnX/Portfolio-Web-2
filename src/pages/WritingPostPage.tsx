import type { ComponentType } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { MDXProvider } from "@mdx-js/react";
import SEO from "../components/seo/SEO";
import NotFoundPage from "./NotFoundPage";
import Masthead from "../blog/components/Masthead";
import Eyebrow from "../blog/components/Eyebrow";
import Byline from "../blog/components/Byline";
import { blogMdxComponents } from "../blog/mdx-components";
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
  /** Single string OR array of labels rendered above the headline. */
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

const formatReadTime = (rt: string | undefined): string | undefined => {
  if (!rt) return undefined;
  const m = rt.match(/^(\d+)\s*(min|menit)\b/);
  if (m) return `${m[1]} menit baca`;
  return rt;
};

const buildEyebrowLabel = (
  eyebrow: string | string[] | undefined,
  tags: string[] | undefined,
): string => {
  const source = (() => {
    if (Array.isArray(eyebrow)) return eyebrow;
    if (typeof eyebrow === "string" && eyebrow.length > 0) return [eyebrow];
    if (tags && tags.length > 0) return tags.slice(0, 2);
    return ["BLOG"];
  })();
  return source.map((t) => t.toUpperCase()).join(" · ");
};

export default function WritingPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const mod = slug ? posts.get(slug) : undefined;

  if (!mod) return <NotFoundPage />;

  const MDX = mod.default;
  const fm = mod.frontmatter ?? {};
  const summary = fm.excerpt ?? fm.description ?? "";
  const readTime = formatReadTime(fm.readingTime ?? fm.readTime);
  const eyebrowLabel = buildEyebrowLabel(fm.eyebrow, fm.tags);
  const niceDate = formatDate(fm.date ?? "");

  return (
    <main className="editorial">
      <SEO
        title={fm.title ?? slug!}
        description={summary}
        path={`/blog/${slug}`}
        type="article"
        publishedTime={fm.date}
      />

      <article className="editorial__content">
        <Masthead edition={fm.edition} date={niceDate} meta={readTime} />

        <Link
          to="/blog"
          className="editorial-back"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            marginBlock: "16px 0",
            padding: "6px 0",
            fontFamily: "var(--sans)",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: "var(--ink-soft)",
            textDecoration: "none",
            transition: "color 200ms ease",
          }}
        >
          <ArrowLeft size={12} /> Kembali ke katalog
        </Link>

        <Eyebrow>{eyebrowLabel}</Eyebrow>

        <h1 className="editorial-headline">{fm.title ?? slug}</h1>

        {summary && <p className="editorial-deck">{summary}</p>}

        <Byline
          author={fm.author ?? "Pande Gede Dani Wismagatha"}
          date={niceDate}
          readTime={readTime}
        />

        <div className="editorial-body">
          <MDXProvider components={blogMdxComponents}>
            <MDX />
          </MDXProvider>
        </div>

        <footer className="editorial-pagefoot">
          <span>DANIWISMAGATHA.MY.ID/BLOG</span>
          <Link
            to="/blog"
            className="editorial-pagefoot__link"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              color: "var(--ink-faint)",
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={11} /> KEMBALI KE KATALOG
          </Link>
        </footer>
      </article>
    </main>
  );
}
