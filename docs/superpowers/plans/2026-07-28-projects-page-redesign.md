# Projects Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the three infinite-scroll carousels on `/projects` with a uniform filterable grid and a shared-element detail view (real per-project URL, prev/next navigation, optional interactive AWS architecture diagram), per `docs/superpowers/specs/2026-07-28-projects-page-redesign-design.md`.

**Architecture:** Next.js App Router intercepting + parallel routes (`@modal` slot) so a soft-nav click renders the detail as an overlay on the still-mounted grid (enabling a `motion` `layoutId` shared-element morph), while a hard-nav/refresh renders the same content as a standalone `[slug]` page. Filter state lives in the `?category=` URL param. Project data is a single typed array in `data.ts` shared by the grid and both detail routes.

**Tech Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4, `motion` (already installed, `^12.42.2`).

## Global Constraints

- No test framework is configured in this repo — every task's verification step is a manual dev-server check, not an automated test. Do not introduce Jest/Playwright/etc. as a side effect of this feature.
- Ink `#171717` is the only primary/dark color (DESIGN.md) — use it for active filter chips, close/back buttons, focus rings. Never introduce a separate brand accent color.
- Geist via `next/font`, display weight caps at 600, aggressive negative letter-spacing on display sizes (DESIGN.md).
- Spacing on a 4px base; radii from the existing `rounded` token scale (6px in-app buttons, 8-12px cards) (DESIGN.md).
- Placeholder images stay plain CSS `background-image` with `picsum.photos` — `next/image` remotePatterns is not configured; don't mix approaches (AGENTS.md).
- Use `TransitionLink` (`src/components/ui/transition-link.tsx`) for any navigation that should trigger the whole-page fade (e.g. the "← Back" link) — but note the grid→detail soft-navigation in this feature does **not** use `TransitionLink`, since it needs the intercepted-route morph instead of a full-page fade (see Task 3).
- Components needing interactivity are `"use client"` from the start (AGENTS.md convention).
- `cn()` from `src/lib/utils.ts` for conditional classes.
- Read the relevant guide under `node_modules/next/dist/docs/` before writing route-convention code (intercepting routes, parallel routes) — this Next version has confirmed breaking changes vs. training data (see Task 4).
- Real per-project copy (descriptions, metrics, diagram content) is out of scope — use clearly-labeled placeholder content; the user will fill in real copy later.

---

### Task 1: Project data model

**Files:**
- Create: `src/app/projects/data.ts`

**Interfaces:**
- Produces: `Project`, `ProjectLink`, `ProjectMetric`, `ProjectDiagram`, `DiagramNode`, `DiagramEdge` types, and `projects: Project[]`, `categories: string[]` (derived), all exported from `src/app/projects/data.ts`. Every later task imports project data from here — no task should hand-roll a competing shape.

- [ ] **Step 1: Write `data.ts` with types and the full project array**

```ts
// src/app/projects/data.ts

export type ProjectLink = { label: string; href: string }

export type DiagramNode = {
  id: string
  service: string // AWS service key — see src/components/projects/aws-icons/registry.ts (Task 10)
  label: string
  detail: string
  x: number // 0-100, percentage position within the diagram canvas
  y: number
}

export type DiagramEdge = { from: string; to: string }

export type ProjectDiagram = {
  nodes: DiagramNode[]
  edges: DiagramEdge[]
}

export type ProjectMetric = { value: string; label: string }

export type Project = {
  slug: string
  title: string
  subtitle: string
  category: "MLOps" | "AI Agent" | "Side Project"
  image: string
  description: string
  techStack: string[]
  role?: string
  timeframe?: string
  links?: ProjectLink[]
  metrics?: ProjectMetric[]
  diagram?: ProjectDiagram
}

export const projects: Project[] = [
  {
    slug: "model-registry",
    title: "Model Registry",
    subtitle: "Versioned model lifecycle management",
    category: "MLOps",
    image: "https://picsum.photos/seed/mlops1/640/400",
    description:
      "Placeholder description: a centralized registry for tracking model versions, lineage, and promotion status across training and serving environments.",
    techStack: ["Python", "MLflow", "PostgreSQL", "Docker"],
    role: "Sole engineer",
    timeframe: "2025",
    links: [{ label: "Repository", href: "#" }],
    metrics: [
      { value: "3x", label: "faster rollback" },
      { value: "40%", label: "fewer promotion errors" },
    ],
    diagram: {
      nodes: [
        { id: "api", service: "api-gateway", label: "API Gateway", detail: "Receives registry read/write requests.", x: 15, y: 50 },
        { id: "lambda", service: "lambda", label: "Registry Service", detail: "Validates and persists model version metadata.", x: 50, y: 50 },
        { id: "db", service: "rds", label: "PostgreSQL", detail: "Stores model version lineage and promotion status.", x: 85, y: 50 },
      ],
      edges: [
        { from: "api", to: "lambda" },
        { from: "lambda", to: "db" },
      ],
    },
  },
  {
    slug: "feature-store",
    title: "Feature Store",
    subtitle: "Low-latency feature serving",
    category: "MLOps",
    image: "https://picsum.photos/seed/mlops2/640/400",
    description:
      "Placeholder description: a low-latency online feature store backing real-time inference, with an offline store for training-time consistency.",
    techStack: ["Python", "Redis", "DynamoDB"],
    role: "Sole engineer",
    timeframe: "2025",
  },
  {
    slug: "training-pipeline",
    title: "Training Pipeline",
    subtitle: "Distributed training orchestration",
    category: "MLOps",
    image: "https://picsum.photos/seed/mlops3/640/400",
    description:
      "Placeholder description: orchestrates distributed training jobs across a GPU cluster, with automatic checkpointing and failure recovery.",
    techStack: ["Python", "Kubernetes", "PyTorch"],
    metrics: [{ value: "2.5x", label: "training throughput" }],
  },
  {
    slug: "research-agent",
    title: "Research Agent",
    subtitle: "Autonomous literature review",
    category: "AI Agent",
    image: "https://picsum.photos/seed/agent1/640/400",
    description:
      "Placeholder description: an autonomous agent that searches, reads, and summarizes academic literature against a research question.",
    techStack: ["TypeScript", "LLM tool-use", "Vector search"],
    role: "Sole engineer",
    timeframe: "2026",
    links: [{ label: "Repository", href: "#" }, { label: "Demo", href: "#" }],
  },
  {
    slug: "code-reviewer",
    title: "Code Reviewer",
    subtitle: "LLM-powered PR analysis",
    category: "AI Agent",
    image: "https://picsum.photos/seed/agent2/640/400",
    description:
      "Placeholder description: reviews pull requests for correctness and style issues, posting inline comments via the GitHub API.",
    techStack: ["TypeScript", "GitHub API", "LLM tool-use"],
    metrics: [
      { value: "150+", label: "PRs reviewed" },
      { value: "22%", label: "fewer review-cycle iterations" },
    ],
    diagram: {
      nodes: [
        { id: "webhook", service: "api-gateway", label: "Webhook", detail: "Receives GitHub PR events.", x: 10, y: 50 },
        { id: "queue", service: "sqs", label: "Queue", detail: "Buffers incoming review requests.", x: 35, y: 50 },
        { id: "worker", service: "lambda", label: "Review Worker", detail: "Runs LLM analysis and posts comments.", x: 62, y: 50 },
        { id: "storage", service: "s3", label: "Diff Cache", detail: "Caches PR diffs for reuse across review passes.", x: 88, y: 50 },
      ],
      edges: [
        { from: "webhook", to: "queue" },
        { from: "queue", to: "worker" },
        { from: "worker", to: "storage" },
      ],
    },
  },
  {
    slug: "tool-router",
    title: "Tool Router",
    subtitle: "Dynamic tool selection layer",
    category: "AI Agent",
    image: "https://picsum.photos/seed/agent3/640/400",
    description:
      "Placeholder description: routes an agent's next action to the correct tool implementation based on intent classification.",
    techStack: ["TypeScript", "LLM tool-use"],
  },
  {
    slug: "portfolio-blog",
    title: "Portfolio Blog",
    subtitle: "This site, built with Next.js",
    category: "Side Project",
    image: "https://picsum.photos/seed/side1/640/400",
    description:
      "Placeholder description: this site — a single-user portfolio and blog built with Next.js App Router, Tailwind, and motion.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS"],
    links: [{ label: "Repository", href: "#" }],
  },
  {
    slug: "habit-tracker",
    title: "Habit Tracker",
    subtitle: "Minimal daily streak app",
    category: "Side Project",
    image: "https://picsum.photos/seed/side2/640/400",
    description:
      "Placeholder description: a minimal daily habit tracker focused on streak visibility and zero-friction logging.",
    techStack: ["React Native"],
  },
  {
    slug: "recipe-box",
    title: "Recipe Box",
    subtitle: "Family recipes, searchable",
    category: "Side Project",
    image: "https://picsum.photos/seed/side3/640/400",
    description:
      "Placeholder description: a searchable archive of family recipes with unit conversion and serving-size scaling.",
    techStack: ["Next.js", "SQLite"],
  },
]

export const categories = Array.from(new Set(projects.map((p) => p.category)))

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug)
}

export function getCategoryProjects(category: string | null) {
  if (!category || !categories.includes(category)) return projects
  return projects.filter((p) => p.category === category)
}
```

