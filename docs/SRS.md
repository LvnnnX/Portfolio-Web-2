# Software Requirements Specification (SRS)

## Blog Editorial Layout System — daniwismagatha.my.id

**Version:** 1.0 (alpha)
**Date:** 20 Mei 2026
**Author:** Pande Gede Dani Wismagatha
**Audience:** AI coding agent (Claude Code / Codex / OpenCode / Kiro) implementing the blog editorial layout

---

## 1. Introduction

### 1.1 Purpose

This document specifies the requirements for the **blog editorial layout system** to be added to the Portfolio Website v3 (`daniwismagatha.my.id`). The system must reproduce the visual quality of the editorial-style PDFs that have been hand-rendered for individual blog posts ("Rupiah Menuju Merdeka 17.845", "Kasus Nadiem dan Dua Cermin"), but as **first-class web pages** with full responsiveness, accessibility, and SEO support.

The output of this spec is a working `/blog` section on the portfolio website with:

- Editorial typography (serif body, drop cap, justified text with hyphenation)
- Magazine-style page chrome (masthead, eyebrow label, byline, footnote)
- An accent color system based on a Heritage / Boston Clay palette
- Markdown/MDX-driven content authoring
- Listing page + per-post route + reading-time metadata
- Print stylesheet that mirrors the PDF version

### 1.2 Scope

**In scope:**

- Adding a `/blog` route group to the existing Portfolio v3 React/Vite app.
- Creating reusable layout components: `<BlogPost>`, `<Lede>`, `<Masthead>`, `<Byline>`, `<Footnote>`, `<EditorialBlockquote>`, `<EditorialTable>`.
- Wiring MDX rendering via `@mdx-js/rollup` with custom MDX components.
- Importing two existing posts (`01-rupiah/source.mdx`, `02-nadiem/source.mdx`) verbatim into the new structure.
- Defining design tokens (colors, typography, spacing) in a `DESIGN.md` file and exporting them to Tailwind theme.
- Listing page at `/blog` showing all posts in chronological order with edition numbers.
- Per-post route at `/blog/[slug]` with full editorial layout.
- Print stylesheet so `Ctrl+P` produces a PDF visually equivalent to the hand-rendered ones.

**Out of scope:**

- CMS / admin UI (posts authored as MDX files in repo).
- Comments system.
- Multi-author support.
- Search / tag pages (deferred to a future phase).
- RSS feed (deferred — see FR-10 stretch).
- Dark mode (the editorial design is light-only by intent — see DESIGN.md rationale).

### 1.3 Definitions

| Term | Meaning |
|---|---|
| **Editorial layout** | The serif-driven, magazine-inspired layout rendered in the existing PDF blog posts. |
| **Lede** | The opening paragraph of an article, rendered with a drop cap. |
| **Eyebrow** | The small uppercase tag-like label that appears above the headline (e.g. "Catatan", "Hukum & Politik"). |
| **Masthead** | The thin top header containing the brand wordmark and edition metadata. |
| **Byline** | The line below the deck listing author, date, and reading time. |
| **Footnote block** | The italicized references list at the end of each post. |
| **Drop cap** | The large stylized first letter of the lede paragraph. |
| **Edition** | A monotonically increasing identifier for posts (Edisi 01, Edisi 02, ...). |
| **MDX** | Markdown with embedded JSX. Used for post source. |
| **Heritage palette** | The accent palette derived from the existing PDF design (deep ink, Boston Clay). See DESIGN.md. |

### 1.4 References

- DESIGN.md (this triad) — design tokens.
- CLAUDE.md (this triad) — implementation guidance.
- Existing PDF outputs: `01-rupiah/Rupiah-Menuju-Merdeka-17845.pdf`, `02-nadiem/Kasus-Nadiem-Dua-Cermin.pdf`.
- Existing source: `01-rupiah/source.mdx`, `02-nadiem/source.mdx`.
- Portfolio v3 stack reference: React 19, Vite, Tailwind v4, Framer Motion, Three.js.

### 1.5 Document overview

Section 2 describes the product in context. Section 3 lists numbered functional requirements (FR-x). Section 4 covers external interfaces. Section 5 lists non-functional requirements (NFR-x). Section 6 defines the phased roadmap. Section 7 closes with acceptance criteria for "v1 done".


