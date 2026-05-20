---
version: alpha
name: Heritage Editorial
description: Architectural minimalism meets journalistic gravitas — a serif-driven editorial system for the daniwismagatha.my.id blog.
colors:
  primary: "#1D1D1F"
  secondary: "#4A4A4F"
  tertiary: "#B8422E"
  neutral: "#FAFAFA"
  surface: "#FFFFFF"
  faint: "#86868B"
  rule: "#D2D2D7"
  border: "#E5E5E7"
  accent-soft: "#F4D9D2"
typography:
  display:
    fontFamily: Source Serif 4
    fontSize: 37px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: Source Serif 4
    fontSize: 21px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  deck:
    fontFamily: Source Serif 4
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "-0.005em"
    fontStyle: italic
  body-md:
    fontFamily: Source Serif 4
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "-0.005em"
  body-sm:
    fontFamily: Source Serif 4
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "-0.005em"
  blockquote:
    fontFamily: Source Serif 4
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.5
    fontStyle: italic
  eyebrow:
    fontFamily: SF Pro Text
    fontSize: 11px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.20em"
  byline:
    fontFamily: SF Pro Text
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.05em"
  masthead-brand:
    fontFamily: SF Pro Text
    fontSize: 11px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.22em"
  masthead-meta:
    fontFamily: SF Pro Text
    fontSize: 10px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.10em"
  footnote:
    fontFamily: SF Pro Text
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.55
    fontStyle: italic
  table-header:
    fontFamily: SF Pro Text
    fontSize: 11px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.05em"
  pagefoot:
    fontFamily: SF Pro Text
    fontSize: 9px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.10em"
rounded:
  none: 0px
  xs: 2px
  sm: 4px
  md: 8px
  lg: 16px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  page-margin-y: 18mm
  page-margin-x: 22mm
  content-max: 680px
components:
  masthead:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.masthead-brand}"
    padding: 8pt
  eyebrow:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.tertiary}"
    typography: "{typography.eyebrow}"
  headline-display:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.display}"
  deck:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.secondary}"
    typography: "{typography.deck}"
  byline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.secondary}"
    typography: "{typography.byline}"
    padding: 8pt
  body:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.body-md}"
  blockquote-editorial:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.secondary}"
    typography: "{typography.blockquote}"
    padding: 12pt
  drop-cap:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.tertiary}"
    typography: "{typography.display}"
  table-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.body-sm}"
    padding: 6pt
  table-header:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.secondary}"
    typography: "{typography.table-header}"
    padding: 6pt
  footnote-block:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.secondary}"
    typography: "{typography.footnote}"
    padding: 10pt
  link-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.body-md}"
  link-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.tertiary}"
    typography: "{typography.body-md}"
  card-listing:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.body-md}"
    padding: 16pt
    rounded: "{rounded.none}"
  card-listing-hover:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
---


## Overview

Heritage Editorial is the visual system for the editorial-style blog at `daniwismagatha.my.id/blog`. It exists for one job: make long-form writing in Bahasa Indonesia feel as considered as the prose deserves.

The reference is the print column — the kind that European broadsheets and magazines like *The Economist*, *The Atlantic*, and *De Correspondent* have refined for over a century. Long measure, justified text with hyphenation, drop caps, a single accent color used sparingly, and chrome that signals seriousness without shouting.

What it is **not**: a marketing landing page, a product UI, or a documentation theme. It will look austere on a phone, dignified on a tablet, and like a printed essay on desktop. That is intentional. The audience opens these posts to *read*, not to skim, like, share, and leave.

The system is light-only. Dark mode is rejected because the typographic ratios that make this work — drop cap weight, blockquote border, subtle ink-on-paper — break down under a dark theme. A blog this small does not need both modes; it needs one mode rendered well.

## Colors

The palette is intentionally narrow. Every color earns its place.

- **Primary (`#1D1D1F`):** Deep ink for headlines, body text, and emphasized elements. Apple's `--ink` from their San Francisco system — neutral enough to disappear, dark enough to feel printed.
- **Secondary (`#4A4A4F`):** Soft ink for deck text, blockquotes, byline metadata, and footnotes. Half a step lighter than primary so it recedes without becoming illegible.
- **Tertiary (`#B8422E`):** Boston Clay — the only true accent in the system. Used for the drop cap, the blockquote left border, the eyebrow label, and link hover state. Its scarcity is what makes it work.
- **Neutral (`#FAFAFA`):** Muted surface for table headers and listing card hover states. Just below pure white.
- **Surface (`#FFFFFF`):** The page background. Pure white to maximize contrast with body ink and let the accent breathe.
- **Faint (`#86868B`):** Tertiary metadata color (page numbers, masthead meta, "1 hour ago" timestamps). Visible but never dominant.
- **Rule (`#D2D2D7`):** Hairline rules between sections, byline borders, footnote separators.
- **Border (`#E5E5E7`):** Slightly darker than `rule`, used for table cell bottoms.
- **Accent-soft (`#F4D9D2`):** Reserved for future tinted callouts. Not used in v1 components.

Contrast: Primary on Surface = 18.8:1 (AAA). Secondary on Surface = 8.4:1 (AAA). Tertiary on Surface = 5.6:1 (AA Large; AAA fails by design — this color is decorative, not body).

## Typography

Two families, used with discipline.

