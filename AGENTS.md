<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commands

```bash
npm run dev      # Dev server (a dev server is often already running on port 3001 — check before starting another; Next refuses a second instance)
npm run build    # Production build
npm run lint     # ESLint (or ./node_modules/.bin/eslint src for full output)
npx tsc --noEmit # Typecheck
```

No test framework configured.

## Stack

Next.js 16.2.11 (App Router, Turbopack, `src/app/`), React 19, TypeScript, Tailwind CSS v4 (PostCSS plugin, tokens in `src/app/globals.css` — no tailwind.config file), `motion` (framer-motion successor) for micro-animations. Path alias `@/*` → `src/*`.

## Design System

`DESIGN.md` is the single source of truth for all visual decisions — Vercel-inspired token system (colors, typography, spacing, radii). Key rules:

- Ink `#171717` is the only primary/dark color — use it instead of pure black, including for "black" backgrounds.
- Geist (via `next/font`, CSS vars `--font-geist-sans` / `--font-geist-mono`) — display weight caps at 600, aggressive negative letter-spacing on display sizes.
- Spacing on a 4px base; radii from the `rounded` token scale (6px in-app buttons, 8–12px cards, 100px marketing pills).
- If a request conflicts with DESIGN.md, DESIGN.md wins.

## Architecture

Single-user portfolio/blog. Two top-level pages; project detail is a modal-only overlay on `/projects`, not a separate route:

