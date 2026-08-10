"use client"

import { motion, useReducedMotion } from "motion/react"

function buildVariants(instant: boolean) {
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: instant ? 0 : 0.15, delayChildren: instant ? 0 : 0.05 } },
  }
  const fade = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: instant ? 0 : 0.3 } },
  }
  const badge = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: instant ? 0 : 0.4, delay: instant ? 0 : 0.5, ease: "easeOut" as const } },
  }
  const bar = {
    hidden: { height: 0, y: 376 },
    visible: ({ height, y }: { height: number; y: number }) => ({
      height,
      y,
      transition: { duration: instant ? 0 : 0.6, ease: "easeOut" as const },
    }),
  }
  return { container, fade, badge, bar }
}

const BARS = [
  { x: 350, y: 119, height: 257, value: "1780.87ms", label: "Before", sub: "(동기 순차 쿼리 4개)", className: "fill-sky-100 dark:fill-sky-950" },
  { x: 700, y: 252, height: 124, value: "855.11ms", label: "After", sub: "(비동기 병렬 쿼리 4개)", className: "fill-blue-600 dark:fill-blue-500" },
]

export function ChatbotLatencyDiagram() {
  const shouldReduceMotion = useReducedMotion()
  const { container, fade, badge, bar } = buildVariants(!!shouldReduceMotion)

  return (
    <motion.svg
      viewBox="0 0 1200 526"
      className="h-auto w-full"
      fontFamily="-apple-system, 'Segoe UI', ui-sans-serif, sans-serif"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={container}
    >
      <defs>
        <pattern id="chatbot-latency-grid-fine" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" strokeWidth="1" className="stroke-black/[0.035] dark:stroke-white/[0.05]" />
        </pattern>
        <pattern id="chatbot-latency-grid-bold" width="120" height="120" patternUnits="userSpaceOnUse">
          <path d="M 120 0 L 0 0 0 120" fill="none" strokeWidth="1" className="stroke-black/[0.06] dark:stroke-white/[0.08]" />
        </pattern>
      </defs>

      <rect width="1200" height="526" fill="url(#chatbot-latency-grid-fine)" />
      <rect width="1200" height="526" fill="url(#chatbot-latency-grid-bold)" />

      <text x="40" y="28" fontSize="17" fontWeight="600" letterSpacing="1.7" className="fill-[#888888] dark:fill-zinc-500">
        RESULT
      </text>
      <text x="40" y="58" fontSize="20" className="fill-[#4d4d4d] dark:fill-zinc-400">
        건물정보 조회를 동기 순차에서 비동기 병렬로 바꾼 벤치마크
      </text>

      <line x1="200" y1="376" x2="1080" y2="376" strokeWidth="1.5" className="stroke-[#a1a1a1] dark:stroke-zinc-600" />

      {BARS.map((b) => (
        <motion.g key={b.value} variants={fade}>
          <motion.rect x={b.x} width="150" rx="4" className={b.className} variants={bar} custom={{ height: b.height, y: b.y }} />
          <text x={b.x + 75} y={b.y - 22} fontSize="34" fontWeight="600" textAnchor="middle" className="fill-[#171717] dark:fill-white">
            {b.value}
          </text>
          <text x={b.x + 75} y="406" fontSize="19" fontWeight="600" textAnchor="middle" className="fill-[#171717] dark:fill-white">
            {b.label}
          </text>
          <text x={b.x + 75} y="430" fontSize="16" textAnchor="middle" className="fill-[#888888] dark:fill-zinc-500">
            {b.sub}
          </text>
        </motion.g>
      ))}

      {/* arrow from before-bar peak down to after-bar peak */}
      <motion.g variants={fade} className="text-[#a1a1a1] dark:text-zinc-600">
        <path d="M 540 119 C 640 119, 640 252, 685 252" fill="none" strokeWidth="2" strokeDasharray="5 5" stroke="currentColor" />
        <polygon points="685,246 698,252 685,258" fill="currentColor" />
      </motion.g>

      <motion.g variants={badge}>
        <rect x="560" y="150" width="180" height="48" rx="24" className="fill-[#171717] dark:fill-white" />
        <text x="650" y="180" fontSize="18" fontWeight="600" textAnchor="middle" className="fill-white dark:fill-[#171717]">
          51.98%↓ · 2.08x
        </text>
      </motion.g>

      <text x="40" y="456" fontSize="15" className="fill-[#888888] dark:fill-zinc-500">
        * benchmark_async_vs_sync.py, 프로덕션 DB 대상 5회 반복 측정 평균값
      </text>
      <text x="40" y="478" fontSize="15" className="fill-[#888888] dark:fill-zinc-500">
        (실사용자 트래픽 지표는 아직 규모가 작아 별도로 수치화하지 않음)
      </text>
      <text x="40" y="500" fontSize="15" className="fill-[#888888] dark:fill-zinc-500">
        * db_agent도 별도로 재설계해 쿼리당 LLM 호출을 4회→1회로 줄임(ms 실측치 없음, ANALYSIS 참고)
      </text>
    </motion.svg>
  )
}