---

## 2. Overall Description

### 2.1 Product perspective

The blog system is a **module added to an existing portfolio site**, not a greenfield project. It must coexist with the existing routes (home, projects, about, etc.) and reuse the existing visual chrome (nav, footer, theme provider) where it makes sense — but it introduces its own typography island for the editorial reading experience.

The portfolio stack is locked at: React 19, Vite, Tailwind CSS v4, Framer Motion, Three.js. No framework changes are permitted by this spec (see NFR-3, "Forbidden additions" in CLAUDE.md).

### 2.2 User classes

| Class | Time on task | Description |
|---|---|---|
| **Primary** | 5–15 min | Reader who arrived from a link (LinkedIn, Twitter, search). Reads one full post, may scroll to footnote. |
| **Secondary** | 30–90 sec | Recruiter / hiring manager scanning the listing page to assess writing quality. Reads headline + deck + first two paragraphs. |
| **Tertiary** | 1–2 min | Returning reader checking for new posts on `/blog` index. |

### 2.3 Operating environment

- Modern evergreen browsers: Chrome ≥120, Safari ≥17, Firefox ≥120, Edge ≥120.
- Mobile-first viewport: 360×640 minimum, optimized for 375–428 width.
- Desktop reading width: caps at 680px content column on viewports ≥1024px.
- Print: A4, 18mm × 22mm margins (matches PDF spec). Background colors must print.

### 2.4 Constraints

- **Stack lock:** must use existing Vite + React 19 + Tailwind v4 + Framer Motion. No Next.js, no Astro, no separate static-site generator. (See CLAUDE.md "Forbidden additions" for the full list.)
- **Asset budget:** total CSS for blog module ≤ 30 KB minified, total JS for blog module ≤ 50 KB gzipped.
- **Animation budget:** entrance animations ≤ 200ms; respect `prefers-reduced-motion`.
- **Font budget:** ≤ 2 web fonts total for the blog system (1 serif body + 1 sans for chrome). Fallback stack must include Charter, Iowan Old Style, Georgia.

### 2.5 Assumptions and dependencies

- Repo is the existing `Portfolio-Web-2` with Vite + Tailwind v4 already configured.
- Posts will be authored as `.mdx` files in `src/content/blog/`.
- The user is comfortable running `pnpm` or `npm` install for new MDX dependencies.
- The user owns the `daniwismagatha.my.id` domain and has deploy permissions.
- The user already has the two source MDX files from the existing blog-posts.zip.

---

## 3. Functional Requirements

### FR-1 — Blog index route (`/blog`)

- **FR-1.1** The route `/blog` SHALL render a list of all posts in reverse chronological order (newest first).
- **FR-1.2** Each list item SHALL show: edition number (e.g. "Edisi 02"), eyebrow tags, headline, deck, date, reading time.
- **FR-1.3** Each list item SHALL link to its post page at `/blog/[slug]`.
- **FR-1.4** The listing page SHALL use a serif headline font and sans-serif metadata (mirroring the editorial chrome).
- **FR-1.5** The listing page SHALL be statically pre-rendered at build time (Vite SSG plugin or equivalent).

### FR-2 — Post page route (`/blog/[slug]`)

- **FR-2.1** Each post SHALL render the full editorial layout: masthead, eyebrow, headline, deck, byline, body, footnote.
- **FR-2.2** The first paragraph after the headline SHALL render with a drop cap if marked with `<Lede>` in MDX.
- **FR-2.3** Body text SHALL be justified with hyphenation (`text-align: justify; hyphens: auto;`) on viewports ≥768px; left-aligned on smaller screens.
- **FR-2.4** Blockquotes SHALL render with a left accent border using the Heritage tertiary color.
- **FR-2.5** Tables SHALL render with editorial styling (uppercase header labels, single-pixel rules between rows).
- **FR-2.6** Footnote blocks SHALL render in italic small text below a horizontal rule at the end of the post.
- **FR-2.7** Each post SHALL be statically pre-rendered at build time.

### FR-3 — MDX content pipeline

