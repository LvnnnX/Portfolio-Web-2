/**
 * Build-time prerender. After the client bundle is written, every route is rendered
 * through src/entry-server.ts into its own HTML file, so crawlers and link
 * previews get the page's real title, metadata and content instead of an empty
 * #root. Also writes 404.html and sitemap.xml from the same route list.
 *
 * It runs inside `vite build` rather than as an npm script, so it happens whatever
 * build command the host is configured with.
 */

import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { createServer, type Manifest, type Plugin, type ResolvedConfig } from "vite";

interface SiteRoute {
  path: string;
  lastmod?: string;
  inSitemap: boolean;
}

interface ServerEntry {
  render(path: string): Promise<{ html: string; modules: string[] }>;
  listRoutes(): SiteRoute[];
  langFor(path: string): "id" | "en";
  SITE_URL: string;
}

// React 19 emits hoistable <title>, <meta> and <link> tags at the very start of a
// non-document render. That leading run is the page's <head> content.
const LEADING_HEAD = /^(?:\s*(?:<title\b[^>]*>[\s\S]*?<\/title>|<meta\b[^>]*>|<link\b[^>]*>))+/;
const NOINDEX = /<meta name="robots" content="noindex"/;

export function prerender(): Plugin {
  let config: ResolvedConfig;
  return {
    name: "portfolio:prerender",
    apply: "build",
    config: (_, env) => (env.isSsrBuild ? undefined : { build: { manifest: true } }),
    configResolved(resolved) {
      config = resolved;
    },
    async closeBundle() {
      if (!config.build.ssr) await prerenderSite(config);
    },
  };
}

async function prerenderSite(config: ResolvedConfig) {
  const outDir = resolve(config.root, config.build.outDir);
  const template = await readFile(join(outDir, "index.html"), "utf8");
  const manifest = JSON.parse(
    await readFile(join(outDir, ".vite", "manifest.json"), "utf8"),
  ) as Manifest;

  const server = await createServer({
    root: config.root,
    configFile: config.configFile,
    mode: config.mode,
    logLevel: "error",
    appType: "custom",
    server: { middlewareMode: true, hmr: false, watch: null },
  });

  try {
    const entry = (await server.ssrLoadModule("/src/entry-server.ts")) as ServerEntry;
    const routes = entry.listRoutes();
    const build = (html: string, modules: string[], lang: string) =>
      page(template, html, chunkHints(modules, manifest, template, config.base), lang);

    for (const route of routes) {
      const { html, modules } = await entry.render(route.path);
      // A listed route that renders the 404 page means its slug no longer resolves.
      if (NOINDEX.test(html)) throw new Error(`[prerender] ${route.path} rendered the 404 page`);
      await emit(outDir, fileFor(route.path), build(html, modules, entry.langFor(route.path)));
    }

    const missing = await entry.render("/404");
    await emit(outDir, "404.html", build(missing.html, missing.modules, "en"));

    const listed = routes.filter((r) => r.inSitemap);
    await emit(outDir, "sitemap.xml", sitemap(entry.SITE_URL, listed));
    config.logger.info(
      `\n[prerender] ${routes.length} pages + 404.html, sitemap with ${listed.length} URLs`,
    );
  } finally {
    await server.close();
    // The manifest was only needed here; don't publish the source layout.
    await rm(join(outDir, ".vite"), { recursive: true, force: true });
  }
}

/** "/blog/x" -> "blog/x.html", served at /blog/x by Vercel's cleanUrls. */
const fileFor = (path: string) => (path === "/" ? "index.html" : `${path.slice(1)}.html`);

async function emit(outDir: string, file: string, content: string) {
  const target = join(outDir, file);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, content, "utf8");
}

function page(template: string, appHtml: string, hints: string, lang: string) {
  const head = LEADING_HEAD.exec(appHtml)?.[0] ?? "";
  const body = appHtml.slice(head.length);
  // Marked so App.tsx can drop them once React renders its own copies.
  const headTags = head.trim().replace(/<(title|meta|link)\b/g, "<$1 data-prerender");

  // Function replacers: page text can contain "$&" and friends.
  return template
    .replace(/<html lang="[^"]*">/, () => `<html lang="${lang}">`)
    .replace(/<title>[\s\S]*?<\/title>\s*/, () => "")
    .replace("</head>", () => `${headTags}\n${hints}\n</head>`)
    .replace('<div id="root"></div>', () => `<div id="root">${body}</div>`);
}

/** CSS and modulepreload tags for the code-split chunks a page rendered. */
function chunkHints(modules: string[], manifest: Manifest, template: string, base: string) {
  const css = new Set<string>();
  const js = new Set<string>();
  const visit = (key: string) => {
    const chunk = manifest[key];
    if (!chunk || js.has(chunk.file)) return;
    js.add(chunk.file);
    chunk.css?.forEach((file) => css.add(file));
    chunk.imports?.forEach(visit);
  };
  modules.forEach(visit);

  // The entry's own script, stylesheet and preloads are already in the template.
  const fresh = (file: string) => !template.includes(`${base}${file}`);
  return [
    ...[...css].filter(fresh).map((f) => `<link rel="stylesheet" crossorigin href="${base}${f}">`),
    ...[...js].filter(fresh).map((f) => `<link rel="modulepreload" crossorigin href="${base}${f}">`),
  ].join("\n");
}

function sitemap(siteUrl: string, routes: SiteRoute[]) {
  const urls = routes.map((r) => {
    const lastmod = r.lastmod ? `\n    <lastmod>${r.lastmod}</lastmod>` : "";
    return `  <url>\n    <loc>${siteUrl}${r.path}</loc>${lastmod}\n  </url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;
}
