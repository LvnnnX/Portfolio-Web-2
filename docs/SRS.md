# Software Requirements Specification

**Project:** Portfolio Web v3 — Pande Gede Dani Wismagatha
**Repo:** [LvnnnX/Portfolio-Web-2](https://github.com/LvnnnX/Portfolio-Web-2)
**Live:** https://www.daniwismagatha.my.id
**Document version:** 1.0 (May 2026)
**Author:** Dani (with Kiro)
**Status:** Draft for v3 rework

---

## 1. Introduction

### 1.1 Purpose
This SRS defines the requirements for reworking the existing portfolio (v2) into v3. The goal is to evolve from a "credentials-listing" portfolio into a **case-study driven, ML-showcase portfolio** that demonstrates technical depth through live demos, measurable outcomes, and recruiter-friendly content architecture.

### 1.2 Scope
The deliverable is a static-rendered, theme-aware, content-rich web application that:
- Repositions the brand from generic "Data Scientist & AI Specialist" to a sharper niche.
- Reframes every experience and project from input-based (training hours, certificates) to outcome-based (metrics, problems solved, business impact).
- Hosts at least one **live ML demo** (YOLOv8 Fruit Ninja inference) embedded in-page.
- Adds dedicated **case study pages** for the top 3 projects.
- Adds a **technical writing / blog** section authored in MDX.
- Keeps the existing aesthetic (glassmorphism, falling-pattern, WebGL shader) but improves performance, accessibility, and SEO.

### 1.3 Definitions
- **Case study** — a long-form page covering Problem → Data → Approach → Results → Lessons.
- **Live demo** — an interactive widget that runs model inference (in-browser ONNX / WASM, or proxied to Hugging Face Spaces).
- **Hero card** — top-of-fold composition with name, tagline, headline metrics.
- **Tier-1 project** — a project with a dedicated case-study page (max 3).
- **Tier-2 project** — a project with only a card on the index (no dedicated page).
- **Token** — a design value defined in `DESIGN.md` (color, spacing, typography).

### 1.4 References
- Existing repo: https://github.com/LvnnnX/Portfolio-Web-2
- Resume PDF: `Pande Gede Dani Wismagatha-resume.pdf`
- Companion specs: `DESIGN.md`, `CLAUDE.md` (in `/docs`)
- WCAG 2.2 AA — accessibility target.
- Lighthouse v11 — performance target.

### 1.5 Document overview
Section 2 describes the product context. Section 3 lists features. Section 4 covers external interfaces. Section 5 covers non-functional requirements. Section 6 lists the phased roadmap that drives implementation order.

---

## 2. Overall Description

### 2.1 Product perspective
v3 is a continuation of v2 (Vite + React 19 + Tailwind v4 + Framer Motion + Three.js). It keeps the same domain, hosting, and visual identity, but restructures content and adds new routes, components, and integrations.

### 2.2 User classes
- **Primary — recruiter / hiring manager.** Scans for: 1) clear positioning, 2) measurable outcomes, 3) shipped artifacts, 4) easy CV download. Time on site: 60–90 seconds.
- **Secondary — engineering peer.** Reads case studies in depth, inspects code, may interact with live demo. Time on site: 5–10 minutes.
- **Tertiary — student / mentee.** Reads blog posts, follows links to learning resources.

### 2.3 Operating environment
- **Browsers:** evergreen Chromium, Firefox, Safari (last 2 versions). Mobile Safari & Chrome Android.
- **Network:** target Lighthouse mobile profile (Slow 4G, 4× CPU throttle).
- **Hosting:** static hosting (Vercel / Netlify / Cloudflare Pages — keep current host unless migration is justified).
- **Build tool:** Vite (current).

### 2.4 Constraints
- **Stack lock:** stay on React 19 + Vite + Tailwind v4 + Framer Motion. No migration to Next.js / Astro in v3 (deferred to v4 if SSR/blog needs justify it).
- **Single-author:** Dani is the sole maintainer; complexity must stay justified by visible value.
- **Asset budget:** keep total image weight under 2 MB above the fold; lazy-load below.
- **Animation budget:** existing falling-pattern + WebGL shader stay, but must respect `prefers-reduced-motion` and disable on mobile (already partially handled in `index.css`).

### 2.5 Assumptions and dependencies
- The Fruit Ninja YOLOv8 weights are exportable to ONNX and runnable in-browser via `onnxruntime-web`, OR can be hosted on Hugging Face Spaces and embedded via iframe.
- The current Vite + Tailwind v4 toolchain remains stable through the rework.
- The user is comfortable with content authoring in MDX.

---

## 3. System Features (Functional Requirements)

### 3.1 Brand & positioning
- **FR-1.1** Hero tagline must replace "Data Scientist & AI Specialist" with a sharper variant. Default proposal: *"Computer Vision & Applied ML Engineer — Building Vision Systems for Real-World Automation."* Final wording to be approved by Dani before merge.
- **FR-1.2** Hero must present three headline metrics (e.g. *"3+ yrs ML / 13 YOLOv8 variants benchmarked / GPA 3.98"*). Numbers must reflect outcome, not training input.
- **FR-1.3** Hero must include a primary CTA "Download CV" linking to `/Pande-Gede-Dani-Wismagatha-CV.pdf`, kept above the fold on desktop and mobile.
- **FR-1.4** Hero must include a secondary CTA "See live demo" anchoring to `#playground`.