- **FR-3.1** The system SHALL accept `.mdx` files in `src/content/blog/` as the authoring source.
- **FR-3.2** YAML frontmatter SHALL be parsed and used for: `title`, `slug`, `date`, `description`, `tags`, `author`, `edition`, `readTime`.
- **FR-3.3** The MDX renderer SHALL provide custom components: `<Lede>`, `<EditorialBlockquote>`, `<EditorialTable>`, `<Footnote>`.
- **FR-3.4** The MDX pipeline SHALL apply `remark-gfm` for GitHub-flavored Markdown (tables, strikethrough).
- **FR-3.5** No client-side MDX runtime SHALL ship — all MDX is compiled at build time.

### FR-4 — Editorial typography

- **FR-4.1** Body text SHALL use the serif font defined in DESIGN.md (`typography.body-md.fontFamily`).
- **FR-4.2** Drop cap SHALL render at 4.5em font-size, 0.85 line-height, accent color, floated left.
- **FR-4.3** Headlines (h1) SHALL use the serif font at 28pt with -0.025em letter-spacing.
- **FR-4.4** Subheadings (h2) SHALL use the serif font at 16pt with -0.015em letter-spacing.
- **FR-4.5** Eyebrow labels SHALL use the sans-serif font in uppercase with 0.20em letter-spacing.
- **FR-4.6** Body line-height SHALL be 1.65; letter-spacing -0.005em.

### FR-5 — Color & accent system

- **FR-5.1** Accent color SHALL be the Heritage tertiary defined in DESIGN.md (`#B8422E`, "Boston Clay").
- **FR-5.2** Accent SHALL appear on: drop cap, blockquote left border, eyebrow text, "active" link state.
- **FR-5.3** Body ink SHALL be `#1D1D1F`; soft ink `#4A4A4F`; faint ink `#86868B`.
- **FR-5.4** Surface SHALL be `#FFFFFF`; muted surface `#FAFAFA`.
- **FR-5.5** All token references SHALL come from DESIGN.md — no inline hex values in component code.

### FR-6 — Listing page metadata

- **FR-6.1** Each list card SHALL show edition number left-aligned, date right-aligned in a thin top row.
- **FR-6.2** Eyebrow tags SHALL show below the metadata row (max 3 tags, comma-separated).
- **FR-6.3** Headline SHALL be 22–24pt, deck 13pt italic.
- **FR-6.4** Cards SHALL be separated by 1px horizontal rules in faint ink color.
- **FR-6.5** Hover state SHALL move the card 2px right with a 200ms ease — respect `prefers-reduced-motion`.

### FR-7 — Print stylesheet

- **FR-7.1** A `@media print` block SHALL hide nav, footer, and any interactive chrome.
- **FR-7.2** Print SHALL use A4 paper size with 18mm × 22mm margins.
- **FR-7.3** Print SHALL preserve all editorial styling: drop cap, blockquote borders, eyebrow, byline, footnote.
- **FR-7.4** Background colors SHALL print (`-webkit-print-color-adjust: exact`).
- **FR-7.5** A small page footer SHALL show "DANIWISMAGATHA.MY.ID/CATATAN" and page number.

### FR-8 — SEO and metadata

- **FR-8.1** Each post SHALL emit OpenGraph tags: `og:title`, `og:description`, `og:type=article`, `og:url`, `og:image`.
- **FR-8.2** Each post SHALL emit Twitter Card tags: `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`.
- **FR-8.3** Each post SHALL emit a JSON-LD `Article` schema block.
- **FR-8.4** The listing page SHALL emit a `<link rel="canonical">` tag pointing to `/blog`.
- **FR-8.5** A `sitemap.xml` SHALL include `/blog` and all post slugs.

### FR-9 — Accessibility

- **FR-9.1** All interactive elements SHALL have visible focus rings using the accent color.
- **FR-9.2** Color contrast SHALL meet WCAG AA (4.5:1 for body, 3:1 for headings).
- **FR-9.3** Headings SHALL form a logical document outline (one h1 per page).
- **FR-9.4** All images SHALL have `alt` text or `alt=""` for decorative.
- **FR-9.5** Drop cap SHALL be implemented via `::first-letter` (not separate `<span>`) so screen readers read the lede normally.

### FR-10 — Stretch (optional, post-v1)

- **FR-10.1** RSS feed at `/blog/rss.xml`.
- **FR-10.2** Tag pages at `/blog/tag/[tag]`.
- **FR-10.3** Reading-progress bar.
- **FR-10.4** "Estimated reading time" computed from word count.

