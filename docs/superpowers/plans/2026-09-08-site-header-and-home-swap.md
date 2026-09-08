# Site Header + Home/About Swap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the About page content the site's home page (`/`), and add a persistent 5-item header (About/Projects/Blog/Newsletter/Contact) to every page, reusing the existing `TextRoll` hover animation.

**Architecture:** A new `SiteHeader` client component renders once in the root layout (outside the page-transition wrapper, so it never remounts on navigation) and owns the 5-item nav data that currently lives in `src/app/page.tsx`. The current home page's full-screen list is deleted; About's page content moves from `/about` to `/`; `/about` becomes a permanent redirect to `/`. Per-page "← Back to home" buttons on the top-level list pages are removed as redundant; per-page "← Back to list" buttons on detail pages are kept but repositioned to clear the new fixed header.

**Tech Stack:** Next.js 16.2.11 (App Router), React 19, TypeScript, Tailwind CSS v4, `motion` for the existing `TextRoll` animation.

**Spec:** `docs/superpowers/specs/2026-09-08-site-header-and-home-swap-design.md`

## Global Constraints

- This is not the Next.js you know — breaking changes vs. training data are possible; the `permanentRedirect` API used in Task 4 was confirmed against `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/permanentRedirect.md` for this exact version (16.2.11).
- No test framework is configured in this repo. Every task's verification step is `npx tsc --noEmit` (and `npm run lint` where noted) plus the manual dev-server check described in the task — not an automated test file.
- Path alias `@/*` → `src/*`. Use it for all internal imports.
- Use `TransitionLink` (`@/components/ui/transition-link`) for internal navigation, never `next/link` — it drives the fade transition.
- Ink `#171717` is the only primary/dark color (no pure black/white outside the documented dark-mode pairs).
- The header must render at `z-10` — this is deliberately *below* the project-detail modal's overlay (`z-20`–`z-30` in `src/components/projects/project-detail-overlay.tsx`), so the modal's backdrop naturally covers the header without extra show/hide logic.
- A dev server may already be running on port 3001 — check before starting another (`lsof -i :3001` or similar); Next refuses a second instance.

---

## File Structure

- **Create** `src/components/site-header.tsx` — the new persistent header (nav data + rendering).
- **Modify** `src/app/layout.tsx` — mount `SiteHeader` in the root layout.
- **Modify** `src/app/page.tsx` — replaced wholesale: old nav-list content deleted, About's page content moves in (via `git mv` from `src/app/about/page.tsx`), function renamed `About` → `Home`, footer's self-referential "← 홈으로" link removed.
- **Create** `src/app/about/page.tsx` — new file (the original was moved out in the step above): a permanent redirect to `/`.
- **Modify** `src/app/projects/page.tsx` — remove the fixed "← Back" button.
- **Modify** `src/app/blog/page.tsx` — remove the fixed "← Back" button.
- **Modify** `src/app/blog/[slug]/page.tsx` — reposition "← Back" from `top-6` to `top-20`.
- **Modify** `src/app/projects/[slug]/page.tsx` — reposition "← Back" from `top-6` to `top-20`.

---

### Task 1: Create the SiteHeader component

**Files:**
- Create: `src/components/site-header.tsx`

**Interfaces:**
- Consumes: `TextRoll` (`@/components/ui/text-roll`, default export, props `{ children: string; className?: string; center?: boolean }`), `TransitionLink` (`@/components/ui/transition-link`, default export, props `{ href: string; children: React.ReactNode; className?: string }`).
- Produces: `SiteHeader` (`@/components/site-header`, default export, no props) — consumed by Task 2.

- [ ] **Step 1: Create the component**

