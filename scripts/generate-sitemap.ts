/**
 * Build-time sitemap generator.
 *
 * Reads src/content/{case-studies,posts,tech-news}/*.mdx and writes
 * dist/sitemap.xml after `vite build`.
 *
 * Slugs come from frontmatter, with the filename as fallback — this must match
 * how the router resolves them (see WritingPostPage / TechNewsPostPage /
 * CaseStudyPage, which all key their module map on `frontmatter.slug ?? filename`).
 * Deriving slugs from filenames alone used to publish dead URLs for any post
 * whose filename carries a date prefix.
 *
 * /services is deliberately excluded: it's an unlisted route.
 *
 * Usage (post-build):
 *   node --import tsx/esm scripts/generate-sitemap.ts
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITE_URL = "https://www.daniwismagatha.my.id";
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const CONTENT = resolve(ROOT, "src", "content");

type ChangeFreq = "daily" | "weekly" | "monthly" | "yearly";

interface SitemapEntry {
  loc: string;
  changefreq?: ChangeFreq;
  priority?: number;
  lastmod?: string;
}

interface ContentDoc {
  slug: string;
  date?: string;
}

/** Read every .mdx in `dir`, resolving each slug the way the router does. */
async function readDocs(dir: string): Promise<ContentDoc[]> {
  let files: string[];
  try {
    files = await readdir(dir);
  } catch {
    return [];
  }

  const docs: ContentDoc[] = [];
  for (const file of files.filter((f) => f.endsWith(".mdx"))) {
    const raw = await readFile(resolve(dir, file), "utf8");
    const { data } = matter(raw);
    if (data.draft === true) continue;

    const slug =
      typeof data.slug === "string" && data.slug.length > 0
        ? data.slug
        : file.replace(/\.mdx$/, "");

    const date = data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : typeof data.date === "string"
        ? data.date.slice(0, 10)
        : undefined;

    docs.push({ slug, date });
  }

  // Newest first, so the sitemap reads in the same order as the indexes.
  return docs.sort((a, b) => (a.date ?? "") < (b.date ?? "") ? 1 : -1);
}

function entry(
  loc: string,
  changefreq: ChangeFreq,
  priority: number,
  lastmod?: string,
): SitemapEntry {
  return { loc: `${SITE_URL}${loc}`, changefreq, priority, lastmod };
}

function renderXml(entries: SitemapEntry[]): string {
  const items = entries
    .map((e) => {
      const parts = [`    <loc>${e.loc}</loc>`];
      if (e.lastmod) parts.push(`    <lastmod>${e.lastmod}</lastmod>`);
      if (e.changefreq) parts.push(`    <changefreq>${e.changefreq}</changefreq>`);
      if (e.priority !== undefined) parts.push(`    <priority>${e.priority.toFixed(1)}</priority>`);
      return `  <url>\n${parts.join("\n")}\n  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>
`;
}

async function main(): Promise<void> {
  const [caseStudies, posts, techNews] = await Promise.all([
    readDocs(resolve(CONTENT, "case-studies")),
    readDocs(resolve(CONTENT, "posts")),
    readDocs(resolve(CONTENT, "tech-news")),
  ]);

  const entries: SitemapEntry[] = [
    entry("/", "monthly", 1.0),
    entry("/blog", "weekly", 0.8, posts[0]?.date),
    entry("/tech-news", "daily", 0.8, techNews[0]?.date),
    entry("/planned-website", "monthly", 0.5),
    ...caseStudies.map((d) => entry(`/case-study/${d.slug}`, "monthly", 0.9, d.date)),
    ...posts.map((d) => entry(`/blog/${d.slug}`, "monthly", 0.7, d.date)),
    ...techNews.map((d) => entry(`/tech-news/${d.slug}`, "monthly", 0.4, d.date)),
  ];

  const xml = renderXml(entries);
  await writeFile(resolve(DIST, "sitemap.xml"), xml, "utf8");
  console.log(
    `[sitemap] wrote ${entries.length} URLs ` +
      `(${caseStudies.length} case studies, ${posts.length} posts, ${techNews.length} tech-news)`,
  );
}

main().catch((err) => {
  console.error("[sitemap] failed:", err);
  process.exit(1);
});