- [ ] **Step 2: Verify with `npx tsc --noEmit`**

Run: `npx tsc --noEmit`
Expected: no errors referencing `data.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/app/projects/data.ts
git commit -m "feat(projects): add structured project data model"
```

---

### Task 2: Uniform grid + URL-based category filter

**Files:**
- Modify: `src/app/projects/page.tsx` (full rewrite — carousel logic removed)

**Interfaces:**
- Consumes: `projects`, `categories`, `getCategoryProjects` from `./data.ts` (Task 1).
- Produces: the grid renders plain `<div>` placeholders for cards in this task — `ProjectCard` (Task 3) replaces the placeholder markup, so this task's card markup is intentionally temporary but must still be visually correct (image, title, subtitle) since it's what ships if the branch stops here.

- [ ] **Step 1: Rewrite `page.tsx` with grid + filter chips reading/writing `?category=`**

```tsx
// src/app/projects/page.tsx
"use client"

import { useRouter, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"
import TransitionLink from "@/components/ui/transition-link"
import { categories, getCategoryProjects } from "./data"

export default function ProjectsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get("category")
  const visibleProjects = getCategoryProjects(activeCategory)

  const setCategory = (category: string | null) => {
    const params = new URLSearchParams(searchParams)
    if (category) params.set("category", category)
    else params.delete("category")
    router.push(`/projects${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false })
  }

  return (
    <main className="relative min-h-screen w-full bg-zinc-50 px-6 pb-24 dark:bg-black">
      <TransitionLink
        href="/"
        className="fixed top-6 left-6 z-10 flex h-7 items-center rounded-[6px] bg-[#171717] px-2 text-sm font-medium text-white dark:bg-white dark:text-[#171717]"
      >
        ← Back
      </TransitionLink>

      <div className="mx-auto max-w-5xl pt-24">
        <h1
          className="px-0 pb-8 font-sans text-2xl font-semibold text-[#171717] dark:text-white"
          style={{ letterSpacing: "-0.96px", lineHeight: "32px" }}
        >
          Projects
        </h1>

        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setCategory(null)}
            className={cn(
              "cursor-pointer rounded-[6px] px-3 py-1.5 text-sm font-medium transition-colors",
              !activeCategory
                ? "bg-[#171717] text-white dark:bg-white dark:text-[#171717]"
                : "bg-zinc-200 text-[#171717] hover:bg-zinc-300 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
            )}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setCategory(category)}
              className={cn(
                "cursor-pointer rounded-[6px] px-3 py-1.5 text-sm font-medium transition-colors",
                activeCategory === category
                  ? "bg-[#171717] text-white dark:bg-white dark:text-[#171717]"
                  : "bg-zinc-200 text-[#171717] hover:bg-zinc-300 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((project) => (
            <div
              key={project.slug}
              className="relative aspect-[4/5] overflow-hidden rounded-xl bg-cover bg-center"
              style={{ backgroundImage: `url(${project.image})` }}
            >
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4">
                <h3 className="text-base font-semibold text-white" style={{ letterSpacing: "-0.28px" }}>
                  {project.title}
                </h3>
                <p className="text-sm font-normal text-white/70" style={{ letterSpacing: "-0.28px" }}>
                  {project.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Manual verification**

Run: `npm run dev` (check port 3001 first per AGENTS.md), open `/projects`.
Expected: 9 cards in a uniform 3-column grid (desktop), filter chips narrow the set and update the URL (`?category=MLOps` etc.), "All" clears it. Resize to confirm 2-column at tablet, 1-column at mobile widths.

- [ ] **Step 3: Commit**

```bash
git add src/app/projects/page.tsx
git commit -m "feat(projects): replace carousel with uniform filterable grid"
```

---

### Task 3: `ProjectCard` component with shared-element `layoutId`

**Files:**
- Create: `src/components/projects/project-card.tsx`
- Modify: `src/app/projects/page.tsx` (swap inline card markup for `<ProjectCard>`)

**Interfaces:**
- Consumes: `Project` type from `src/app/projects/data.ts` (Task 1).
- Produces: `ProjectCard({ project, categoryParam }: { project: Project; categoryParam: string | null })` — a `motion.div`-based `Link` to `/projects/${project.slug}${categoryParam ? `?category=${categoryParam}` : ""}`, with `layoutId={`card-image-${project.slug}`}` on the image element and `layoutId={`card-title-${project.slug}`}` on the title. Task 6 (detail overlay) and Task 5 (detail content) must use these exact `layoutId` string patterns for the morph to connect.

- [ ] **Step 1: Write `project-card.tsx`**

```tsx
// src/components/projects/project-card.tsx
"use client"

import Link from "next/link"
import { motion } from "motion/react"

import type { Project } from "@/app/projects/data"

export function ProjectCard({
  project,
  categoryParam,
}: {
  project: Project
  categoryParam: string | null
}) {
  const href = `/projects/${project.slug}${categoryParam ? `?category=${categoryParam}` : ""}`

  return (
    <Link href={href} scroll={false} className="group block">
      <motion.div
        layoutId={`card-image-${project.slug}`}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.2 }}
        className="relative aspect-[4/5] overflow-hidden rounded-xl bg-cover bg-center shadow-sm"
        style={{ backgroundImage: `url(${project.image})` }}
      >
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4">
          <motion.h3
            layoutId={`card-title-${project.slug}`}
            className="text-base font-semibold text-white"
            style={{ letterSpacing: "-0.28px" }}
          >
            {project.title}
          </motion.h3>
          <p className="text-sm font-normal text-white/70" style={{ letterSpacing: "-0.28px" }}>
            {project.subtitle}
          </p>
          <div className="mt-2 flex flex-wrap gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {project.techStack.slice(0, 3).map((tech) => (
              <span key={tech} className="rounded-[6px] bg-white/20 px-2 py-0.5 text-xs text-white">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
```

- [ ] **Step 2: Swap the grid's inline card markup in `page.tsx`**

```tsx
// src/app/projects/page.tsx — replace the mapped <div> block with:
import { ProjectCard } from "@/components/projects/project-card"
// ...
{visibleProjects.map((project) => (
  <ProjectCard key={project.slug} project={project} categoryParam={activeCategory} />
))}
```

- [ ] **Step 3: Manual verification**

Run: `npm run dev`, open `/projects`.
Expected: cards render identically to Task 2 plus hover scale (1.03) and a tech-stack pill reveal on hover. Clicking a card navigates to `/projects/<slug>` (still a 404/blank at this point — Task 4 adds the route) — confirm no console errors from the `Link`/`layoutId` setup itself.

- [ ] **Step 4: Commit**

```bash
git add src/components/projects/project-card.tsx src/app/projects/page.tsx
git commit -m "feat(projects): extract ProjectCard with shared-element layoutId"
```

---

### Task 4: Route scaffolding — layout, parallel `@modal` slot, standalone `[slug]` page, not-found

**Files:**
- Create: `src/app/projects/layout.tsx`
- Create: `src/app/projects/@modal/default.tsx`
- Create: `src/app/projects/[slug]/page.tsx`
- Create: `src/app/projects/not-found.tsx`

**Interfaces:**
- Consumes: `getProject` from `./data.ts` (Task 1).
- Produces: a working `/projects/[slug]` standalone route (plain content, no shared-content component yet — Task 5 replaces the inline JSX here) and the `@modal` slot wiring that Task 6 depends on.

- [ ] **Step 1: Read the relevant Next.js docs before writing route-convention files**

Run: `cat node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/parallel-routes.md node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/intercepting-routes.md`
Confirm the `@modal` slot + `(.)[slug]` convention and the Next 16 `default.tsx` requirement (called out in `02-guides/upgrading/version-16.md`) match what's written below before proceeding — this project's Next version may have further deviations from what this plan assumes.

- [ ] **Step 2: Write `layout.tsx` to render the grid/children alongside the modal slot**

```tsx
// src/app/projects/layout.tsx
export default function ProjectsLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <>
      {children}
      {modal}
    </>
  )
}
```

- [ ] **Step 3: Write `@modal/default.tsx` (required in Next 16 or the build fails)**

```tsx
// src/app/projects/@modal/default.tsx
export default function Default() {
  return null
}
```

- [ ] **Step 4: Write the standalone `[slug]/page.tsx`**

```tsx
// src/app/projects/[slug]/page.tsx
import { notFound } from "next/navigation"

import TransitionLink from "@/components/ui/transition-link"
import { getProject } from "@/app/projects/data"

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  return (
    <main className="relative min-h-screen w-full bg-zinc-50 px-6 pb-24 dark:bg-black">
      <TransitionLink
        href="/projects"
        className="fixed top-6 left-6 z-10 flex h-7 items-center rounded-[6px] bg-[#171717] px-2 text-sm font-medium text-white dark:bg-white dark:text-[#171717]"
      >
        ← Back
      </TransitionLink>
      <div className="mx-auto max-w-3xl pt-24">
        <h1 className="text-2xl font-semibold text-[#171717] dark:text-white">{project.title}</h1>
        <p className="mt-2 text-[#4d4d4d] dark:text-zinc-400">{project.description}</p>
      </div>
    </main>
  )
}
```

- [ ] **Step 5: Write `not-found.tsx`**

```tsx
// src/app/projects/not-found.tsx
import TransitionLink from "@/components/ui/transition-link"

export default function NotFound() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-zinc-50 px-6 dark:bg-black">
      <p className="text-[#171717] dark:text-white">Project not found.</p>
      <TransitionLink
        href="/projects"
        className="flex h-7 items-center rounded-[6px] bg-[#171717] px-2 text-sm font-medium text-white dark:bg-white dark:text-[#171717]"
      >
        ← Back to projects
      </TransitionLink>
    </main>
  )
}
```

- [ ] **Step 6: Manual verification**

Run: `npm run dev`, open `/projects/model-registry` directly (typed URL / hard nav).
Expected: standalone detail page renders with title + description, no console errors about the `@modal` slot. Open `/projects/does-not-exist` — expect the `not-found.tsx` content. Confirm clicking a card from `/projects` now navigates successfully (still no overlay/morph yet — that's Task 6).

- [ ] **Step 7: Commit**

```bash
git add src/app/projects/layout.tsx src/app/projects/@modal src/app/projects/[slug] src/app/projects/not-found.tsx
git commit -m "feat(projects): scaffold parallel/intercepting route structure"
```

---

### Task 5: Shared `ProjectDetailContent` component

**Files:**
- Create: `src/components/projects/project-detail-content.tsx`
- Modify: `src/app/projects/[slug]/page.tsx` (use the new component instead of inline JSX)

**Interfaces:**
- Consumes: `Project` type from `data.ts`.
- Produces: `ProjectDetailContent({ project, titleLayoutId, imageLayoutId }: { project: Project; titleLayoutId?: string; imageLayoutId?: string })`. The `layoutId` props are optional so the standalone page (no morph, nothing to match against) can render the component without them, while Task 6's overlay passes the matching ids from Task 3. Renders `role`/`timeframe`, tech tags, metrics stat tiles, and links conditionally; the diagram slot is added in Task 10 (left as a typed no-op here so Task 10 only needs to fill in the `{project.diagram && ...}` branch).

- [ ] **Step 1: Write `project-detail-content.tsx`**

```tsx
// src/components/projects/project-detail-content.tsx
"use client"

import { motion } from "motion/react"

import type { Project } from "@/app/projects/data"

export function ProjectDetailContent({
  project,
  titleLayoutId,
  imageLayoutId,
}: {
  project: Project
  titleLayoutId?: string
  imageLayoutId?: string
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <motion.div
        layoutId={imageLayoutId}
        className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-cover bg-center"
        style={{ backgroundImage: `url(${project.image})` }}
      />

      <motion.h1
        layoutId={titleLayoutId}
        className="mt-6 text-2xl font-semibold text-[#171717] dark:text-white"
        style={{ letterSpacing: "-0.96px" }}
      >
        {project.title}
      </motion.h1>

      {(project.role || project.timeframe) && (
        <p className="mt-1 text-sm text-[#888888]">
          {[project.role, project.timeframe].filter(Boolean).join(" · ")}
        </p>
      )}

      <p className="mt-4 text-[#4d4d4d] dark:text-zinc-400">{project.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-[6px] bg-zinc-200 px-2 py-1 text-xs font-medium text-[#171717] dark:bg-zinc-800 dark:text-white"
          >
            {tech}
          </span>
        ))}
      </div>

      {project.metrics && (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {project.metrics.map((metric) => (
            <div key={metric.label} className="rounded-xl border border-[#ebebeb] p-4 dark:border-zinc-800">
              <div className="text-2xl font-semibold text-[#171717] dark:text-white">{metric.value}</div>
              <div className="text-sm text-[#888888]">{metric.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* project.diagram rendering added in Task 10 */}

      {project.links && (
        <div className="mt-8 flex flex-wrap gap-3">
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-[6px] bg-[#171717] px-3 py-1.5 text-sm font-medium text-white dark:bg-white dark:text-[#171717]"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Use it from the standalone page**

```tsx
// src/app/projects/[slug]/page.tsx — replace the <h1>/<p> block with:
import { ProjectDetailContent } from "@/components/projects/project-detail-content"
// ...
<div className="pt-24">
  <ProjectDetailContent project={project} />
</div>
```

- [ ] **Step 3: Manual verification**

Run: `npm run dev`, open `/projects/code-reviewer` (has metrics + links) and `/projects/tool-router` (has neither).
Expected: metrics grid and links row appear only for `code-reviewer`; no empty sections/placeholders render for `tool-router`.

- [ ] **Step 4: Commit**

```bash
git add src/components/projects/project-detail-content.tsx src/app/projects/[slug]/page.tsx
git commit -m "feat(projects): add shared ProjectDetailContent component"
```

---

### Task 6: Intercepted modal route + overlay chrome (scrim, close, focus trap)

**Files:**
- Create: `src/components/projects/project-detail-overlay.tsx`
- Create: `src/app/projects/@modal/(.)[slug]/page.tsx`

**Interfaces:**
- Consumes: `ProjectDetailContent` (Task 5), `getProject` (Task 1), `project-card.tsx`'s `layoutId` naming pattern (Task 3: `card-image-${slug}`, `card-title-${slug}`).
- Produces: `ProjectDetailOverlay({ project }: { project: Project })` — renders the scrim + panel + close button + focus trap, and passes `imageLayoutId={`card-image-${project.slug}`}` / `titleLayoutId={`card-title-${project.slug}`}` into `ProjectDetailContent` so the morph connects to the originating grid card. Task 9 (prev/next + rail) modifies this component to add its navigation UI.

- [ ] **Step 1: Write `project-detail-overlay.tsx`**

```tsx
// src/components/projects/project-detail-overlay.tsx
"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"

import type { Project } from "@/app/projects/data"
import { ProjectDetailContent } from "./project-detail-content"

export function ProjectDetailOverlay({ project }: { project: Project }) {
  const router = useRouter()
  const panelRef = useRef<HTMLDivElement>(null)

  const close = () => router.back()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    panelRef.current?.focus()
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-20 flex items-start justify-center overflow-y-auto bg-black/40 p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close()
        }}
      >
        <div
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          className="relative my-12 w-full max-w-3xl rounded-xl bg-white p-8 outline-none dark:bg-[#0a0a0a]"
        >
          <button
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 flex h-7 w-7 cursor-pointer items-center justify-center rounded-[6px] bg-zinc-200 text-[#171717] dark:bg-zinc-800 dark:text-white"
          >
            ✕
          </button>
          <ProjectDetailContent
            project={project}
            imageLayoutId={`card-image-${project.slug}`}
            titleLayoutId={`card-title-${project.slug}`}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
```

Note: this is a minimal focus-trap (focuses the panel on mount, closes on Esc) rather than a full cyclic Tab-trap — Task 12 hardens this to cyclically trap Tab/Shift+Tab within the panel per the spec's keyboard-navigation requirement.

- [ ] **Step 2: Write the intercepted route**

```tsx
// src/app/projects/@modal/(.)[slug]/page.tsx
import { notFound } from "next/navigation"

import { getProject } from "@/app/projects/data"
import { ProjectDetailOverlay } from "@/components/projects/project-detail-overlay"

export default async function InterceptedProjectModal({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  return <ProjectDetailOverlay project={project} />
}
```

- [ ] **Step 3: Manual verification**

Run: `npm run dev`, open `/projects`, click a card.
Expected: the detail renders as an overlay on top of the still-visible (dimmed) grid, URL updates to `/projects/<slug>`, clicking the scrim or the ✕ or pressing Esc closes it back to the grid. Then refresh the page while the overlay is open — expect it to render as the standalone full page (Task 4's `[slug]/page.tsx`) instead, confirming the intercept only applies to soft navigation.

- [ ] **Step 4: Commit**

```bash
git add src/components/projects/project-detail-overlay.tsx "src/app/projects/@modal/(.)[slug]"
git commit -m "feat(projects): add intercepted modal route with overlay chrome"
```

---

### Task 7: Shared-element morph tuning

**Files:**
- Modify: `src/components/projects/project-card.tsx`
- Modify: `src/components/projects/project-detail-content.tsx`

**Interfaces:**
- Consumes: existing `layoutId` wiring from Tasks 3, 5, 6 — no new props.
- Produces: no interface change; this task only tunes animation config (transition curve, sequencing) shared by both files.

- [ ] **Step 1: Add a shared spring transition to both `motion.div`/`motion.h3` elements carrying a `layoutId`**

In `project-card.tsx`, add to the image `motion.div` (in addition to the existing `whileHover`):

```tsx
transition={{ layout: { type: "spring", stiffness: 300, damping: 30 } }}
```

In `project-detail-content.tsx`, add the same `transition` prop to both the image `motion.div` and the title `motion.h1`.

- [ ] **Step 2: Stagger the non-shared detail content**

Wrap the content below the title in `project-detail-content.tsx` (role/timeframe through links) in a `motion.div` with a stagger, so it enters after the morph settles:

```tsx
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2, duration: 0.3, staggerChildren: 0.06 }}
>
  {/* role/timeframe through links, unchanged */}
</motion.div>
```

- [ ] **Step 3: Manual verification**

Run: `npm run dev`, open `/projects`, click several different cards.
Expected: the clicked card's image visibly animates (position/size) from its grid slot into the detail panel, title moves with it, and the rest of the detail content (tags, metrics, links) fades in ~200ms after the image settles rather than everything appearing simultaneously.

- [ ] **Step 4: Commit**

```bash
git add src/components/projects/project-card.tsx src/components/projects/project-detail-content.tsx
git commit -m "feat(projects): tune shared-element morph spring and content stagger"
```

---

### Task 8: Filter transition animation

**Files:**
- Modify: `src/app/projects/page.tsx`

**Interfaces:**
- Consumes: existing `visibleProjects` array.
- Produces: no interface change — wraps the existing grid map in `AnimatePresence`/`motion.div` per-card enter/exit.

- [ ] **Step 1: Wrap the grid in `AnimatePresence` and give each card enter/exit animation**

```tsx
// src/app/projects/page.tsx
import { AnimatePresence, motion } from "motion/react"
// ...
<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
  <AnimatePresence mode="popLayout">
    {visibleProjects.map((project, index) => (
      <motion.div
        key={project.slug}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2, delay: index * 0.04 }}
      >
        <ProjectCard project={project} categoryParam={activeCategory} />
      </motion.div>
    ))}
  </AnimatePresence>
</div>
```

Note: `ProjectCard`'s own `layoutId`-carrying `motion.div` is now nested inside this wrapper `motion.div` — this is fine, `motion` supports nested animated elements, but verify in Step 2 that the card's own hover/morph animations aren't fighting the wrapper's enter/exit.

- [ ] **Step 2: Manual verification**

Run: `npm run dev`, open `/projects`, click between filter chips repeatedly.
Expected: cards leaving the filtered set fade+shrink out, the remaining/new set staggers in left-to-right/top-to-bottom. No layout jump or flash of unstyled content. Click a card afterward to confirm the morph from Task 7 still works correctly with the added wrapper.

- [ ] **Step 3: Commit**

```bash
git add src/app/projects/page.tsx
git commit -m "feat(projects): animate grid on filter change"
```

---

### Task 9: Prev/next navigation + thumbnail rail

**Files:**
- Modify: `src/components/projects/project-detail-overlay.tsx`

**Interfaces:**
- Consumes: `getCategoryProjects` from `data.ts` (Task 1), `useSearchParams` for the active `?category=`.
- Produces: no new exported interface — adds internal navigation UI to the existing `ProjectDetailOverlay`.

- [ ] **Step 1: Compute the navigable set and add chevrons + rail**

```tsx
// src/components/projects/project-detail-overlay.tsx
"use client"

import { useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"

import type { Project } from "@/app/projects/data"
import { getCategoryProjects } from "@/app/projects/data"
import { ProjectDetailContent } from "./project-detail-content"

export function ProjectDetailOverlay({ project }: { project: Project }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get("category")
  const panelRef = useRef<HTMLDivElement>(null)

  const navigable = getCategoryProjects(activeCategory)
  const currentIndex = navigable.findIndex((p) => p.slug === project.slug)
  const prevProject = currentIndex > 0 ? navigable[currentIndex - 1] : null
  const nextProject = currentIndex < navigable.length - 1 ? navigable[currentIndex + 1] : null

  const close = () => router.back()

  const goTo = (slug: string) => {
    const qs = activeCategory ? `?category=${activeCategory}` : ""
    router.push(`/projects/${slug}${qs}`, { scroll: false })
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowLeft" && prevProject) goTo(prevProject.slug)
      if (e.key === "ArrowRight" && nextProject) goTo(nextProject.slug)
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevProject, nextProject])

  useEffect(() => {
    panelRef.current?.focus()
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-20 flex items-start justify-center overflow-y-auto bg-black/40 p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close()
        }}
      >
        {prevProject && (
          <button
            onClick={() => goTo(prevProject.slug)}
            aria-label="Previous project"
            className="fixed top-1/2 left-4 z-30 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-[#171717] shadow-md dark:bg-zinc-900 dark:text-white"
          >
            ←
          </button>
        )}
        {nextProject && (
          <button
            onClick={() => goTo(nextProject.slug)}
            aria-label="Next project"
            className="fixed top-1/2 right-4 z-30 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-[#171717] shadow-md dark:bg-zinc-900 dark:text-white"
          >
            →
          </button>
        )}

        <div
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          className="relative my-12 w-full max-w-3xl rounded-xl bg-white p-8 pb-24 outline-none dark:bg-[#0a0a0a]"
        >
          <button
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 flex h-7 w-7 cursor-pointer items-center justify-center rounded-[6px] bg-zinc-200 text-[#171717] dark:bg-zinc-800 dark:text-white"
          >
            ✕
          </button>
          <ProjectDetailContent
            project={project}
            imageLayoutId={`card-image-${project.slug}`}
            titleLayoutId={`card-title-${project.slug}`}
          />

          {navigable.length > 1 && (
            <div className="fixed inset-x-0 bottom-6 z-30 flex justify-center gap-2">
              {navigable.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => goTo(p.slug)}
                  aria-label={p.title}
                  className={`h-12 w-12 shrink-0 overflow-hidden rounded-[6px] bg-cover bg-center ring-2 transition-all ${
                    p.slug === project.slug ? "ring-[#171717] dark:ring-white" : "ring-transparent opacity-60"
                  }`}
                  style={{ backgroundImage: `url(${p.image})` }}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
```

- [ ] **Step 2: Manual verification**

Run: `npm run dev`, open `/projects?category=MLOps`, click into a project.
Expected: chevrons and rail only include the 3 MLOps projects; clicking → / ← or a rail thumbnail navigates and re-morphs; first/last project correctly hides the corresponding chevron; a category with only 1 project (none currently, but verify by temporarily filtering) hides both chevrons and the rail. Keyboard arrow keys also navigate.

- [ ] **Step 3: Commit**

```bash
git add src/components/projects/project-detail-overlay.tsx
git commit -m "feat(projects): add prev/next navigation and thumbnail rail"
```

---

### Task 10: AWS icon set + diagram rendering (nodes, edges, tooltip)

**Files:**
- Create: `src/components/projects/aws-icons/registry.tsx`
- Create: `src/components/projects/aws-icons/*.tsx` (one file per icon used by the seed data: `lambda.tsx`, `api-gateway.tsx`, `rds.tsx`, `sqs.tsx`, `s3.tsx` — covering every `service` key used in `data.ts`)
- Create: `src/components/projects/aws-diagram.tsx`
- Modify: `src/components/projects/project-detail-content.tsx` (fill in the `{project.diagram && ...}` slot left in Task 5)

**Interfaces:**
- Consumes: `ProjectDiagram`, `DiagramNode`, `DiagramEdge` types from `data.ts`.
- Produces: `AWS_ICONS: Record<string, React.ComponentType<{ className?: string }>>` from `registry.tsx` (keyed by the same `service` strings used in `data.ts`'s diagram nodes — every `service` value in `data.ts` must have a matching key here or the diagram silently renders no icon); `AwsDiagram({ diagram: ProjectDiagram })` component. Task 11 (flow animation) modifies `aws-diagram.tsx` to add the animated edge glow — it does not change this task's node/edge/tooltip structure.

- [ ] **Step 1: Source and add the 5 AWS Architecture Icons used in the seed data**

Download the official AWS Architecture Icons (usage permitted under AWS's icon guidelines) for: Lambda, API Gateway, RDS, SQS, S3. Save each as a React component wrapping the icon's SVG markup, e.g.:

```tsx
// src/components/projects/aws-icons/lambda.tsx
export function LambdaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
      {/* AWS Lambda architecture icon SVG paths */}
    </svg>
  )
}
```

Repeat for `api-gateway.tsx` (`ApiGatewayIcon`), `rds.tsx` (`RdsIcon`), `sqs.tsx` (`SqsIcon`), `s3.tsx` (`S3Icon`).

- [ ] **Step 2: Write the registry mapping `service` keys to icon components**

```tsx
// src/components/projects/aws-icons/registry.tsx
import { LambdaIcon } from "./lambda"
import { ApiGatewayIcon } from "./api-gateway"
import { RdsIcon } from "./rds"
import { SqsIcon } from "./sqs"
import { S3Icon } from "./s3"

export const AWS_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  lambda: LambdaIcon,
  "api-gateway": ApiGatewayIcon,
  rds: RdsIcon,
  sqs: SqsIcon,
  s3: S3Icon,
}
```

- [ ] **Step 3: Write `aws-diagram.tsx` with nodes, orthogonal edges, and hover/tap tooltip**

```tsx
// src/components/projects/aws-diagram.tsx
"use client"

import { useState } from "react"

import type { ProjectDiagram } from "@/app/projects/data"
import { AWS_ICONS } from "./aws-icons/registry"

export function AwsDiagram({ diagram }: { diagram: ProjectDiagram }) {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null)
  const activeNode = diagram.nodes.find((n) => n.id === activeNodeId)

  const nodeById = Object.fromEntries(diagram.nodes.map((n) => [n.id, n]))

  return (
    <div className="relative mt-8">
      <h2 className="mb-3 text-sm font-semibold text-[#171717] dark:text-white">Architecture</h2>
      <svg
        viewBox="0 0 100 100"
        className="w-full rounded-xl border border-[#ebebeb] bg-white dark:border-zinc-800 dark:bg-zinc-950"
        onClick={(e) => {
          if (e.target === e.currentTarget) setActiveNodeId(null)
        }}
      >
        {diagram.edges.map((edge, i) => {
          const from = nodeById[edge.from]
          const to = nodeById[edge.to]
          if (!from || !to) return null
          const midX = (from.x + to.x) / 2
          return (
            <path
              key={i}
              d={`M ${from.x} ${from.y} L ${midX} ${from.y} L ${midX} ${to.y} L ${to.x} ${to.y}`}
              fill="none"
              stroke="#a1a1a1"
              strokeWidth={0.5}
            />
          )
        })}

        {diagram.nodes.map((node) => {
          const Icon = AWS_ICONS[node.service]
          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              onMouseEnter={() => setActiveNodeId(node.id)}
              onMouseLeave={() => setActiveNodeId((current) => (current === node.id ? null : current))}
              onClick={(e) => {
                e.stopPropagation()
                setActiveNodeId((current) => (current === node.id ? null : node.id))
              }}
              className="cursor-pointer"
            >
              <rect x={-6} y={-6} width={12} height={12} rx={2} fill="white" stroke="#ebebeb" />
              {Icon && <Icon className="h-3 w-3" />}
              <text y={10} textAnchor="middle" fontSize={2.5} fill="#4d4d4d">
                {node.label}
              </text>
            </g>
          )
        })}
      </svg>

      {activeNode && (
        <div
          className="pointer-events-none absolute z-10 max-w-56 rounded-[6px] bg-[#171717] px-3 py-2 text-xs text-white shadow-md"
          style={{
            left: `${Math.min(Math.max(activeNode.x, 15), 85)}%`,
            top: `${Math.min(activeNode.y + 12, 85)}%`,
            transform: "translateX(-50%)",
          }}
        >
          {activeNode.detail}
        </div>
      )}
    </div>
  )
}
```

Note: the `left`/`top` clamping (`Math.min(Math.max(...))`) is a first pass at the spec's "flip near edges" requirement — it clamps position rather than fully flipping side, which is sufficient to avoid off-canvas rendering; revisit only if manual testing in Step 5 shows real clipping.

- [ ] **Step 4: Wire it into `ProjectDetailContent`**

```tsx
// src/components/projects/project-detail-content.tsx
import { AwsDiagram } from "./aws-diagram"
// ...
{project.diagram && <AwsDiagram diagram={project.diagram} />}
```

- [ ] **Step 5: Manual verification**

Run: `npm run dev`, open `/projects/model-registry` and `/projects/code-reviewer` (both have diagrams), and `/projects/tool-router` (no diagram).
Expected: diagram section renders with correctly-positioned icons/labels and orthogonal connector lines for the two projects that have one; no diagram section at all for `tool-router`. Hovering (desktop, use browser dev tools device toolbar to also check tap on mobile emulation) a node shows its tooltip with `detail` text, positioned without clipping off the card; clicking empty canvas space dismisses it.

- [ ] **Step 6: Commit**

```bash
git add src/components/projects/aws-icons src/components/projects/aws-diagram.tsx src/components/projects/project-detail-content.tsx
git commit -m "feat(projects): add interactive AWS architecture diagram"
```

---

### Task 11: Diagram flow animation (in-view gated, reduced-motion aware)

**Files:**
- Modify: `src/components/projects/aws-diagram.tsx`

**Interfaces:**
- Consumes: `motion`'s `useInView` and `useReducedMotion` hooks.
- Produces: no new exported interface — adds an animated glow element per edge, gated by visibility and motion preference.

- [ ] **Step 1: Add in-view + reduced-motion gated flow glow along each edge**

```tsx
// src/components/projects/aws-diagram.tsx
"use client"