### 3.2 Experience timeline
- **FR-2.1** Each timeline card must render in **impact-first** format: 1 outcome sentence (top, bold), 1 context sentence (bottom, muted). Categories (EDUCATION/LEADERSHIP/etc.) remain as eyebrow labels.
- **FR-2.2** Timeline must support priority ordering. Top 5 cards are visible by default; remaining items collapse into a "Show 3 more" accordion.
- **FR-2.3** Each card must expose a "Details" link. For Tier-1 entries, the link routes to `/case-study/:slug`. For Tier-2, it opens an inline expandable.
- **FR-2.4** Default order (highest to lowest): Bangkit ML Cohort → Microsoft Data Engineer → Fruit Ninja YOLOv8 → MEWS BBMKG Internship → Olympiad Coach → student governance roles (collapsed).

### 3.3 Featured projects & case studies
- **FR-3.1** The system must support exactly 3 Tier-1 projects with dedicated `/case-study/:slug` pages. Initial set: `fruit-ninja-yolov8`, `smandapura-exam-app`, `mews-bbmkg-automation`.
- **FR-3.2** Each case study page must include sections in this order: **Problem → Data → Approach → Results → Lessons learned → Repo / live link**.
- **FR-3.3** Results section must surface at least one quantified metric (accuracy, FPS, latency, throughput, dollars/hours saved). Placeholder copy is forbidden in production.
- **FR-3.4** All case studies must be authored as MDX in `src/content/case-studies/*.mdx` and rendered through a single `CaseStudy` layout component.

### 3.4 Live ML playground
- **FR-4.1** The site must include a `/playground` section (or anchor) that hosts at least one runnable ML demo.
- **FR-4.2** Default demo: Fruit Ninja YOLOv8 inference. Implementation choice (in priority order):
  1. In-browser via `onnxruntime-web` if model size ≤ 25 MB.
  2. Embedded Hugging Face Space via `<iframe>` if model is larger.
  3. Static GIF/MP4 fallback if both fail.
- **FR-4.3** The playground must show inference latency in ms next to results.
- **FR-4.4** The playground must work without breaking layout when inference fails (graceful fallback to static media).

### 3.5 Skills & stack
- **FR-5.1** Skills section must group items under named clusters: **Languages**, **ML / DS**, **Data Engineering**, **Frontend**, **Tools**.
- **FR-5.2** Each item must render as a logo + label chip. Logos are SVG inlined or served from `public/logos/`.
- **FR-5.3** A proficiency indicator (e.g. dot scale 1–5) is **explicitly excluded** to avoid the recruiter-trust pitfall.

### 3.6 Writing / blog
- **FR-6.1** A `/writing` index page must list posts authored as MDX in `src/content/posts/*.mdx`.
- **FR-6.2** Each post page must render at `/writing/:slug` with reading-time, publish date, and tags.
- **FR-6.3** v3 must ship with **at least 2 posts** at launch: a paper review and a tutorial drawn from the Fruit Ninja project.

### 3.7 GitHub presence
- **FR-7.1** A "Open source" section must surface 4 pinned repos via the GitHub REST API (`/users/LvnnnX/repos`) at build time, cached as a static JSON.
- **FR-7.2** Each repo card must show name, description, primary language, stars.
- **FR-7.3** No live API calls at runtime — fetch happens during `vite build` and result is committed to `src/content/github.json`.

### 3.8 Testimonials (optional, gated by content availability)
- **FR-8.1** A testimonial carousel may be added once Dani provides ≥ 2 quotes from mentors/supervisors. Until then, the section is omitted from the build.

