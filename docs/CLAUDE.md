# CLAUDE.md — Implementation Guidance for AI Coding Agents

**Project:** Blog Editorial Layout for Portfolio v3 (`daniwismagatha.my.id`)
**Audience:** Claude Code, Codex, OpenCode, Kiro, or any coding agent executing this work
**Companion docs:** `docs/SRS.md` (the *what*), `docs/DESIGN.md` (the *look*)

---

## 0. Read these first (in this order)

Before touching any code, the agent MUST:

1. Read `docs/SRS.md` end-to-end. Every implementation decision must trace back to a numbered FR or NFR.
2. Read `docs/DESIGN.md`. All design tokens (colors, typography, spacing) come from here. Never hardcode hex values.
3. Read `package.json`. Confirm the existing stack: React 19, Vite, Tailwind v4, Framer Motion, Three.js.
4. Read the current `vite.config.ts`, `tailwind.config.ts`, and `src/main.tsx` (or equivalent entry).
5. Read the existing CSS layer to understand which utilities and base styles are already defined.

If any of these files are missing or contradict the SRS, **stop and ask the user** before proceeding.

---

## 1. Tech stack (locked)

| Layer | Choice | Why |
|---|---|---|
| Build | Vite ≥5 | Already in use |
| Framework | React 19 | Already in use |
| Styling | Tailwind CSS v4 + custom CSS layer | Already in use; editorial typography needs custom CSS variables |
| MDX | `@mdx-js/rollup` ≥3 | Native Vite integration, no extra runtime |
| Frontmatter | `gray-matter` ≥4 | De facto standard |
| GFM | `remark-gfm` ≥4 | Tables, strikethrough, task lists |
| Routing | Existing portfolio router | Do not introduce a new router |
| SSG | `vite-ssg` OR existing SSG plugin | Build-time rendering required by FR-1.5 and FR-2.7 |
| Fonts | Source Serif 4 (body) + system sans (chrome) | Charter is licensed; Source Serif 4 is the closest free equivalent |

### Forbidden additions

The agent SHALL NOT add any of the following without explicit user approval:

