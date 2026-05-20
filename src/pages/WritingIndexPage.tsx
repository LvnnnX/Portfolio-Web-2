import type { ComponentType } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/seo/SEO";

interface PostFrontmatter {
  slug?: string;
  title?: string;
  date?: string;
  excerpt?: string;
  description?: string;
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

interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
}

const posts: PostMeta[] = Object.entries(modules)
  .map(([path, mod]) => {
    const fileSlug = path.split("/").pop()?.replace(/\.mdx$/, "") ?? "";
    const fm = mod.frontmatter ?? {};
    return {
      slug: fm.slug ?? fileSlug,
      title: fm.title ?? fileSlug,
      date: fm.date ?? "",
      excerpt: fm.excerpt ?? fm.description ?? "",
      tags: fm.tags ?? [],
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export default function WritingIndexPage() {
  return (
    <main className="relative pt-28 md:pt-32 pb-16 md:pb-24 px-4 md:px-6">
      <SEO
        title="Blog"
        description="Catatan tentang ekonomi, hukum, teknologi, dan apa pun yang layak ditulis pelan-pelan."
        path="/blog"
      />
      <div className="max-w-3xl mx-auto">
        <p className="text-[10px] md:text-[12px] font-bold tracking-[0.12em] uppercase text-[color:var(--color-accent,#B8422E)] mb-3">
          Blog
        </p>
        <h1 className="text-[34px] md:text-[48px] font-bold tracking-[-0.025em] leading-[1.1] text-foreground mb-4">
          Notes &amp; essays
        </h1>
        <p className="text-[16px] md:text-[18px] leading-[1.6] text-muted-foreground mb-10 md:mb-14">
          Catatan pelan tentang ekonomi, hukum, teknologi, dan hal-hal yang layak dipikir lebih dari satu kali.
        </p>

        {posts.length === 0 ? (
          <p className="text-muted-foreground">No posts yet.</p>
        ) : (
          <ul className="flex flex-col gap-4 md:gap-6">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="block liquid-glass rounded-[20px] p-5 md:p-7 transition-all hover:-translate-y-1 hover:shadow-2xl"
                >
                  <p className="text-[10px] md:text-[12px] font-semibold tracking-[0.12em] uppercase text-muted-foreground mb-2">
                    {post.date || "—"}
                  </p>
                  <h2 className="text-[20px] md:text-[26px] font-bold tracking-tight text-foreground mb-2 leading-tight">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-[13px] md:text-[15px] text-muted-foreground leading-[1.55] mb-3">
                      {post.excerpt}
                    </p>
                  )}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-muted text-foreground/70 px-2 py-0.5 rounded-full text-[10px] md:text-[11px] font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
