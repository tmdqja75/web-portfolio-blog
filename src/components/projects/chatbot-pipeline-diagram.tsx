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
  return { container, step, fade }
}

const BOX_W = 204
const GAP = 28
const MARGIN = 34
const BOX_Y = 100
const BOX_H = 150

const PIPELINE_STEPS = [
  { n: 1, title: "관련성 판단", sub: "(사용자 메시지)" },
  { n: 2, title: "건물정보 병렬 수집", sub: "(async 쿼리 4개)" },
  { n: 3, title: "정보 추출", sub: "(질문→구조화 데이터)" },
  { n: 4, title: "db_agent 서브그래프", sub: "(3-노드, LLM 호출 1회)" },
  { n: 5, title: "응답 생성", sub: "(예시질문 병렬 생성)" },
].map((s, i) => ({ ...s, x: MARGIN + i * (BOX_W + GAP) }))

export function ChatbotPipelineDiagram() {
  const shouldReduceMotion = useReducedMotion()
  const { container, step, fade } = buildVariants(!!shouldReduceMotion)

  return (
    <motion.svg
      viewBox="0 0 1200 270"
      className="h-auto w-full"
      fontFamily="-apple-system, 'Segoe UI', ui-sans-serif, sans-serif"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={container}
    >
      <defs>
        <pattern id="chatbot-pipeline-grid-fine" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" strokeWidth="1" className="stroke-black/[0.035] dark:stroke-white/[0.05]" />
        </pattern>
        <pattern id="chatbot-pipeline-grid-bold" width="120" height="120" patternUnits="userSpaceOnUse">
          <path d="M 120 0 L 0 0 0 120" fill="none" strokeWidth="1" className="stroke-black/[0.06] dark:stroke-white/[0.08]" />
        </pattern>
      </defs>

      <rect width="1200" height="270" fill="url(#chatbot-pipeline-grid-fine)" />
      <rect width="1200" height="270" fill="url(#chatbot-pipeline-grid-bold)" />

      <text x="34" y="32" fontSize="20" fontWeight="600" letterSpacing="1.7" className="fill-[#888888] dark:fill-zinc-500">
        PIPELINE
      </text>
      <text x="34" y="62" fontSize="22" className="fill-[#4d4d4d] dark:fill-zinc-400">
        메시지 한 통이 응답으로 바뀌는 LangGraph 5단계
      </text>

      {PIPELINE_STEPS.map((s) => (
        <motion.g key={s.n} variants={step}>
          <rect x={s.x} y={BOX_Y} width={BOX_W} height={BOX_H} rx="10" fill="none" className="stroke-[#a1a1a1] dark:stroke-zinc-700" />
          <circle cx={s.x + 24} cy={BOX_Y} r="19" className="fill-[#171717] dark:fill-white" />
          <text x={s.x + 24} y={BOX_Y + 6} fontSize="20" fontWeight="600" textAnchor="middle" className="fill-white dark:fill-[#171717]">
            {s.n}
          </text>
          <text x={s.x + BOX_W / 2} y={BOX_Y + 68} fontSize="22" fontWeight="600" textAnchor="middle" className="fill-[#171717] dark:fill-white">
            {s.title}
          </text>
          <text x={s.x + BOX_W / 2} y={BOX_Y + 100} fontSize="19" textAnchor="middle" className="fill-[#888888] dark:fill-zinc-500">
            {s.sub}
          </text>
        </motion.g>
      ))}

      {PIPELINE_STEPS.slice(0, -1).map((from, i) => {
        const x1 = from.x + BOX_W
        const x2 = PIPELINE_STEPS[i + 1].x
        const y = BOX_Y + BOX_H / 2
        return (
          <motion.g key={x1} variants={fade} className="text-[#888888] dark:text-zinc-500">
            <line x1={x1 + 4} y1={y} x2={x2 - 10} y2={y} strokeWidth="2.5" stroke="currentColor" />
            <polygon points={`${x2 - 10},${y - 6} ${x2},${y} ${x2 - 10},${y + 6}`} fill="currentColor" />
          </motion.g>
        )
      })}
    </motion.svg>
  )
}