### 3.9 SEO & metadata
- **FR-9.1** Each route must emit unique `<title>` and `<meta name="description">`.
- **FR-9.2** Each route must emit Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`).
- **FR-9.3** The site must include `Person` JSON-LD structured data on `/`.
- **FR-9.4** The site must serve a valid `sitemap.xml` and `robots.txt`.

### 3.10 Theme & accessibility
- **FR-10.1** The existing light/dark toggle must persist user preference in `localStorage` and respect `prefers-color-scheme` on first visit.
- **FR-10.2** All text-on-background pairings must meet WCAG 2.2 AA contrast (≥ 4.5:1 for body, ≥ 3:1 for large text).
- **FR-10.3** All interactive elements must be keyboard-navigable with visible focus states.
- **FR-10.4** All decorative animations (falling pattern, WebGL shader, draggable card) must disable when `prefers-reduced-motion: reduce` is set.

### 3.11 Contact
- **FR-11.1** Contact section must offer at minimum: email (mailto), LinkedIn, GitHub, X/Twitter, and a "Download CV" button.
- **FR-11.2** Contact form (if added) must POST to a serverless function or use Formspree/Resend; never expose SMTP credentials client-side.

---

## 4. External Interface Requirements

### 4.1 User interfaces
Refer to `DESIGN.md` for the full token spec. Key interface contracts:
- All cards use `liquid-glass` panel with consistent `rounded-2xl` border radius.
- All section headings use `h2` with `font-weight: 700`, `letter-spacing: -0.02em`.
- All buttons use the `liquid-glass-button` component variants defined in `src/components/ui/`.

### 4.2 Hardware interfaces
None.

### 4.3 Software interfaces
- **GitHub REST API** — read-only, build-time, public endpoints only.
- **Hugging Face Spaces** (optional) — embedded via iframe; no auth required.
- **Plausible / Umami / GoatCounter** — privacy-friendly analytics; no cookies.

### 4.4 Communications interfaces
- HTTPS only.
- Static file delivery via the existing CDN.

---

## 5. Non-Functional Requirements

### 5.1 Performance
- **NFR-1** Lighthouse mobile **Performance ≥ 90**, **Best Practices ≥ 95**, **SEO ≥ 95**, **Accessibility ≥ 95**.
- **NFR-2** Largest Contentful Paint ≤ 2.5 s on Slow 4G.
- **NFR-3** Total JS bundle ≤ 250 KB gzipped on the landing route. ML inference deps load on-demand for `/playground`.
- **NFR-4** Hero image must be served as AVIF + WebP fallback, dimensioned for the device via `<picture>`.

### 5.2 Reliability
- **NFR-5** Build must be reproducible from a clean clone with `pnpm i && pnpm build` (or `npm`).
- **NFR-6** No runtime dependency on third-party APIs in the critical path. GitHub data is build-time cached.

### 5.3 Maintainability
- **NFR-7** All content (case studies, posts, experience entries) must live in `src/content/*` as MDX or JSON, separate from component code.
- **NFR-8** Components must be functional, typed (TypeScript strict), and free of `any` outside narrowly justified spots.
- **NFR-9** ESLint + Prettier must pass on every commit; pre-commit hook via `lint-staged` is recommended.

### 5.4 Security & privacy
- **NFR-10** No analytics that drop third-party cookies.
- **NFR-11** No client-side secrets. All env values used at build time only.
- **NFR-12** Contact form submissions must be rate-limited at the serverless layer.

### 5.5 Internationalization
- **NFR-13** Content is English-first. Indonesian translation deferred to v4. Text must remain extractable (no hardcoded strings in deeply nested components — prefer the `src/content/*` pattern).

### 5.6 Browser & device support
- **NFR-14** Mobile-first layout. All breakpoints covered: 375px, 768px, 1024px, 1440px.
- **NFR-15** No hover-only interactions — every hover affordance must have a tap-equivalent.

---

## 6. Phased Roadmap

Implementation must proceed in these phases. Each phase ends with a deployable build.

### Phase 0 — Foundation (1–2 days)
- Add `docs/SRS.md`, `docs/CLAUDE.md`, `docs/DESIGN.md` to the repo.
- Set up `src/content/` directory with MDX support (`@mdx-js/rollup`).
- Add `react-router-dom` (currently single-page).
- Establish `pnpm` lockfile and CI workflow (lint + typecheck + build).

### Phase 1 — Content rewrite (2–3 days)
- Rewrite all experience cards in impact-first copy (FR-2.1).
- Rewrite featured-project cards with quantified outcomes.
- Add the 3 Tier-1 case-study MDX stubs with placeholder metrics flagged `TODO`.
- Update hero tagline + headline metrics (FR-1.1, FR-1.2).

### Phase 2 — Routing & case studies (2–3 days)
- Wire `react-router-dom` with `/`, `/case-study/:slug`, `/writing`, `/writing/:slug`.
- Build the `CaseStudy` layout component.
- Build the `WritingIndex` and `WritingPost` components.
- Author 2 launch posts.

### Phase 3 — ML playground (3–5 days)
- Export Fruit Ninja YOLOv8 model to ONNX.
- Try in-browser inference via `onnxruntime-web`. Fall back to HF Spaces iframe if too heavy.
- Add latency display, error handling, mobile fallback.

### Phase 4 — Polish (2–3 days)
- GitHub pinned repos build-time fetch (FR-7).
- SEO metadata, sitemap, JSON-LD (FR-9).
- Lighthouse audit pass — close every NFR-1 / NFR-2 gap.
- Reduced-motion + keyboard nav audit.

### Phase 5 — Launch & monitor
- Deploy to production.
- Add privacy-friendly analytics.
- Collect feedback for v3.1 backlog.

---

## 7. Acceptance criteria (definition of done)

v3 ships when **all** of the following are true:
- Lighthouse mobile scores meet NFR-1.
- Three Tier-1 case studies are live with quantified Results sections (no placeholders).
- The Fruit Ninja playground renders inference results OR a graceful fallback.
- WCAG AA contrast verified via `npx @google/design.md lint docs/DESIGN.md`.
- At least 2 writing posts are live.
- "Download CV" CTA is reachable in ≤ 1 click from any route.
- The repo builds clean from a fresh clone with no warnings.
