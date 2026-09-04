# 사내 Coding Agent 활용 교육 프로젝트 구현 계획

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** 포트폴리오의 `AI Agent` 프로젝트에 사내 Claude Code·Codex 활용 교육 사례를 추가하고, 44페이지 발표 자료를 상세 화면에서 바로 볼 수 있게 한다.

**Architecture:** 새 프로젝트 데이터와 선택형 `presentation` 메타데이터를 `data.ts`에 추가한다. 상세 화면은 메타데이터가 있을 때만 브라우저 내장 PDF 뷰어와 새 탭 대체 링크를 표시한다. PDF 첫 페이지에서 만든 PNG를 카드와 상세 배너에 함께 쓴다.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Motion, 브라우저 내장 PDF 뷰어, `pdftoppm`, `agent-browser`.

---

## 작업 전제

- 기준 브랜치는 로컬 `dev`다. 현재 확인된 원격 기준 브랜치는 `origin/dev`다.
- 현재 `dev` 작업 트리에는 `.gitignore`, `AGENTS.md`, 블로그 파일, `public/blog/`에 추적 중인 수정과 추적되지 않은 파일이 있다. 이 작업과 섞으면 안 된다.
- `docs/`는 현재 작업 트리의 미커밋 `.gitignore` 변경으로 무시되고 있다. 이 계획과 명세 파일은 작업 전용 문서지만, 브랜치 전환 때 사라지거나 새 기능 브랜치를 더럽히지 않도록 보존 브랜치에 명시적으로 포함한다.
- 기존 작업을 stash로 숨기지 않는다. 보존 브랜치에 커밋해 이동한다.
- Notion, 외부 회사 시스템, 기존 블로그 콘텐츠는 수정하지 않는다.

### Task 1: 현재 `dev` 작업 트리를 보존 브랜치로 옮기기

**Objective:** 현재 unstashed 변경을 독립 브랜치에 커밋하고, 깨끗한 `dev`에서 기능 브랜치를 만든다.

**Files:**
- Preserve: 현재 `git status --short`에 나타나는 모든 수정, 삭제, 추적되지 않은 파일
- Force-add: `docs/2026-09-04-claude-code-codex-training-specs.md`
- Force-add: `docs/2026-09-04-claude-code-codex-training-plan.md`
- Do not add: `.claude/settings.local.json`, `.next/`, `.vercel/`, `node_modules/`, `docs/*.swp` 같은 무시된 개인·생성 파일

**Step 1: 현 상태를 확인한다.**

Run:
```bash
git status --short
git branch --show-current
git diff --check
```

Expected: 현재 브랜치는 `dev`이고, 기존 작업 트리 변경이 나열된다. 공백 오류는 없어야 한다.

**Step 2: 보존 브랜치를 만든다.**

Run:
```bash
git switch -c chore/preserve-dev-wip-2026-09-04
```

Expected: 기존 변경을 그대로 가진 상태에서 새 브랜치로 전환한다. 변경을 stash하거나 버리지 않는다.

**Step 3: 기존 변경과 작업 문서를 스테이징한다.**

Run:
```bash
git add -A
git add -f docs/2026-09-04-claude-code-codex-training-specs.md \
  docs/2026-09-04-claude-code-codex-training-plan.md
git diff --cached --check
git status --short
```

Expected: 현재 보이는 기존 변경과 두 문서가 스테이징된다. 무시된 개인 설정, 빌드 산출물, swap 파일은 스테이징되지 않는다.

**Step 4: 보존 커밋을 만든다.**

Run:
```bash
git commit -m "chore: preserve existing dev worktree"
git status --short
```

Expected: 보존 브랜치가 깨끗해진다. 커밋에는 새 PDF 기능 구현을 넣지 않는다.

**Step 5: 깨끗한 `dev`로 돌아간 뒤 기능 브랜치를 만든다.**

Run:
```bash
git switch dev
git pull --ff-only origin dev
git status --short
git switch -c feat/claude-code-codex-training
git status --short
```

