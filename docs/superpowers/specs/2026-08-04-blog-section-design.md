# Blog section — design

Date: 2026-08-04
Status: approved, ready for implementation planning

## Goal

Fill in the `Blog` slot in the landing nav with a working blog: posts authored as markdown files in the repo, listed in a single reverse-chronological list view, each post rendered on its own reading page.

Content is Korean long-form technical deep-dives (LLM agents, MLOps) — 1500+ words, code blocks, occasional images. Publishing means committing a file.

## Decisions

| Decision | Choice | Rejected alternatives |
|---|---|---|
| Authoring format | Plain `.md` in the repo with YAML frontmatter | MDX (no React embeds needed); Notion/CMS (adds an API dependency) |
| Pipeline | `marked` + `gray-matter` + `shiki`, all at build time | `marked` alone (monochrome code); `react-markdown` chain (~6 deps, ships renderer to client, pays off only with React-in-markdown) |
| List layout | Display stack — big-type titles, mono eyebrows | Ledger table (dense, changelog-like); year-spine with summaries (better past ~30 posts) |
| Filtering | None. Tag is eyebrow text, not a control | Tag filter buttons; series grouping |
| Post layout | Single column + sticky TOC rail + reading progress bar | Centered column alone; full-bleed title with numbered sections (numbering implies a sequence these posts don't have) |

All visual decisions stay inside `DESIGN.md`: ink `#171717`, Geist + Geist Mono, hairline `#ebebeb`, 6px in-app radii, `zinc-50` / black page backgrounds as on `/projects`.

## Content model

One file per post, filename is the slug:

```
content/blog/failure-recovery-in-langgraph.md   →  /blog/failure-recovery-in-langgraph
```

Frontmatter:

```md
---
title: "LangGraph에서 실패를 복구하는 에이전트 설계"
date: 2026-07-28
tag: Agent
summary: "재시도만으로는 부족하다. 상태를 되감는 복구 루프를 그래프에 넣은 과정."
draft: false
---
```

- `title`, `date`, `tag`, `summary` are required; `draft` defaults to `false` when absent.
- `date` is `YYYY-MM-DD`, displayed as `2026.07.28`.
- `tag` is a single free-form string, uppercased in the eyebrow. Not a filter control, not validated against an enum.
- `draft: true` excludes the post from the list **and** from `generateStaticParams`, so its URL 404s.

Reading time is derived, never authored: strip fenced code blocks from the body, count the remaining characters, `Math.max(1, Math.round(chars / 500))`. 500자/분 approximates Korean technical prose. Displayed as `12분`.

## Routes

### `/blog` — list

Server component, statically rendered. Reverse-chronological, no pagination, no filtering.

```
Blog                                        h1: 24px / 600 / -0.96px  (matches /projects)
──────────────────────────────────────      hairline #ebebeb
2026.07.28 · AGENT · 12분                   mono, 10px, uppercase, #888
LangGraph에서 실패를 복구하는 에이전트 설계    30px / 600 / -1.2px, #a1a1a1 at rest
──────────────────────────────────────
2026.06.11 · AGENT · 9분
프롬프트가 아니라 도구를 설계하라
```

**Signature interaction.** Titles rest dimmed at `#a1a1a1`. On hover or keyboard focus the title resolves to ink `#171717` while a hairline sweeps beneath it left→right. The list reads as a stack of headlines coming into focus one at a time — one bold move, everything else quiet.

`TextRoll` is deliberately not reused for post titles: it staggers 0.035s per character, so a 25-character Korean title takes ~0.9s to finish rolling, and its absolutely-positioned duplicate assumes a single line. The dim→ink resolve is the same gesture at long-title scale.

Empty state (no published posts): a single line in body gray — `아직 발행한 글이 없습니다.` No illustration, no card.

A fixed back-to-home pill sits top-left, copying the one on `/projects` exactly.

The landing page's `{ name: "Blog" }` nav entry gains `href: "/blog"`, which makes it render through `TransitionLink` like About and Projects.

### `/blog/[slug]` — post

Server component with `generateStaticParams` (non-draft slugs only) and `generateMetadata` (title + summary for `description`).

```
▔▔▔▔▔▔▔▔▔▔▔░░░░░░░░░░░░░  2px ink progress bar, fixed top
2026.07.28 · AGENT · 12분
LangGraph에서 실패를
복구하는 에이전트 설계
─────────────────────────
본문, max 65ch            목차
…                         문제: 재시도는…   ← active, ink
[ 코드 블록 ]              체크포인트 설계    ← #888
…                         복구 경로 연결
```

- Body measure caps at 65ch. TOC rail is sticky on the right at `lg` and above, **hidden below `lg`** — mobile is one column with no TOC. The progress bar stays at every width.
- The TOC lists `h2` headings only. IDs are generated inside the `marked` heading renderer, which collects the headings in the same pass — no `github-slugger` dependency. Korean headings slugify to their own text (URL-encoded), which is valid and stable across rebuilds.
- Code blocks are highlighted at build time by Shiki with dual themes (`github-light` / `github-dark`), so a single HTML payload serves both color schemes through CSS variables. Nothing highlights on the client.
- Unknown or draft slugs render the 404 path, matching `src/app/projects/not-found.tsx`.

## Components and boundaries

| File | Responsibility | Depends on |
|---|---|---|
| `content/blog/*.md` | The posts | — |
| `src/lib/blog.ts` | Server-only. `getAllPosts()` → sorted metadata list; `getPost(slug)` → `{ meta, html, headings }`. Owns fs reads, frontmatter parsing, reading-time math, and the marked+shiki render. | `marked`, `gray-matter`, `shiki` |
| `src/app/blog/page.tsx` | List page shell: heading, back pill, maps posts to rows | `getAllPosts()` |
| `src/app/blog/[slug]/page.tsx` | Post page shell: header block, article body, rail placement, metadata | `getPost()` |
| `src/components/blog/post-list-item.tsx` | Client. One list row and its dim→ink hover/focus state | — |
| `src/components/blog/reading-rail.tsx` | Client. Scroll-spy over `headings` + progress bar | `headings` prop |
| `src/app/page.tsx` | Add `href: "/blog"` to the Blog nav item | — |

`src/lib/blog.ts` is the only module that touches the filesystem or knows markdown exists; both pages consume plain serializable data. `reading-rail.tsx` receives headings as a prop and never parses HTML, so the TOC cannot drift from the rendered document.

## Motion and accessibility

- Row hover/focus: 200ms color transition plus the hairline sweep. Keyboard focus produces the same resolve, so the list is navigable without a mouse.
- `reading-rail.tsx` calls `useReducedMotion`; when reduced motion is set, TOC clicks jump instead of smooth-scrolling. The progress bar is a width change, not an animation, and stays in both modes.
- Every row is a real `<a>` wrapping the whole block, so the hit target matches the visible row.
- The article uses `<article>` with the post title as its `h1`; markdown `h2`/`h3` keep their document order.

## Verification

No test framework is configured in this repo, so verification is build- and eye-based:

1. `npm run build` — must emit a static route per non-draft post and none for drafts.
2. `npx tsc --noEmit` and `npm run lint` — clean.
3. Manual pass at mobile width: TOC absent, progress bar present, no horizontal scroll on long code blocks.
4. Manual pass with reduced motion enabled: TOC clicks jump, nothing animates.

## Out of scope

- **Pagination** — revisit around 30 posts; the list is a flat map until then.
- **RSS feed** — roughly 20 lines in `src/app/blog/rss.xml/route.ts` whenever it's wanted.
- **Tag filtering, search, series grouping, comments, view counts** — none are built now. The `tag` field exists in frontmatter, so filtering can be added later without touching the content files.
- **Images pipeline** — posts use plain markdown `![]()`; `next/image` remote patterns stay unconfigured, per the existing convention.