- **Next.js, Remix, Astro, Gatsby** — keep Vite.
- **A second CSS framework** (Bootstrap, Bulma, Chakra, MUI). Tailwind v4 only.
- **A CMS or headless CMS** (Sanity, Contentful, Strapi). MDX files in repo.
- **A heavy MDX runtime** (`next-mdx-remote`). Compile at build time only.
- **A new state library** (Redux, Zustand, Jotai). Blog is read-only static content.
- **Comments / discussions** (Disqus, utterances, Giscus). Out of scope.
- **A web font hosting service** that costs money. Google Fonts only.
- **A second routing library**. Use whatever the portfolio already uses.
- **Custom drop-cap libraries** (`react-dropcap`, etc.). Use `::first-letter` CSS only.
- **A separate package for syntax highlighting** unless the existing posts contain code blocks (they don't).

---

## 2. Repository layout (target after Phase 0)

```
.
├── docs/
│   ├── SRS.md            # source of truth for what
│   ├── CLAUDE.md         # this file — source of truth for how
│   └── DESIGN.md         # source of truth for visual tokens
├── src/
│   ├── blog/
│   │   ├── components/
│   │   │   ├── BlogPost.tsx
│   │   │   ├── Masthead.tsx
│   │   │   ├── Eyebrow.tsx
│   │   │   ├── Byline.tsx
│   │   │   ├── Lede.tsx
│   │   │   ├── EditorialBlockquote.tsx
│   │   │   ├── EditorialTable.tsx
│   │   │   └── Footnote.tsx
│   │   ├── lib/
│   │   │   ├── getAllPosts.ts
│   │   │   └── getPostBySlug.ts
│   │   ├── styles/
│   │   │   └── editorial.css
│   │   └── mdx-components.ts
│   ├── content/
│   │   └── blog/
│   │       ├── 2026-05-20-rupiah-menuju-merdeka.mdx
│   │       └── 2026-05-20-kasus-nadiem-dua-cermin.mdx
│   ├── routes/
│   │   ├── blog/
│   │   │   ├── index.tsx       # /blog listing
│   │   │   └── [slug].tsx      # /blog/:slug post page
│   ├── main.tsx
│   └── App.tsx
├── tailwind.config.ts
├── tailwind.theme.json         # generated from DESIGN.md
├── vite.config.ts
└── package.json
```

Adapt paths to the existing portfolio's conventions if they differ — but **do not** scatter blog code outside `src/blog/`.


---

## 3. Coding rules

### TypeScript

- All new files SHALL be TypeScript (`.ts` / `.tsx`).
- Strict mode SHALL be enabled (already on in v3).
- No `any` without an inline `// eslint-disable-next-line` and a justification comment.
- All exports SHALL be named (no default exports for components).
- Public functions SHALL have explicit return types.

### React

- Functional components only. No class components.
- Use Server Components if the existing v3 setup supports them; otherwise plain function components.
- Props interfaces SHALL live in the same file as the component, named `XxxProps`.
- No prop drilling beyond two levels — lift to a context if needed.
- No `useEffect` for derived state — use `useMemo` or compute inline.

### Styling

- Editorial typography SHALL live in `src/blog/styles/editorial.css`. Imported once from the blog layout.
- Tailwind utilities are allowed for layout (flex, grid, padding, margin), but typography (font, leading, tracking) SHALL come from the editorial CSS class system or DESIGN.md tokens.
- No `style={{...}}` inline except for token references that Tailwind cannot express (e.g. `borderColor: 'var(--rule)'`).
- No CSS-in-JS libraries (`styled-components`, `emotion`). Plain CSS + Tailwind only.
- All CSS variables SHALL be defined in `:root` inside `editorial.css` and match DESIGN.md token names exactly.

### Animation

- Framer Motion only. No GSAP.
- Entrance animations SHALL respect `prefers-reduced-motion: reduce` and disable when set.
- No animation longer than 250ms for blog content.
- No layout animations on text — only on interactive elements (cards, links).

### Content (MDX)

- Frontmatter required fields: `title`, `slug`, `date` (ISO 8601), `description`, `tags`, `author`, `edition`, `readTime`.
- Optional: `lang` (defaults to `id`), `coverImage`.
- The first paragraph after the title in the body SHOULD be wrapped in `<Lede>` for drop-cap rendering.
- References / footnote SHOULD be wrapped in `<Footnote>` at the end of the post.
- Blockquotes SHALL use standard Markdown syntax (`>`); the MDX provider replaces the renderer.

### Imagery

- Hero / cover images are optional in v1. If present, they go above the masthead.
- Images SHALL use `<img loading="lazy">` with explicit width and height attributes.
- Decorative images SHALL have `alt=""`.

---

## 4. Workflow per task — the 7-step loop

For every task the agent picks up, follow this loop:

1. **Locate FR** — Find the FR / NFR in `SRS.md` that this task implements. Cite it in the commit message.
2. **Read code** — Read the existing files this task touches before writing anything. Do not assume structure.
3. **Plan** — Sketch the change in 3–5 bullets in your scratch/plan area. Confirm against SRS.
4. **Implement** — Make the change. Stick to the locked stack.
5. **Verify** — Run `pnpm build` (or `npm run build`). Run `pnpm lint`. Open the dev server and visually confirm.
6. **Review** — Self-review the diff. Look for: hardcoded hex values, magic numbers, unused imports, broken types.
7. **Report** — Commit with `feat(blog): <short> (FR-x.y)` or `fix(blog): <short>`. Open PR. Describe what changed and which FR/NFR it satisfies.

If a step fails, STOP and report. Do not paper over a build failure with a workaround.

---

## 5. Phase-by-phase agent instructions

These are concrete commands and file references the agent should not have to invent.

### Phase 0 — Foundation

```bash
# Install MDX deps
pnpm add @mdx-js/rollup gray-matter remark-gfm

# Generate Tailwind theme from DESIGN.md
npx -y @google/design.md export --format tailwind docs/DESIGN.md > tailwind.theme.json

# Validate DESIGN.md
npx -y @google/design.md lint docs/DESIGN.md
```

Edit `vite.config.ts` to add the MDX plugin in the `plugins` array (before React plugin):

```ts
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [remarkGfm],
      providerImportSource: "@/blog/mdx-components",
    }),
    // ... existing plugins
  ],
});
```

Edit `tailwind.config.ts` to merge the generated theme:

```ts
import generated from "./tailwind.theme.json";

export default {
  // ...
  theme: {
    extend: {
      colors: generated.colors,
      fontFamily: generated.fontFamily,
      // do NOT spread `...generated` blindly — it can clobber existing tokens
    },
  },
};
```

Add web fonts in `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,700;1,8..60,400&display=swap" rel="stylesheet" />
```

### Phase 1 — Editorial layout components

Create `src/blog/styles/editorial.css` with all the CSS variables and base styles documented in DESIGN.md. The drop-cap, blockquote, masthead, eyebrow, byline, footnote styles all live here.

Build components in this order (each is small, ≤ 60 lines):

1. `Masthead.tsx` — top header with brand + edition
2. `Eyebrow.tsx` — uppercase tag label
3. `Byline.tsx` — author / date / reading time row
4. `Lede.tsx` — `<p className="lede">{children}</p>`
5. `EditorialBlockquote.tsx`
6. `EditorialTable.tsx`
7. `Footnote.tsx` — italic small text with top border
8. `BlogPost.tsx` — composes all of the above

### Phase 2 — MDX content pipeline

Create `src/blog/mdx-components.ts`:

```ts
import type { MDXComponents } from "mdx/types";
import { Lede } from "./components/Lede";
import { EditorialBlockquote } from "./components/EditorialBlockquote";
import { EditorialTable } from "./components/EditorialTable";
import { Footnote } from "./components/Footnote";

export function useMDXComponents(): MDXComponents {
  return {
    Lede,
    Footnote,
    blockquote: EditorialBlockquote,
    table: EditorialTable,
  };
}
```

Create `src/blog/lib/getAllPosts.ts` using `import.meta.glob` to eagerly import all MDX files at build time, parsing frontmatter via `gray-matter`.

Create `src/blog/lib/getPostBySlug.ts` returning a single post by slug.

Copy the existing MDX sources (`01-rupiah/source.mdx`, `02-nadiem/source.mdx` from blog-posts.zip) into `src/content/blog/`, renaming to `<date>-<slug>.mdx`.

### Phase 3 — Public routes

Add the listing route at `/blog` and the post route at `/blog/[slug]`.

For SSG, add to `vite.config.ts`:

```ts
import { defineConfig } from "vite";
// ... if using vite-ssg or similar
```

Hook the SSG plugin to enumerate post slugs from `getAllPosts()` so each post pre-renders.

Inject OpenGraph / Twitter Card / JSON-LD via a `<Head>` helper component. If the portfolio v3 already has a `<Head>` or `<Helmet>` wrapper, use it.

### Phase 4 — Polish

Run Lighthouse:

```bash
pnpm build
pnpm preview
# in another terminal
npx -y lighthouse http://localhost:4173/blog/kasus-nadiem-dua-cermin --view --preset=desktop
```

Run axe:

```bash
pnpm add -D @axe-core/cli
npx axe http://localhost:4173/blog
```

Test print preview manually. Open Chrome → Ctrl+P. Compare against existing PDF reference visually.

---

## 6. Conventions

### Commits

Format: `<type>(<scope>): <subject> (<FR-ref>)`

Types: `feat`, `fix`, `style`, `refactor`, `docs`, `test`, `chore`.
Scope: `blog`, `mdx`, `tokens`, `seo`, `print`, `a11y`.

Examples:
- `feat(blog): add Masthead and Eyebrow components (FR-2.1)`
- `feat(mdx): wire @mdx-js/rollup with custom components (FR-3.1, FR-3.3)`
- `style(tokens): export DESIGN.md to tailwind.theme.json (FR-5.5)`
- `fix(print): preserve drop cap and accent border in print stylesheet (FR-7.3)`

### PR titles

Concise, ≤70 characters. Mirror the commit format minus the FR-ref.

### Branching

- `main` — always deployable.
- `feat/blog-phase-{N}` — one branch per phase.
- Open PRs early as drafts. Land each phase as a single PR.

### Comments

- Comment only the *why*, never the *what*. Code shows what; comments explain why.
- TODOs SHALL use the format `// TODO(blog): <description>` with optional issue number.
- No commented-out code. Delete it; git remembers.

---

## 7. What NOT to do (the most-read section)

These are the failure modes most likely to cause this work to go off the rails. The agent SHALL NOT:

1. **Hardcode hex colors anywhere outside `editorial.css` and DESIGN.md.** Every accent reference must use `var(--accent)` or a Tailwind token from `tailwind.theme.json`. If you find yourself typing `#B8422E` anywhere else, stop.

2. **Add a CMS or admin UI.** The user explicitly does not want this. MDX files in repo are the source of truth.

3. **Switch the framework.** No Next.js. No Astro. The portfolio is Vite + React 19 and stays that way.

4. **Replace existing routing.** Use whatever the portfolio already uses. Do not introduce React Router if the portfolio uses something else.

5. **Add `@tailwindcss/typography` (the Prose plugin).** It will fight with the editorial CSS. The custom `editorial.css` does the typography work.

6. **Use a third-party drop cap library.** CSS `::first-letter` is sufficient and is required for accessibility (FR-9.5).

7. **Ship a client-side MDX runtime.** All MDX SHALL be compiled at build time. No `next-mdx-remote` style runtime.

8. **Leave hardcoded post slugs in the listing page.** The listing SHALL be derived from `getAllPosts()`. Adding a third post must require zero code changes (NFR-3.4).

9. **Skip frontmatter validation.** A missing required field in frontmatter SHALL fail the build loudly. Do not silently default.

10. **Use `dangerouslySetInnerHTML` to render Markdown.** MDX is the renderer. Period.

11. **Override the existing site theme provider for non-blog routes.** The editorial palette lives only inside `/blog/*` routes. Other routes are unaffected.

12. **Inline large blocks of CSS in JSX.** Move them to `editorial.css`. JSX `style={...}` is allowed only for token references.

13. **Delete or modify the existing `01-rupiah/` and `02-nadiem/` PDFs in the user's archive.** Those are the visual reference truth.

14. **Add comments / discussions / reactions.** Out of scope.

15. **Generate a placeholder hero image.** If no cover image exists, render the post without one. Do not fabricate visuals.

16. **Push to `main` directly.** Always branch + PR.

17. **Run `git push --force` on a shared branch.** Local rebases on `feat/*` branches are fine; force-push only on your own untracked branch.

18. **Write a 500-line file in one operation.** Use chunked writes (≤300 lines per call) for any new file >300 lines. This is a hard constraint of the agent runtime.

19. **Skip the DESIGN.md linter.** Always run `npx -y @google/design.md lint docs/DESIGN.md` after editing tokens. Zero errors required.

20. **Rebuild `getAllPosts()` per request at runtime.** It is a build-time function. Use `import.meta.glob` with `eager: true` so it runs once at build.

---

## 8. When stuck

Escalation order:

1. Re-read `docs/SRS.md`. The answer to most "what should I do" questions lives in a numbered FR.
2. Re-read `docs/DESIGN.md`. The answer to most "what color / size" questions lives in a token.
3. Re-read this `CLAUDE.md` Section 7 ("What NOT to do"). The answer to "should I add X" questions usually lives there.
4. Compare the rendering against the reference PDFs in the user's `blog-posts.zip` (`01-rupiah/Rupiah-Menuju-Merdeka-17845.pdf`, `02-nadiem/Kasus-Nadiem-Dua-Cermin.pdf`). The PDF is the visual truth.
5. Ask the user. Phrase the question as: "I'm seeing X in the code, the SRS says Y, the DESIGN.md says Z. Which is the source of truth?"

Do NOT make a creative decision and ship it. The whole point of this triad is to remove guesswork.

---

## 9. Language preferences

- The maintainer (Pande Gede Dani Wismagatha / Dito) prefers replies in Bahasa Indonesia (kasual, kamu/aku) for chat.
- Code comments, commit messages, PR titles, and these spec docs SHALL be in English.
- Post content (`.mdx` body) SHALL be in Bahasa Indonesia for the existing two posts. Future posts may be in English depending on `lang` frontmatter.

---

*End of CLAUDE.md*