Expected: `feat/claude-code-codex-training`은 `dev`에서 갈라지고 작업 트리는 깨끗하다. 이 단계가 끝나기 전에는 PDF, 이미지, `data.ts`, 상세 컴포넌트를 수정하지 않는다.

### Task 2: 공개 발표 자료와 카드 배너를 준비하기

**Objective:** 공개 PDF 사본과 첫 페이지 기반 16:9 PNG를 기능 브랜치에 추가한다.

**Files:**
- Create: `public/projects/claude-code-codex-training.pdf`
- Create: `public/projects/claude-code-codex-training-banner.png`
- Source only: `/Users/admin/Documents/job-app/supplimentary/Claude Code 사용법_최종.pdf`

**Step 1: PDF 메타데이터를 다시 확인한다.**

Run:
```bash
pdfinfo '/Users/admin/Documents/job-app/supplimentary/Claude Code 사용법_최종.pdf'
```

Expected: `Pages: 44`, `Encrypted: no`, `Page size: 720 x 405 pts`를 확인한다. 원본은 수정하지 않는다.

**Step 2: 원본을 공개 정적 자산으로 복사한다.**

Run:
```bash
cp '/Users/admin/Documents/job-app/supplimentary/Claude Code 사용법_최종.pdf' \
  public/projects/claude-code-codex-training.pdf
pdfinfo public/projects/claude-code-codex-training.pdf
```

Expected: 사본도 44페이지이고 암호화되지 않았다.

**Step 3: 첫 페이지를 PNG 배너로 만든다.**

Run:
```bash
pdftoppm -f 1 -l 1 -png -singlefile -r 150 \
  public/projects/claude-code-codex-training.pdf \
  public/projects/claude-code-codex-training-banner
file public/projects/claude-code-codex-training-banner.png
```

Expected: `public/projects/claude-code-codex-training-banner.png`은 약 16:9 비율의 PNG다. 파일명 끝에 `-1`이 붙었다면 `-singlefile` 옵션이 빠졌는지 확인하고 생성물을 바로잡는다.

**Step 4: 자산만 별도 커밋한다.**

Run:
```bash
git add public/projects/claude-code-codex-training.pdf \
  public/projects/claude-code-codex-training-banner.png
git diff --cached --check
git commit -m "feat: add coding agent training assets"
```

Expected: 커밋에는 두 공개 자산만 포함된다.

### Task 3: 프로젝트 데이터와 PAAR 내용을 추가하기

**Objective:** 기존 `AI Agent` 필터와 카드가 새 교육 프로젝트를 자동으로 표시하도록 한다.

**Files:**
- Modify: `src/app/projects/data.ts:1-36`
- Modify: `src/app/projects/data.ts:38-307`

**Step 1: 선택형 발표 자료 타입을 추가한다.**

`ProjectLink` 아래에 다음 타입을 추가한다.

```ts
export type ProjectPresentation = {
  src: string
  title: string
  pageCount: number
}
```

`Project` 타입에 다음 선택형 필드를 추가한다.

```ts
presentation?: ProjectPresentation
```

`Project` 타입의 기존 필드와 카테고리 유니온은 바꾸지 않는다. `AI Agent`는 이미 허용된 값이다.

**Step 2: 새 프로젝트 레코드를 `projects` 배열 마지막에 추가한다.**

다음 데이터가 기준이다. 문구는 PAAR 원문에 있는 사실만 사용하고, 도입 성과나 사용률을 새로 주장하지 않는다.

