export type ProjectLink = { label: string; href: string }

export type ProjectPresentation = {
  src: string
  title: string
  pageCount: number
}

export type ProjectMetric = { value: string; label: string }

// PAAR = Problem / Analysis / Action / Result — see job-app/paar skill.
// heading is a short, content-specific title (not a generic "왜 필요했나"
// template) so each project's section reads as its own story. Bullets are
// pre-compressed to resume-bullet length; keep 3-5 items so the section
// stays scannable by a recruiter in a few seconds.
export type ProjectPAARSection = {
  heading: string
  bullets: string[]
  image?: string
  evidenceImage?: { src: string; alt: string; caption?: string }
}

// A carousel is an optional deep-dive under the Action section for projects with
// enough distinct sub-phases (experiment/pipeline/deployment, etc.) that one bullet
// list can't carry them all. `key` matches a diagram entry in
// ACTION_CAROUSEL_DIAGRAM_BY_PROJECT in project-detail-content.tsx, if that slide has one.
export type ActionCarouselSlide = {
  key: string
  label: string
  heading: string
  bullets: string[]
  images?: { src: string; alt: string; caption?: string }[]
}

export type ProjectPAAR = {
  problem: ProjectPAARSection & { stats?: ProjectMetric[] }
  analysis: ProjectPAARSection
  action: ProjectPAARSection & { carousel?: ActionCarouselSlide[] }
  result: ProjectPAARSection
}

export type Project = {
  slug: string
  title: string
  subtitle: string
  category: "MLOps" | "AI Agent" | "Side Project"
  description: string
  techStack: string[]
  role?: string
  timeframe?: string
  links?: ProjectLink[]
  metrics?: ProjectMetric[]
  diagramImage?: string
  paar?: ProjectPAAR
  presentation?: ProjectPresentation
}

