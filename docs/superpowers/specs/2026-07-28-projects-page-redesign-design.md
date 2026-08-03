# Projects Page Redesign — Design Spec

Date: 2026-07-28
Branch: `feat/projects-page-redesign`

## Purpose

The current `/projects` page uses three independently-scrolling infinite-loop
carousels. It's visually striking but poorly suited to its actual audience:
recruiters and HR, who need to scan all projects quickly, understand what
each one is at a glance, and drill into detail without losing their place.

This spec redesigns the page around a uniform, filterable grid with a
shared-element detail view, so the page optimizes for fast evaluation while
still reading as a dynamic, portfolio-quality piece of UI.

## Goals

- All projects visible/scannable in one predictable grid, not an
  open-ended scroll.
- Filtering by category without a full page reload or context loss.
- A detail view for each project (description, tech stack, role/timeframe,
  optional metrics, optional AWS architecture diagram, optional links) that
  is shareable via a real URL.
- Motion used for continuity and hierarchy (shared-element morph, staggered
  reveal) rather than as decoration.

## Non-goals

- No CMS or MDX-based content authoring — project data stays as a
  structured TypeScript array (`data.ts`), consistent with the rest of this
  single-user, single-maintainer site.
- No automated test suite — this repo has none configured; verification is
  manual (see Testing section).
- No auto-layout/template system for AWS diagrams — node positions are
  hand-authored per project.
- Real project copy (descriptions, metrics, diagram content) is out of
  scope for this spec; placeholder content is used and will be filled in
  later.

## 1. Architecture & routing

```
src/app/projects/
├── layout.tsx              # renders {children} + {modal} slot together
├── page.tsx                # the grid (redesigned)
├── data.ts                 # project data (extracted from current inline `columns`)
├── @modal/
│   ├── default.tsx         # returns null — required in Next 16 (parallel
│   │                         route slots now need an explicit default.tsx
│   │                         or the build fails)
│   └── (.)[slug]/
│       └── page.tsx        # intercepted detail — renders as overlay on the grid
└── [slug]/
    └── page.tsx            # standalone detail page — hard nav / refresh / direct link
```

- **Soft navigation** (clicking a card from the grid): Next.js matches the
  `(.)[slug]` segment inside the `@modal` slot. The grid stays mounted
  underneath, and the detail renders as an overlay on top of it. Because the
  grid card and the overlay are both mounted in the same React tree, a
  `motion` shared-element (`layoutId`) animation can morph directly between
  them.
- **Hard navigation** (pasting `/projects/model-registry`, or refreshing
  while a detail view is open): renders `[slug]/page.tsx` standalone. No
  grid is mounted behind it, so there's nothing to morph from — it enters
  via the existing `template.tsx` page-fade.
- The detail **content** (description, stats, diagram, tags, links) lives in
  one shared component used by both `@modal/(.)[slug]/page.tsx` and
  `[slug]/page.tsx`. Only the wrapper differs: overlay chrome + close button
  vs. full page + back link.
- `data.ts` is the single source of truth for both the grid and both detail
  routes.
- Confirmed against `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/intercepting-routes.md`
  and `parallel-routes.md`: this is Next's documented pattern for exactly
  this use case (their example is a photo-gallery modal). The `default.tsx`
  requirement for parallel route slots is called out as a Next 16 breaking
  change in `02-guides/upgrading/version-16.md` — verify at implementation
  time this hasn't changed further since this spec was written.

## 2. Data model

`src/app/projects/data.ts` replaces the current inline `columns` array:

```ts
type ProjectLink = { label: string; href: string }

type DiagramNode = {
  id: string
  service: string     // AWS service key, maps to an icon (e.g. "lambda", "s3", "api-gateway")
  label: string
  detail: string       // shown on hover (desktop) / tap (mobile)
  x: number             // percentage position within the diagram canvas (0-100)
  y: number
}

type DiagramEdge = {
  from: string          // DiagramNode id
  to: string             // DiagramNode id
}

type ProjectDiagram = {
  nodes: DiagramNode[]
  edges: DiagramEdge[]
}

type ProjectMetric = { value: string; label: string }  // e.g. { value: "40%", label: "latency reduction" }

type Project = {
  slug: string          // url-safe id, e.g. "model-registry" — manual override allowed to avoid collisions
  title: string
  subtitle: string
  category: "MLOps" | "AI Agent" | "Side Project"
  image: string
  description: string    // long-form, detail view, 2-4 sentences
  techStack: string[]
  role?: string
  timeframe?: string
  links?: ProjectLink[]   // repo / demo, optional
  metrics?: ProjectMetric[]  // optional — stat tiles
  diagram?: ProjectDiagram   // optional — only projects with an AWS architecture
}

const projects: Project[] = [ /* ... */ ]
```