```tsx
// src/components/site-header.tsx
"use client"

import TextRoll from "@/components/ui/text-roll"
import TransitionLink from "@/components/ui/transition-link"

const navigationItems: {
  name: string
  href?: string
  externalHref?: string
  emailHref?: string
}[] = [
  { name: "About", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Newsletter", externalHref: "https://maily.so/automata" },
  { name: "Contact", emailHref: "mailto:tmdqja75@gmail.com" },
]

const navItemClassName =
  "text-sm font-semibold tracking-[-0.02em] uppercase transition-colors sm:text-base"

export default function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-10 border-b border-black/5 bg-zinc-50/80 backdrop-blur dark:border-white/10 dark:bg-black/80">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-6 py-3">
        {navigationItems.map((item) => (
          <div key={item.name} className="flex items-start">
            {item.href ? (
              <TransitionLink href={item.href}>
                <TextRoll className={navItemClassName}>{item.name}</TextRoll>
              </TransitionLink>
            ) : item.externalHref ? (
              <a
                href={item.externalHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                <TextRoll className={navItemClassName}>{item.name}</TextRoll>
              </a>
            ) : (
              <a href={item.emailHref}>
                <TextRoll className={navItemClassName}>{item.name}</TextRoll>
              </a>
            )}
          </div>
        ))}
      </nav>
    </header>
  )
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors mentioning `site-header.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/site-header.tsx
git commit -m "feat: add persistent SiteHeader component"
```

---

### Task 2: Mount SiteHeader in the root layout

**Files:**
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `SiteHeader` (`@/components/site-header`, default export, no props) from Task 1.

- [ ] **Step 1: Import and render SiteHeader before PageTransition**

In `src/app/layout.tsx`, add the import alongside the existing `PageTransition` import:

```tsx
import PageTransition from "@/components/ui/page-transition";
import SiteHeader from "@/components/site-header";
```

Then change the `<body>` block from:

```tsx
      <body className="flex min-h-full flex-col bg-zinc-50 dark:bg-black">
        <PageTransition>{children}</PageTransition>
      </body>
```

to:

```tsx
      <body className="flex min-h-full flex-col bg-zinc-50 dark:bg-black">
        <SiteHeader />
        <PageTransition>{children}</PageTransition>
      </body>
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Manual check — header renders on every page**