```ts
{
  slug: "claude-code-codex-training",
  title: "사내 Coding Agent 활용 교육",
  subtitle: "컨텍스트 엔지니어링을 중심으로 설계한 Claude Code·Codex 워크숍",
  category: "AI Agent",
  image: "/projects/claude-code-codex-training-banner.png",
  description:
    "Claude Code와 Codex 같은 Coding Agent를 안전하고 재현 가능하게 쓰기 위한 사내 워크숍이다. 회사와 팀장 요청으로 시작했고, 교육 콘텐츠 구성과 44페이지 자료 제작, 진행을 단독으로 맡았다.",
  techStack: ["Claude Code", "Codex", "MCP", "Subagents", "Skills", "Context Engineering"],
  role: "기획·자료 제작·진행 단독 담당",
  timeframe: "2026",
  metrics: [
    { value: "44페이지", label: "직접 제작한 발표 자료" },
    { value: "1회 워크숍", label: "사내 개발자·데이터 사이언티스트 대상 진행" },
    { value: "5~15명", label: "참석 대상 규모" },
  ],
  presentation: {
    src: "/projects/claude-code-codex-training.pdf",
    title: "Claude Code / Codex: Coding Agent 능력치 최대한 끌어올리기",
    pageCount: 44,
  },
  paar: {
    problem: {
      heading: "설치보다 먼저 필요한 사용 기준",
      bullets: [
        "회사가 Claude Code·Codex 같은 Coding Agent의 도입과 확산을 검토하면서, 개발자와 데이터 사이언티스트가 실제 업무에 적용할 수 있는 교육이 필요했음",
        "워크숍 진행은 회사와 팀장 요청으로 시작했지만, 무엇을 어떤 순서로 가르칠지와 자료 구성은 직접 맡았음",
        "도구 설치와 명령어만으로는 맥락이 부족한 요청, 길어지는 대화, 권한이 넓은 도구 설정에서 생길 수 있는 문제를 다루기 어려웠음",
      ],
      stats: [
        { value: "1회", label: "사내 워크숍" },
        { value: "5~15명", label: "개발자·데이터 사이언티스트 대상" },
        { value: "2026", label: "진행 시기" },
      ],
    },
    analysis: {
      heading: "설치법 대신 컨텍스트 엔지니어링",
      bullets: [
        "LLM이 토큰을 순차 생성하는 방식과 환각이 생기는 이유부터 설명해 Coding Agent의 동작 원리를 먼저 맞췄음",
        "맥락 없는 명령과 길어지는 대화가 결과 품질에 미치는 영향을 바탕으로, Agent를 잘 쓰는 일은 컨텍스트 창을 채우는 일이라는 관점으로 교육을 구성했음",
        "Memory, MCP, Subagents, Skills, Plugins, Plan Mode가 메인 컨텍스트 창을 구성하거나 아끼는 방식을 비교해 설명했음",
        "API 키 노출, MCP 권한 범위, `--dangerously-skip-permissions`처럼 실사용 중 놓치기 쉬운 보안 문제를 별도 주제로 다뤘음",
      ],
    },
    action: {
      heading: "44페이지에 원리와 실사용을 묶다",
      bullets: [
        "LLM·Agent 기초, 컨텍스트 엔지니어링, Claude Code 핵심 컴포넌트, 실사용 케이스, 팁과 주의사항까지 이어지는 44페이지 발표 자료를 직접 설계·제작했음",
        "개발자 사례에서는 GitHub Issue를 Skills, Memory, Plan Mode로 해결하고 PR을 만드는 흐름을, 비개발자 사례에서는 MCP, Subagents, Skills를 조합한 리서치 흐름을 시연했음",
        "Codex에서 대응되는 설정 파일과 구성 차이도 정리해 Claude Code 사용자가 다른 Coding Agent로 옮겨갈 때의 기준을 제공했음",
        "컨텍스트와 설정 파일을 팀에 공유할 때 민감정보를 제외하고 MCP는 읽기 권한부터 부여하는 실전 원칙을 담았음",
      ],
    },
    result: {
      heading: "자료는 남았고, 성과 지표는 없다",
      bullets: [
        "사내 개발자·데이터 사이언티스트를 대상으로 1회 워크숍을 진행하고, 공개 가능한 44페이지 자료를 직접 제작했음",
        "워크숍 이후 비공식 구두 피드백은 있었지만 설문, 사용률, 생산성, 도입 효과를 추적한 정량 지표는 없음",
        "따라서 이 사례는 제품 도입 성과가 아니라 Developer Enablement를 위한 교육 설계·자료 제작·진행 경험으로 제시함",
      ],
    },
  },
},
```