- `src/app/page.tsx` — landing: full-screen nav list (`navigationItems` array; items with `href` become links) using `TextRoll` hover animation.
- `src/app/projects/page.tsx` — client component (wrapped in `Suspense` since it reads `useSearchParams`). Filterable grid (not a carousel): category buttons write `?category=` to the URL, `AnimatePresence`/`motion` fades cards in/out on filter change. Project data comes from `src/app/projects/data.ts` (`categories`, `getCategoryProjects`, `getProject`), not an inline array. Clicking a card sets `?project=<slug>` on the same URL (preserving `?category=`) and this page renders `ProjectDetailOverlay` for the matching project — there is no `/projects/[slug]` route; opening/closing/prev-next all happen via that query param and browser history (`router.push`/`router.back`).
- `src/components/projects/project-card.tsx` — grid card. It renders `ProjectBanner` above the card copy and links to `/projects?project=<slug>`.
- `src/components/projects/project-banner.tsx` — reusable 16:9 transparent-glass banner used on the grid and detail body. `PROJECT_BANNER_ICONS` maps each project slug to exactly two representative icons (exported, shared with `project-banner-modal.tsx`); the non-compact banner always uses the same `gap-10` center-row spacing. The V2 DSPy mark is `public/icons/dspy.png`.
- `src/components/projects/project-banner-modal.tsx` — modal-only banner variant. The modal's own `backdrop-filter` blur doesn't recomposite live over the WebGPU ocean canvas when stacked with another blurred ancestor (browsers snapshot it once instead of resampling per frame), so exactly one element in the whole modal may carry `backdrop-blur` — that's this component; the modal shell and body around it use plain alpha transparency instead.
- `src/components/projects/project-detail-overlay.tsx` — modal chrome: focus trap (Tab cycles within the panel), Escape/backdrop-click to close (`router.back()`), prev/next via arrow keys and a thumbnail rail, all gated through `getCategoryProjects` so navigation stays within the active filter. The panel shell is transparent/bordered only.
- `src/components/projects/project-detail-content.tsx` — the detail body, only ever rendered inside `ProjectDetailOverlay`. Renders the banner edge-to-edge (so it's exposed directly to the live background behind the modal) followed by a separate opaque body div for the rest of the content.

### PAAR project sections

A project can carry an optional `paar` field (`ProjectPAAR` in `data.ts`) that renders four
content sections — Problem / Analysis / Action / Result — instead of the generic
description-paragraph + `diagramImage` layout. Each section is `{ heading: string, bullets:
string[] }` (`problem` also carries an optional `stats: ProjectMetric[]`, a 3-up mini stat
row). Write a heading specific to that project's story (e.g. "도면 한 장에 30분씩"), never
the generic template wording ("왜 필요했나" / "무엇을 검토했나" / ...).

- `project-detail-content.tsx` renders the fixed English eyebrow tags (`PAAR_EYEBROW`:
  PROBLEM/ANALYSIS/ACTION/RESULT) above each section's per-project `heading`/`bullets`, and
  looks up an optional animated diagram per section via `PAAR_DIAGRAM` (analysis/action/result
  keys — problem has no diagram slot, use `stats` there instead).
- Diagrams live in `pipeline-diagram.tsx` (Action — 5-step flow), `analysis-diagram.tsx`
  (Analysis — 3-candidate comparison with rejected/accepted paths converging to one outcome),
  `accuracy-diagram.tsx` (Result — bar chart). All are `motion.svg`, revealed via `whileInView`
  and gated by `useReducedMotion`, on a 1200-unit-wide viewBox.
- **Size SVG text for the scale-down, not the raw number.** The viewBox shrinks to fit the
  ~700px article column, so a "12" `fontSize` renders at ~7px on screen. Current diagrams use
  17-23px for body text and 44px for the big stat number in the Result chart — tune future
  additions to match that on-screen size, not the SVG unit count.
- The diagram wrapper is `overflow-x-auto` with a `min-w-[640px]` inner div, not
  `overflow-hidden` + plain `w-full` — on mobile this lets text stay legible via horizontal
  scroll instead of shrinking to illegible size.
- The top-of-page `metrics` array renders as a `TL;DR` bullet list (bold value + `·` + label),
  not boxed stat cards — keep that pattern for other projects' headline numbers.
- Bullets and headings should go through the `korean-humanizer` skill before shipping. The
  recurring tell in this content was em dash (—) used as a "claim — detail" separator; replace
  with a period, parentheses, or a connecting clause. The bullet-list format itself is not an
  AI tell (it's a normal resume/portfolio convention) — don't flatten it into prose.
- `dxf-panel-parser` in `data.ts` is the worked example for all of the above.

### Blog post writing

Posts are `content/blog/<slug>.md`, parsed by `src/lib/blog.ts` (`gray-matter` frontmatter +
`marked`). Frontmatter:

```yaml
---
title: "Post title, quoted"
date: 2025-10-25          # YYYY-MM-DD, unquoted
tag: Agent                 # single word, reuse the existing set: Agent, MLOps, ML, Conference
summary: "One-sentence hook, quoted"
draft: false                # true hides it from getAllPosts() until ready to publish
---
```

- No H1 and don't restate the title/summary in the body — `blog/[slug]/page.tsx` already
  renders `meta.title` as the page `<h1>` and `meta.summary` as the subhead above the body.
- `##` (H2) marks major sections and is the only heading level collected into the
  `ReadingRail` table-of-contents, so every H2 should be a real navigable section. Use `###`
  for sub-points that shouldn't appear in the rail.
- Opening with a plain intro paragraph before the first `##`, or opening directly with an
  image/the first `##`, are both used in existing posts — no fixed rule which.
- Images: `![alt](/blog/<file>)`, stored in `public/blog/`, named
  `<post-slug>-<description>.<ext>`. Alt text should be Korean and descriptive (see
  `pydanticai-after-pycon-korea.md`'s SVG alt as the model to follow, not the bare
  `alt text`/`sm-endpoint` placeholders in older posts). An italic caption line (`*caption*`)
  directly below an image is optional, used occasionally.
- Diagrams-as-SVG follow the "Blog post SVG diagrams" conventions below.
- Korean prose, `**bold**` for key terms/names on first use, numbered lists for sequential
  steps, bullet lists for flat feature/pros-cons lists. Run through the `korean-humanizer`
  skill before shipping — same em-dash tell called out for PAAR bullets applies here.
- Reading time (`minutes`) is auto-computed (~500 Korean chars/min, code fences excluded) —
  not hand-authored.

### Blog post SVG diagrams

Diagrams embedded in `content/blog/*.md` are standalone SVG files referenced via markdown
image syntax (`![alt](/blog/<name>.svg)`), stored in `public/blog/` — not `motion.svg` React
components (those are PAAR-only, see above). `.post-body img` in `globals.css` already handles
responsive sizing and rounded corners, so no extra markup is needed. Conventions:

**Arrow style**
- Arrows should have a "flowing" animated effect when dash effect is requested (moving dash
  pattern along the line).
- Arrows connecting elements should bend at 90 degrees (orthogonal/elbow routing) instead of
  running diagonally.
- Each bend/corner in an arrow should have a slight radius — rounded corners, not sharp right
  angles.

**Layout**
- When several arrow stems leave the element, they should be evenly spaced along its edge (not
  clustered together).
- Arrow shapes/bend points should adjust to match wherever the stems and targets end up (i.e.,
  recompute the elbow geometry rather than keeping fixed bend coordinates).

**Content scope**
- No title or subtitle text inside the SVG itself (that context lives in the surrounding blog
  prose instead).

**Typography**
- Text/labels sized large overall.

Implementation notes: the flow animation is a `<style>` block inside the SVG itself
(`stroke-dasharray` + a `stroke-dashoffset` keyframe), wrapped in
`@media (prefers-reduced-motion: no-preference)` so it works even loaded through a plain
`<img>` tag and respects reduced-motion. Rounded elbow corners are quadratic Béziers (`Q
cornerX,cornerY endX,endY`) with the straight segments backed off by the radius before/after
each corner, not a stroke-based corner radius. `public/blog/pydanticai-multiagent-architecture.svg`
(used in `pydanticai-after-pycon-korea.md`) is the worked example.

### Page transitions

- `src/app/template.tsx` — remounts on every navigation; wrapper `#page-transition` plays the `page-fade-in` keyframe (defined in `globals.css`) for enter fades.
- `src/components/ui/transition-link.tsx` — `TransitionLink` fades `#page-transition` out, then `router.push` for exit fades. Use it instead of `next/link` for internal navigation so the fade-out runs; it passes modifier-key clicks through to native `<a>` behavior.

### Conventions

- Components needing interactivity are `"use client"` from the start.
- `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge) for conditional classes.
- Placeholder images: plain CSS `background-image` with `https://picsum.photos/seed/<name>/640/400` — `next/image` remotePatterns is not configured, don't mix approaches.
