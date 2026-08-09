export type ProjectLink = { label: string; href: string }

export type ProjectMetric = { value: string; label: string }

// PAAR = Problem / Analysis / Action / Result — see job-app/paar skill.
// heading is a short, content-specific title (not a generic "왜 필요했나"
// template) so each project's section reads as its own story. Bullets are
// pre-compressed to resume-bullet length; keep 3-5 items so the section
// stays scannable by a recruiter in a few seconds.
export type ProjectPAARSection = {
  heading: string
  bullets: string[]
}

export type ProjectPAAR = {
  problem: ProjectPAARSection & { stats?: ProjectMetric[] }
  analysis: ProjectPAARSection
  action: ProjectPAARSection
  result: ProjectPAARSection
}

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
  diagramImage?: string
  paar?: ProjectPAAR
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
    slug: "dxf-panel-parser",
    title: "DXF 분전반 도면 파서",
    subtitle: "VLM 기반 회로표 자동 추출 파이프라인",
    category: "AI Agent",
    image: "/projects/dxf-panel-parser-banner.png",
    description:
      "수주마다 분전반 도면 20~60장의 회로표를 팀원이 손으로 옮겨 적어 프로젝트당 10~30시간이 걸렸습니다. 도면마다 레이아웃이 제각각이라 DXF 텍스트 직접 파싱은 일반화가 어렵고, OCR은 표 구조 복원에 별도 로직이 필요해 인식과 구조화를 한 번에 처리하는 VLM(Claude/GPT) 방식을 택했습니다. 정확도는 주장 대신 직접 만든 사람 투표 도구로 측정했고, 크롭·프롬프트 엔지니어링·few-shot 개선을 거쳐 실도면 3건·패널 약 200개 기준 두 모델 모두 정답 비율을 35.0%에서 91.7%까지 끌어올렸습니다.",
    techStack: ["Python", "ezdxf", "Claude API", "GPT-5.4", "Batch API", "FastAPI", "Docker"],
    role: "단독 개발",
    timeframe: "2026.08",
    diagramImage: "/projects/dxf-panel-parser-diagram.svg",
    metrics: [
      { value: "35%→92%", label: "두 모델 모두 정답 비율 (사람 투표 검증, 패널 200개)" },
      { value: "30분→수분", label: "도면 1장당 회로표 정리 시간" },
      { value: "웹 UI 사내 배포", label: "Python·Docker로 만든 CAD→Excel 변환기" },
    ],
    paar: {
      problem: {
        heading: "도면 한 장에 30분씩",
        bullets: [
          "수주마다 분전반 도면 20~60장의 회로표를 팀원이 손으로 옮겨 적음(도면 1장당 30분 이상)",
          "프로젝트당 10~30시간의 반복 수작업, 수주 주기가 불규칙해 몰릴 때 병목이 됨",
          "지시받은 업무가 아니라 이 비효율을 직접 발견해 착수",
        ],
        stats: [
          { value: "20~60장", label: "수주당 처리할 분전반" },
          { value: "30분+", label: "도면 1장당 수작업 시간" },
          { value: "10~30h", label: "프로젝트당 반복 수작업" },
        ],
      },
      analysis: {
        heading: "세 가지 후보, 두 번의 기각",
        bullets: [
          "DXF 텍스트 직접 파싱 기각. 도면마다 레이아웃이 제각각이라 규칙 기반 파서를 일반화하기 어려움",
          "전통 OCR 기각. 텍스트 인식과 표 구조(행·열) 복원을 별도 로직으로 만들어야 함",
          "VLM(Claude/GPT) 채택. 인식과 구조화를 프롬프트 하나로 동시에 처리하는 대신 100% 정확도 보장은 포기",
          "정확도 개선 단계에서 3개 이상 모델 앙상블도 검토했으나, 혼자 개발하는 상황에서 운영 복잡도가 커져 기각",
          "100%를 보장할 수 없다는 전제 위에서, 사람이 결과를 검증하는 투표 도구를 직접 만들어 신뢰도를 수치화",
        ],
      },
      action: {
        heading: "다섯 단계로 좁힌 파이프라인",
        bullets: [
          "DWG→DXF 변환 후 기하 연산(ezdxf)으로 분전반 영역 자동 탐지, 한글 SHX 폰트 오버라이드 렌더링",
          "Claude·GPT VLM으로 회로표 추출. 단건·병렬·Batch 3가지 실행 모드와 비용 추정(--estimate) 지원",
          "FastAPI 웹앱(업로드 → SSE 진행률 → Excel 내보내기)까지 단독 설계·구현, Docker로 패키징",
          "원래 건물 전체 CAD 데이터를 분석하는 에이전트로 기획했으나 개발 범위가 과도해 분전반 파서로 스코프 축소",
        ],
      },
      result: {
        heading: "35%에서 92%까지",
        bullets: [
          "실도면 3건·패널 약 200개를 사람 투표로 검증한 결과, 두 모델 모두 정답 비율이 35.0%→72.9%→91.7%로 올라감",
          "크롭+프롬프트 엔지니어링이 가장 큰 개선(+37.9%p), few-shot 추가가 2차 개선(+18.8%p)",
          "도면 1장당 회로표 정리 시간 30분+→수분 대로 단축, 현재도 실사용 중",
        ],
      },
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

export const categories: string[] = Array.from(new Set(projects.map((p) => p.category)))

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug)
}

export function getCategoryProjects(category: string | null) {
  if (!category || !categories.includes(category)) return projects
  return projects.filter((p) => p.category === category)
}
