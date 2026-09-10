"use client"

import { motion, useReducedMotion } from "motion/react"

function buildVariants(instant: boolean) {
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: instant ? 0 : 0.07, delayChildren: instant ? 0 : 0.02 } },
  }
  const step = {
    hidden: { opacity: 0, y: instant ? 0 : 10 },
    visible: { opacity: 1, y: 0, transition: { duration: instant ? 0 : 0.22, ease: "easeOut" as const } },
  }
  const fade = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: instant ? 0 : 0.15 } },
  }
  return { container, step, fade }
}

const ROUTE_CARDS = [
  { x: 40, cx: 115, label: "/environment", lines: ["Q1_environment", "Q2_environment"] },
  { x: 210, cx: 285, label: "/energy", lines: ["Q1_energy", "Q2_energy"] },
  { x: 380, cx: 455, label: "/equipment", lines: ["Q1_equipment", "Q2_equipment"] },
]
const QUERY_CX = 860

// left-edge entry points on the Cosine Similarity box, one per route vector
const ROUTE_ENTRY_Y = [622, 637, 652]

function EmbeddingVectorBox({ cx, tone }: { cx: number; tone: "red" | "emerald" }) {
  const colors =
    tone === "red"
      ? "fill-red-50 stroke-red-600 dark:fill-red-950/40 dark:stroke-red-800"
      : "fill-emerald-50 stroke-emerald-600 dark:fill-emerald-950/40 dark:stroke-emerald-700"
  const textColor = tone === "red" ? "fill-red-700 dark:fill-red-400" : "fill-emerald-700 dark:fill-emerald-400"
  return (
    <g>
      <rect x={cx - 28} y="314" width="56" height="170" rx="8" className={colors} strokeWidth="1.2" />
      <text
        x={cx}
        y="399"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="15"
        fontWeight="700"
        letterSpacing="1.5"
        transform={`rotate(-90 ${cx} 399)`}
        className={textColor}
      >
        EMBEDDING VECTOR
      </text>
    </g>
  )
}

