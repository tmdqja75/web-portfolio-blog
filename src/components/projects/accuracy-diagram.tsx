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
    hidden: { height: 0, y: BASELINE_Y },
    visible: ({ height, y }: { height: number; y: number }) => ({
      height,
      y,
      transition: { duration: instant ? 0 : 0.6, ease: "easeOut" as const },
    }),
  }
  return { container, fade, bar }
}

type Category = "bothCorrect" | "claudeOnly" | "gptOnly" | "bothWrong"

// Categorical palette validated for adjacent-pair CVD/contrast (see dataviz skill):
// blue -> orange -> aqua -> yellow, kept in that relative order so every touching
// pair in the stack clears the separation floor in both light and dark mode.
const CATEGORY_META: Record<Category, { label: string; className: string }> = {
  bothCorrect: { label: "둘 다 정답", className: "fill-[#2a78d6] dark:fill-[#3987e5]" },
  claudeOnly: { label: "Claude만 정답", className: "fill-[#eb6834] dark:fill-[#d95926]" },
  gptOnly: { label: "GPT만 정답", className: "fill-[#1baf7a] dark:fill-[#199e70]" },
  bothWrong: { label: "둘 다 오답", className: "fill-[#eda100] dark:fill-[#c98500]" },
}

// Bottom -> top stacking order. Percentages sum to 100 within each stage, so every
// stack tops out at the same 100% gridline regardless of how the mix shifts.
const STACK_ORDER: Category[] = ["bothWrong", "gptOnly", "claudeOnly", "bothCorrect"]
const LEGEND_ORDER: Category[] = ["bothCorrect", "claudeOnly", "gptOnly", "bothWrong"]

const BAR_WIDTH = 140
const BASELINE_Y = 376
const PX_PER_PERCENT = 2.6
const INLINE_LABEL_MIN_HEIGHT = 34

const STAGES = [
  {
    x: 330,
    label: "① 원본 이미지",
    sub: "(그대로 입력)",
    values: { bothCorrect: 35.0, claudeOnly: 36.5, gptOnly: 20.5, bothWrong: 8.0 },
  },
  {
    x: 580,
    label: "② 크롭 + 프롬프트",
    sub: "(빈 행 제거)",
    values: { bothCorrect: 72.9, claudeOnly: 16.7, gptOnly: 6.9, bothWrong: 3.4 },
  },
  {
    x: 830,
    label: "③ + Few-shot",
    sub: "(예시 추가)",
    values: { bothCorrect: 91.7, claudeOnly: 3.9, gptOnly: 4.4, bothWrong: 0.0 },
  },
] as const

function buildSegments(values: Record<Category, number>) {
  let cursor = BASELINE_Y
  return STACK_ORDER.map((category) => {
    const height = values[category] * PX_PER_PERCENT
    const y = cursor - height
    cursor = y
    return { category, value: values[category], y, height }
  })
}

const LEGEND_X = [220, 380, 620, 850]

