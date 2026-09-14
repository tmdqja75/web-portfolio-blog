"use client"

import { motion, useReducedMotion } from "motion/react"

function buildVariants(instant: boolean) {
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: instant ? 0 : 0.08, delayChildren: instant ? 0 : 0.05 } },
  }
  const step = {
    hidden: { opacity: 0, y: instant ? 0 : 10 },
    visible: { opacity: 1, y: 0, transition: { duration: instant ? 0 : 0.35, ease: "easeOut" as const } },
  }
  const fade = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: instant ? 0 : 0.3 } },
  }
  return { container, step, fade }
}

const VIEW_W = 1200
const VIEW_H = 660
const MARGIN = 48
const CIRCLE_R = 62

const BEFORE_LABEL_Y = 40
const BEFORE_CY = 140
const TIME_Y = 270
const AFTER_LABEL_Y = 340
const PILL_Y = AFTER_LABEL_Y + 14
const PILL_H = 54
const AFTER_CY = PILL_Y + PILL_H + 40 + CIRCLE_R

const BEFORE_STEPS = ["AI 뉴스|팔로업", "아티클|읽기", "주제|선정", "초안|작성", "팩트|체크", "초안|수정", "최종|발행"]
const AFTER_STEPS = ["주제|선정", "팩트|체크", "초안|수정", "최종|발행"]

// Before row sets the shared start point and spacing so its first circle and
// After row's square icon line up, and every shape after that keeps the same gap.
const ROW_START_X = MARGIN + CIRCLE_R
const ROW_SPACING = (VIEW_W - MARGIN - CIRCLE_R - ROW_START_X) / (BEFORE_STEPS.length - 1)

function rowCenters(n: number, startX: number, spacing: number) {
  return Array.from({ length: n }, (_, i) => startX + i * spacing)
}

// After row's first slot (index 0) is the square icon, so its circles start at index 1.
const BEFORE_CENTERS = rowCenters(BEFORE_STEPS.length, ROW_START_X, ROW_SPACING)
const AFTER_CENTERS = rowCenters(AFTER_STEPS.length, ROW_START_X + ROW_SPACING, ROW_SPACING)

function StepCircle({ cx, cy, label, fill }: { cx: number; cy: number; label: string; fill: string }) {
  const lines = label.split("|")
  return (
    <>
      <circle cx={cx} cy={cy} r={CIRCLE_R} fill={fill} />
      {lines.map((line, i) => (
        <text
          key={line}
          x={cx}
          y={cy + (i - (lines.length - 1) / 2) * 26 + 7}
          textAnchor="middle"
          fontSize="22"
          fontWeight="600"
          fill="#171717"
        >
          {line}
        </text>
      ))}
    </>
  )
}

