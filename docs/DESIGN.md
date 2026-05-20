---
version: alpha
name: Portfolio v3 — Pande Dani
description: Apple-grade glassmorphism for an ML / Computer Vision portfolio. Deep ink type, Bali-clay accent, liquid-glass surfaces.
colors:
  primary: "#0071E3"
  primary-dark: "#2997FF"
  ink: "#1D1D1F"
  ink-soft: "#86868B"
  surface: "#FFFFFF"
  surface-muted: "#F5F5F7"
  surface-dark: "#0A0A0A"
  surface-dark-muted: "#1D1D1F"
  border: "#D2D2D7"
  border-dark: "#424245"
  accent: "#B8422E"
  accent-soft: "#E8A89D"
  success: "#34C759"
  warn: "#FF9F0A"
  danger: "#FF3B30"
typography:
  display:
    fontFamily: "SF Pro Display, Inter, -apple-system, sans-serif"
    fontSize: "4.5rem"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  h1:
    fontFamily: "SF Pro Display, Inter, -apple-system, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  h2:
    fontFamily: "SF Pro Display, Inter, -apple-system, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  h3:
    fontFamily: "SF Pro Display, Inter, -apple-system, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  body-lg:
    fontFamily: "SF Pro Text, Inter, -apple-system, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "-0.01em"
  body-md:
    fontFamily: "SF Pro Text, Inter, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "-0.01em"
  body-sm:
    fontFamily: "SF Pro Text, Inter, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  eyebrow:
    fontFamily: "SF Pro Text, Inter, -apple-system, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.12em"
  mono:
    fontFamily: "JetBrains Mono, SF Mono, Menlo, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.55
spacing:
  "2xs": 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  "2xl": 48px
  "3xl": 64px
  "4xl": 96px
  section: 128px
rounded:
  xs: 6px
  sm: 10px
  md: 14px
  lg: 20px
  xl: 28px
  pill: 9999px
elevation:
  flat: "0 0 0 0 rgba(0,0,0,0)"
  glass-sm: "0 2px 6px rgba(0,0,0,0.08), 0 0 12px rgba(0,0,0,0.10)"
  glass-md: "0 8px 32px rgba(0,0,0,0.10), inset 1px 1px 1px -0.5px rgba(255,255,255,0.6)"
  glass-lg: "0 16px 48px rgba(0,0,0,0.18), inset 1px 1px 2px -0.5px rgba(255,255,255,0.7)"
  focus-ring: "0 0 0 3px rgba(0,113,227,0.45)"
components:
  surface-glass:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: 24px
  surface-glass-dark:
    backgroundColor: "{colors.surface-dark}"
    rounded: "{rounded.lg}"
    padding: 24px
  card-experience:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: 24px
  card-project:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: 28px
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.pill}"
    padding: 14px
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "#FFFFFF"
  button-secondary:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: 14px
  button-secondary-hover:
    backgroundColor: "{colors.border}"
    textColor: "{colors.ink}"
  chip-skill:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: 8px
  badge-eyebrow:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent}"
    rounded: "{rounded.sm}"
    padding: 6px
  metric-stat:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 20px
---

## Overview

Portfolio v3 is **architectural minimalism meets Apple craft, with a Bali signature**. The aesthetic borrows three things from Apple's design language:

1. **Quiet typography** — large display text, tight letter-spacing, deep ink color, generous whitespace.
2. **Liquid-glass surfaces** — frosted, refractive panels that feel layered without shouting.
3. **Disciplined motion** — every animation has a reason; nothing decorative survives a `prefers-reduced-motion: reduce` check.

The signature accent is `#B8422E` — a clay/terracotta that nods to Bali. It is reserved exclusively for category badges and rare "moment of attention" highlights. The workhorse interactive color is Apple's system blue (`#0071E3` light / `#2997FF` dark) because muscle memory matters.

