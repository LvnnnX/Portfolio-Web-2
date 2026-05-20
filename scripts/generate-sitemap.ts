/**
 * Build-time sitemap generator.
 *
 * Walks the route table by reading src/content/{case-studies,posts}/*.mdx
 * and writes dist/sitemap.xml after `vite build`.
 *
 * Static routes: /, /writing, /playground.
 * Dynamic routes: one entry per case study, one per writing post.
 *
 * Usage (post-build):
 *   node --import tsx/esm scripts/generate-sitemap.ts
 */

import { readdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITE_URL = "https://www.daniwismagatha.my.id";
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const CASE_STUDIES_DIR = resolve(ROOT, "src", "content", "case-studies");
const POSTS_DIR = resolve(ROOT, "src", "content", "posts");

interface SitemapEntry {
  loc: string;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: number;
}

async function listSlugs(dir: string): Promise<string[]> {
  try {
    const files = await readdir(dir);
    return files
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => f.replace(/\.mdx$/, ""));
  } catch {
    return [];
  }
}

function entry(loc: string, changefreq: SitemapEntry["changefreq"], priority: number): SitemapEntry {
  return { loc: `${SITE_URL}${loc}`, changefreq, priority };
}

function renderXml(entries: SitemapEntry[]): string {
  const items = entries
    .map((e) => {
      const parts = [`    <loc>${e.loc}</loc>`];
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
  const [caseStudies, posts] = await Promise.all([
    listSlugs(CASE_STUDIES_DIR),
    listSlugs(POSTS_DIR),
  ]);

  const entries: SitemapEntry[] = [
    entry("/", "monthly", 1.0),
    entry("/blog", "weekly", 0.8),
    ...caseStudies.map((slug) => entry(`/case-study/${slug}`, "monthly", 0.9)),
    ...posts.map((slug) => entry(`/blog/${slug}`, "monthly", 0.7)),
  ];

  const xml = renderXml(entries);
  await writeFile(resolve(DIST, "sitemap.xml"), xml, "utf8");
  console.log(`[sitemap] wrote ${entries.length} URLs to dist/sitemap.xml`);
}

main().catch((err) => {
  console.error("[sitemap] failed:", err);
  process.exit(1);
});