export function AccuracyDiagram() {
  const shouldReduceMotion = useReducedMotion()
  const { container, fade, bar } = buildVariants(!!shouldReduceMotion)

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
        <pattern id="accuracy-grid-fine" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" strokeWidth="1" className="stroke-black/[0.035] dark:stroke-white/[0.05]" />
        </pattern>
        <pattern id="accuracy-grid-bold" width="120" height="120" patternUnits="userSpaceOnUse">
          <path d="M 120 0 L 0 0 0 120" fill="none" strokeWidth="1" className="stroke-black/[0.06] dark:stroke-white/[0.08]" />
        </pattern>
      </defs>

      <rect width="1200" height="540" fill="url(#accuracy-grid-fine)" />
      <rect width="1200" height="540" fill="url(#accuracy-grid-bold)" />

      <text x="40" y="28" fontSize="20" fontWeight="600" letterSpacing="1.7" className="fill-[#888888] dark:fill-zinc-500">
        EXPERIMENT
      </text>
      <text x="40" y="58" fontSize="22" className="fill-[#4d4d4d] dark:fill-zinc-400">
        패널마다 Claude·GPT 정답 여부를 나눠 보면, 개선 단계마다 두 모델의 격차가 좁혀진다
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

      <line x1="200" y1={BASELINE_Y} x2="1080" y2={BASELINE_Y} strokeWidth="1.5" className="stroke-[#a1a1a1] dark:stroke-zinc-600" />

      {STAGES.map((stage) => {
        const segments = buildSegments(stage.values)
        const topSegment = segments[segments.length - 1]
        return (
          <motion.g key={stage.label} variants={fade}>
            {segments.map((seg, i) => (
              <motion.rect
                key={seg.category}
                x={stage.x}
                width={BAR_WIDTH}
                rx={i === segments.length - 1 ? 4 : 1}
                className={CATEGORY_META[seg.category].className}
                variants={bar}
                custom={{ height: seg.height, y: seg.y }}
              />
            ))}

            {/* 2px surface-color gap between touching segments */}
            {segments.slice(0, -1).map((seg) => (
              <line
                key={`${seg.category}-gap`}
                x1={stage.x}
                x2={stage.x + BAR_WIDTH}
                y1={seg.y}
                y2={seg.y}
                strokeWidth="3"
                className="stroke-white dark:stroke-[#0a0a0a]"
              />
            ))}

            {/* headline "both correct" value, centered in the top segment */}
            <text
              x={stage.x + BAR_WIDTH / 2}
              y={topSegment.y + topSegment.height / 2 + 10}
              fontSize="28"
              fontWeight="700"
              textAnchor="middle"
              className="fill-white"
            >
              {topSegment.value.toFixed(1)}%
            </text>

            {/* inline labels for the solo-model segments, only where they fit */}
            {segments
              .filter((seg) => seg.category !== "bothCorrect" && seg.height >= INLINE_LABEL_MIN_HEIGHT)
              .map((seg) => (
                <text
                  key={`${seg.category}-inline`}
                  x={stage.x + BAR_WIDTH / 2}
                  y={seg.y + seg.height / 2 + 6}
                  fontSize="17"
                  fontWeight="600"
                  textAnchor="middle"
                  className="fill-white"
                >
                  {seg.value.toFixed(1)}%
                </text>
              ))}

            <text x={stage.x + BAR_WIDTH / 2} y="406" fontSize="21" fontWeight="600" textAnchor="middle" className="fill-[#171717] dark:fill-white">
              {stage.label}
            </text>
            <text x={stage.x + BAR_WIDTH / 2} y="430" fontSize="19" textAnchor="middle" className="fill-[#888888] dark:fill-zinc-500">
              {stage.sub}
            </text>
          </motion.g>
        )
      })}

      <motion.g variants={fade} fontSize="19" className="fill-[#4d4d4d] dark:fill-zinc-400">
        {LEGEND_ORDER.map((category, i) => (
          <g key={category} transform={`translate(${LEGEND_X[i]}, 462)`}>
            <rect width="16" height="16" rx="3" className={CATEGORY_META[category].className} />
            <text x="24" y="13">{CATEGORY_META[category].label}</text>
          </g>
        ))}
      </motion.g>

      <text x="40" y="498" fontSize="18" className="fill-[#888888] dark:fill-zinc-500">
        * Claude(claude-sonnet-4-6) · GPT(gpt-5.4) 교차 채점, 자체 제작 사람 투표 평가 도구 기준
      </text>
      <text x="40" y="520" fontSize="18" className="fill-[#888888] dark:fill-zinc-500">
        (실도면 3건·패널 약 200개. 원본 단계 Claude 143/200 · GPT 111/200 → Few-shot 단계 195/204 · 196/204로 격차가 거의 사라짐)
      </text>
    </motion.svg>
  )
}