The design must work in both light and dark modes from day one. Dark is treated as a peer mode, not a stylistic afterthought. Every component spec includes both surfaces.

The portfolio is read by recruiters in 60–90 seconds. The visual hierarchy must therefore deliver, in order: who → what → proof. No cleverness is allowed to delay that path.


## Colors

The palette is intentionally narrow. Three families do all the work:

**Ink family — text and structural lines.**
- `ink` (#1D1D1F): primary text in light mode. Use for headings and body copy.
- `ink-soft` (#86868B): muted text, captions, supporting copy. Same value in both modes.
- `surface` (#FFFFFF) and `surface-muted` (#F5F5F7): light-mode backgrounds.
- `surface-dark` (#0A0A0A) and `surface-dark-muted` (#1D1D1F): dark-mode backgrounds.
- `border` / `border-dark`: hairlines. 1px only. Never use for emphasis — that's what type weight is for.

**Interactive family — actions and links.**
- `primary` (#0071E3) in light mode, `primary-dark` (#2997FF) in dark mode. This is Apple system blue and it's the only color that says "click me." Reserve it. Don't use it for decoration.

**Accent family — Bali signature.**
- `accent` (#B8422E): clay/terracotta. Used exclusively for category eyebrows ("EDUCATION", "PROJECT") and the badge background of `badge-eyebrow`. Never as a primary action color.
- `accent-soft` (#E8A89D): a tinted background for the eyebrow badge so the clay reads on light surfaces without looking heavy.

**Status family — used only for state, never decoration.**
- `success` / `warn` / `danger` borrow from Apple's HIG. Reserved for form validation, build status, alerts.

### Pairing rules
- Body copy: `ink` on `surface` or `surface-muted` (light), `surface` on `surface-dark` (dark). Both pass WCAG AA.
- Primary action: `#FFFFFF` on `primary`. Hover swaps the background to `ink` for a satisfying density shift.
- Eyebrow badge: `accent` text on `accent-soft` background — passes AA for the small caps treatment.

### Do not
- Don't introduce gradients except as background ambience (the WebGL shader already covers that).
- Don't use the accent for body text or large headings. It's a spice, not a base.
- Don't add a fourth color family. If something needs more emphasis, use type scale and weight, not a new hue.


## Typography

Type does most of the heavy lifting. The scale is Apple-derived: large, confident displays, tight tracking, generous line-heights.

**Family.** SF Pro Display for headings, SF Pro Text for body, with `Inter` and the system fallback stack right behind. JetBrains Mono for code blocks and inline code in case studies.

**Scale (mobile → desktop).**
- `display` (4.5rem): hero name only. Used once per page. Never inside a card.
- `h1` (3rem): page titles on case studies and writing posts.
- `h2` (2.25rem): section headings on the home page (Work, Projects, Skills, Contact).
- `h3` (1.5rem): card titles inside experience/project cards.
- `body-lg` (1.125rem): the tagline under the hero, lead paragraphs in case studies.
- `body-md` (1rem): default body copy.
- `body-sm` (0.875rem): meta info, dates, captions.
- `eyebrow` (0.75rem, 600 weight, +0.12em tracking): the all-caps category labels above headings.
- `mono` (0.875rem): code, latency readouts, identifiers.

**Weight.**
- 700 for display, h1, h2.
- 600 for h3 and the eyebrow.
- 400 for body.

**Tracking.** Negative letter-spacing on every heading (`-0.03em` on display, `-0.02em` on h2). Positive tracking only on the eyebrow (`+0.12em`).

**Line-height.** Tight on headings (1.05–1.25), generous on body (1.5–1.6).

### Rules
- Heading hierarchy is enforced by component, not by author. Don't restyle a `<p>` to look like an `<h2>`.
- Never center-align body copy. Center is reserved for hero name and section titles.
- Never use italic for emphasis on headings. Use weight or size.
- Never set body text smaller than 14px on mobile.


## Layout

The portfolio is structured as a **single primary route** with a small set of secondary routes. The home route is a vertical scroll narrative; secondary routes are full-bleed reading layouts.

### Grid
- 12-column max-width grid, 1200px content width on desktop.
- 24px gutter on mobile, 32px on tablet, 48px on desktop.
- Section padding (top + bottom) is `spacing.section` (128px) on desktop, `spacing.3xl` (64px) on mobile.

### Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

Mobile-first: write the smallest viewport first, layer up. No `max-width` queries.

### Section rhythm
Home page sections, top-to-bottom:
1. Hero — full viewport height, centered name, tagline, three metrics, two CTAs.
2. About — short personal paragraph + portrait, two-column on desktop, stacked on mobile.
3. Experience — timeline of cards, alternating left/right on desktop, stacked on mobile.
4. Featured Projects — three Tier-1 cards with cover images, links to case studies.
5. Playground — embedded live ML demo with latency readout.
6. Skills — clustered chip grid (Languages / ML / Data / Frontend / Tools).
7. Writing — three latest posts, links to /writing.
8. Open Source — four pinned GitHub repos.
9. Contact — email + socials + Download CV CTA.

### Container patterns
- Cards never bleed to the edge on desktop. Mobile gets a 16px outer margin.
- Section headings sit left-aligned with their content, not center-aligned. The only centered headings are the hero name.
- Vertical rhythm between elements inside a card uses `spacing.md` (16px). Between cards: `spacing.lg` (24px).

### Do not
- Don't stack more than three columns of cards on desktop. Two is usually enough.
- Don't use carousels for primary content. Carousels hide things; the scroll does the same job better.
- Don't introduce a sticky sidebar. The nav is sticky enough.


## Elevation & Depth

Depth in this design is communicated through **glass refraction and shadow softness**, not through hard drop shadows. The system uses four elevation levels.

### Levels
- **flat** — section backgrounds, dividers. No shadow. Just a hairline border if needed.
- **glass-sm** — chips, small badges, mobile cards. Soft 12px blur, no inset light.
- **glass-md** — primary cards (experience, project, skill clusters). The default. Includes inset light from top-left to fake a refractive edge.
- **glass-lg** — modals, the playground panel, hero card. Heaviest blur and the deepest outer shadow.
- **focus-ring** — 3px Apple blue ring at 45% opacity. Used on every focusable element. Never replaced with a custom focus style.

### Glass blur rules
- Light mode: `backdrop-filter: blur(16px)` with a `rgba(255,255,255,0.7)` background.
- Dark mode: `backdrop-filter: blur(20px)` with a `rgba(0,0,0,0.4)` background.
- **Mobile (≤ 768px):** disable `backdrop-filter` entirely. Replace with an opaque background (`rgba(255,255,255,0.95)` light, `rgba(15,15,15,0.95)` dark). This is already in `index.css` and must be preserved.

### Shadow rules
- Outer shadow always uses warm-neutral black at low opacity. No colored shadows.
- Inset light (top-left highlight, bottom-right shade) is required on glass-md and glass-lg to fake the refractive edge. Without it, the panels look like flat translucent rectangles.

### Do not
- Don't stack more than two elevation levels in the same area. A glass-lg modal over a glass-md card is fine; three layers of glass becomes soup.
- Don't apply backdrop-blur over a video or animated background — it tanks performance and looks muddy.


## Shapes

Corner radius defines the brand more than people realize. The system uses six radii.

- `rounded.xs` (6px): tags, code spans, tiny utility chips.
- `rounded.sm` (10px): inline buttons, eyebrow badges, form inputs.
- `rounded.md` (14px): metric stat cards, hero metric tiles.
- `rounded.lg` (20px): primary content cards (experience, project).
- `rounded.xl` (28px): the hero glass card and the playground panel.
- `rounded.pill` (9999px): primary and secondary CTA buttons, skill chips, navigation pill.

### Rules
- Buttons are pills. Period. The existing `liquid-glass-button` is the canonical implementation.
- Cards step up the radius scale as they get larger and more visually important.
- Images inside cards inherit the card's radius minus 4px (so a `rounded.lg` card has `rounded.md` images inside it). This creates a subtle nested feel.

### Do not
- Don't mix sharp (0–4px) and pill radii in the same component. Choose one rhythm and stick with it.
- Don't use square corners anywhere. The brand is soft.


## Components

Component definitions in the front matter give the binding values; this section explains *why* and *when* to use each.

### Buttons
- **`button-primary`** — single, decisive action per view. "Download CV", "View case study", "Send message". Apple blue background, white text, pill shape, hover swaps to ink-black for a satisfying density change.
- **`button-secondary`** — reserved for the runner-up action next to a primary. Muted surface, ink text, same pill shape. Never use two primaries in the same group.

A button without a clear job becomes a link. Default to underlined text links inside paragraphs.

### Cards
- **`card-experience`** — timeline entries on the home page. 24px padding, `rounded.lg`, soft glass-md elevation. Eyebrow on top, h3 title, org + period on one muted line, two-sentence body, tag chips at the bottom.
- **`card-project`** — featured project tiles. 28px padding, `rounded.xl`, glass-md elevation, includes a 16:9 cover image at the top.

### Chips
- **`chip-skill`** — pill, soft background, ink text, no border. Used in the skills cluster. Hover lifts elevation to glass-md.
- **`badge-eyebrow`** — the only place the Bali clay color appears as a background. Small, all-caps, +0.12em tracking. Never larger than 12px.

### Stats
- **`metric-stat`** — the three hero numbers and the inline metrics inside case studies. Big numeral, small label below in muted text. The numeral uses the `display` type token.

### Surfaces
- **`surface-glass`** / **`surface-glass-dark`** — generic panel container. Used by the playground, modals, and dropdown menus.

### State variants
Variants are *separate component entries* with related names, not nested. The current set:
- `button-primary` / `button-primary-hover`
- `button-secondary` / `button-secondary-hover`

Add more variants when needed (`-active`, `-disabled`) using the same naming pattern. Don't nest variants under the base component.


## Do's and Don'ts

### Do
- **Do** keep the hero quiet. One name, one tagline, three numbers, two CTAs. That's it.
- **Do** lead every card with the outcome, then the context. Recruiters skim; they need the verb first.
- **Do** use the eyebrow badge for category. It's the cheapest way to add structure without clutter.
- **Do** test every interactive element with the keyboard. Tab, Enter, Space, Esc.
- **Do** disable decorative motion when `prefers-reduced-motion: reduce`. Render the static end-state.
- **Do** ship dark mode parity from the first commit. Don't bolt it on later.
- **Do** use system blue for the one thing on a page you most want clicked.
- **Do** keep the Bali clay accent rare. It's special because it's rare.

### Don't
- **Don't** use color to indicate hierarchy. Use type weight and size.
- **Don't** layer three glass surfaces. Two max.
- **Don't** add animations to text. Move surfaces, not letters.
- **Don't** justify body copy. Left-align in LTR.
- **Don't** use icon fonts. Use SVG with `aria-label` or `aria-hidden`.
- **Don't** introduce a new font family. Two families is the cap (display sans + mono).
- **Don't** use `box-shadow` to indicate state. Use `outline` for focus, opacity for disabled.
- **Don't** rely on hover for primary affordances. Mobile has no hover.
- **Don't** use lorem ipsum in production. Real copy or no card.
- **Don't** add a fourth CTA. If a section needs four CTAs, the section needs to be re-designed.

### Validation
This file should pass `npx -y @google/design.md lint docs/DESIGN.md` with zero errors and only documented WCAG warnings (if any). Run the linter before merging any change to this file.
