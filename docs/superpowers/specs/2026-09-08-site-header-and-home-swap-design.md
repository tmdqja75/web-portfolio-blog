# Site header + home/about swap

## Goal

Make the About page the site's home page, and add a persistent 5-item header
(About / Projects / Blog / Newsletter / Contact) to every page, reusing the
existing `TextRoll` hover animation from the current home page's nav list.

## Routing changes

- `src/app/about/page.tsx`'s content (the dark hero/snap-scroll page) moves
  to `src/app/page.tsx`, becoming the new `/`.
- `src/app/about/page.tsx` is replaced with a permanent redirect to `/`
  (`redirect("/")` from `next/navigation`), so existing links to `/about`
  keep working.
- The current `src/app/page.tsx` (full-screen centered list of 5 links using
  `TextRoll`, `navigationItems` array) is deleted. Its content and link data
  move into the new header component.
- No new routes for Newsletter or Contact. They remain external/mailto
  links, same as today:
  - Newsletter → `https://maily.so/automata` (external, new tab)
  - Contact → `mailto:tmdqja75@gmail.com`

## Header component

New file: `src/components/site-header.tsx` (`"use client"`).

- Rendered once in `src/app/layout.tsx`, as a sibling **before**
  `<PageTransition>` inside `<body>` — so it stays mounted across route
  changes instead of fading in/out with page content on navigation.
- Fixed, full width, `top-0`, `z-10`. `z-10` is chosen deliberately: it sits
  below the intercepted project-detail modal's overlay (`z-20`+ in
  `project-detail-overlay.tsx`), so when a project modal opens, its backdrop
  naturally covers the header instead of the header poking through on top of
  it. No pathname-based show/hide logic needed.
- Adaptive theme, matching the pattern already used by the projects/blog
  "← Back" buttons: `bg-zinc-50/80 dark:bg-black/80`, `backdrop-blur`, a
  thin bottom border (`border-b border-black/5 dark:border-white/10`).
- Nav items reuse `TextRoll` exactly as the current home page does, sized
  down for a nav bar (roughly `text-sm`/`text-base font-semibold uppercase
  tracking-tight` instead of the hero-scale `text-4xl`/`text-5xl`), laid out
  horizontally and centered, with `flex-wrap` so the row shrinks/wraps
  gracefully on narrow viewports instead of collapsing into a hamburger
  menu.
- Internal items (About, Projects, Blog) use `TransitionLink`; external
  (Newsletter) uses a plain `<a target="_blank" rel="noopener noreferrer">`;
  Contact uses a plain `<a href="mailto:...">` — same link-type branching
  the current `src/app/page.tsx` already does, just carried into the new
  component.
- No active-page highlighting. Matches the current site's minimal style;
  easy to add later if wanted.

## Cleanup of existing per-page navigation

- `src/app/projects/page.tsx` and `src/app/blog/page.tsx`: remove the fixed
  `"← Back"` pill (top-level list pages) — redundant with the header now
  covering Home/About navigation. Existing `pt-24` top padding on the inner
  content div is kept as header clearance.
- New home page (moved-in About content): remove the `"← 홈으로"` footer
  link (redundant with header). Keep the floating bottom CTA cluster
  (→ `/projects`, → `/blog`) and the floating side arrow (→ `/projects`) —
  those are in-page scroll/wayfinding affordances, not top-level nav, and
  stay as-is.
- `src/app/blog/[slug]/page.tsx` and `src/app/projects/[slug]/page.tsx`:
  keep their own `"← Back"` link (returns to the list, not home — this is
  contextual navigation, not global nav, and is out of scope for the
  header). Shift its position from `top-6` to roughly `top-20` so it clears
  the new fixed header instead of visually colliding with it.
- `src/components/projects/project-detail-overlay.tsx`: no changes. Its own
  chrome (`z-20`–`z-30`) already sits above the header's `z-10`.

## Testing / verification

No test framework is configured for this project. Verify manually with
`npm run dev`:

1. Visiting `/` shows the former About content (hero, timeline, tech stack,
   connect section) with the header on top.
2. Visiting `/about` redirects to `/`.
3. The header appears identically on `/`, `/projects`, `/blog`, a blog
   detail page, and a project detail page.
4. Each of the 5 header links works: About/Projects/Blog navigate
   in-app (with the existing fade transition), Newsletter opens
   `maily.so` in a new tab, Contact opens the mail client.
5. Header is legible in both system light and dark mode, on both the
   always-dark home page and the light/dark-toggling Projects/Blog pages.
6. Opening a project card's modal still works, and the header doesn't
   visually poke through the modal's backdrop.
7. Blog/project detail page "← Back" buttons no longer collide with the
   header.
8. `npx tsc --noEmit` and `npm run lint` pass.