import { useRef, useState } from "react"
import { motion, useInView, useReducedMotion } from "motion/react"
// ...existing imports

export function AwsDiagram({ diagram }: { diagram: ProjectDiagram }) {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null)
  const activeNode = diagram.nodes.find((n) => n.id === activeNodeId)
  const nodeById = Object.fromEntries(diagram.nodes.map((n) => [n.id, n]))

  const svgRef = useRef<SVGSVGElement>(null)
  const isInView = useInView(svgRef, { once: false, amount: 0.4 })
  const shouldReduceMotion = useReducedMotion()
  const animateFlow = isInView && !shouldReduceMotion

  return (
    <div className="relative mt-8">
      <h2 className="mb-3 text-sm font-semibold text-[#171717] dark:text-white">Architecture</h2>
      <svg ref={svgRef} viewBox="0 0 100 100" /* ...unchanged props... */>
        {diagram.edges.map((edge, i) => {
          const from = nodeById[edge.from]
          const to = nodeById[edge.to]
          if (!from || !to) return null
          const midX = (from.x + to.x) / 2
          const d = `M ${from.x} ${from.y} L ${midX} ${from.y} L ${midX} ${to.y} L ${to.x} ${to.y}`
          return (
            <g key={i}>
              <path d={d} fill="none" stroke="#a1a1a1" strokeWidth={0.5} />
              {animateFlow && (
                <motion.circle
                  r={1.2}
                  fill="#0070f3"
                  style={{ offsetPath: `path("${d}")`, offsetRotate: "0deg" }}
                  animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: i * 0.3 }}
                />
              )}
            </g>
          )
        })}
        {/* ...nodes unchanged... */}
      </svg>
      {/* ...tooltip unchanged... */}
    </div>
  )
}
```

- [ ] **Step 2: Manual verification**

Run: `npm run dev`, open `/projects/model-registry`, scroll the diagram in and out of view.
Expected: glow dots animate continuously along each edge only while the diagram is in the viewport; scrolling it out stops the animation (verify via browser performance/paint flashing, or simply confirm no console/CPU spike when off-screen). Then enable "prefers reduced motion" in OS/browser settings and reload — expect the glow to not render at all, edges remain static lines.

- [ ] **Step 3: Commit**

```bash
git add src/components/projects/aws-diagram.tsx
git commit -m "feat(projects): add in-view gated diagram flow animation"
```

---

### Task 12: Reduced motion for morph/filter + cyclic focus trap

**Files:**
- Modify: `src/components/projects/project-card.tsx`
- Modify: `src/components/projects/project-detail-content.tsx`
- Modify: `src/app/projects/page.tsx`
- Modify: `src/components/projects/project-detail-overlay.tsx`

**Interfaces:**
- Consumes: `motion`'s `useReducedMotion` hook (already used in Task 11).
- Produces: no new interface — all four files gate their `motion` transition configs on `useReducedMotion()`, and the overlay panel gets a real cyclic Tab-trap.

- [ ] **Step 1: Gate the shared-element and filter transitions on `useReducedMotion`**

In `project-card.tsx`, `project-detail-content.tsx`, and `page.tsx`: call `const shouldReduceMotion = useReducedMotion()` at the top of each client component, and conditionally use a plain `{ duration: 0.15 }` fade-only transition instead of the spring/stagger configs when `shouldReduceMotion` is true. Example for the card image in `project-card.tsx`:

```tsx
const shouldReduceMotion = useReducedMotion()
// ...
<motion.div
  layoutId={`card-image-${project.slug}`}
  transition={
    shouldReduceMotion
      ? { duration: 0.15 }
      : { layout: { type: "spring", stiffness: 300, damping: 30 } }
  }
  // ...