Notes:

- `category` replaces the current column-header grouping. The grid derives
  its filter chips from `[...new Set(projects.map(p => p.category))]`
  rather than hardcoding them.
- Optional fields (`role`, `timeframe`, `links`, `metrics`, `diagram`)
  render conditionally in the detail view — omitted from the DOM entirely
  when absent, not shown as empty or "N/A".
- Placeholder content for this pass: 2-3 sentence lorem-ipsum-style
  `description` per project; `metrics`/`diagram`/`links` populated on
  roughly half the entries so both the present and absent rendering paths
  are exercised during implementation. Real copy to be filled in later by
  the user.

## 3. Grid & filter (landing view)

- Single responsive CSS Grid replaces the three `ScrollColumn` carousels:
  `repeat(3, 1fr)` desktop, `repeat(2, 1fr)` tablet, `1fr` mobile. Cards
  keep the existing `aspect-[4/5]`, gradient-overlay title/subtitle
  treatment.
- Filter chips above the grid: `"All"` plus one chip per distinct
  `category`. Active chip styled per DESIGN.md ink token (`#171717` fill,
  white text — matches the existing "← Back" pill).
- The active filter is stored in the URL as `?category=<slug>` (not
  component-only state), so it survives navigation into and back out of a
  detail view, and is itself shareable/back-button-correct. A missing or
  unrecognized `category` value is treated as `"All"`.
- Filtering is client-side (`.filter()` over the in-memory `projects`
  array) — no server round-trip needed for this data size.
- Filter transition: `AnimatePresence` wraps the grid. On category change,
  non-matching cards exit (fade + scale to 0.96, ~150ms) before the
  matching set enters (staggered fade-in, ~40ms delay per card, ~200ms
  each). No `layout`-reflow animation needed — it's a uniform grid, so
  changing the filter reorders/removes cards rather than resizing them.
- Each card is a `motion` element with `layoutId={`card-${project.slug}`}`
  on the image and `layoutId={`title-${project.slug}`}` on the title.
- Card hover: scale 1.02-1.03, shadow lift, and a reveal of the first 2-3
  `techStack` entries as small pills.

## 4. Detail overlay & shared-element morph

- `@modal/(.)[slug]/page.tsx` renders a full-viewport overlay: a scrim
  (~40% opacity black) over the dimmed grid, plus a centered/full-height
  detail panel.
- The detail panel's hero image and title use the same `layoutId`s as the
  originating grid card, so `motion` morphs position/size/radius between
  them automatically.
- Sequencing: image + title morph first (spring, `stiffness: 300,
  damping: 30`, ~350-450ms). Once settled, the remaining content
  fades/slides in with a ~120ms stagger, in this order: role/timeframe →
  description → tech stack tags → metrics stat tiles (if present) →
  diagram (if present) → links.
- Closing (X button, scrim click, or Esc) calls `router.back()`, reversing
  the morph to the originating grid card and staying consistent with the
  browser back button.
- If detail content exceeds viewport height, only the detail panel scrolls
  internally; the scrim stays fixed.

## 5. Prev/next navigation + thumbnail rail

- The navigable set for a given detail view is `projects` filtered by the
  `?category=` param carried over from the grid (or all projects if absent
  / `"All"`).
- Prev/next: fixed chevron buttons at the overlay's left/right edges, plus
  `ArrowLeft`/`ArrowRight` keyboard handlers. Activating either performs a
  shallow route change to the neighboring slug within the same `@modal`
  route (no full reload) and re-triggers the shared-element morph — the
  outgoing image/title un-morph, the incoming ones morph in from the same
  on-screen position.
- Thumbnail rail: a fixed strip at the bottom of the overlay showing every
  project in the current navigable set as small (~48px) thumbnails, with
  the active one highlighted by a border/ring. Clicking one jumps directly,
  using the same navigation mechanism as prev/next.