**Step 3: 타입 검사로 데이터 계약을 검증한다.**

Run:
```bash
npx tsc --noEmit
```

Expected: 새 타입과 프로젝트 데이터가 통과한다.

**Step 4: 데이터 변경을 커밋한다.**

Run:
```bash
git add src/app/projects/data.ts
git commit -m "feat: add coding agent training project"
```

Expected: 프로젝트 데이터 변경만 포함된다.

### Task 4: 상세 화면에 PDF 발표 자료 섹션을 추가하기

**Objective:** `presentation`이 있는 프로젝트에서만 TL;DR과 PAAR 사이에 인라인 PDF를 표시한다.

**Files:**
- Modify: `src/components/projects/project-detail-content.tsx:97-216`

**Step 1: 발표 자료 섹션을 렌더링할 조건을 만든다.**

`ProjectDetailContent`의 `project.metrics` 블록 뒤, `project.paar` 블록 앞에 다음 구조를 추가한다. `presentation`이 없는 기존 프로젝트에는 아무 UI도 추가하지 않는다.

```tsx
{project.presentation && (
  <section className="mt-10 border-t border-[#ebebeb] pt-8 dark:border-zinc-800" aria-labelledby="presentation-heading">
    <span className="text-xs font-semibold tracking-[1.5px] text-[#888888] dark:text-zinc-500">PRESENTATION</span>
    <h2 id="presentation-heading" className="mt-1 text-lg font-semibold text-[#171717] dark:text-white" style={{ letterSpacing: "-0.6px" }}>
      {project.presentation.title}
    </h2>
    <p className="mt-1 text-sm text-[#888888] dark:text-zinc-500">직접 제작한 {project.presentation.pageCount}페이지 워크숍 자료</p>
    <div className="mt-5 overflow-hidden rounded-xl border border-[#ebebeb] dark:border-zinc-800">
      <iframe
        src={project.presentation.src}
        title={project.presentation.title}
        loading="lazy"
        className="h-[70vh] min-h-[28rem] w-full sm:h-[48rem]"
      />
    </div>
    <p className="mt-3 text-sm text-[#888888] dark:text-zinc-500">
      PDF가 표시되지 않나요?{" "}
      <a href={project.presentation.src} target="_blank" rel="noreferrer" className="underline underline-offset-4">
        새 탭에서 자료 보기
      </a>
    </p>
  </section>
)}
```

iframe이 특정 브라우저에서 PDF를 실제로 렌더링했는지 신뢰성 있게 감지할 수는 없다. 그래서 대체 링크는 오류를 숨긴 조건부 UI가 아니라 PDF 아래의 짧은 복구 경로로 항상 표시한다. 이 링크는 다운로드 유도 버튼이 아니며, 브라우저 내장 뷰어로 새 탭에서 열도록 한다.

**Step 2: 접근성과 레이아웃을 확인한다.**

- `section`과 `h2`는 `aria-labelledby`로 연결한다.
- iframe에는 발표 자료 제목을 그대로 넣어 고유한 `title`을 제공한다.
- 컨테이너는 기존 PAAR 다이어그램과 같은 `rounded-xl`과 테두리 규칙을 쓴다.
- `w-full`과 고정 최소 높이로 모바일 가로 넘침을 막는다.
- `loading="lazy"`로 카드, 제목, TL;DR보다 PDF가 먼저 로딩되는 일을 막는다.
- 새 패키지, PDF.js, 서버 API, 분석 스크립트는 추가하지 않는다.

**Step 3: TypeScript와 ESLint를 실행한다.**

Run:
```bash
npx tsc --noEmit
npx eslint src/
```

Expected: 두 명령이 종료 코드 0으로 끝난다.

**Step 4: 컴포넌트 변경을 커밋한다.**

