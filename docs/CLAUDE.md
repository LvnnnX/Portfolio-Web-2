# CLAUDE.md — Implementation Guidance for AI Coding Agents

This file is the operating manual for any AI agent (Claude Code, Codex, Copilot, Kiro) working on the **Portfolio Web v3** rework. Read it top-to-bottom before touching code. It pairs with `SRS.md` (the *what*) and `DESIGN.md` (the *look*). This file is the *how*.

---

## 0. Read these first

1. `docs/SRS.md` — every functional requirement (FR-x.y) and non-functional requirement (NFR-x). Do not implement anything not traceable to an FR/NFR.
2. `docs/DESIGN.md` — every visual token (color, type, spacing). Do not introduce new tokens; reference existing ones.
3. `package.json` — confirm the actual installed version of every dependency before importing.
4. `src/index.css` — existing CSS variables and glass utility classes. Reuse, do not duplicate.

If any of these documents conflict with each other, **stop and ask**. Do not silently choose one.

---

## 1. Tech stack (locked for v3)

| Layer | Choice | Notes |
|---|---|---|
| Framework | React 19 + Vite | Already installed, do not migrate. |
| Language | TypeScript (strict) | `tsconfig.json` is strict; do not loosen. |
| Styling | Tailwind v4 + custom CSS variables | Tokens come from `DESIGN.md`. |
| Animation | Framer Motion | Existing patterns in `Hero`, `Experience`. |
| 3D / shaders | Three.js | Used by `web-gl-shader.tsx`. Don't add a second 3D engine. |
| Routing | `react-router-dom` v6+ | Add in Phase 0. |
| Content | MDX via `@mdx-js/rollup` | Add in Phase 0. |
| Inference | `onnxruntime-web` | Lazy-loaded only on `/playground`. |
| Package manager | `npm` | `package-lock.json` is the lockfile. Migration to pnpm is deferred. |
| Node | ≥ 20 LTS | Match Vite 8 requirements. |

**Forbidden additions without explicit user approval:**
- A second CSS framework (no Bootstrap, MUI, Chakra).
- A different routing library.
- A backend / API layer in this repo. This is a static site.
- Any analytics that drops third-party cookies.
- Any dependency > 100 KB gzipped on the critical path.

---

## 2. Repository layout (target after Phase 0)

```
docs/
  SRS.md
  CLAUDE.md
  DESIGN.md
public/
  images/...           # existing media
  logos/               # NEW — skill / tool logos as SVG
  Pande-CV.pdf         # NEW — single canonical CV file
  og-default.png       # NEW — default Open Graph image
src/
  components/
    layout/            # NEW — Navigation, Footer, RootLayout
    sections/          # NEW — section-level components (Hero, Experience, Projects, ...)
    ui/                # primitives (existing — liquid-glass-button, etc.)
  content/             # NEW — all authored content
    case-studies/
      fruit-ninja-yolov8.mdx
      smandapura-exam-app.mdx
      mews-bbmkg-automation.mdx
    posts/
      *.mdx
    experience.json
    projects.json
    skills.json
    github.json        # build-time generated
  hooks/               # NEW — useTheme, useReducedMotion, ...
  lib/                 # existing utils + new helpers (mdx, github, seo)
  pages/               # NEW — route entry components
    HomePage.tsx
    CaseStudyPage.tsx
    WritingIndexPage.tsx
    WritingPostPage.tsx
    PlaygroundPage.tsx
  routes.tsx           # NEW — react-router config
  main.tsx
  App.tsx
  index.css
scripts/
  fetch-github.ts      # NEW — build-time GitHub fetch
  generate-sitemap.ts  # NEW — sitemap from routes
```

Existing files stay in place; new ones slot in alongside.

---

## 3. Coding rules

### 3.1 TypeScript
- `tsconfig.app.json` is strict. Do not relax `strict`, `noImplicitAny`, or `strictNullChecks`.
- No `any`. If you genuinely need it, use `unknown` and narrow.
- Every component prop interface is explicitly typed and exported when reused.
- Prefer `type` for unions / primitives, `interface` for object shapes that may be extended.