**Source Serif 4** (Google Fonts, free, OFL) is the body face. It is the closest free equivalent to Charter — the Apple/Adobe serif that anchored the original PDF reference. Its optical-size axis (`opsz: 8..60`) lets the same font handle the 28pt headline and the 8pt footnote without losing character. Hinted well, supports Bahasa Indonesia diacritics, and renders crisply at small sizes.

Fallback stack: `"Source Serif 4", Charter, "Iowan Old Style", Georgia, "Times New Roman", serif`.

**SF Pro Text** (system, free on Apple devices) handles the chrome — eyebrow labels, masthead, byline metadata, table headers, footnote, page footer. Where SF Pro is unavailable (non-Apple platforms), the stack falls back to `-apple-system, "Inter", system-ui, sans-serif`.

Type scale follows the print reference at 11pt body — slightly larger than typical web body to match the editorial feel. Line-height stays generous (1.65 for body, 1.45 for deck) to give justified paragraphs room to breathe without rivers.

Letter-spacing is negative for serifs (`-0.005em` body, `-0.025em` display) and positive for caps-lock chrome (`0.20em` eyebrow, `0.22em` masthead brand) — the latter is the classic typographic correction for all-caps legibility.

Drop cap: 4.5em font-size, 0.85 line-height, weight 700, color tertiary, floated left with 6pt 8pt 0 0 padding. Implemented via `::first-letter` for screen-reader compatibility (FR-9.5).

## Layout

Page chrome is constructed from a sequence of horizontal hairlines that frame each region. The grammar is consistent across listing and post pages:

1. Masthead (top hairline below)
2. Eyebrow + Headline + Deck
3. Byline (top hairline above, bottom hairline below)
4. Body (variable length)
5. Footnote (top hairline above)
6. Page footer (top hairline above)

Content max-width is **680px** on viewports ≥1024px. This is the "long measure" sweet spot — enough characters per line for typographic rhythm (~75 cpl), not so wide that the eye loses track. On smaller viewports the column scales down with viewport-relative padding (`px-6` on mobile, `px-8` on tablet).

Page padding mirrors the PDF: 18mm vertical, 22mm horizontal on print and large viewports. On mobile this collapses to 24px vertical, 16px horizontal — print metrics don't translate to phones.

Vertical rhythm: paragraphs have 9pt bottom margin (≈8px at 1rem). H2 has 18pt top, 8pt bottom. The horizontal divider for "thought break" (`· · ·`) gets 20pt top and 14pt bottom — it's a visual breath.

## Components

- **`masthead`:** Top header row showing brand wordmark left and edition metadata right, separated by a single hairline. Brand is bold uppercase tracked at 0.22em. Meta is faint and tracked at 0.10em. This component appears once at the top of every post.

- **`eyebrow`:** Small uppercase tag label appearing above the headline. Always tertiary color. Conveys section / category (e.g. "CATATAN", "HUKUM & POLITIK"). Single line, no wrapping.

- **`headline-display`:** Article title in display serif at 28pt. Letter-spacing is tight (-0.025em) and line-height is short (1.1) — this is the loudest single element on the page.

- **`deck`:** The standfirst paragraph below the headline. Italic deck serif at 13pt. Maximum width is 130mm (about 80% of content column) so it breaks before the body width and feels like a subtitle, not a paragraph.

- **`byline`:** Author / date / reading time row. Single line, sans-serif chrome face, separated by middle dots. Bordered top and bottom with hairlines.

- **`drop-cap`:** First letter of the lede paragraph. Implemented via CSS `::first-letter` on a paragraph with `.lede` class. The `<Lede>` MDX component is the only public API for this.

- **`blockquote-editorial`:** Italic block with a 3pt-wide tertiary left border. Padding 6pt vertical, 14pt left. Used for direct quotations from external sources.

- **`table-row` / `table-header`:** Table styling. Header background is muted neutral, header text is uppercase chrome at 8pt. Rows have hairline bottom borders. No vertical rules.

- **`footnote-block`:** End-of-post references list. Italic chrome face at 8pt, top hairline, 10pt top padding. Inline strong tags allowed for source names.

- **`card-listing`:** Listing-page card. White surface, no rounded corners, hairline bottom rule. Hover state shifts background to muted neutral. Used at `/blog`.

## Do's and Don'ts

**Do:**

- Use the tertiary accent (Boston Clay) sparingly. The drop cap, the blockquote border, the eyebrow, and the link hover. That is the entire list.
- Justify body text with hyphenation on viewports ≥768px. The editorial feel collapses without it.
- Render the drop cap via `::first-letter`, not a wrapping span. Screen readers must read the lede normally.
- Keep paragraph spacing modest (9pt). Justified text already creates visual breaks.
- Match the reference PDFs visually within ±5% spacing tolerance. They are the truth.

**Don't:**

- Add a second accent color. The system is monochromatic plus one.
- Add dark mode. The design depends on ink-on-paper contrast that breaks under inversion.
- Use Tailwind Typography (`@tailwindcss/typography`). Its prose styles will conflict with the editorial CSS.
- Round corners on listing cards. The aesthetic is square hairlines, not soft chips.
- Animate text. Animate cards on hover, links on focus, but never text bodies.
- Inflate the type scale. 11pt body is intentional. 12pt makes the page feel like a SaaS marketing site.
- Substitute Charter, Iowan, or another premium serif if the user has not licensed them. Source Serif 4 is the contracted fallback.
