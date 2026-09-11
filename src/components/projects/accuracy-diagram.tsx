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
  const bar = {
    hidden: { height: 0, y: 376 },
    visible: ({ height, y }: { height: number; y: number }) => ({
      height,
      y,
      transition: { duration: instant ? 0 : 0.6, ease: "easeOut" as const },
    }),
  }
  return { container, fade, bar }
}

const BARS = [
  { x: 330, y: 285, height: 91, value: "35.0%", label: "① 원본 이미지", sub: "(그대로 입력)", className: "fill-sky-100 dark:fill-sky-950" },
  { x: 580, y: 186, height: 190, value: "72.9%", label: "② 크롭 + 프롬프트", sub: "(빈 행 제거)", className: "fill-blue-600 dark:fill-blue-500" },
  { x: 830, y: 138, height: 238, value: "91.7%", label: "③ + Few-shot", sub: "(예시 추가)", className: "fill-blue-800 dark:fill-blue-400" },
]

export function AccuracyDiagram() {
  const shouldReduceMotion = useReducedMotion()
  const { container, fade, bar } = buildVariants(!!shouldReduceMotion)

  return (
    <motion.svg
      viewBox="0 0 1200 500"
      className="h-auto w-full"
      fontFamily="-apple-system, 'Segoe UI', ui-sans-serif, sans-serif"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={container}
    >
      <defs>
        <pattern id="accuracy-grid-fine" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" strokeWidth="1" className="stroke-black/[0.035] dark:stroke-white/[0.05]" />
        </pattern>
        <pattern id="accuracy-grid-bold" width="120" height="120" patternUnits="userSpaceOnUse">
          <path d="M 120 0 L 0 0 0 120" fill="none" strokeWidth="1" className="stroke-black/[0.06] dark:stroke-white/[0.08]" />
        </pattern>
      </defs>

      <rect width="1200" height="500" fill="url(#accuracy-grid-fine)" />
      <rect width="1200" height="500" fill="url(#accuracy-grid-bold)" />

      <text x="40" y="28" fontSize="20" fontWeight="600" letterSpacing="1.7" className="fill-[#888888] dark:fill-zinc-500">
        EXPERIMENT
      </text>
      <text x="40" y="58" fontSize="22" className="fill-[#4d4d4d] dark:fill-zinc-400">
        3단계 프롬프트 개선으로 두 모델이 모두 맞힌 정답률을 끌어올린 실험
      </text>

      <g strokeWidth="1" strokeDasharray="4 4" className="stroke-[#ebebeb] dark:stroke-zinc-800">
        <line x1="220" y1="116" x2="1080" y2="116" />
        <line x1="220" y1="246" x2="1080" y2="246" />
      </g>
      <g fontSize="18" textAnchor="end" fontFamily="ui-monospace, monospace" className="fill-[#888888] dark:fill-zinc-500">
        <text x="190" y="121">100%</text>
        <text x="190" y="251">50%</text>
        <text x="190" y="381">0%</text>
      </g>

      <line x1="200" y1="376" x2="1080" y2="376" strokeWidth="1.5" className="stroke-[#a1a1a1] dark:stroke-zinc-600" />

      {BARS.map((b) => (
        <motion.g key={b.value} variants={fade}>
          <motion.rect x={b.x} width="140" rx="4" className={b.className} variants={bar} custom={{ height: b.height, y: b.y }} />
          <text x={b.x + 70} y={b.y - 30} fontSize="44" fontWeight="600" textAnchor="middle" className="fill-[#171717] dark:fill-white">
            {b.value}
          </text>
          <text x={b.x + 70} y="406" fontSize="21" fontWeight="600" textAnchor="middle" className="fill-[#171717] dark:fill-white">
            {b.label}
          </text>
          <text x={b.x + 70} y="430" fontSize="19" textAnchor="middle" className="fill-[#888888] dark:fill-zinc-500">
            {b.sub}
          </text>
        </motion.g>
      ))}

      <text x="40" y="456" fontSize="18" className="fill-[#888888] dark:fill-zinc-500">
        * Claude(claude-sonnet-4-6) · GPT(gpt-5.4) 교차 채점, 자체 제작 사람 투표 평가 도구 기준
      </text>
      <text x="40" y="478" fontSize="18" className="fill-[#888888] dark:fill-zinc-500">
        (실도면 3건·패널 약 200개, 두 모델 모두 정답인 비율)
      </text>
    </motion.svg>
  )
}