export function ChatbotV2AnalysisDiagram() {
  const shouldReduceMotion = useReducedMotion()
  const { container, step, fade } = buildVariants(!!shouldReduceMotion)

  return (
    <motion.svg
      viewBox="0 0 1200 830"
      className="h-auto w-full"
      fontFamily="-apple-system, 'Segoe UI', ui-sans-serif, sans-serif"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={container}
    >
      <defs>
        <pattern id="chatbot-v2-grid-fine" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" strokeWidth="1" className="stroke-black/[0.035] dark:stroke-white/[0.05]" />
        </pattern>
        <pattern id="chatbot-v2-grid-bold" width="120" height="120" patternUnits="userSpaceOnUse">
          <path d="M 120 0 L 0 0 0 120" fill="none" strokeWidth="1" className="stroke-black/[0.06] dark:stroke-white/[0.08]" />
        </pattern>
        <marker id="chatbot-v2-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,1 L9,5 L0,9 z" className="fill-[#a1a1a1] dark:fill-zinc-600" />
        </marker>
      </defs>

      <rect width="1200" height="830" fill="url(#chatbot-v2-grid-fine)" />
      <rect width="1200" height="830" fill="url(#chatbot-v2-grid-bold)" />

      <text x="40" y="30" fontSize="20" fontWeight="600" letterSpacing="1.7" className="fill-[#888888] dark:fill-zinc-500">
        ANALYSIS
      </text>
      <text x="40" y="60" fontSize="22" className="fill-[#4d4d4d] dark:fill-zinc-400">
        임베딩 코사인 유사도로 라우팅하고, threshold는 오답 비용을 반영해 재설계했다
      </text>

      {/* route description cards (필러 텍스트, 서버 기동 시 1회 임베딩) */}
      {ROUTE_CARDS.map((c) => (
        <motion.g key={c.label} variants={step}>
          <rect x={c.x} y="96" width="150" height="90" rx="8" className="fill-red-50 stroke-red-600 dark:fill-red-950/40 dark:stroke-red-800" strokeWidth="1.4" />
          <rect x={c.x} y="96" width="150" height="26" rx="8" className="fill-red-600 dark:fill-red-800" />
          <rect x={c.x} y="109" width="150" height="13" className="fill-red-600 dark:fill-red-800" />
          <text x={c.cx} y="114" textAnchor="middle" fontSize="15" fontWeight="700" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" className="fill-white">
            {c.label}
          </text>
          {c.lines.map((line, i) => (
            <text key={line} x={c.cx} y={150 + i * 18} textAnchor="middle" fontSize="15" className="fill-[#888888] dark:fill-zinc-500">
              {line}
            </text>
          ))}
        </motion.g>
      ))}
      <motion.text variants={fade} x="590" y="146" textAnchor="middle" fontSize="22" fontWeight="700" className="fill-red-600 dark:fill-red-500">
        ……
      </motion.text>
      <motion.text variants={fade} x="590" y="168" fontSize="14" textAnchor="middle" className="fill-[#888888] dark:fill-zinc-500">
        (21개 라우트)
      </motion.text>

      {/* query card */}
      <motion.g variants={step}>
        <rect x="760" y="96" width="200" height="90" rx="8" className="fill-emerald-50 stroke-emerald-600 dark:fill-emerald-950/40 dark:stroke-emerald-700" strokeWidth="1.4" />
        <rect x="760" y="96" width="200" height="26" rx="8" className="fill-emerald-600 dark:fill-emerald-700" />
        <rect x="760" y="109" width="200" height="13" className="fill-emerald-600 dark:fill-emerald-700" />
        <text x={QUERY_CX} y="114" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-white">
          사용자 질문 (매 요청)
        </text>
        <text x={QUERY_CX} y="150" textAnchor="middle" fontSize="15" className="fill-[#888888] dark:fill-zinc-500">
          &quot;지금 실내 공기질 어때?&quot;
        </text>
      </motion.g>

      {/* arrows down to embedding model */}
      {[...ROUTE_CARDS.map((c) => c.cx), QUERY_CX].map((x) => (
        <motion.line key={x} variants={fade} x1={x} y1="186" x2={x} y2="228" strokeWidth="1.6" markerEnd="url(#chatbot-v2-arrow)" className="stroke-[#a1a1a1] dark:stroke-zinc-600" />
      ))}

      <motion.g variants={step}>
        <rect x="40" y="228" width="920" height="46" rx="8" className="fill-[#171717] dark:fill-white" />
        <g transform="translate(388, 241)" className="fill-white dark:fill-[#171717]">
          <path
            transform="scale(0.7917)"
            d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9 6.0651 6.0651 0 0 0-11.5715 2.3556 5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.4592a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"
          />
        </g>
        <text x="418" y="257" textAnchor="start" fontSize="19" fontWeight="600" className="fill-white dark:fill-[#171717]">
          text-embedding-3-large
        </text>
      </motion.g>

      {[...ROUTE_CARDS.map((c) => c.cx), QUERY_CX].map((x) => (
        <motion.line key={x} variants={fade} x1={x} y1="274" x2={x} y2="314" strokeWidth="1.6" markerEnd="url(#chatbot-v2-arrow)" className="stroke-[#a1a1a1] dark:stroke-zinc-600" />
      ))}

      {/* embedding vectors, one per card + one for the query */}
      <motion.g variants={step}>
        {ROUTE_CARDS.map((c) => (
          <EmbeddingVectorBox key={c.cx} cx={c.cx} tone="red" />
        ))}
        <EmbeddingVectorBox cx={QUERY_CX} tone="emerald" />
      </motion.g>

      {/* route vectors drop below the embedding model, then turn into the Cosine Similarity box's
          left edge at staggered heights so the three lines never cross each other */}
      {ROUTE_CARDS.map((c, i) => (
        <motion.polyline
          key={c.cx}
          variants={fade}
          points={`${c.cx},484 ${c.cx},${ROUTE_ENTRY_Y[i]} 480,${ROUTE_ENTRY_Y[i]}`}
          fill="none"
          strokeWidth="1.6"
          markerEnd="url(#chatbot-v2-arrow)"
          className="stroke-[#a1a1a1] dark:stroke-zinc-600"
        />
      ))}
      {/* the query vector travels above both the Cosine and threshold boxes (y < 610) before
          dropping into the Cosine box from the top, so it never passes behind either box */}
      <motion.polyline
        variants={fade}
        points={`${QUERY_CX},484 ${QUERY_CX},530 565,530 565,610`}
        fill="none"
        strokeWidth="1.6"
        markerEnd="url(#chatbot-v2-arrow)"
        className="stroke-[#a1a1a1] dark:stroke-zinc-600"
      />

      <motion.g variants={step}>
        <rect x="480" y="610" width="170" height="70" rx="8" className="fill-blue-50 stroke-blue-600 dark:fill-blue-950/40 dark:stroke-blue-700" strokeWidth="1.6" />
        <text x="565" y="650" textAnchor="middle" fontSize="17" fontWeight="700" className="fill-blue-700 dark:fill-blue-400">
          Cosine Similarity
        </text>
      </motion.g>

      <motion.line variants={fade} x1="650" y1="645" x2="700" y2="645" strokeWidth="1.6" markerEnd="url(#chatbot-v2-arrow)" className="stroke-[#a1a1a1] dark:stroke-zinc-600" />

      {/* threshold gate, same vertical span as the Cosine box so the connector above never dips behind it */}
      <motion.g variants={step}>
        <rect x="700" y="610" width="170" height="70" rx="8" className="fill-orange-50 stroke-orange-600 dark:fill-orange-950/40 dark:stroke-orange-700" strokeWidth="1.6" />
        <text x="785" y="638" textAnchor="middle" fontSize="17" fontWeight="700" className="fill-orange-700 dark:fill-orange-400">
          threshold
        </text>
        <text x="785" y="660" textAnchor="middle" fontSize="19" fontWeight="700" className="fill-orange-700 dark:fill-orange-400">
          0.47
        </text>
      </motion.g>

      {/* split to two outcomes */}
      <motion.polyline variants={fade} points="870,630 910,630 910,600 940,600" fill="none" strokeWidth="1.8" markerEnd="url(#chatbot-v2-arrow)" className="stroke-[#171717] dark:stroke-white" />
      <motion.polyline variants={fade} points="870,660 910,660 910,700 940,700" fill="none" strokeWidth="1.8" markerEnd="url(#chatbot-v2-arrow)" className="stroke-[#a1a1a1] dark:stroke-zinc-600" />

      <motion.g variants={step}>
        <rect x="940" y="558" width="220" height="84" rx="10" className="fill-[#171717] dark:fill-white" />
        <text x="1050" y="590" textAnchor="middle" fontSize="18" fontWeight="600" className="fill-white dark:fill-[#171717]">
          확신 라우팅
        </text>
        <text x="1050" y="614" textAnchor="middle" fontSize="12.5" className="fill-white/70 dark:fill-[#171717]/70">
          score ≥ 0.47, 즉시 대시보드 연동
        </text>
      </motion.g>

      <motion.g variants={step}>
        <rect x="940" y="658" width="220" height="84" rx="10" className="fill-none stroke-[#a1a1a1] dark:stroke-zinc-600" strokeWidth="1.6" />
        <text x="1050" y="690" textAnchor="middle" fontSize="18" fontWeight="600" className="fill-[#4d4d4d] dark:fill-zinc-400">
          DSPy 저신뢰 폴백
        </text>
        <text x="1050" y="714" textAnchor="middle" fontSize="12.5" className="fill-[#888888] dark:fill-zinc-500">
          score &lt; 0.47, 재판단 (정확도 50%→100%)
        </text>
      </motion.g>

      <text x="40" y="790" fontSize="17" className="fill-[#888888] dark:fill-zinc-500">
        * 표준 F1(threshold 0.33)은 오답과 fallback을 동일 비용으로 취급 → wrong-route에 5배 페널티를 준 weighted F1로 threshold 0.47 재설계, 오분류 25→10건(60%↓)
      </text>
    </motion.svg>
  )
}
