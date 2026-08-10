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
    slug: "savee-chatbot-api",
    title: "세이비 챗봇 API",
    subtitle: "BEMS 데이터를 자연어로 묻는 LangGraph 에이전트",
    category: "AI Agent",
    image: "/projects/savee-chatbot-api-banner.png",
    description:
      "BEMS 사용자가 여러 대시보드를 뒤지고 시각화 페이지에 들어갈 때마다 필터를 손으로 입력해야 하던 문제를 직접 발굴했습니다. 중앙 오케스트레이터 방식은 토큰 낭비와 디버깅 난이도가 걸렸고 n8n은 서버를 하나 더 관리해야 해서 LangGraph 노드 기반 설계를 택했습니다.",
    techStack: [
      "Python",
      "LangGraph",
      "FastAPI",
      "WebSocket",
      "PostgreSQL",
      "Langfuse",
      "Docker",
      "AWS",
    ],
    role: "단독 개발 (백엔드·에이전트·인프라), 프론트엔드 1명과 API 협업",
    timeframe: "2025.08–2025.11 (유지보수 지속)",
    metrics: [
      { value: "1780ms→855ms", label: "건물정보 조회 지연 (async 병렬화, 51.98%↓)" },
      { value: "LLM 호출 4회→1회", label: "db_agent 쿼리 처리 (3-노드 재설계, MCP 서버로 분리)" },
    ],
    paar: {
      problem: {
        heading: "매번 손으로 필터를 입력해야 했다",
        bullets: [
          "BEMS 제품 Savee 사용자가 인사이트를 얻으려면 여러 대시보드를 수동으로 뒤져야 했음",
          "시각화 페이지에 들어갈 때마다 위치·기간·비교 기간 필터를 매번 손으로 조합해야 했음",
          "지시받은 업무가 아니라 사내에서 LLM/에이전트 활용을 탐색하던 시점에 직접 제안해 착수",
        ],
      },
      analysis: {
        heading: "오케스트레이터 대신 노드 기반 그래프",
        bullets: [
          "중앙 오케스트레이터 LLM 기각. 매 스텝이 오케스트레이터를 거쳐 토큰을 낭비하고, 실패 지점 추적이 어려움",
          "n8n 기각. 별도 서버를 새로 운영·관리해야 하는 포인트가 늘어남",
          "LangGraph 채택. 노드별로 필요한 프롬프트만 실행, 실패 지점을 노드 단위로 좁혀 디버깅 가능",
          "복잡한 DB 조회는 별도 db_agent 서브그래프로 분리, 이후 MCP 서버로 독립시켜 사내 재사용 가능하게 확장",
          "노드 단위 설계로 디버깅은 쉬워졌지만 스텝마다 LLM 호출이 늘어 지연시간이 누적되는 트레이드오프를 체감",
          "db_agent 응답 지연 원인 진단: 쿼리 하나에 LLM 호출이 4번(작성·검증 도구 호출·재실행 호출·응답 작성) 걸렸고, 결과가 100행 넘으면 특히 느려짐",
          "SQL 문법 검증을 LLM 대신 sqlglot(정적 파서)으로 대체. 의미 오류(테이블·컬럼 존재 여부)는 못 잡지만, 검증 한 번마다 LLM을 부르던 비용을 없앰",
        ],
      },
      action: {
        heading: "LangGraph 에이전트 + WebSocket 스트리밍 API",
        bullets: [
          "관련성 판단→건물정보 병렬 수집(async)→정보추출→응답생성으로 이어지는 LangGraph 에이전트 단독 설계·구현",
          "FastAPI+WebSocket으로 첫 토큰부터 실시간 스트리밍, 개발용 Streamlit UI 구성",
          "Docker/ECR/ECS 기반 dev/prod CI/CD 구축(GitHub Actions), 프론트엔드 1명과 API 문서로 협업",
          "db_agent를 write_sql_query→check_sql_query(sqlglot)→execute_query 3-노드로 재설계, MCP 서버(ds-llm-building-mcp)의 get_energy_query_v2 툴로 전환",
        ],
      },
      result: {
        heading: "두 곳의 병목을 찾아 각각 줄였다",
        bullets: [
          "건물정보 조회 지연시간 1780.87ms→855.11ms (51.98%↓, 2.08x), 프로덕션 DB 대상 5회 반복 측정",
          "db_agent 쿼리당 LLM 호출 4회→1회로 축소(3-노드 재설계 자체로 검증되는 구조적 수치). 응답시간(ms) 실측치는 남아있지 않아 수치화하지 않음",
          "실사용자 풀은 아직 많지 않아 사용량·정확도는 수치화하지 않음. 현재도 개발·운영은 지속 중",
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
