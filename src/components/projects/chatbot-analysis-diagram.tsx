"use client"

import { motion, useReducedMotion } from "motion/react"

function buildVariants(instant: boolean) {
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: instant ? 0 : 0.15, delayChildren: instant ? 0 : 0.05 } },
  }
  const step = {
    hidden: { opacity: 0, y: instant ? 0 : 10 },
    visible: { opacity: 1, y: 0, transition: { duration: instant ? 0 : 0.4, ease: "easeOut" as const } },
  }
  const fade = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: instant ? 0 : 0.3 } },
  }
  const outcome = {
    hidden: { opacity: 0, y: instant ? 0 : 10 },
    visible: { opacity: 1, y: 0, transition: { duration: instant ? 0 : 0.4, delay: instant ? 0 : 0.3, ease: "easeOut" as const } },
  }
  return { container, step, fade, outcome }
}

const CANDIDATES = [
  {
    x: 40,
    status: "기각",
    accepted: false,
    title: "중앙 오케스트레이터 LLM",
    reason: ["매 스텝이 오케스트레이터를 거쳐", "토큰 낭비, 실패 지점 추적 어려움"],
  },
  {
    x: 430,
    status: "기각",
    accepted: false,
    title: "n8n (노코드 워크플로우)",
    reason: ["별도 서버를 새로 운영·관리", "해야 하는 포인트가 늘어남"],
  },
  {
    x: 820,
    status: "채택",
    accepted: true,
    title: "LangGraph (노드 기반 그래프)",
    reason: ["노드별로 필요한 프롬프트만 실행", "실패 지점을 노드 단위로 추적"],
  },
]

const BOX_Y = 76
const BOX_H = 176

export function ChatbotAnalysisDiagram() {
  const shouldReduceMotion = useReducedMotion()
  const { container, step, fade, outcome } = buildVariants(!!shouldReduceMotion)

  return (
    <motion.svg
      viewBox="0 0 1200 540"
      className="h-auto w-full"
      fontFamily="-apple-system, 'Segoe UI', ui-sans-serif, sans-serif"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={container}
    >
      <defs>
        <pattern id="chatbot-analysis-grid-fine" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" strokeWidth="1" className="stroke-black/[0.035] dark:stroke-white/[0.05]" />
        </pattern>
        <pattern id="chatbot-analysis-grid-bold" width="120" height="120" patternUnits="userSpaceOnUse">
          <path d="M 120 0 L 0 0 0 120" fill="none" strokeWidth="1" className="stroke-black/[0.06] dark:stroke-white/[0.08]" />
        </pattern>
      </defs>

      <rect width="1200" height="540" fill="url(#chatbot-analysis-grid-fine)" />
      <rect width="1200" height="540" fill="url(#chatbot-analysis-grid-bold)" />

      <text x="40" y="30" fontSize="20" fontWeight="600" letterSpacing="1.7" className="fill-[#888888] dark:fill-zinc-500">
        ANALYSIS
      </text>
      <text x="40" y="60" fontSize="22" className="fill-[#4d4d4d] dark:fill-zinc-400">
        에이전트 아키텍처 후보 세 가지를 비교하고 두 개를 기각했다
      </text>

      {CANDIDATES.map((c) => (
        <motion.g key={c.title} variants={step}>
          <rect
            x={c.x}
            y={BOX_Y}
            width="340"
            height={BOX_H}
            rx="10"
            fill="none"
            className={c.accepted ? "stroke-[#171717] dark:stroke-white" : "stroke-[#a1a1a1] dark:stroke-zinc-700"}
            strokeWidth={c.accepted ? 2 : 1.5}
          />
          <rect
            x={c.x + 260}
            y={BOX_Y + 14}
            width="64"
            height="28"
            rx="14"
            className={c.accepted ? "fill-[#171717] dark:fill-white" : "fill-[#f7d4d6] dark:fill-red-950"}
          />
          <text
            x={c.x + 292}
            y={BOX_Y + 33}
            fontSize="18"
            fontWeight="600"
            textAnchor="middle"
            className={c.accepted ? "fill-white dark:fill-[#171717]" : "fill-[#c50000] dark:fill-red-400"}
          >
            {c.status}
          </text>
          <text x={c.x + 20} y={BOX_Y + 68} fontSize="22" fontWeight="600" className="fill-[#171717] dark:fill-white">
            {c.title}
          </text>
          {c.reason.map((line, i) => (
            <text key={line} x={c.x + 20} y={BOX_Y + 106 + i * 26} fontSize="19" className="fill-[#888888] dark:fill-zinc-500">
              {line}
            </text>
          ))}
        </motion.g>
      ))}

      {/* rejected paths terminate */}
      {CANDIDATES.filter((c) => !c.accepted).map((c) => (
        <motion.g key={c.x} variants={fade} className="text-[#a1a1a1] dark:text-zinc-700">
          <line x1={c.x + 170} y1={BOX_Y + BOX_H} x2={c.x + 170} y2="288" strokeWidth="2" strokeDasharray="5 5" stroke="currentColor" />
          <circle cx={c.x + 170} cy="306" r="16" fill="none" stroke="currentColor" strokeWidth="2" />
          <text x={c.x + 170} y="312" fontSize="20" textAnchor="middle" className="fill-[#a1a1a1] dark:fill-zinc-700">
            ✕
          </text>
        </motion.g>
      ))}

      {/* accepted path continues to outcome */}
      <motion.g variants={fade} className="text-[#171717] dark:text-white">
        <line x1="990" y1={BOX_Y + BOX_H} x2="990" y2="322" strokeWidth="2.5" stroke="currentColor" />
        <polygon points="978,312 990,332 1002,312" fill="currentColor" />
      </motion.g>

      <motion.g variants={outcome}>
        <rect x="770" y="336" width="390" height="140" rx="10" className="fill-[#171717] dark:fill-white" />
        <text x="794" y="372" fontSize="21" fontWeight="600" className="fill-white dark:fill-[#171717]">
          채택 후 트레이드오프
        </text>
        <g opacity="0.7">
          <text x="794" y="402" fontSize="19" className="fill-white dark:fill-[#171717]">
            스텝마다 LLM을 호출해 지연시간이 누적되는
          </text>
          <text x="794" y="428" fontSize="19" className="fill-white dark:fill-[#171717]">
            대신, 실패 지점을 노드 단위로 좁혀 디버깅은 쉬워짐
          </text>
        </g>
      </motion.g>

      <text x="40" y="512" fontSize="18" className="fill-[#888888] dark:fill-zinc-500">
        * 복잡한 DB 조회는 별도 db_agent 서브그래프로 분리했고, 이후 MCP 서버로 독립시켜 사내 다른 시스템에서도 재사용 가능하게 확장
      </text>
    </motion.svg>
  )
}