### 3.2 React
- Functional components only. No class components.
- Hooks live in `src/hooks/` and are prefixed `use`.
- No prop drilling deeper than 2 levels — lift to context (`ThemeContext`) or co-locate state.
- Memoize only when profiling shows a real cost. Premature `useMemo` is noise.
- Keys on lists must be stable IDs from the data source, never the array index.

### 3.3 Styling
- **Token-only.** Every color, radius, spacing value comes from a Tailwind class backed by a CSS variable defined in `DESIGN.md` / `index.css`. No hex literals in `.tsx` files.
- Use the existing `liquid-glass` and `glass-panel` utility classes for cards. Do not duplicate them.
- New utility classes go into `src/index.css` under a clearly labeled section, not in component files.
- Mobile-first: write the smallest viewport styles first, then layer up with `md:`, `lg:`.

### 3.4 Animation
- Default to Framer Motion. Use `motion.div` with `initial` / `whileInView` / `viewport={{ once: true }}` for scroll reveals.
- Wrap any decorative motion in a `useReducedMotion()` check (FR-10.4). When reduced, render the static end-state, not nothing.
- Cap concurrent heavy animations: only one WebGL canvas, one falling-pattern instance.

### 3.5 Content
- All content (experience, projects, posts, case studies) lives in `src/content/`.
- JSON for tabular data, MDX for prose.
- Components import content; never hardcode user-facing strings inside component bodies. The only exception is single-word UI labels (e.g. button text "Download").
- When in doubt: if a non-developer (Dani) would reasonably want to edit it without touching `.tsx`, it goes in `src/content/`.

### 3.6 Imagery
- Source images go in `public/images/`.
- For above-the-fold images, generate AVIF + WebP variants at build time and use `<picture>` (NFR-4).
- All `<img>` tags require `alt`, `width`, and `height`. Decorative images use `alt=""` and `aria-hidden="true"`.

---

## 4. Workflow per task

When given any task, follow this loop:

1. **Locate the FR/NFR** that justifies the task. If none exists, stop and ask the user before adding scope.
2. **Read the relevant existing code** (don't guess at conventions — match the file you're editing).
3. **Plan in ≤ 5 bullet points** if the change touches 3+ files. Share the plan, get a nod, then proceed.
4. **Implement** in the smallest reasonable diff.
5. **Verify**: `npm run lint && npx tsc -b && npm run build`. Build must succeed.
6. **Self-review** against the FR you cited. Confirm acceptance criteria are met.
7. **Report** what changed, what was verified, what is unverified.

Never push directly to `main`. Always work on a branch named `feat/<short-slug>` or `fix/<short-slug>` and open a PR.

---

## 5. Phase-by-phase agent instructions

The full roadmap lives in `SRS.md §6`. Below is the agent-facing checklist per phase.

### Phase 0 — Foundation
- Keep `package-lock.json`; do **not** migrate to pnpm yet (deferred).
- `npm install react-router-dom @mdx-js/rollup @mdx-js/react remark-gfm rehype-slug rehype-autolink-headings reading-time gray-matter`.
- Configure `vite.config.ts` to register the MDX plugin **before** the React plugin.
- Create the directory tree from §2.
- Move `Demo`-level orchestration into `src/pages/HomePage.tsx`. `App.tsx` becomes the router root + global background layer.
- Add a CI workflow `.github/workflows/ci.yml` that runs `npm ci && npm run lint && npx tsc -b && npm run build` on every PR.

### Phase 1 — Content rewrite
- Create `src/content/experience.json` schema:
  ```ts
  type ExperienceEntry = {
    id: string;
    category: "EDUCATION" | "LEADERSHIP" | "INTERNSHIP" | "CERTIFICATION" | "PROJECT";
    title: string;
    org: string;
    period: string;
    impact: string;       // 1 outcome sentence, bold
    context: string;      // 1 context sentence, muted
    tags: string[];
    priority: number;     // lower = higher in the list
    caseStudySlug?: string; // links to /case-study/:slug for Tier-1
  };
  ```
