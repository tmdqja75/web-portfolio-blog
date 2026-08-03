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

Single-user portfolio/blog. Two top-level pages plus a projects detail route:

- `src/app/page.tsx` — landing: full-screen nav list (`navigationItems` array; items with `href` become links) using `TextRoll` hover animation.
- `src/app/projects/page.tsx` — client component (wrapped in `Suspense` since it reads `useSearchParams`). Filterable grid (not a carousel): category buttons write `?category=` to the URL, `AnimatePresence`/`motion` fades cards in/out on filter change. Project data comes from `src/app/projects/data.ts` (`categories`, `getCategoryProjects`, `getProject`), not an inline array.
- `src/app/projects/[slug]/page.tsx` — full-page project detail (direct nav / refresh / no-JS fallback).
- `src/app/projects/@modal/(.)[slug]/page.tsx` + `default.tsx` — parallel/intercepted route: clicking a card from `/projects` opens the same detail as an overlay modal (`ProjectDetailOverlay`) without leaving the grid; `src/app/projects/layout.tsx` renders `{children}` and `{modal}` side by side per Next's parallel-routes convention.
- `src/components/projects/project-card.tsx` — grid card, shares a `layoutId` (`card-image-<slug>` / `card-title-<slug>`) with the overlay for the morph transition.
- `src/components/projects/project-detail-overlay.tsx` — modal chrome: focus trap (Tab cycles within the panel), Escape/backdrop-click to close (`router.back()`), prev/next via arrow keys and a thumbnail rail, all gated through `getCategoryProjects` so navigation stays within the active filter.
- `src/components/projects/project-detail-content.tsx` — body shared between the full page and the overlay.
- `src/components/projects/aws-diagram.tsx` + `aws-icons/` — interactive AWS architecture diagram (in-view gated flow animation, respects `prefers-reduced-motion` via `useReducedMotion`) used inside a project's detail content.

### Page transitions

- `src/app/template.tsx` — remounts on every navigation; wrapper `#page-transition` plays the `page-fade-in` keyframe (defined in `globals.css`) for enter fades.
- `src/components/ui/transition-link.tsx` — `TransitionLink` fades `#page-transition` out, then `router.push` for exit fades. Use it instead of `next/link` for internal navigation so the fade-out runs; it passes modifier-key clicks through to native `<a>` behavior.

### Conventions

- Components needing interactivity are `"use client"` from the start.
- `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge) for conditional classes.
- Placeholder images: plain CSS `background-image` with `https://picsum.photos/seed/<name>/640/400` — `next/image` remotePatterns is not configured, don't mix approaches.