export const projects: Project[] = [
  {
    slug: "savee-chatbot-api",
    title: "세이비 챗봇 API",
    subtitle: "BEMS 데이터를 자연어로 묻는 LangGraph 에이전트",
    category: "AI Agent",
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
    role: "백엔드/에이전트/인프라 개발, 프론트엔드 1명·PM 1명과 협업",
    timeframe: "2025.08–2025.11",
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
    slug: "savee-chatbot-api-v2",
    title: "세이비 챗봇 API V2",
    subtitle: "semantic routing과 품질/보안 인프라 관리",
    category: "AI Agent",
    description:
      "21개 대시보드 중 어디를 봐야 할지 헤매는 사용자를 위해 챗봇이 질문과 관련된 화면으로 직접 연동해주는 semantic routing을 직접 발굴해 확장했고, 세션 영속화·에이전트 평가 시스템·DSPy 프롬프트 최적화·role/tier 기반 접근 제어까지 품질·보안 인프라를 단독으로 구축했습니다. 저신뢰 라우팅 정확도를 50%에서 100%(holdout)로 올리고, semantic routing 오분류를 60%(25건→10건) 줄였습니다.",
    techStack: [
      "Python",
      "LangGraph",
      "FastAPI",
      "WebSocket",
      "PostgreSQL",
      "DSPy",
      "MLflow",
      "Langfuse",
      "AWS ECS",
    ],
    role: "백엔드/에이전트/인프라 개발, 프론트엔드 1명·PM 1명과 협업",
    timeframe: "2026.05–2026.08 (dev 브랜치 QA 중, main 미배포)",
    metrics: [
      { value: "50%→100%", label: "저신뢰(threshold 0.47 미만) 라우팅 정확도, DSPy bootstrap holdout 측정" },
      { value: "오분류 25→10건(60%↓)", label: "158개 라벨링 쿼리, wrong-route 5배 페널티 준 weighted F1로 threshold 재설계" },
      { value: "접근 제어 0→매트릭스", label: "6단계 권한×3플랜 티어×14카테고리를 fail-closed로 강제" },
    ],
    paar: {
      problem: {
        heading: "3개월 손 놓았던 챗봇, 대시보드 21개를 다시 들여다보다",
        bullets: [
          "프로덕트 내부 대시보드가 21개나 있어 사용자가 원하는 정보를 확인하려 할 때 어느 탭부터 봐야 할지 몰라 헤멘다는 피드백 발생",
          "Savee 대시보드가 21개나 있어 사용자가 원하는 정보를 확인하려 할 때 어느 탭부터 봐야 할지 몰라 헤매는 문제를 직접 인지",
          "채팅 세션 미저장으로 대화가 이어지지 않는 근본 결함, 5개 LLM 의사결정 지점의 회귀를 감으로만 판단하던 상태, role/tier가 파이프라인 어디에도 반영되지 않아 생기는 접근 제어 보안 위험",
        ],
        stats: [
          { value: "21개", label: "사용자가 헤매던 대시보드 화면" },
          { value: "3개월", label: "손대지 못한 공백 (2~5월)" },
          { value: "0", label: "권한·티어를 반영한 접근 제어" },
        ],
      },
      analysis: {
        heading: "오답과 fallback을 같은 값으로 치지 않기로 했다",
        bullets: [
          "LLM 프롬프트 분류(호출 비용)와 키워드/룰 매칭(자연어 다양성 못 커버)을 기각하고 임베딩 코사인 유사도 라우팅 채택",
          "text-embedding-3-small(55%)과 -large(91%)를 비교, 비용은 6.5배지만 하루 10만 쿼리 가정 시 월 $3 차이라 large 채택",
          "표준 F1(threshold 0.33)이 오답과 모른다는 fallback을 같은 비용으로 취급한다는 걸 발견하고, wrong-route에 5배 페널티를 준 weighted F1로 threshold 0.47을 다시 구함",
          "LangGraph 내장 체크포인터는 프론트가 쓸 세션 조회 API 형태가 아니라 기각하고, 커스텀 chat_users/chat_sessions 스키마와 REST API를 직접 설계",
          "권한 체크를 websocket 미들웨어가 아니라 그래프 내부 노드(resolve_access_context)에 둬 기존 분류 인프라를 재사용하고, 두 레포에 이중 게이트(fail-closed)를 설치",
        ],
      },
      action: {
        heading: "라우팅·세션 영속화·품질 인프라, 세 축을 혼자 구현",
        bullets: [
          "21개 라우트로 semantic routing을 확장하고, 저신뢰 구간은 DSPy 폴백 3지점(P0-relevance/classification, P1-fallback)을 MLflow 후보→챔피언 승격 워크플로우로 서빙 전환",
          "chat-history v2(커스텀 스키마+REST API), LLM 세션 타이틀 자동 생성, 단건/batch 세션 삭제로 대화 영속화를 완성",
          "5개 LLM 의사결정 지점을 검증하는 오프라인 평가 시스템(evals), role/tier 기반 fail-closed 접근 제어, LangGraph v1 마이그레이션, JSON 구조화 로깅, CI/CD 빌드 캐싱까지 품질·보안·운영 인프라를 정리",
        ],
      },
      result: {
        heading: "저신뢰 라우팅 50%→100%, 오분류 60%↓",
        bullets: [
          "저신뢰(threshold 0.47 미만) 라우팅 정확도 50%→100%로 개선 (evals 프레임워크, DSPy bootstrap holdout split 측정)",
          "semantic routing 오분류 25건→10건(60%↓), 158개 라벨링 쿼리·weighted F1 threshold 0.47 기준. 대신 fallback이 1건→43건으로 늘어나는 트레이드오프를 감수",
          "DSPy 모델을 요청 경로 대신 FastAPI lifespan에서 1회만 로드하도록 바꿔, 요청당 약 40초였던 콜드스타트 지연을 구조적으로 제거",
          "접근 제어 커버리지를 0에서 6단계 권한×3플랜 티어×14카테고리 매트릭스로 fail-closed 강제. evals 회귀 사례, 접근 제어 배포 후 실사용 감사, chat-history 사용량은 아직 측정하지 않아 수치화하지 않음",
        ],
      },
    },
  },
  {
    slug: "newsletter-automation",
    title: "오토마타 뉴스레터 자동화",
    subtitle: "LangGraph 멀티에이전트 기반 AI 뉴스레터 자동 발행 시스템",
    category: "AI Agent",
    description:
      "매주 발행하는 AI 뉴스레터의 리서치와 작성에 부담을 느껴 자동화를 시작했지만, 오픈엔드 에이전트에게 전부 맡기는 방식은 실제 운영에서 토픽 품질을 보장하지 못했습니다. 검색과 랭킹은 결정론적 파이프라인으로 옮기고 토픽 선정에는 Human-in-the-Loop 승인 단계를 남기는 구조로 다시 설계했습니다. 현재도 실제로 매주 발행 중이며, LangSmith로 실측한 실행당 평균 소요 시간은 27분, 비용은 1.06달러입니다.",
    techStack: [
      "Python",
      "LangGraph",
      "deepagents",
      "Claude API",
      "Tavily API",
      "GitHub API",
      "LangSmith",
    ],
    role: "에이전트 개발",
    timeframe: "2026.01–2026.08 (진행 중)",
    links: [
      { label: "Repository", href: "https://github.com/tmdqja75/newsletter-automation-gpters/tree/personal" },
      { label: "뉴스레터", href: "https://maily.so/automata" },
    ],
    metrics: [
      { value: "27분·$1.06", label: "실행당 평균 (LangSmith 실측 12회, 범위 7~66분·$0.71~$1.54)" },
      { value: "오픈엔드→결정론적+HITL", label: "토픽 품질 저하를 겪은 뒤 에이전트 아키텍처 재설계" },
      { value: "실제 발행 중", label: "매주 실사용 시스템" },
    ],
    paar: {
      problem: {
        heading: "리서치 1주, 작성 1시간, 매주 반복",
        bullets: [
          "매주 발행하는 AI 뉴스레터를 위해 리서치가 한 주에 걸쳐 분산되고, 작성에도 별도로 한 시간이 들어 개인 시간 부담이 컸음",
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
          "현재도 실제로 매주 뉴스레터 발행에 쓰이고 있음",
        ],
      },
    },
  },
  {
    slug: "aws-mlops-platform",
    title: "AWS 기반 MLOps 플랫폼",
    subtitle: "팀이 함께 쓰는 ML 모델 배포 표준과 인프라 설계",
    category: "MLOps",
    description:
      "모델 실험은 각자 로컬 환경에 흩어져 있었고 운영 추론은 Lambda 코드를 사람이 직접 고쳐 배포하던 시기였습니다. 팀원 두 명이 퇴사하면서 플랫폼 구축을 사실상 혼자 맡게 됐고, SageMaker와 단일 EC2 다중 컨테이너 구성을 검토했지만 1인 운영 부담과 장애 전파 범위가 걸림돌이었습니다. BentoML로 서비스 패키징을 표준화하고 ECS Fargate로 배포 단위를 나눈 뒤, MLflow(실험·아티팩트)와 DynamoDB(건물별 배포 구성)의 역할을 분리하고 Prometheus·Grafana로 서빙 상태를 먼저 확인하는 구조를 만들었습니다. 수동 배포에 약 30분이 걸리던 것이 GitHub Actions 실배포 60건 기준 중앙값 4.71분으로 줄었고, 지금은 다른 데이터 사이언티스트 2명도 이 경로로 자신의 모델을 배포하고 있습니다.",
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
        heading: "체계화 되지 않은 팀 내 ML 모델 배포 프로세스",
        bullets: [
          "데이터 사이언티스트마다 로컬에서 따로 실험해 파라미터와 성능 지표를 한곳에서 비교하기 어려웠음",
          "전처리·재학습 모델·비즈니스 규칙이 바뀔 때마다 AWS Lambda 추론 코드를 사람이 직접 고쳐 다시 배포해야 했음",
          "입력 데이터 불일치나 모델 추론 실패를 알려주는 중앙 모니터링이 없어 오류가 웹 UI 정확도에 영향을 준 뒤에야 디버깅을 시작했음",
          "여러 팀원이 함께 공유하고 배포할 수 있는 표준 경로가 필요해졌다고 판단하여 프로덕트 MLOps 플랫폼 구축에 착수",
        ],
        stats: [
          { value: "약 30분", label: "기존 수동 배포(회고 추정)" },
          { value: "1명", label: "플랫폼 구축·운영 담당" },
          { value: "사후 감지", label: "기존 장애 대응 방식" },
        ],
      },
      analysis: {
        heading: "SageMaker/단일 EC2/BentoML+ECS Fargate 비교",
        bullets: [
          "SageMaker를 실제로 도입해봤지만 팀원 2명이 퇴사한 뒤 혼자 설정·운영하기엔 복잡성과 부담이 과했음",
          "단일 EC2에 여러 Docker 서비스를 올리는 방식도 시도했으나 디스크 용량 과부하나 원인 불명의 이유로 EC2 호스트가 다운되면, 모든 서비스들이 중단되버리는 이슈 발생",
          "모델별 FastAPI와 커스텀 Dockerfile도 검토했지만 의존성 패키징·모델 로딩·오류 응답·빌드 규칙을 매번 새로 구현해야 해 1인 운영에 불리했음",
          "BentoML을 서비스 정의와 컨테이너 패키징의 표준 계약으로 삼고 ECS Fargate로 모델 서비스를 독립 배포 단위로 격리해 장애 전파 범위를 줄였음",
          "MLflow(실험·아티팩트)와 DynamoDB(건물별 배포 구성), Prometheus·Grafana(EC2 자체 호스팅)로 계층을 나눴음. 유연한 스키마는 시간이 지나며 타입 드리프트를 허용했고, 자체 호스팅 모니터링은 단일 호스트 운영 책임을 그대로 남겼음",
        ],
      },
      action: {
        heading: "기록·패키징·배포·관측을 한 경로로",
        bullets: [
          "MLflow를 ECS에 배포하고 RDS 백엔드와 S3 아티팩트 저장소를 연결해 학습 코드의 실험 로깅 규칙을 공통화",
          "BentoML 서비스 템플릿과 scikit-learn Pipeline 전처리, 공통 API·오류 응답, Prometheus 메트릭 규칙을 설계",
          "변경된 앱 탐지, 컨테이너 빌드, ECR 푸시, ALB 라우팅 검증, ECS 서비스 갱신까지 GitHub Actions로 자동화",
          "Prometheus·Grafana를 EC2 DS 서버에서 운영하며 건물 식별 라벨과 커스텀 지표를 추가하고 Slack 알림으로 연결",
          "모델 알고리즘·건물별 비즈니스 로직·DynamoDB 조회 코드는 각 담당자가 맡고, 본인은 플랫폼 계층 전체를 설계·구현·운영 진행",
        ],
      },
      result: {
        heading: "ML 모델 API 배포 시간 30분에서 약 4분으로 단축",
        bullets: [
          "ML 모델별 다양한 실험들을 MLFlow 서버로 기록하고, MLFlow UI에서 한 눈에 비교하여 최적 모델을 선택할 수 있게 됨",
          "수동 Lambda 배포 약 30분에서 GitHub Actions 실배포 중앙값 4.71분으로 줄었음",
          "다른 데이터 사이언티스트 2명이 같은 경로로 자 BentoML 서비스를 배포하고 있음",
        ],
      },
    },
  },
  {
    slug: "claude-code-codex-training",
    title: "사내 Coding Agent 활용 교육",
    subtitle: "컨텍스트 엔지니어링을 중심으로 설계한 Claude Code·Codex 워크숍",
    category: "AI Agent",
    description:
      "Claude Code와 Codex 같은 Coding Agent를 안전하고 재현 가능하게 쓰기 위한 사내 워크숍이다. 회사와 팀장 요청으로 시작했고, 교육 콘텐츠 구성과 44페이지 자료 제작, 진행을 단독으로 맡았다.",
    techStack: ["Claude Code", "Codex", "MCP", "Subagents", "Skills", "Context Engineering"],
    role: "기획/자료 제작/발표 담당",
    timeframe: "2026.04",
    metrics: [
      { value: "44페이지", label: "직접 제작한 발표 자료" },
      { value: "1회 워크숍", label: "사내 개발자·데이터 사이언티스트 대상 진행" },
      { value: "5~15명", label: "참석 대상 규모" },
    ],
    presentation: {
      src: "/projects/claude-code-codex-training.pdf",
      title: "Coding Agent 사용법 발표를 위해 직접 제작한 발표 자료",
      pageCount: 44,
    },
    paar: {
      problem: {
        heading: "사내 새로운 Coding Agent 도입",
        bullets: [
          "회사가 Claude Code·Codex 같은 Coding Agent의 도입과 확산을 검토하면서, 개발자와 데이터 사이언티스트가 실제 업무에 적용할 수 있는 교육이 필요했음",
          "개발자/데이터사이언티스트 팀 대상으로 ",
          "개발자 팀에서도 코덱스/클로드 코드가 개발 컨벤션을 잘 지키지 못하거나 환각 (hallucination) 문제를 겪는 사례가 있었음",
        ],
      },
      analysis: {
        heading: "단순한 사용법을 넘어 작동 원리를 설명하기",
        bullets: [
          "단순히 클로드 코드/코덱스 명령어와 사용법을 나열하는 교육은 ",
          "LLM과 Agent의 작동 원리를 함께 설명하면, 사용자가 컨텍스트를 설계하고 설정 파일을 구성할 때 의도와 결과를 더 잘 맞출 수 있다고 판단",
          "LLM이 토큰을 순차 생성하는 방식과 환각이 생기는 이유부터 설명해 Coding Agent의 동작 원리를 먼저 맞췄음",
          "맥락 없는 명령과 길어지는 대화가 결과 품질에 미치는 영향을 바탕으로, Agent를 잘 쓰는 일은 컨텍스트 창을 채우는 일이라는 관점으로 교육을 구성했음",
          "Memory, MCP, Subagents, Skills, Plugins, Plan Mode가 메인 컨텍스트 창을 구성하거나 아끼는 방식을 비교해 설명했음",
          "API 키 노출, MCP 권한 범위, `--dangerously-skip-permissions`처럼 실사용 중 놓치기 쉬운 보안 문제를 별도 주제로 다뤘음",
        ],
      },
      action: {
        heading: "발표자료 제작 및 워크샵 진행",
        bullets: [
          "LLM과 Agent 기초, 컨텍스트 엔지니어링, Claude Code 핵심 컴포넌트, 실사용 케이스, 팁과 주의사항까지 이어지는 발표 자료를 직접 설계·제작",
          "개발자 사례에서는 GitHub Issue를 Skills, Memory, Plan Mode로 해결하고 PR을 만드는 흐름을, 비개발자 사례에서는 MCP, Subagents, Skills를 조합한 리서치 흐름을 시연했음",
          "Codex에서 대응되는 설정 파일과 구성 차이도 정리해 Claude Code 사용자가 다른 Coding Agent로 옮겨갈 때의 기준을 제공했음",
          "컨텍스트와 설정 파일을 팀에 공유할 때 민감정보를 제외하고 MCP는 읽기 권한부터 부여하는 실전 원칙을 담았음",
        ],
      },
      result: {
        heading: "빨리진 프로토타입 및 자로 생성",
        bullets: [
          "데이터사이언스 팀에서도 Claude Code와 Codex를 활용하여 데이터 분석 결과를 사용자에게 쉽게 표출할 수 있는 웹 대시보드 프로토타입 생성 가능하게 됨",
          "개발자 팀에서도 Claude Code와 Codex를 활용하여 코드 생성과 리뷰 프로세스를 자동화할 수 있는 프로세스를 개발하게 됨",
        ],
      },
    },
  },
  {
    slug: "dxf-panel-parser",
    title: "DXF 분전반 도면 파서",
    subtitle: "VLM 기반 분전반 CAD → 엑셀 자동 변환 플랫폼",
    category: "AI Agent",
    description:
      "수주마다 분전반 도면 20~60장의 회로표를 팀원이 손으로 옮겨 적어 프로젝트당 10~30시간이 걸렸습니다. 도면마다 레이아웃이 제각각이라 DXF 텍스트 직접 파싱은 일반화가 어렵고, OCR은 표 구조 복원에 별도 로직이 필요해 인식과 구조화를 한 번에 처리하는 VLM(Claude/GPT) 방식을 택했습니다. 정확도는 주장 대신 직접 만든 사람 투표 도구로 측정했고, 크롭·프롬프트 엔지니어링·few-shot 개선을 거쳐 실도면 3건·패널 약 200개 기준 두 모델 모두 정답 비율을 35.0%에서 91.7%까지 끌어올렸습니다.",
    techStack: ["Python", "OpenAI API", "FastAPI", "Docker"],
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
        image: "/projects/dxf-panel-parser-original-cad.png",
        bullets: [
          "새로운 건물을 수주할 때마다 위 예시처럼 수많은 분전반 CAD 도면을 팀원이 손으로 옮겨 적음",
          "도면을 ",
          "CAD 도면 작업에 드는 시간 비용을 줄이기 위해 직접 개발 착수",
        ],
      },
      analysis: {
        heading: "정확도와 개발 비용을 고려한 분전반 CAD 도면 파싱 방법 고려",
        bullets: [
          "도면마다 레이아웃이 제각각이라 규칙 기반 파서를 일반화하기 어려워 CAD 파일 (DXF 파일) 텍스트를 직접 파싱하는 방법은 비효울적일 것이라 판단",
          "CAD도면에 맞는 OCR을 새로 훈련해야 되서 OCR도 정확도가 낮아 개발 비용 대비 효율이 떨어질 것이라 판단",
          "분전반 이미지를 한 번에 처리해 구조화를 프롬프트 하나로 동시에 처리하는 VLM이 가장 효율적",
          "Hallucination과 분전반 패널 이미지 해상도에 따라 정확도를 100%를 보장할 수 없다는 판단을 내리고, 사람이 결과를 검증하는 투표 도구를 직접 만들어 신뢰도를 수치화하기로 계획",
        ],
      },
      action: {
        heading: "VLM 기반 CAD→Excel 파싱 파이프라인 설계 + 다양한 전처리 방식과 VLM 모델 조합 정확도 실험 진행",
        bullets: [
          "CAD 도면의 기하 연산(ezdxf)으로 분전반 영역 자동 탐지",
          "Claude Sonnet 4.5, GPT 5.4 모델들을 다양한 전처리 방식으로 실험하여 정확도 비교",
          "전처리 방식은 ①원본, ②크롭, ③크롭+few-shot, ④크롭+few-shot+프롬프트 엔지니어링으로 나눠 실험",
          "정확도 측정을 위해 Claude Code와 바이브 코딩으로 사람 투표 평가 웹 플랫폼을 직접 제작해 체계적으로 각 실험 결과 정량화",
          "FastAPI 웹앱(업로드 → SSE 진행률 → Excel 내보내기)까지 설계 및 구현, Docker로 패키징",
        ],
        carousel: [
          {
            key: "experiment",
            label: "실험",
            heading: "2개 모델 × 4단계 전처리로 정확도 비교",
            bullets: [
              "Claude Sonnet 4.5와 GPT-5.4 두 모델에 원본, 크롭, 크롭+few-shot, 크롭+few-shot+프롬프트 엔지니어링 네 가지 전처리 조합을 각각 적용",
              "반복되는 빈 격자 행을 잘라내는 크롭만으로도 인식 정확도가 눈에 띄게 올라가는 것을 확인",
              "크롭 전후 이미지를 나란히 비교하며 VLM이 더 짧고 밀도 높은 이미지에서 회로표를 더 정확히 읽어내는 것을 검증",
            ],
            images: [
              {
                src: "/projects/dxf-panel-parser-crop-before.png",
                alt: "빈 행이 그대로 남아있는 분전반 표 원본 이미지",
                caption: "원본: 반복되는 빈 격자 행이 그대로 포함됨",
              },
              {
                src: "/projects/dxf-panel-parser-crop-after.png",
                alt: "빈 행을 잘라내 압축한 분전반 표 이미지",
                caption: "크롭 후: 빈 행을 제거해 이미지 높이를 줄임",
              },
            ],
          },
          {
            key: "verification",
            label: "검증",
            heading: "사람 투표로 정확도를 측정하는 평가 플랫폼을 직접 제작",
            bullets: [
              "Claude Code와 빠르게 주고받으며(바이브 코딩) 두 모델의 결과를 나란히 비교하고 투표하는 뷰어(viewer.html)를 직접 제작",
              "표준 라이브러리 http.server로 만든 뷰어 서버가 투표를 실험 단계별 CSV로 기록하고, 값이 다른 셀만 강조하는 Diff Only 모드로 대조 부담을 줄임",
              "투표 CSV를 단계별로 집계해 35.0%→72.9%→91.7% 개선 폭을 원형 차트·승률 막대·헤드투헤드 비교로 보여주는 Trial 비교 리포트까지 제작",
            ],
            images: [
              {
                src: "/projects/dxf-panel-parser-voting-tool.png",
                alt: "패널 이미지와 Claude·GPT 추출 결과를 나란히 놓고 투표하는 자체 제작 평가 도구 화면",
                caption:
                  "정확도를 주장 대신 측정하려고 직접 만든 투표 플랫폼. 패널마다 두 모델 결과를 나란히 놓고 하나씩 직접 투표해 정량 비교 데이터를 모았다.",
              },
            ],
          },
          {
            key: "deployment",
            label: "배포",
            heading: "FastAPI와 Docker로 만든 사내 배포용 웹 앱",
            bullets: [
              "업로드부터 SSE 진행률 스트리밍, 결과 수정, Excel 내보내기까지 브라우저 하나로 끝나는 FastAPI 웹앱을 구현",
              "ODA File Converter와 나눔폰트, Xvfb(가상 프레임버퍼)를 함께 패키징한 Docker 이미지로 GUI 없는 서버 환경에서도 그대로 동작하게 구성",
            ],
            images: [
              {
                src: "/projects/dxf-panel-parser-webapp-processing.png",
                alt: "DWG에서 DXF 변환, 분전반 추출, 분전반 분석 3단계 진행률과 실시간 처리 로그를 보여주는 웹앱 화면",
                caption: "업로드 후 SSE로 스트리밍되는 3단계 처리 진행률과 로그",
              },
              {
                src: "/projects/dxf-panel-parser-webapp-results.png",
                alt: "분전반별 회로표를 표로 보여주고 엑셀로 내보내는 결과 화면",
                caption: "패널별 회로표 결과 확인·수정과 Excel 내보내기 화면",
              },
            ],
          },
        ],
      },
      result: {
        heading: "패널 파싱 정확도를 35%에서 92%까지",
        bullets: [
          "실도면 3건·패널 약 200개를 사람 투표로 검증한 결과, 두 모델 모두 정답 비율이 35.0%→72.9%→91.7%로 올라감",
          "크롭+프롬프트 엔지니어링이 가장 큰 개선(+37.9%p), few-shot 추가가 2차 개선(+18.8%p)",
          "단계별로 뜯어보면 원본 단계에서는 Claude가 GPT보다 패널 143/200개 대 111/200개로 앞섰지만, 개선이 쌓일수록 격차가 좁혀져 few-shot 단계에서는 195/204 대 196/204로 사실상 동률에 도달함",
          "도면 1장당 회로표 정리 시간 30분+→수분 대로 단축, 현재도 실사용 중",
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