---

## 4. External Interface Requirements

### 4.1 User interface

The blog inherits the existing portfolio nav and footer. The blog content area introduces its own typography island (serif body, accent palette) but does NOT override the existing site theme provider for non-blog routes.

### 4.2 Hardware interface

None.

### 4.3 Software interface

- Build tool: Vite ≥5
- Framework: React 19
- Styling: Tailwind CSS v4 + custom CSS layer for editorial typography
- MDX: `@mdx-js/rollup` ≥3
- Frontmatter: `gray-matter` ≥4
- GFM: `remark-gfm` ≥4
- Routing: existing portfolio router (likely React Router or similar)
- SSG: Vite SSG plugin (`vite-ssg` or `vite-plugin-ssr`)

### 4.4 Communication interface

None — fully static.

---

## 5. Non-Functional Requirements

### NFR-1 — Performance

- **NFR-1.1** Lighthouse Performance score on `/blog/[slug]` SHALL be ≥95 on mobile.
- **NFR-1.2** First Contentful Paint SHALL be <1.2s on a 4G connection.
- **NFR-1.3** Largest Contentful Paint SHALL be <2.0s on a 4G connection.
- **NFR-1.4** Cumulative Layout Shift SHALL be <0.05 (no font swap jumps).

### NFR-2 — Reliability

- **NFR-2.1** Posts SHALL render even if a custom MDX component is missing (fallback to default markdown rendering).
- **NFR-2.2** Build SHALL fail loudly if a post's frontmatter is missing required fields.

### NFR-3 — Maintainability

- **NFR-3.1** All design tokens SHALL be defined exactly once in DESIGN.md and exported to Tailwind theme.
- **NFR-3.2** All editorial layout components SHALL live under `src/blog/components/`.
- **NFR-3.3** No editorial styling SHALL leak into non-blog routes.
- **NFR-3.4** New posts SHALL require zero code changes — only adding a `.mdx` file.

### NFR-4 — Accessibility

- **NFR-4.1** All requirements in FR-9 are also non-functional acceptance criteria.
- **NFR-4.2** The site SHALL pass `axe-core` automated audit with zero violations on `/blog` and a representative `/blog/[slug]` page.

### NFR-5 — Browser support

- **NFR-5.1** Chrome ≥120, Safari ≥17, Firefox ≥120, Edge ≥120 SHALL be fully supported.
- **NFR-5.2** Older browsers SHALL receive degraded but readable typography (no drop cap, no hyphens).

### NFR-6 — i18n

- **NFR-6.1** Posts SHALL be authored in Bahasa Indonesia by default.
- **NFR-6.2** The MDX pipeline SHALL accept `lang` frontmatter to set `<html lang>` per post.
- **NFR-6.3** Hyphenation SHALL respect the post's `lang` (Indonesian hyphenation differs from English).

### NFR-7 — Security

- **NFR-7.1** MDX content SHALL be sanitized against script injection at build time.
- **NFR-7.2** External links in posts SHALL receive `rel="noopener noreferrer"`.
- **NFR-7.3** No user-generated content (comments, etc.) — out of scope per Section 1.2.

---

## 6. Phased Roadmap

### Phase 0 — Foundation (1 day)

**Goal:** Set up MDX pipeline + design tokens. No visual changes yet.

- Add MDX deps to `package.json`: `@mdx-js/rollup`, `gray-matter`, `remark-gfm`.
- Wire `@mdx-js/rollup` into `vite.config.ts`.
- Create `src/content/blog/` directory.
- Author `docs/DESIGN.md` (Heritage palette).
- Run `npx -y @google/design.md export --format tailwind docs/DESIGN.md > tailwind.theme.json`.
- Merge generated theme into `tailwind.config.ts` extending existing theme.
- Add Source Serif 4 (or licensed Charter equivalent) via `<link>` in `index.html` or `@import` in `main.css`.
- **Deployable:** Yes. Site behaves identically to before; only build pipeline changed.

### Phase 1 — Editorial layout components (1 day)

**Goal:** Build the reusable React components that produce the editorial chrome.

