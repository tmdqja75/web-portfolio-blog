"use client"

import { motion, useReducedMotion } from "motion/react"
import { FaAws, FaChartLine, FaGlobe, FaPlug } from "react-icons/fa6"
import { SiDocker, SiFastapi, SiGithubactions, SiLangchain, SiPostgresql, SiStreamlit } from "react-icons/si"

function buildVariants(instant: boolean) {
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: instant ? 0 : 0.1, delayChildren: instant ? 0 : 0.05 } },
  }
  const step = {
    hidden: { opacity: 0, y: instant ? 0 : 10 },
    visible: { opacity: 1, y: 0, transition: { duration: instant ? 0 : 0.4, ease: "easeOut" as const } },
  }
  const fade = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: instant ? 0 : 0.3 } },
  }
  return { container, step, fade }
}

// Reserved width on the right of every box for its icon (icon + gap + margin).
const ICON_RESERVE = 56

const NODES = [
  { x: 40, y: 92, w: 330, h: 62, title: "웹 클라이언트", sub: "(프론트엔드 개발자와 API 협업)", Icon: FaGlobe },
  { x: 410, y: 92, w: 330, h: 62, title: "Streamlit UI", sub: "(개발·디버깅용)", Icon: SiStreamlit },
  { x: 40, y: 196, w: 700, h: 64, title: "FastAPI + WebSocket 서버", sub: "(첫 토큰부터 실시간 스트리밍)", Icon: SiFastapi },
  { x: 790, y: 196, w: 490, h: 64, title: "Langfuse", sub: "(트레이스 로깅 · 관측)", Icon: FaChartLine },
  { x: 790, y: 372, w: 235, h: 50, title: "MCP 서버", sub: "(ds-llm-building-mcp)", Icon: FaPlug },
  { x: 1045, y: 372, w: 235, h: 50, title: "PostgreSQL", sub: "(SQLAlchemy async)", Icon: SiPostgresql },
  { x: 40, y: 496, w: 360, h: 64, title: "GitHub Actions", sub: "(CI: 테스트 · 빌드)", Icon: SiGithubactions },
  { x: 440, y: 496, w: 360, h: 64, title: "Docker → ECR", sub: "(이미지 빌드 · 푸시)", Icon: SiDocker },
  { x: 840, y: 496, w: 400, h: 64, title: "ECS (dev / prod)", sub: "(컨테이너 배포)", Icon: FaAws },
]

