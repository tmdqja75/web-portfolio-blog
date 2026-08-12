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
    slug: "aws-mlops-platform",
    title: "AWS 기반 MLOps 플랫폼",
    subtitle: "혼자 운영하고 팀이 함께 쓰는 모델 배포 표준",
    category: "MLOps",
    image: "/projects/aws-mlops-platform-banner.png",
    description:
      "모델 실험은 각자 로컬에서 관리하고, 운영 추론 코드는 Lambda에서 직접 고치던 시기였습니다. 두 명의 팀원이 퇴사한 뒤 혼자 플랫폼을 맡게 되어 SageMaker와 단일 EC2 구성을 검토했지만, 운영 부담과 장애 전파 범위가 컸습니다. BentoML과 ECS Fargate로 모델 서비스를 분리하고 MLflow, DynamoDB, Prometheus/Grafana를 연결해 공통 배포 경로를 만들었습니다. 수동 배포는 약 30분이 걸렸고, GitHub Actions 실배포 실행 60건의 중앙값은 4.71분이었습니다.",
    techStack: [
      "Python",
      "MLflow",
      "BentoML",
      "Docker",
      "GitHub Actions",
      "AWS ECS",
      "DynamoDB",
      "Prometheus",
      "Grafana",
    ],
    role: "MLOps 플랫폼 설계·구현·운영",
    timeframe: "2024.11 이후 (초기 구축 4~5개월)",
    metrics: [
      { value: "30분→4.71분", label: "배포 리드타임 (Before 회고 추정, After 실배포 중앙값 60건)" },
      { value: "84.3% 단축", label: "GitHub Actions 기반 변경 감지·ECR·ECS CD" },
      { value: "팀원 2명 재사용", label: "각자의 BentoML 서비스를 공통 경로로 배포" },
    ],
    paar: {
      problem: {
        heading: "배포는 수동, 장애는 웹 화면에서 먼저 발견",
        bullets: [
          "모델 실험과 성능 비교가 데이터 사이언티스트 각자의 로컬 환경에 흩어져 있었음",
          "전처리·재학습 모델·비즈니스 규칙이 바뀔 때마다 Lambda 추론 코드를 직접 수정해 배포",
          "데이터 불일치와 추론 실패를 알려주는 모니터링이 없어 잘못된 정보가 웹 UI에 반영된 뒤 디버깅을 시작",
          "팀원 2명이 퇴사한 뒤 플랫폼 구축과 운영을 혼자 맡아, 한 사람이 감당할 수 있는 구조가 필요했음",
        ],
        stats: [
          { value: "약 30분", label: "기존 수동 배포(회고 추정)" },
          { value: "1명", label: "플랫폼 구축·운영 담당" },
          { value: "사후 감지", label: "기존 장애 대응 방식" },
        ],
      },
      analysis: {
        heading: "관리형 통합보다 작은 표준을 선택",
        bullets: [
          "SageMaker를 시도했지만 인원이 줄어든 팀에서 혼자 설정하고 운영하기에는 부담이 컸음",
          "단일 EC2에 여러 Docker 서비스를 올리는 방식도 시도했으나, 디스크나 호스트 장애가 모든 서비스를 함께 멈추게 해 기각",
          "모델별 FastAPI와 Dockerfile도 검토했지만 전처리, 모델 로딩, 오류 응답, 패키징 규칙을 매번 다시 만들어야 했음",
          "BentoML을 서비스 정의와 컨테이너 패키징의 공통 계약으로 쓰고, ECS Fargate로 모델별 실패 범위를 분리",
          "MLflow는 실험·아티팩트, DynamoDB는 건물별 배포 구성에 사용. 유연한 속성이 타입 드리프트를 만든 점은 남은 과제",
        ],
      },
      action: {
        heading: "실험 기록부터 배포와 알림까지 한 경로로",
        bullets: [
          "MLflow를 ECS에 배포하고 RDS 백엔드와 S3 아티팩트 저장소를 연결, 학습 코드의 실험 로깅 규칙을 통합",
          "BentoML 서비스 템플릿과 scikit-learn Pipeline 전처리, 공통 API·오류 응답, Prometheus 메트릭 규칙을 설계",
          "변경 앱 탐지→컨테이너 빌드→ECR 푸시→ALB 라우팅 검증→ECS 갱신을 GitHub Actions로 자동화",
          "Prometheus/Grafana를 EC2 기반 DS 서버에서 운영하고 커스텀 지표와 Slack 알림을 연결",
          "모델 알고리즘·건물별 비즈니스 로직·DynamoDB 조회 코드는 각 담당자가 맡고, 본인은 플랫폼 계층을 소유",
        ],
      },
      result: {
        heading: "실배포 중앙값 4.71분",
        bullets: [
          "기존 수동 Lambda 배포 약 30분(회고 추정)에서 GitHub Actions 실배포 중앙값 4.71분으로 단축",
          "성공한 워크플로 중 소요 시간 2분 이상을 실배포로 분류해 60건을 집계. 55건이 3~6분 안에 완료",
          "30분과 중앙값을 비교하면 배포 리드타임이 84.3% 줄고 속도는 6.4배가 됨",
          "다른 데이터 사이언티스트 2명이 같은 경로로 자신의 BentoML 서비스를 배포",
        ],
      },
    },
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
    slug: "newsletter-automation",
    title: "오토마타 뉴스레터 자동화",
    subtitle: "LangGraph 멀티에이전트 기반 AI 뉴스레터 자동 발행 시스템",
    category: "AI Agent",
    image: "/projects/newsletter-automation-banner.png",
    description:
      "매주 수요일 발행하는 AI 뉴스레터의 리서치와 작성에 부담을 느껴 자동화를 시작했지만, 오픈엔드 에이전트에게 전부 맡기는 방식은 실제 운영에서 토픽 품질을 보장하지 못했습니다. 검색과 랭킹은 결정론적 파이프라인으로 옮기고 토픽 선정에는 Human-in-the-Loop 승인 단계를 남기는 구조로 다시 설계했습니다. 현재도 실제로 매주 발행 중이며, LangSmith로 실측한 실행당 평균 소요 시간은 27분, 비용은 1.06달러입니다.",
    techStack: [
      "Python",
      "LangGraph",
      "deepagents",
      "Claude API",
      "Tavily API",
      "GitHub API",
      "LangSmith",
    ],
    role: "단독 개발 (Claude Code 협업)",
    timeframe: "2026.01–2026.08 (진행 중)",
    links: [
      { label: "Repository", href: "https://github.com/tmdqja75/newsletter-automation-gpters" },
    ],
    metrics: [
      { value: "27분·$1.06", label: "실행당 평균 (LangSmith 실측 12회, 범위 7~66분·$0.71~$1.54)" },
      { value: "오픈엔드→결정론적+HITL", label: "토픽 품질 저하를 겪은 뒤 에이전트 아키텍처 재설계" },
      { value: "실제 발행 중", label: "매주 수요일 실사용 시스템" },
    ],
    paar: {
      problem: {
        heading: "리서치 1주, 작성 1시간, 매주 반복",
        bullets: [
          "매주 수요일 발행하는 AI 뉴스레터를 위해 리서치가 한 주에 걸쳐 분산되고, 작성에도 별도로 한 시간이 들어 개인 시간 부담이 컸음",
          "ChatGPT로 초안을 쓰면 톤이 어색해 결국 손으로 다듬어야 했고, 바쁜 주에는 발행이 밀리기도 함",
          "지시받은 업무가 아니라 뉴스레터 운영자 본인이 직접 겪은 문제라 자발적으로 착수",
        ],
        stats: [
          { value: "주 1회", label: "발행 주기" },
          { value: "1주+1h", label: "리서치+작성 소요(수동)" },
          { value: "7개월", label: "개발 기간(파트타임)" },
        ],
      },
      analysis: {
        heading: "완전 자동화 대신 결정론적 파이프라인과 HITL",
        bullets: [
          "오픈엔드 LLM 리서치 루프 기각. 실행마다 결과가 달라 재현이 불가능하고 비용도 예측할 수 없었음",
          "8카테고리·12쿼리 고정 검색 플랜에 정규화, 중복 제거, 날짜 필터, 점수 랭킹을 더한 결정론적 파이프라인 채택",
          "완전 자동 토픽 선정은 실운영에서 품질 저하를 겪어 기각하고, LangGraph interrupt 기반 HITL 승인 단계로 전환",
          "실운영 결과 20개 중 16개가 SEO 리스티클로 채워지는 문제를 직접 확인하고 원인 5가지를 역추적해 해결",
          "리서치 결과가 사용자에게 닿기까지 LLM이 네 번 재전사하며 화면 번호와 실제 URL 매핑이 어긋날 수 있는 구조적 버그를 발견해 매핑 로직을 전부 Python으로 옮김",
        ],
      },
      action: {
        heading: "Orchestrator가 조율하는 멀티에이전트 파이프라인",
        bullets: [
          "run_weekly_research가 검색과 랭킹을 파이썬 함수로 결정론적으로 처리하고, Orchestrator는 결과 파일 경로만 전달받는 구조로 설계",
          "HITL 모드에서는 request_topic_selection 도구 안에서 interrupt를 호출해 후보를 보여주고 Command(resume)으로 재개",
          "선택된 토픽마다 article-writer 서브에이전트를 병렬 호출해 리서치 보강, 팩트 기반 작성, 톤 교정을 한 번에 처리",
          "GitHub Search API와 Trending 스크래핑, PyTorch-KR 포럼(Discourse API)을 새 리서치 소스로 추가",
          "LangSmith로 에이전트 트레이스를 모니터링하고 run_metrics.json에 실행별 토큰 사용량과 소요 시간을 기록",
        ],
      },
      result: {
        heading: "LangSmith 실측, 평균 27분·$1.06",
        bullets: [
          "프로덕션 실행 12회 기준 평균 27분(범위 7~66분), $1.06(범위 $0.71~$1.54)으로 실측",
          "리서치 1주 분산과 작성 1시간 수작업을 실행당 평균 27분짜리 자동 파이프라인으로 대체",
          "SEO 리스티클 문제의 원인 진단과 수정은 완료했으나, 개선 후 비율은 재측정이 필요한 상태로 남겨둠",
          "현재도 실제로 매주 수요일 발행에 쓰이고 있음",
        ],
      },
    },
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
