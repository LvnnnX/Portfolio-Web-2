/**
 * Every URL the site serves, derived from the same content globs the pages use.
 * The prerender renders each one and the sitemap lists the indexable ones, so the
 * two can no longer drift apart the way the old filename-based sitemap did.
 */

interface Frontmatter {
  slug?: string;
  date?: string | Date;
  draft?: boolean;
}

export interface SiteRoute {
  path: string;
  /** YYYY-MM-DD of the newest content behind the URL, when known. */
  lastmod?: string;
  /** False for routes that are served but deliberately left out of the sitemap. */
  inSitemap: boolean;
}

const glob = {
  caseStudies: import.meta.glob<Frontmatter>("../content/case-studies/*.mdx", { eager: true, import: "frontmatter" }),
  posts: import.meta.glob<Frontmatter>("../content/posts/*.mdx", { eager: true, import: "frontmatter" }),
  techNews: import.meta.glob<Frontmatter>("../content/tech-news/*.mdx", { eager: true, import: "frontmatter" }),
};

function toDay(date: Frontmatter["date"]): string | undefined {
  if (date instanceof Date) return date.toISOString().slice(0, 10);
  return typeof date === "string" ? date.slice(0, 10) : undefined;
}

/** Slugs resolve as the pages resolve them: frontmatter first, filename second. */
function entries(mods: Record<string, Frontmatter | undefined>) {
  return Object.entries(mods)
    .map(([file, fm]) => ({
      slug: fm?.slug ?? file.split("/").pop()!.replace(/\.mdx$/, ""),
      lastmod: toDay(fm?.date),
      draft: fm?.draft === true,
    }))
    .sort((a, b) => (b.lastmod ?? "").localeCompare(a.lastmod ?? ""));
}

export function listRoutes(): SiteRoute[] {
  const caseStudies = entries(glob.caseStudies);
  const posts = entries(glob.posts);
  const techNews = entries(glob.techNews);

  return [
    { path: "/", inSitemap: true },
    { path: "/blog", lastmod: posts[0]?.lastmod, inSitemap: true },
    { path: "/tech-news", lastmod: techNews[0]?.lastmod, inSitemap: true },
    { path: "/planned-website", inSitemap: true },
    // Served, but unlisted: /services is not linked from the navigation.
    { path: "/services", inSitemap: false },
    ...caseStudies.map((d) => ({ path: `/case-study/${d.slug}`, lastmod: d.lastmod, inSitemap: !d.draft })),
    ...posts.map((d) => ({ path: `/blog/${d.slug}`, lastmod: d.lastmod, inSitemap: !d.draft })),
    ...techNews.map((d) => ({ path: `/tech-news/${d.slug}`, lastmod: d.lastmod, inSitemap: !d.draft })),
  ];
}