export function NewsletterWorkflowDiagram() {
  const shouldReduceMotion = useReducedMotion()
  const { container, step, fade } = buildVariants(!!shouldReduceMotion)

  const arrowRight = VIEW_W - MARGIN
  const squareRightEdge = ROW_START_X + CIRCLE_R
  const firstAfterCircleLeftEdge = AFTER_CENTERS[0] - CIRCLE_R
  const pillCenterY = PILL_Y + PILL_H / 2

  return (
    <motion.svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="h-auto w-full"
      fontFamily="-apple-system, 'Segoe UI', ui-sans-serif, sans-serif"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={container}
    >
      <defs>
        <filter id="newsletter-final-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
      </defs>

      {/* Before */}
      <motion.g variants={fade}>
        <text x={MARGIN} y={BEFORE_LABEL_Y} fontSize="26" fontWeight="600" className="fill-[#171717] dark:fill-white">
          Before
        </text>
      </motion.g>
      {BEFORE_STEPS.map((label, i) => (
        <motion.g key={`before-${label}`} variants={step}>
          <StepCircle cx={BEFORE_CENTERS[i]} cy={BEFORE_CY} label={label} fill="#a3a3a3" />
        </motion.g>
      ))}

      {/* Time arrow */}
      <motion.g variants={fade} className="text-[#171717] dark:text-white">
        <circle cx={MARGIN} cy={TIME_Y} r="12" fill="none" strokeWidth="2" stroke="currentColor" />
        <line x1={MARGIN} y1={TIME_Y} x2={MARGIN} y2={TIME_Y - 7} strokeWidth="2" stroke="currentColor" strokeLinecap="round" />
        <line x1={MARGIN} y1={TIME_Y} x2={MARGIN + 5} y2={TIME_Y + 4} strokeWidth="2" stroke="currentColor" strokeLinecap="round" />
        <text x={MARGIN + 26} y={TIME_Y + 8} fontSize="24" fontWeight="600" fill="currentColor">
          Time
        </text>
        <line x1={MARGIN + 96} y1={TIME_Y} x2={arrowRight - 14} y2={TIME_Y} strokeWidth="2.5" stroke="currentColor" />
        <polygon points={`${arrowRight - 14},${TIME_Y - 7} ${arrowRight},${TIME_Y} ${arrowRight - 14},${TIME_Y + 7}`} fill="currentColor" />
      </motion.g>

      {/* After */}
      <motion.g variants={fade}>
        <text x={MARGIN} y={AFTER_LABEL_Y} fontSize="26" fontWeight="600" className="fill-[#171717] dark:fill-white">
          After
        </text>
      </motion.g>

      <motion.g variants={step}>
        <rect x="440" y={PILL_Y} width="440" height={PILL_H} rx="27" fill="#93c5fd" />
        <text x="660" y={pillCenterY + 8} textAnchor="middle" fontSize="22" fontWeight="700" fill="#171717">
          리서치 1주+작성 1시간 → 약 30분
        </text>
      </motion.g>

      <motion.g variants={fade}>
        <line
          x1={squareRightEdge}
          y1={AFTER_CY}
          x2={firstAfterCircleLeftEdge}
          y2={AFTER_CY}
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </motion.g>

      <motion.g variants={step}>
        <rect
          x={ROW_START_X - CIRCLE_R}
          y={AFTER_CY - CIRCLE_R}
          width={CIRCLE_R * 2}
          height={CIRCLE_R * 2}
          rx="34"
          className="fill-[#171717] dark:fill-white"
        />
        {["오토마타", "뉴스레터", "에이전트"].map((line, i) => (
          <text
            key={line}
            x={ROW_START_X}
            y={AFTER_CY + (i - 1) * 26 + 7}
            textAnchor="middle"
            fontSize="20"
            fontWeight="700"
            className="fill-white dark:fill-[#171717]"
          >
            {line}
          </text>
        ))}
      </motion.g>

      <motion.circle
        variants={fade}
        cx={AFTER_CENTERS[AFTER_CENTERS.length - 1]}
        cy={AFTER_CY}
        r={CIRCLE_R}
        fill="#60a5fa"
        opacity="0.75"
        filter="url(#newsletter-final-glow)"
      />

      {AFTER_STEPS.map((label, i) => (
        <motion.g key={`after-${label}`} variants={step}>
          <StepCircle cx={AFTER_CENTERS[i]} cy={AFTER_CY} label={label} fill="#93c5fd" />
        </motion.g>
      ))}

      <motion.g variants={fade}>
        <rect
          x={AFTER_CENTERS[0] - 74}
          y={AFTER_CY + CIRCLE_R + 20}
          width="148"
          height="44"
          rx="22"
          fill="none"
          strokeWidth="2"
          className="stroke-[#171717] dark:stroke-white"
        />
        <text
          x={AFTER_CENTERS[0]}
          y={AFTER_CY + CIRCLE_R + 48}
          textAnchor="middle"
          fontSize="22"
          fontWeight="700"
          className="fill-[#171717] dark:fill-white"
        >
          HITL
        </text>
      </motion.g>
    </motion.svg>
  )
}