export function ChatbotArchitectureDiagram() {
  const shouldReduceMotion = useReducedMotion()
  const { container, step, fade } = buildVariants(!!shouldReduceMotion)

  return (
    <motion.svg
      viewBox="0 0 1320 610"
      className="h-auto w-full"
      fontFamily="-apple-system, 'Segoe UI', ui-sans-serif, sans-serif"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={container}
    >
      <defs>
        <pattern id="chatbot-architecture-grid-fine" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" strokeWidth="1" className="stroke-black/[0.035] dark:stroke-white/[0.05]" />
        </pattern>
        <pattern id="chatbot-architecture-grid-bold" width="120" height="120" patternUnits="userSpaceOnUse">
          <path d="M 120 0 L 0 0 0 120" fill="none" strokeWidth="1" className="stroke-black/[0.06] dark:stroke-white/[0.08]" />
        </pattern>
      </defs>

      <rect width="1320" height="610" fill="url(#chatbot-architecture-grid-fine)" />
      <rect width="1320" height="610" fill="url(#chatbot-architecture-grid-bold)" />

      <text x="40" y="30" fontSize="17" fontWeight="600" letterSpacing="1.7" className="fill-[#888888] dark:fill-zinc-500">
        ARCHITECTURE
      </text>
      <text x="40" y="60" fontSize="20" className="fill-[#4d4d4d] dark:fill-zinc-400">
        요청 한 번이 클라이언트에서 DB까지 거치는 경로
      </text>

      {NODES.map((n) => (
        <motion.g key={n.title} variants={step}>
          <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="10" fill="none" className="stroke-[#a1a1a1] dark:stroke-zinc-700" />
          <text
            x={n.x + (n.w - ICON_RESERVE) / 2}
            y={n.y + n.h / 2 - 5}
            fontSize="16"
            fontWeight="600"
            textAnchor="middle"
            className="fill-[#171717] dark:fill-white"
          >
            {n.title}
          </text>
          <text
            x={n.x + (n.w - ICON_RESERVE) / 2}
            y={n.y + n.h / 2 + 15}
            fontSize="13"
            textAnchor="middle"
            className="fill-[#888888] dark:fill-zinc-500"
          >
            {n.sub}
          </text>
          <n.Icon
            x={n.x + n.w - 36}
            y={n.y + n.h / 2 - 10}
            size={20}
            className="text-[#888888] dark:text-zinc-500"
          />
        </motion.g>
      ))}

      {/* LangGraph Agent — hero box with nested db_agent subgraph */}
      <motion.g variants={step}>
        <rect x="40" y="302" width="700" height="120" rx="10" fill="none" strokeWidth="2" className="stroke-[#171717] dark:stroke-white" />
        <text x="64" y="336" fontSize="20" fontWeight="600" className="fill-[#171717] dark:fill-white">
          LangGraph Agent
        </text>
        <text x="64" y="360" fontSize="13" className="fill-[#888888] dark:fill-zinc-500">
          (관련성 판단 → 병렬 수집 → 정보추출 → 응답생성)
        </text>
        <SiLangchain x="696" y="318" size="28" className="text-[#171717] dark:text-white" />
        <rect x="64" y="376" width="652" height="38" rx="8" fill="none" strokeDasharray="4 4" className="stroke-[#a1a1a1] dark:stroke-zinc-700" />
        <text x="390" y="400" fontSize="14" fontWeight="500" textAnchor="middle" className="fill-[#4d4d4d] dark:fill-zinc-400">
          db_agent 서브그래프 (3-노드, LLM 호출 1회)
        </text>
      </motion.g>

      {/* connectors */}
      <motion.g variants={fade} className="text-[#888888] dark:text-zinc-500">
        <line x1="205" y1="154" x2="205" y2="186" strokeWidth="2" stroke="currentColor" />
        <polygon points="199,186 205,196 211,186" fill="currentColor" />
      </motion.g>
      <motion.g variants={fade} className="text-[#888888] dark:text-zinc-500">
        <line x1="575" y1="154" x2="575" y2="186" strokeWidth="2" stroke="currentColor" />
        <polygon points="569,186 575,196 581,186" fill="currentColor" />
      </motion.g>
      <motion.g variants={fade} className="text-[#888888] dark:text-zinc-500">
        <line x1="390" y1="260" x2="390" y2="292" strokeWidth="2" stroke="currentColor" />
        <polygon points="384,292 390,302 396,292" fill="currentColor" />
      </motion.g>
      <motion.g variants={fade} className="text-[#888888] dark:text-zinc-500">
        <line x1="716" y1="396" x2="780" y2="396" strokeWidth="2" stroke="currentColor" />
        <polygon points="780,390 790,396 780,402" fill="currentColor" />
      </motion.g>
      <motion.g variants={fade} className="text-[#888888] dark:text-zinc-500">
        <line x1="1025" y1="397" x2="1035" y2="397" strokeWidth="2" stroke="currentColor" />
        <polygon points="1035,391 1045,397 1035,403" fill="currentColor" />
      </motion.g>
      <motion.g variants={fade} className="text-[#888888] dark:text-zinc-500">
        <line x1="400" y1="528" x2="430" y2="528" strokeWidth="2" stroke="currentColor" />
        <polygon points="430,522 440,528 430,534" fill="currentColor" />
      </motion.g>
      <motion.g variants={fade} className="text-[#888888] dark:text-zinc-500">
        <line x1="800" y1="528" x2="830" y2="528" strokeWidth="2" stroke="currentColor" />
        <polygon points="830,522 840,528 830,534" fill="currentColor" />
      </motion.g>

      {/* dashed observability edge: agent -> langfuse */}
      <motion.g variants={fade} className="text-[#a1a1a1] dark:text-zinc-600">
        <path d="M 740 330 C 810 330, 810 280, 850 262" fill="none" strokeWidth="2" strokeDasharray="5 5" stroke="currentColor" />
        <polygon points="844,270 850,260 856,270" fill="currentColor" />
      </motion.g>

      <line x1="40" y1="452" x2="1280" y2="452" strokeWidth="1.5" className="stroke-[#ebebeb] dark:stroke-zinc-800" />

      <text x="40" y="478" fontSize="15" fontWeight="600" letterSpacing="1.5" className="fill-[#888888] dark:fill-zinc-500">
        DEPLOYMENT
      </text>

      <text x="40" y="584" fontSize="13" className="fill-[#888888] dark:fill-zinc-500">
        * main 브랜치 반영 시 GitHub Actions가 Docker 이미지를 빌드해 ECR에 푸시하고 ECS(dev/prod) 서비스를 갱신
      </text>
    </motion.svg>
  )
}