Start the dev server if one isn't already running on port 3001 (`npm run dev`), then visit `/`, `/projects`, and `/blog` in a browser. Confirm the header bar appears fixed at the top on all three (it will visually overlap existing page content until later tasks fix that — that's expected at this point).

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: mount SiteHeader in root layout"
```

---

### Task 3: Move About's content to the home page

**Files:**
- Modify: `src/app/page.tsx` (current nav-list content deleted, replaced by About's content)
- Move from: `src/app/about/page.tsx` (emptied by the move; recreated in Task 4)

**Interfaces:**
- Consumes: nothing new — this task only relocates and lightly edits existing JSX. All imports it uses (`motion`, `Image`, `react-icons`, `TransitionLink`, etc.) are unchanged from the current `src/app/about/page.tsx`.
- Produces: `Home` — the default export of `src/app/page.tsx` — is the App Router's root page for `/`. No other task imports it directly.

- [ ] **Step 1: Delete the old home page and move About's content into place**

```bash
rm src/app/page.tsx
git mv src/app/about/page.tsx src/app/page.tsx
```

- [ ] **Step 2: Rename the component from `About` to `Home`**

In the newly-moved `src/app/page.tsx`, find:

```tsx
export default function About() {
```

Replace with:

```tsx
export default function Home() {
```

- [ ] **Step 3: Remove the self-referential "← 홈으로" footer link**

In the same file, find the footer block:

```tsx
      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-12 md:px-12">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-xs text-white/30">
            © 2026 하승범. 에이전트를 만드는, 에이전트 엔지니어가 만든 페이지.
          </p>
          <TransitionLink
            href="/"
            className="font-mono text-xs text-white/50 transition-colors hover:text-white"
          >
            ← 홈으로
          </TransitionLink>
        </div>
      </footer>
```

Replace with (drops the link and the now-unnecessary `justify-between` two-column layout):

```tsx
      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-12 md:px-12">
        <div className="mx-auto w-full max-w-5xl">
          <p className="font-mono text-xs text-white/30">
            © 2026 하승범. 에이전트를 만드는, 에이전트 엔지니어가 만든 페이지.
          </p>
        </div>
      </footer>
```

- [ ] **Step 4: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors. (If `TransitionLink` shows an unused-import error, check the file — it's still used by the floating CTA cluster and floating arrow further up in the same file, so this should not happen; if it does, do not remove the import, re-check you only deleted the footer's `TransitionLink` usage.)

- [ ] **Step 5: Manual check — home page shows About's content**

With the dev server running, visit `/`. Confirm it shows the hero ("하승범" / "Ha Seungbeom"), timeline, tech stack, and connect sections that used to live at `/about`, with the new `SiteHeader` fixed on top.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: move About content to home page, drop old nav-list home"
```

---

### Task 4: Redirect /about to /

**Files:**
- Create: `src/app/about/page.tsx`

**Interfaces:**
- Consumes: `permanentRedirect` from `next/navigation` (confirmed API for Next 16.2.11 — see Global Constraints).
- Produces: nothing consumed by other tasks.

- [ ] **Step 1: Create the redirect page**

```tsx
// src/app/about/page.tsx
import { permanentRedirect } from "next/navigation"

export default function AboutPage() {
  permanentRedirect("/")
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Manual check — /about redirects**

With the dev server running, visit `/about` directly in the browser. Confirm it lands on `/` (check the browser's address bar updates to `/`).

- [ ] **Step 4: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat: redirect /about to the new home page"
```

---

### Task 5: Remove the redundant back button from /projects

**Files:**
- Modify: `src/app/projects/page.tsx`

- [ ] **Step 1: Remove the fixed "← Back" button**

In `src/app/projects/page.tsx`, find:

```tsx
    <main className="relative min-h-screen w-full bg-zinc-50 px-6 pb-24 dark:bg-black">
      <TransitionLink
        href="/"
        className="fixed top-6 left-6 z-10 flex h-7 items-center rounded-[6px] bg-[#171717] px-2 text-sm font-medium text-white dark:bg-white dark:text-[#171717]"
      >
        ← Back
      </TransitionLink>

      <div className="mx-auto max-w-5xl pt-24">
```

Replace with:

```tsx
    <main className="relative min-h-screen w-full bg-zinc-50 px-6 pb-24 dark:bg-black">
      <div className="mx-auto max-w-5xl pt-24">
```

The `pt-24` clearance is kept as-is — it now serves as clearance for the fixed `SiteHeader` instead of the removed back button.

- [ ] **Step 2: Remove the now-unused TransitionLink import**

Unlike `blog/page.tsx`, `src/app/projects/page.tsx` only used `TransitionLink` for the back button just removed (project cards use it internally via the separate `ProjectCard` component, not directly in this file). Delete the now-unused import line:

```tsx
import TransitionLink from "@/components/ui/transition-link"
```

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors (specifically no unused-import lint/type issue).

- [ ] **Step 4: Manual check**

Visit `/projects`. Confirm no floating "← Back" pill remains, the header is visible and not overlapped by page content, and category filter buttons + project grid still work.

- [ ] **Step 5: Commit**

```bash
git add src/app/projects/page.tsx
git commit -m "refactor: drop redundant back-to-home button on /projects"
```

---

### Task 6: Remove the redundant back button from /blog

**Files:**
- Modify: `src/app/blog/page.tsx`

- [ ] **Step 1: Remove the fixed "← Back" button**

In `src/app/blog/page.tsx`, find:

```tsx
    <main className="relative min-h-screen w-full bg-zinc-50 px-6 pb-24 dark:bg-black">
      <TransitionLink
        href="/"
        className="fixed top-6 left-6 z-10 flex h-7 items-center rounded-[6px] bg-[#171717] px-2 text-sm font-medium text-white dark:bg-white dark:text-[#171717]"
      >
        ← Back
      </TransitionLink>

      <div className="mx-auto max-w-5xl pt-24">
```

Replace with:

```tsx
    <main className="relative min-h-screen w-full bg-zinc-50 px-6 pb-24 dark:bg-black">
      <div className="mx-auto max-w-5xl pt-24">
```

`TransitionLink` is still used further down in this file for each post link, so keep its import.

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Manual check**

Visit `/blog`. Confirm no floating "← Back" pill remains, the header is visible and not overlapped, and the post list still links out correctly.

- [ ] **Step 4: Commit**

```bash
git add src/app/blog/page.tsx
git commit -m "refactor: drop redundant back-to-home button on /blog"
```

---

### Task 7: Reposition the back button on the blog detail page

**Files:**
- Modify: `src/app/blog/[slug]/page.tsx`

- [ ] **Step 1: Shift the "← Back" button below the header**

In `src/app/blog/[slug]/page.tsx`, find:

```tsx
      <TransitionLink
        href="/blog"
        className="fixed top-6 left-6 z-10 flex h-7 items-center rounded-[6px] bg-[#171717] px-2 text-sm font-medium text-white dark:bg-white dark:text-[#171717]"
      >
        ← Back
      </TransitionLink>
```

Replace with:

```tsx
      <TransitionLink
        href="/blog"
        className="fixed top-20 left-6 z-10 flex h-7 items-center rounded-[6px] bg-[#171717] px-2 text-sm font-medium text-white dark:bg-white dark:text-[#171717]"
      >
        ← Back
      </TransitionLink>
```

(Only `top-6` → `top-20` changes; this button still returns to `/blog`, not home, so it is kept, just moved to clear the fixed header.)

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Manual check**

Visit any post at `/blog/<slug>`. Confirm the "← Back" pill now sits clearly below the header bar with no visual overlap, and still navigates back to `/blog` when clicked.

- [ ] **Step 4: Commit**

```bash
git add "src/app/blog/[slug]/page.tsx"
git commit -m "fix: reposition blog detail back-button below site header"
```

---

### Task 8: Reposition the back button on the project detail page

**Files:**
- Modify: `src/app/projects/[slug]/page.tsx`

- [ ] **Step 1: Shift the "← Back" button below the header**

In `src/app/projects/[slug]/page.tsx`, find:

```tsx
      <TransitionLink
        href="/projects"
        className="fixed top-6 left-6 z-10 flex h-7 items-center rounded-[6px] bg-[#171717] px-2 text-sm font-medium text-white dark:bg-white dark:text-[#171717]"
      >
        ← Back
      </TransitionLink>
```

Replace with:

```tsx
      <TransitionLink
        href="/projects"
        className="fixed top-20 left-6 z-10 flex h-7 items-center rounded-[6px] bg-[#171717] px-2 text-sm font-medium text-white dark:bg-white dark:text-[#171717]"
      >
        ← Back
      </TransitionLink>
```

(Only `top-6` → `top-20` changes; this button still returns to `/projects`, not home, so it is kept, just moved to clear the fixed header.)

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Manual check**

Visit any project at `/projects/<slug>` directly (full-page route, not the modal). Confirm the "← Back" pill sits below the header with no overlap, and still navigates back to `/projects`.

- [ ] **Step 4: Commit**

```bash
git add "src/app/projects/[slug]/page.tsx"
git commit -m "fix: reposition project detail back-button below site header"
```

---

### Task 9: Full verification pass

This task has no code changes — it exercises the combined behavior that no single earlier task fully covers alone (the project modal's z-index relationship with the header, light/dark legibility, and lint).

- [ ] **Step 1: Type-check and lint the whole project**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 2: Manual walkthrough with the dev server running**

1. Visit `/`. Confirm it shows the former About content with the header on top, and clicking each of the 5 header items works: About stays on `/`, Projects navigates to `/projects`, Blog navigates to `/blog`, Newsletter opens `https://maily.so/automata` in a new tab, Contact opens the mail client addressed to `tmdqja75@gmail.com`.
2. Visit `/about` directly and confirm it redirects to `/`.
3. From `/projects`, click a project card to open the modal overlay. Confirm the modal's backdrop fully covers the header (no header bar visible through or above the modal), and closing the modal (Escape or backdrop click) returns cleanly to the grid with the header reappearing on top.
4. Visit a project's full detail page directly (e.g. `/projects/<slug>` typed in the address bar) and a blog post directly (e.g. `/blog/<slug>`). Confirm the header is present and the repositioned "← Back" pill doesn't overlap it.
5. Toggle the OS/browser between light and dark mode (or use devtools' rendering emulation) and confirm the header text stays legible against its background on both `/` (always-dark page) and `/projects` or `/blog` (light/dark-toggling pages).

- [ ] **Step 3: Commit (only if Step 1 or Step 2 required fixes)**

If everything already passed with no changes, skip this step. Otherwise:

```bash
git add -A
git commit -m "fix: address issues found in full verification pass"
```
