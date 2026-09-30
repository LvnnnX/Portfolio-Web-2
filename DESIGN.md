# DESIGN.md

Direction for daniwismagatha.my.id.

This file was **extracted from the existing code** on 2026-09-27, not invented. Every
token below is a value already live in `src/index.css`, `src/blog/styles/*.css`, or
`index.html`. It records what the site already is so the design has a stated direction
to be filtered against. If a line here does not match your intent, change the line:
this file is the source of truth, the code follows it.

Supersedes the palette in `docs/DESIGN.md` ("Heritage Editorial", May 2026), which was
scoped to the blog only and whose colors were replaced by the Atelier set below. The
editorial typography notes in that file are still broadly accurate.

## Identity

A working portfolio for a computer vision and applied ML engineer based in Karangasem,
Bali. Two surfaces with deliberately different characters:

- **App surfaces** (`/`): sans-serif, flat, dense. A resume that happens to be a website.
- **Editorial surfaces** (`/blog`, `/tech-news`, `/case-study`, `/services`,
  `/planned-website`): serif on warm paper, long measure, quiet. Built for reading.

The split is the identity motif: the same accent and the same voice, carried across two
surfaces that do not pretend to be the same thing.

## Personality

Plain-spoken and specific. Numbers are real or absent. The site shows work instead of
describing it. No glass, no glow, no decorative motion. Warmth comes from the paper
tone and the clay accent, not from effects.

## Palette

Two core neutrals plus one accent. Neutrals do not count toward the R-29 cap, so the
active palette is **1 accent**.

### App surfaces

| Token | Light | Dark |
|---|---|---|
| `--background` | `#fafafa` | `#101012` |
| `--foreground` | `#111113` | `#ededf0` |
| `--muted` | `#f1f1f4` | `#1a1a1e` |
| `--muted-foreground` | `#6b6b73` | `#9a9aa3` |
| `--border` | `#e4e4e8` | `#2a2a2e` |
| `--primary` (accent) | `#B8422E` | `#d75a3f` |

### Editorial surfaces

| Token | Light | Dark |
|---|---|---|
| `--editorial-paper` | `#fafaf6` | `#0f1012` |
| `--cs-ink` | `#1a1a1c` | `#f3f1ec` |
| `--cs-accent` | `#b8422e` | `#d75a3f` |

**The accent is Bali clay `#B8422E`.** It is the one deliberate accent: it belongs on
the active nav item, the section eyebrow, the primary button, and the contribution
heatmap ramp. It does not belong on body text, borders, or backgrounds.

Language swatches in the GitHub section (`#3572A5` Python, `#F1E05A` JavaScript, and so
on) are GitHub's own convention carrying real data, not palette expansion.

## Typography

- **Manrope** for app surfaces and editorial UI chrome. Chosen for a humanist sans with
  a tall x-height that stays legible at the 10px to 13px label sizes this site leans on.
- **Source Serif 4** for editorial body text. A free Charter-adjacent serif sized for
  long reading, carrying the newspaper character the writing wants.

Type is set in explicit pixel steps rather than a named scale. Headings run
`24px / 32px` at the section level and up to `200px` for the hero name.

## Layout

- App surfaces: `max-w-5xl` content column, section padding `py-10 md:py-16`.
- Editorial surfaces: `max-w-1100px` shell with a `680px` reading measure.
- `--nav-clearance` (`72px` mobile, `96px` desktop) reserves room under the fixed nav.
- Surfaces are flat. `.surface` is `var(--muted)` plus a `1px` border, no blur, no
  elevation. Shadow appears only on the floating nav, where it marks real elevation
  over scrolling content.

## Dials

`Dial: ENERGY 2 / RHYTHM 2 / MOTION 1`

- **ENERGY 2.** The hero name is loud on purpose; everything after it is quiet. The
  palette is restrained to one accent. Balanced, not shouting.
- **RHYTHM 2.** Consistent with deliberate breaks. The editorial surfaces are visibly a
  different composition from the app surfaces, and the home page sections are meant to
  differ from each other rather than repeat one header template.
- **MOTION 1.** Hover states, a theme transition, and a single scroll-reveal that fires
  once per element. No loops, no parallax, no choreography. The loading shimmer is a
  state indicator, not decoration.

### Section scale follows content weight

The home page runs at three scales rather than one, which is what RHYTHM 2 buys:

| Scale | Sections | Padding | Heading |
|---|---|---|---|
| Primary | Experience, Projects | `py-14 md:py-24` | `26px / 38px` |
| Evidence | On GitHub | `py-10 md:py-16` | `24px / 32px` |
| Supporting | Achievements, Get in Touch | `py-8 md:py-12` | `20px / 26px` |

The reason is hierarchy, not variety for its own sake: a portfolio exists to show work,
so the work gets the room and the closing sections defer to it.

### Uppercase labels with wide tracking

`tracking-[0.12em] uppercase` appears on stat labels and section eyebrows only, at 10px
and 11px. At that size Manrope's lowercase loses its shape, and the extra tracking is
what keeps an all-caps micro-label readable rather than a decorative flourish. It is not
used at body size.

## Do and do not

- Do let real data drive what is shown. If a number cannot be sourced, show no number.
- Do keep the two surfaces distinct. The editorial paper never appears on `/`.
- Do not add glass, glow, gradient backgrounds, or decorative status dots.
- Do not spread the accent. One accent, at the moment that matters.
- Do not let a section exist because portfolios usually have one.