Run:
```bash
git add src/components/projects/project-detail-content.tsx
git commit -m "feat: embed coding agent workshop presentation"
```

Expected: 상세 컴포넌트 변경만 포함된다.

### Task 5: 브라우저와 정적 자산을 검증하기

**Objective:** 카드, 필터, 직접 상세 경로, 인터셉트 모달, PDF 경로와 모바일 레이아웃을 실제 브라우저에서 확인한다.

**Files:**
- Verify only: `src/app/projects/page.tsx:20-95`
- Verify only: `src/components/projects/project-card.tsx:18-46`
- Verify only: `src/components/projects/project-detail-content.tsx:97-216`
- Verify only: `public/projects/claude-code-codex-training.pdf`
- Verify only: `public/projects/claude-code-codex-training-banner.png`

**Step 1: 정적 검사 전체를 다시 실행한다.**

Run:
```bash
npx tsc --noEmit
npx eslint src/
git diff dev...HEAD --check
```

Expected: 모두 종료 코드 0이다.

**Step 2: 개발 서버를 확인하거나 시작한다.**

먼저 포트 3001을 확인한다.

```bash
lsof -nP -iTCP:3001 -sTCP:LISTEN
```

서버가 없으면 별도 터미널에서 다음을 실행한다.

```bash
npm run dev -- --port 3001
```

Expected: Next.js 개발 서버가 `http://localhost:3001`에서 준비된다. 이미 실행 중인 서버를 중복으로 시작하지 않는다.

**Step 3: AI Agent 필터와 카드 렌더링을 확인한다.**

Run:
```bash
agent-browser --session claude-code-training open 'http://localhost:3001/projects?category=AI%20Agent'
agent-browser --session claude-code-training snapshot -i
```

Expected: `사내 Coding Agent 활용 교육` 카드가 보이고, 카드 배경은 첫 슬라이드 기반 배너다.

**Step 4: 직접 상세 경로와 PDF iframe을 확인한다.**

Run:
```bash
agent-browser --session claude-code-training open 'http://localhost:3001/projects/claude-code-codex-training'
agent-browser --session claude-code-training snapshot
agent-browser --session claude-code-training get attr src 'iframe[title="Claude Code / Codex: Coding Agent 능력치 최대한 끌어올리기"]'
curl -fsSI 'http://localhost:3001/projects/claude-code-codex-training.pdf'
```

Expected: `PRESENTATION` 섹션, 44페이지 보조 문구, iframe, `새 탭에서 자료 보기` 링크가 보인다. iframe `src`는 `/projects/claude-code-codex-training.pdf`이고 HTTP 응답은 성공 상태와 `application/pdf` 콘텐츠 타입을 반환한다.

**Step 5: 인터셉트 모달과 모바일 폭을 확인한다.**

Run:
```bash
agent-browser --session claude-code-training open 'http://localhost:3001/projects?category=AI%20Agent'
agent-browser --session claude-code-training find text '사내 Coding Agent 활용 교육' click
agent-browser --session claude-code-training snapshot
agent-browser --session claude-code-training set viewport 390 844
agent-browser --session claude-code-training open 'http://localhost:3001/projects/claude-code-codex-training'
agent-browser --session claude-code-training screenshot /tmp/claude-code-training-mobile.png
```

Expected: 목록에서 카드를 열면 프로젝트 상세 모달에서도 자료 섹션이 보인다. 390px 폭에서는 iframe 컨테이너와 대체 링크가 가로로 넘치지 않는다. 스크린샷은 눈으로 확인한다.

**Step 6: 최종 변경을 확인하고 기능 커밋을 검증한다.**

Run:
```bash
git status --short
git log --oneline dev..HEAD
git diff --stat dev...HEAD
```

Expected: 기능 브랜치에는 PDF, PNG, `data.ts`, `project-detail-content.tsx`의 세 기능 커밋만 있고, 보존 브랜치의 블로그·설정 변경은 없다.
