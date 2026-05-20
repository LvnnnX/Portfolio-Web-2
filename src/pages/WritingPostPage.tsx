import type { ComponentType } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEO from "../components/seo/SEO";
import NotFoundPage from "./NotFoundPage";

interface PostFrontmatter {
  slug?: string;
  title?: string;
  date?: string;
  excerpt?: string;
  description?: string;
  readingTime?: string;
  tags?: string[];
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

export default function WritingPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const mod = slug ? posts.get(slug) : undefined;

  if (!mod) return <NotFoundPage />;

  const MDX = mod.default;
  const fm = mod.frontmatter ?? {};
  const summary = fm.excerpt ?? fm.description ?? "";

  return (
    <article className="relative pt-28 md:pt-32 pb-16 md:pb-24 px-4 md:px-6">
      <SEO
        title={fm.title ?? slug!}
        description={summary}
        path={`/blog/${slug}`}
        type="article"
        publishedTime={fm.date}
      />
      <div className="max-w-2xl mx-auto">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-[12px] md:text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={14} /> All posts
        </Link>

        <p className="text-[10px] md:text-[12px] font-semibold tracking-[0.12em] uppercase text-muted-foreground mb-3">
          {fm.date ?? "—"}
          {fm.readingTime ? ` · ${fm.readingTime}` : ""}
        </p>

        <h1 className="text-[30px] md:text-[42px] font-bold tracking-[-0.025em] leading-[1.15] text-foreground mb-4">
          {fm.title ?? slug}
        </h1>

        {summary && (
          <p className="text-[15px] md:text-[17px] leading-[1.6] text-muted-foreground mb-8">
            {summary}
          </p>
        )}

        {fm.tags && fm.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {fm.tags.map((tag) => (
              <span
                key={tag}
                className="bg-muted text-foreground/80 px-3 py-1 rounded-full text-[11px] md:text-[12px] font-semibold border border-border/30"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="prose prose-invert max-w-none case-study-prose">
          <MDX />
        </div>
      </div>
    </article>
  );
}