- If the navigable set has exactly one project, prev/next controls and the
  rail are hidden rather than shown disabled.

## 6. Interactive AWS diagram

- Rendered as an SVG canvas (viewBox-based); `DiagramNode.x`/`.y`
  percentages map directly to viewBox coordinates, keeping it responsive
  without runtime recalculation.
- Nodes: each renders an icon from the official AWS Architecture Icons set
  (imported as SVG components) inside a hoverable/tappable hit area, with
  `label` beneath it.
- Edges: SVG `<path>`s between node centers, drawn as right-angled/
  orthogonal connectors (the standard AWS diagram visual convention).
- Flow animation: a pulsing glow travels continuously along each edge path
  once the diagram scrolls into view (`IntersectionObserver`/`useInView`
  gated, so off-screen diagrams don't animate). Implemented via a small
  gradient blob animated along the path (`motion`'s path animation or SVG
  `<animateMotion>`).
- Hover (desktop) or tap (mobile) on a node shows a tooltip with
  `detail` text, with position logic that flips side near canvas edges to
  avoid clipping. On mobile, tapping elsewhere or another node dismisses
  the open tooltip.
- Only rendered when `project.diagram` is present; the section is omitted
  entirely otherwise, not shown empty.

## 7. Error handling & edge cases

- **Unknown slug**: both `[slug]/page.tsx` and `@modal/(.)[slug]/page.tsx`
  call `notFound()`, rendering a new `not-found.tsx` ("Project not found" +
  link back to `/projects`).
- **Stale `?category=`**: an unrecognized value is treated as `"All"`
  rather than erroring or rendering an empty grid.
- **`prefers-reduced-motion`**: the shared-element morph collapses to a
  simple crossfade (no spring/scale), the grid filter transition drops its
  stagger (instant swap), and the diagram's flow-glow animation is
  disabled entirely.
- **Diagram tooltip clipping**: tooltip placement flips left/right/top/
  bottom based on the node's proximity to the diagram's edge, so it never
  renders off-canvas or under the rail.
- **Keyboard navigation**: the overlay traps focus while open (Tab cycles
  within it), `Esc` closes it, and arrow keys move prev/next.
- **Empty optional fields**: `metrics`, `diagram`, `links`, `role`/
  `timeframe` sections render conditionally, with no placeholder/"N/A"
  markup when absent.

## 8. Testing / success criteria

No test framework is configured in this repo; verification is manual,
consistent with existing project convention. Before considering this
feature complete:

1. Grid displays all projects at uniform size; filter chips correctly
   narrow the set and update the URL.
2. Clicking a card morphs smoothly into the detail overlay; the resulting
   URL is a real, shareable `/projects/[slug]?category=...` path; a
   refresh on that URL renders the standalone page (no grid behind it).
3. Prev/next and the thumbnail rail correctly scope to the active filter
   category, and hide gracefully when only one project is in scope.
4. Diagram hover (desktop) and tap (mobile) both show/dismiss tooltips
   correctly; the flow-glow animates continuously once in view and is
   disabled under `prefers-reduced-motion`.
5. Keyboard-only pass: Tab/Shift+Tab stays trapped in the overlay, arrow
   keys navigate between projects, Esc closes it.
6. Responsive check at 375px, 768px, 1024px, and 1440px.

## Approaches considered (routing)

Three approaches were evaluated for how the detail view attaches to
navigation:

- **A — Intercepting + parallel routes (chosen).** Real, shareable
  per-project URLs; correct back-button behavior; grid stays mounted so
  shared-element animation works; matches Next's documented pattern for
  this exact use case. Trade-off: more route-file scaffolding, and the
  Next 16 `default.tsx` requirement for parallel slots must be respected.
- **B — Client-only state, no real routes.** Simplest to build, but no
  real per-project URL without hand-rolled history management — rejected
  because shareable links matter for this audience (recruiters/HR
  forwarding a specific project).
- **C — Full page navigation + browser View Transitions API.** Avoids
  parallel-route complexity, but View Transitions API support is less
  mature and would sit awkwardly next to the existing `motion`-based
  transition system — rejected in favor of reusing `motion` consistently.
