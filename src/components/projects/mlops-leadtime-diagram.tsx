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
  { x: 280, y: 119, height: 257, value: "약 30분", label: "Before", sub: "(Lambda 수동 갱신, 회고 추정)", className: "fill-sky-100 dark:fill-sky-950" },
  { x: 650, y: 336, height: 40, value: "4.71분", label: "After", sub: "(GitHub Actions 실배포 중앙값, 60건)", className: "fill-blue-600 dark:fill-blue-500" },
]

export function MlopsLeadtimeDiagram() {
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
        <pattern id="mlops-leadtime-grid-fine" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" strokeWidth="1" className="stroke-black/[0.035] dark:stroke-white/[0.05]" />
        </pattern>
        <pattern id="mlops-leadtime-grid-bold" width="120" height="120" patternUnits="userSpaceOnUse">
          <path d="M 120 0 L 0 0 0 120" fill="none" strokeWidth="1" className="stroke-black/[0.06] dark:stroke-white/[0.08]" />
        </pattern>
      </defs>

      <rect width="1200" height="526" fill="url(#mlops-leadtime-grid-fine)" />
      <rect width="1200" height="526" fill="url(#mlops-leadtime-grid-bold)" />

      <text x="40" y="28" fontSize="20" fontWeight="600" letterSpacing="1.7" className="fill-[#888888] dark:fill-zinc-500">
        RESULT
      </text>
      <text x="40" y="58" fontSize="22" className="fill-[#4d4d4d] dark:fill-zinc-400">
        수동 Lambda 갱신에서 GitHub Actions 실배포까지, 배포 리드타임 비교
      </text>

      <line x1="200" y1="376" x2="1080" y2="376" strokeWidth="1.5" className="stroke-[#a1a1a1] dark:stroke-zinc-600" />

      {BARS.map((b) => (
        <motion.g key={b.value} variants={fade}>
          <motion.rect x={b.x} width="150" rx="4" className={b.className} variants={bar} custom={{ height: b.height, y: b.y }} />
          <text x={b.x + 75} y={b.y - 22} fontSize="30" fontWeight="600" textAnchor="middle" className="fill-[#171717] dark:fill-white">
            {b.value}
          </text>
          <text x={b.x + 75} y="406" fontSize="21" fontWeight="600" textAnchor="middle" className="fill-[#171717] dark:fill-white">
            {b.label}
          </text>
          <text x={b.x + 75} y="430" fontSize="18" textAnchor="middle" className="fill-[#888888] dark:fill-zinc-500">
            {b.sub}
          </text>
        </motion.g>
      ))}

      <motion.g variants={badge}>
        <rect x="440" y="150" width="240" height="48" rx="24" className="fill-[#171717] dark:fill-white" />
        <text x="560" y="180" fontSize="20" fontWeight="600" textAnchor="middle" className="fill-white dark:fill-[#171717]">
          84.3%↓ · 6.4배
        </text>
      </motion.g>

      <text x="40" y="456" fontSize="17" className="fill-[#888888] dark:fill-zinc-500">
        * 성공한 GitHub Actions 실행 중 소요 2분 이상만 실배포로 분류해 60건 집계, 60건 중 55건이 3~6분 안에 완료
      </text>
      <text x="40" y="478" fontSize="17" className="fill-[#888888] dark:fill-zinc-500">
        * Before(약 30분)는 당시 배포 로그가 아니라 회고로 재구성한 추정치
      </text>
    </motion.svg>
  )
}
