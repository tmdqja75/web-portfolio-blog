# 사내 Coding Agent 활용 교육 프로젝트 명세

## 목적

포트폴리오 `Projects` 페이지에 사내 Coding Agent 활용 교육 프로젝트를 추가한다. 이 항목은 런타임 제품이나 조직 도입 성과가 아니라, Claude Code와 Codex를 안전하고 재현 가능하게 쓰도록 돕는 Developer Enablement 역량의 증거다.

## 근거와 표현 경계

- 2026년 사내 개발자와 데이터 사이언티스트 5~15명 대상 1회성 워크숍
- 회사와 팀장 요청으로 시작했으며, 교육 콘텐츠 구성, 자료 제작, 진행 방식은 단독 담당
- 직접 제작한 발표 자료는 44페이지 PDF이며 공개 가능
- 워크숍 이후 비공식 구두 피드백은 있었지만, 사용률, 생산성, 만족도, 도입 효과를 뒷받침하는 정량 지표는 없음
- "도입을 주도했다", "생산성을 높였다", "조직 전체에 확산했다" 같은 측정되지 않은 결과는 쓰지 않음
- Claude Code, Codex, MCP, Subagents, Skills, Context Engineering은 교육에서 다룬 주제이며, 이 프로젝트의 제품 런타임 스택으로 표현하지 않음

## 프로젝트 데이터

새 프로젝트는 기존 `AI Agent` 카테고리에 넣는다. 새 카테고리는 추가하지 않는다. `categories`는 프로젝트 데이터에서 자동 생성하므로 필터 UI를 수정할 필요가 없다.

| 필드 | 값 |
| --- | --- |
| slug | `claude-code-codex-training` |
| title | 사내 Coding Agent 활용 교육 |
| subtitle | 컨텍스트 엔지니어링을 중심으로 설계한 Claude Code·Codex 워크숍 |
| category | AI Agent |
| role | 기획·자료 제작·진행 단독 담당 |
| timeframe | 2026 |
| techStack | Claude Code, Codex, MCP, Subagents, Skills, Context Engineering |
| image | `/projects/claude-code-codex-training-banner.png` |

TL;DR 항목은 다음 세 개로 한정한다.

1. `44페이지`: 직접 제작한 발표 자료 분량
2. `1회 워크숍`: 사내 개발자·데이터 사이언티스트 대상 진행 형태
3. `5~15명`: 참석 대상 규모

## PAAR 내용

### Problem

제목은 교육 필요성이 드러나는 구체적 문구로 정한다. 회사가 Claude Code와 Codex 같은 Coding Agent의 도입을 검토하고 확산하던 시점에, 개발자와 데이터 사이언티스트가 도구를 안전하게 실사용할 수 있도록 돕는 교육이 필요했다는 맥락을 담는다.

### Analysis

단순 설치와 명령어 안내만으로는 부족하다고 판단한 이유를 적는다. 맥락이 부족한 명령, 길어지는 대화에서의 성능 저하, 권한이 넓은 도구 설정의 위험을 설명하고, 컨텍스트 엔지니어링을 중심으로 내용을 구성한 결정을 보여 준다.

### Action

LLM과 Agent의 기본 원리, Claude Code의 Memory, MCP, Subagents, Skills, Plugins, Plan Mode, 개발자와 비개발자 사용 사례, Codex 대응 설정, 보안 주의사항까지 포함한 44페이지 자료를 직접 설계하고 제작한 사실을 담는다. API 키 노출 방지, MCP 읽기 권한 우선, `--dangerously-skip-permissions`의 위험을 구체적으로 언급한다.

### Result

공개 가능한 44페이지 자료와 1회 워크숍 진행 자체를 산출물로 제시한다. 설문, 채택률, 사용량, 생산성 지표가 없다는 점을 명확히 쓴다.

## 발표 자료 열람

원본 PDF는 `public/projects/claude-code-codex-training.pdf`에 둔다. 프로젝트 데이터에는 PDF 경로, 접근성 제목, 페이지 수를 담는 선택형 `presentation` 메타데이터를 추가한다. 발표 자료가 없는 기존 프로젝트는 이 데이터를 갖지 않는다.

프로젝트 상세 화면의 TL;DR 아래와 PAAR 본문 위에 `PRESENTATION` 섹션을 둔다.

- 제목: `Claude Code / Codex: Coding Agent 능력치 최대한 끌어올리기`
- 보조 문구: `직접 제작한 44페이지 워크숍 자료`
- 브라우저 내장 PDF 뷰어를 `iframe`으로 렌더링
- iframe에는 문서를 설명하는 고유 `title`을 제공
- PDF 로딩에는 `loading="lazy"` 적용
- 데스크톱과 모바일 모두 가로 넘침 없이 표시
- PDF를 iframe으로 표시할 수 없는 브라우저에서는 같은 문서를 새 탭으로 여는 링크 제공
- 대체 링크 문구: `새 탭에서 자료 보기`
- 다운로드 버튼, 파일 다운로드 유도 문구, 별도 PDF 렌더링 라이브러리는 추가하지 않음

PDF는 공개 정적 파일이므로 방문자가 브라우저 기능으로 저장할 수 있다. 이를 차단하려는 기능은 추가하지 않는다.

## 시각 자산

`public/projects/claude-code-codex-training-banner.png`는 원본 PDF 1페이지를 변환해 만든 16:9 PNG다. 프로젝트 카드와 상세 상단 배너는 같은 이미지를 쓴다. 이 배너는 직접 제작한 발표 자료라는 근거를 첫 화면에서 보여 준다.

## 구현 영향

변경 대상은 다음으로 한정한다.

- `src/app/projects/data.ts`: 선택형 발표 자료 메타데이터 타입과 새 프로젝트 레코드
- `src/components/projects/project-detail-content.tsx`: `presentation`이 있는 프로젝트에만 표시할 발표 자료 섹션
- `public/projects/claude-code-codex-training.pdf`: 원본 PDF 사본
- `public/projects/claude-code-codex-training-banner.png`: PDF 첫 페이지 기반 배너

`ProjectDetailContent`는 전체 상세 경로와 인터셉트 모달이 함께 사용한다. 따라서 새 자료 섹션은 직접 URL 접근과 프로젝트 목록에서 연 모달 양쪽에 동일하게 표시돼야 한다. 기존 PAAR 프로젝트, 다이어그램, 링크 UI는 바꾸지 않는다.

## 검증

1. `npx tsc --noEmit`을 실행해 타입 검사를 통과하는지 확인한다.
2. `npx eslint src/`를 실행해 수정한 소스와 기존 소스가 린트 규칙을 통과하는지 확인한다.
3. 개발 서버에서 카드 배너, `AI Agent` 필터, 직접 상세 경로, 인터셉트 모달을 확인한다.
4. 데스크톱과 모바일 폭에서 iframe의 가로 넘침, 제목, PDF 표시, 대체 링크를 확인한다.
5. `/projects/claude-code-codex-training.pdf`와 배너 PNG가 실제 정적 경로에서 열리는지 확인한다.
6. 기존 작업 트리에 있던 블로그와 설정 변경은 수정하지 않는다.