- Create `src/blog/components/Masthead.tsx`.
- Create `src/blog/components/Eyebrow.tsx`.
- Create `src/blog/components/Byline.tsx`.
- Create `src/blog/components/EditorialBlockquote.tsx`.
- Create `src/blog/components/EditorialTable.tsx`.
- Create `src/blog/components/Lede.tsx` (drop cap wrapper).
- Create `src/blog/components/Footnote.tsx`.
- Create `src/blog/components/BlogPost.tsx` (composes all of the above).
- Create `src/blog/styles/editorial.css` (CSS variables, `::first-letter`, `text-align: justify`, etc.).
- Add Storybook-style preview route at `/_dev/blog-preview` (gated by `import.meta.env.DEV`).
- **Deployable:** Yes. Components exist but no public route consumes them yet.

### Phase 2 — MDX content pipeline (1 day)

**Goal:** Wire MDX rendering with custom components.

- Create `src/blog/mdx-components.ts` exporting `useMDXComponents`.
- Create `src/blog/lib/getAllPosts.ts` — globs `src/content/blog/*.mdx`, parses frontmatter, returns sorted list.
- Create `src/blog/lib/getPostBySlug.ts` — returns post + compiled MDX content.
- Author `docs/CLAUDE.md` if not already (this triad).
- Import the existing `01-rupiah/source.mdx` and `02-nadiem/source.mdx` from `blog-posts.zip` into `src/content/blog/`.
- Validate frontmatter completeness (script in `scripts/validate-frontmatter.ts`).
- **Deployable:** Posts compile but no route renders them yet.

### Phase 3 — Public routes (1 day)

**Goal:** Wire `/blog` and `/blog/[slug]` routes.

- Add route `/blog` rendering listing page using `getAllPosts()`.
- Add route `/blog/[slug]` rendering individual post via `getPostBySlug()`.
- Wire up SSG for both routes (`vite-ssg` or `vite-plugin-ssr`).
- Add OpenGraph + Twitter Card + JSON-LD schemas (FR-8).
- Test print preview matches PDF reference (Ctrl+P).
- **Deployable:** Yes. Blog is live with two posts.

### Phase 4 — Polish & verification (0.5 day)

**Goal:** Hit performance & accessibility targets.

- Run Lighthouse on `/blog` and `/blog/kasus-nadiem-dua-cermin`. Confirm Performance ≥95.
- Run `axe-core` automated audit. Confirm zero violations.
- Test on Chrome, Safari (macOS + iOS), Firefox at 360px, 768px, 1280px viewports.
- Cross-check print preview against PDF reference. Adjust margins / font sizes if drift.
- Add `<link rel="canonical">` and sitemap entry.
- Submit sitemap to Google Search Console.
- **Deployable:** Yes. v1 done.

### Phase 5 — Stretch (optional)

- RSS feed (FR-10.1).
- Tag pages (FR-10.2).
- Reading-progress bar (FR-10.3).
- Auto reading-time (FR-10.4).

---

## 7. Acceptance Criteria

The blog editorial layout system SHALL be considered "v1 done" when ALL of the following are true:

1. Both existing posts (Rupiah, Nadiem) render at `/blog/rupiah-menuju-merdeka` and `/blog/kasus-nadiem-dua-cermin` respectively.
2. The listing at `/blog` shows both posts in reverse chronological order.
3. Visual comparison between web rendering and PDF reference: typography (font family, size ratios, letter-spacing), accent color, drop cap, blockquote styling, eyebrow, masthead, byline, footnote — all match within ±5% spacing tolerance.
4. `npx -y @google/design.md lint docs/DESIGN.md` returns exit 0.
5. Lighthouse mobile performance score ≥95 on `/blog/kasus-nadiem-dua-cermin`.
6. `axe-core` audit returns zero violations on both `/blog` and a representative post.
7. Print preview (`Ctrl+P`) on a post produces a single-window PDF visually equivalent to the existing hand-rendered PDFs.
8. Adding a third post requires zero code changes — only adding a new `.mdx` file under `src/content/blog/`.
9. Total CSS for the blog module is ≤30 KB minified (verified via `pnpm build && du -sb dist/`).
10. The triad (`SRS.md`, `CLAUDE.md`, `DESIGN.md`) is committed under `docs/` in the repo and cross-referenced.

---

*End of SRS.md*