/>
```

Apply the equivalent conditional to the title `layoutId` elements in `project-detail-content.tsx`, the content stagger `motion.div` in the same file (drop `staggerChildren`/`delay` to `0`), and the grid's `AnimatePresence` card transition in `page.tsx` (drop `delay: index * 0.04` to `0`).

- [ ] **Step 2: Harden the overlay's focus trap to cycle Tab/Shift+Tab within the panel**

```tsx
// src/components/projects/project-detail-overlay.tsx — extend the existing keydown handler
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") close()
    if (e.key === "ArrowLeft" && prevProject) goTo(prevProject.slug)
    if (e.key === "ArrowRight" && nextProject) goTo(nextProject.slug)
    if (e.key === "Tab" && panelRef.current) {
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }
  document.addEventListener("keydown", handleKeyDown)
  return () => document.removeEventListener("keydown", handleKeyDown)
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [prevProject, nextProject])
```

- [ ] **Step 3: Manual verification**

Run: `npm run dev`. With OS/browser "reduce motion" enabled: confirm filter switching and card→detail navigation both still work but with plain fades, no scale/spring/stagger. With reduce motion off: open a detail overlay, press Tab repeatedly — focus should cycle only among the close button, tech tag links (if any focusable), and detail links, never escaping to the dimmed grid behind it; Shift+Tab from the first element wraps to the last.

- [ ] **Step 4: Commit**

```bash
git add src/components/projects/project-card.tsx src/components/projects/project-detail-content.tsx src/app/projects/page.tsx src/components/projects/project-detail-overlay.tsx
git commit -m "feat(projects): respect prefers-reduced-motion and trap focus in overlay"
```

---

### Task 13: Full manual QA pass

**Files:** none (verification-only task)

**Interfaces:** none — this task exercises the finished feature end-to-end against the spec's Testing/success-criteria section.

- [ ] **Step 1: Run the full checklist from the spec**

Run: `npm run dev`, and work through each item below at 375px, 768px, 1024px, and 1440px viewport widths (browser dev tools device toolbar):

1. Grid displays all 9 projects, uniform sizing; filter chips narrow the set and update the URL; "All" clears it.
2. Click a card → overlay morphs in; URL becomes `/projects/<slug>` (plus `?category=` if a filter was active); refresh while the overlay is open → renders as the standalone page (no grid visible behind it).
3. Prev/next and the thumbnail rail scope correctly to the active filter category; hides gracefully for a single-project set.
4. Diagram hover (desktop) and tap (mobile emulation) both show/dismiss tooltips; flow-glow animates continuously in view, is absent under reduced motion.
5. Keyboard-only pass: Tab/Shift+Tab stays trapped in the overlay, arrow keys move prev/next, Esc closes.
6. No horizontal scroll or layout breakage at any of the four widths.

- [ ] **Step 2: Run project-wide checks**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

Run: `npm run build`
Expected: build succeeds — this specifically re-verifies the Next 16 `@modal/default.tsx` requirement from Task 4 wasn't missed and doesn't break production build.

- [ ] **Step 3: Fix any issues found in Steps 1-2 inline, then commit**

```bash
git add -A
git commit -m "fix(projects): address issues found in full QA pass"
```

(Skip this commit if Steps 1-2 found nothing to fix.)

---

## Self-Review

**Spec coverage:** every numbered section of the design spec maps to a task — §1 routing → Task 4/6, §2 data model → Task 1, §3 grid/filter → Task 2/3/8, §4 detail overlay/morph → Task 6/7, §5 prev/next/rail → Task 9, §6 AWS diagram → Task 10/11, §7 error handling/edge cases → Task 4 (not-found), Task 9 (single-project hide), Task 12 (reduced motion, focus trap), §8 testing → Task 13.

**Placeholder scan:** no TBD/TODO markers; the one explicit placeholder is project *copy* (descriptions/metrics text), which the spec explicitly scoped out of this plan and labeled as such in the data.

**Type consistency:** `layoutId` naming (`card-image-${slug}`, `card-title-${slug}`) is defined once in Task 3 and reused identically in Tasks 5, 6, 7, 9 — verified no divergent naming. `AWS_ICONS` keys (Task 10, Step 2) match every `service` string used in Task 1's seed `data.ts` (`api-gateway`, `lambda`, `rds`, `sqs`, `s3`) — if a future project's diagram uses a `service` key not yet in the registry, its icon will silently not render; flagging this as a known gap rather than adding speculative icons for services not yet used.