- Migrate every entry from the current `Experience.tsx` into this JSON, rewritten impact-first per FR-2.1.
- Same pattern for `projects.json` and `skills.json`.
- Update `Hero` copy per FR-1.1 / FR-1.2. Numbers: pull from the latest resume; if a number is unverifiable, leave a `TODO(content)` comment and surface it in the PR description.

### Phase 2 — Routing & case studies
- Wire routes:
  - `/` → `HomePage`
  - `/case-study/:slug` → `CaseStudyPage`
  - `/writing` → `WritingIndexPage`
  - `/writing/:slug` → `WritingPostPage`
  - `/playground` → `PlaygroundPage` (also embedded as a section on `/`)
  - `*` → `NotFoundPage`
- Build a `CaseStudyLayout` component that takes MDX frontmatter (`title`, `summary`, `metrics`, `cover`, `repo`, `live`) and enforces the canonical section order: Problem → Data → Approach → Results → Lessons → Links.
- Use `import.meta.glob('/src/content/case-studies/*.mdx', { eager: true })` to discover entries.
- Author 2 launch posts (one paper review, one Fruit Ninja tutorial). Posts use the same MDX pattern with frontmatter (`title`, `date`, `tags`, `excerpt`).

### Phase 3 — ML playground
- Export the Fruit Ninja YOLOv8 model to ONNX with dynamic axes off and INT8 quantization where it doesn't tank accuracy.
- If the resulting `.onnx` is ≤ 25 MB, host it in `public/models/fruit-ninja.onnx` and load via `onnxruntime-web` with the WebGPU execution provider, falling back to WASM.
- If > 25 MB, deploy a Hugging Face Space, then embed via iframe with `loading="lazy"` and `sandbox="allow-scripts allow-same-origin"`.
- Show inference latency in milliseconds with one decimal.
- All inference code is dynamically imported — `import('onnxruntime-web')` inside an effect, never at the top of any module that lands on the home route.

### Phase 4 — Polish
- Build-time GitHub fetch: `scripts/fetch-github.ts` reads `LvnnnX/Portfolio-Web-2`'s owner pinned repos, writes `src/content/github.json`. Run as a `prebuild` hook.
- SEO: implement a `<SEO>` component that uses `react-helmet-async` (or `<DocumentHead>` pattern of choice) per route.
- Add `scripts/generate-sitemap.ts` that walks the route table and emits `dist/sitemap.xml` post-build.
- Run `npx @lhci/cli autorun` against the local preview; fix anything below the NFR-1 thresholds before declaring done.

### Phase 5 — Launch
- Configure the chosen analytics provider (Plausible, Umami, or GoatCounter). Add the script tag with `defer` and only in production.
- Verify SSL, redirects (apex → www, http → https), and that the previous `daniwismagatha.my.id` URLs still resolve to equivalent v3 routes.

---

## 6. Conventions & house rules

- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `perf:`, `test:`).
- **PR titles:** prefix with the phase, e.g. `[P2] feat: case-study layout`.
- **PR description:** must list which FR/NFR the change closes, what was verified, what is unverified.
- **Branching:** off `main`. PRs are squash-merged. Delete branches after merge.
- **Comments:** explain *why*, not *what*. The code says what.
- **TODO format:** `TODO(scope): action`. Example: `TODO(content): confirm exact FPS number`.

---

## 7. What NOT to do

- Do not refactor "while you're in there." If a refactor is needed, file an issue and link it; don't bundle it into an unrelated PR.
- Do not delete the falling-pattern or WebGL shader. They are part of the brand. Optimize them, don't replace them.
- Do not add server-side anything. This is a static site.
- Do not commit secrets. The CI runs in PR forks; assume any committed value is public.
- Do not touch git config. Do not force-push. Do not amend pushed commits.
- Do not add a CMS. The MDX-in-repo pattern is the CMS.

---

## 8. When stuck

If a task is ambiguous, blocked, or in conflict with another doc:
1. Re-read the relevant FR in `SRS.md`.
2. Re-read the relevant token in `DESIGN.md`.
3. If still ambiguous, write down the smallest possible question and ask the user. Do not invent.

The maintainer (Dani) prefers Bahasa Indonesia for conversational replies and English for code, comments, and documentation.
