"use client"

import { motion, useReducedMotion } from "motion/react"
import type { IconType } from "react-icons"
import { FaAws, FaComments } from "react-icons/fa6"
import { SiDocker, SiFastapi, SiGithubactions, SiLangchain, SiModelcontextprotocol, SiPostgresql } from "react-icons/si"

function buildVariants(instant: boolean) {
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: instant ? 0 : 0.02, delayChildren: instant ? 0 : 0.05 } },
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

type ColorKey = "ink" | "mute" | "border" | "blue" | "violet"

const STROKE: Record<ColorKey, string> = {
  ink: "stroke-[#171717] dark:stroke-white",
  mute: "stroke-[#888888] dark:stroke-zinc-500",
  border: "stroke-[#a1a1a1] dark:stroke-zinc-700",
  blue: "stroke-[#0070f3]",
  violet: "stroke-[#7928ca]",
}

const ICON_COLOR: Record<ColorKey, string> = {
  ink: "text-[#171717] dark:text-white",
  mute: "text-[#888888] dark:text-zinc-500",
  border: "text-[#a1a1a1] dark:text-zinc-600",
  blue: "text-[#0070f3]",
  violet: "text-[#7928ca]",
}

function NodeBox({
  x,
  y,
  w,
  h = 80,
  title,
  detail,
  Icon,
  iconImage,
  color = "border",
  dashed = false,
}: {
  x: number
  y: number
  w: number
  h?: number
  title: string
  detail?: string
  Icon?: IconType
  iconImage?: string
  color?: ColorKey
  dashed?: boolean
}) {
  return (
    <>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="10"
        fill="none"
        strokeWidth={dashed ? 1 : 1.4}
        strokeDasharray={dashed ? "5 4" : undefined}
        className={STROKE[color]}
      />
      <text
        x={x + 20}
        y={detail ? y + h / 2 - 6 : y + h / 2 + 6}
        fontSize="18"
        fontWeight="600"
        className="fill-[#171717] dark:fill-white"
      >
        {title}
      </text>
      {detail ? (
        <text x={x + 20} y={y + h / 2 + 18} fontSize="14" className="fill-[#888888] dark:fill-white">
          {detail}
        </text>
      ) : null}
      {Icon ? <Icon x={x + w - 50} y={y + h / 2 - 15} size={30} className={ICON_COLOR[color]} /> : null}
      {iconImage ? <image href={iconImage} x={x + w - 50} y={y + h / 2 - 15} width={30} height={30} /> : null}
    </>
  )
}

const NODES: Array<{
  x: number
  y: number
  w: number
  h?: number
  title: string
  detail?: string
  Icon?: IconType
  iconImage?: string
  color?: ColorKey
  dashed?: boolean
}> = [
  // 01 클라이언트 진입점
  { x: 40, y: 230, w: 240, title: "프론트엔드 Chat UI", detail: "사용자 채팅 인터페이스", Icon: FaComments },
  // 02 실시간 서빙 · 에이전트
  { x: 360, y: 230, w: 380, title: "FastAPI + WebSocket 서버", detail: "첫 토큰부터 실시간 스트리밍", Icon: SiFastapi, color: "blue" },
  { x: 780, y: 230, w: 200, title: "Langfuse", detail: "트레이스 로깅 · 관측", iconImage: "/icons/langfuse.svg", color: "mute", dashed: true },
  { x: 360, y: 560, w: 290, h: 64, title: "MCP 서버", detail: "ds-llm-building-mcp", Icon: SiModelcontextprotocol, color: "ink" },
  { x: 690, y: 560, w: 290, h: 64, title: "PostgreSQL", detail: "SQLAlchemy async", Icon: SiPostgresql, color: "ink" },
  // 03 CI/CD 배포
  { x: 1060, y: 230, w: 300, title: "GitHub Actions", detail: "push 시 자동 실행", Icon: SiGithubactions, color: "violet" },
  { x: 1060, y: 360, w: 300, title: "Docker → ECR", detail: "이미지 빌드 · 푸시", Icon: SiDocker, color: "violet" },
  { x: 1060, y: 490, w: 300, title: "ECS (dev / prod)", detail: "컨테이너 배포", Icon: FaAws, color: "violet" },
]

const LEGEND: Array<{ label: string; color?: string; dashed?: boolean; gray?: boolean }> = [
  { color: "#0070f3", label: "요청 · 스트리밍 흐름" },
  { color: "#7928ca", label: "CI/CD 배포" },
  { gray: true, dashed: true, label: "관측 · 로깅" },
]

// Sections run as columns, split by vertical dividers (dividerX sits to the column's left).
const SECTIONS: Array<{ x: number; dividerX?: number; num: string; label: string; sub: string }> = [
  {
    x: 40,
    num: "01",
    label: "클라이언트 진입점",
    sub: "사용자 요청 진입",
  },
  {
    x: 360,
    dividerX: 320,
    num: "02",
    label: "실시간 서빙 · 에이전트",
    sub: "WebSocket 스트리밍 서버와 LangGraph 에이전트의 도구 호출",
  },
  {
    x: 1060,
    dividerX: 1020,
    num: "03",
    label: "CI/CD 배포",
    sub: "빌드부터 ECS 배포까지 자동화",
  },
]

export function ChatbotArchitectureDiagram() {
  const shouldReduceMotion = useReducedMotion()
  const { container, step, fade } = buildVariants(!!shouldReduceMotion)

  return (
    <motion.svg
      viewBox="0 0 1400 700"
      className="h-auto w-full"
      fontFamily="var(--font-sans)"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={container}
    >
      <defs>
        <pattern id="chatbot-architecture-grid-fine" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" strokeWidth="1" className="stroke-black/[0.035] dark:stroke-white/[0.05]" />
        </pattern>
        <pattern id="chatbot-architecture-grid-bold" width="120" height="120" patternUnits="userSpaceOnUse">
          <path d="M 120 0 L 0 0 0 120" fill="none" strokeWidth="1" className="stroke-black/[0.06] dark:stroke-white/[0.08]" />
        </pattern>
        <marker id="chatbot-architecture-arrow-gray" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
          <path d="M0,0 L7,3 L0,6 Z" className="fill-[#888888] dark:fill-zinc-500" />
        </marker>
        <marker id="chatbot-architecture-arrow-blue" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
          <path d="M0,0 L7,3 L0,6 Z" fill="#0070f3" />
        </marker>
        <marker id="chatbot-architecture-arrow-violet" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
          <path d="M0,0 L7,3 L0,6 Z" fill="#7928ca" />
        </marker>
        <style>
          {`
            .chatbot-architecture-flow { stroke-dasharray: 7 6; }
            @media (prefers-reduced-motion: no-preference) {
              .chatbot-architecture-flow { animation: chatbot-architecture-flow-dash 1.2s linear infinite; }
              @keyframes chatbot-architecture-flow-dash { to { stroke-dashoffset: -26; } }
            }
          `}
        </style>
      </defs>

      <rect width="1400" height="700" fill="url(#chatbot-architecture-grid-fine)" />
      <rect width="1400" height="700" fill="url(#chatbot-architecture-grid-bold)" />

      <text x="40" y="42" fontSize="14" fontWeight="600" letterSpacing="1.8" className="fill-[#888888] dark:fill-white">
        ARCHITECTURE
      </text>
      <text x="40" y="74" fontSize="26" fontWeight="600" letterSpacing="-0.5" className="fill-[#171717] dark:fill-white">
        LangGraph 기반 실시간 스트리밍 서빙 + CI/CD 배포 아키텍처
      </text>
      <text x="40" y="100" fontSize="16" className="fill-[#4d4d4d] dark:fill-white">
        실시간 스트리밍 서빙 · 에이전트 처리와 CI/CD 배포 자동화
      </text>

      {LEGEND.map((item, i) => {
        const legendRowGap = 28
        const headerDividerY = 124
        const legendStartY = headerDividerY / 2 - ((LEGEND.length - 1) / 2) * legendRowGap
        const y = legendStartY + i * legendRowGap
        return (
          <g key={item.label}>
            <line
              x1="1050"
              y1={y}
              x2="1082"
              y2={y}
              strokeWidth="2"
              stroke={item.gray ? undefined : item.color}
              strokeDasharray={item.dashed ? "5 5" : undefined}
              className={item.gray ? "stroke-[#888888] dark:stroke-zinc-500" : undefined}
            />
            <text x="1092" y={y + 5} fontSize="15" className="fill-[#888888] dark:fill-white">
              {item.label}
            </text>
          </g>
        )
      })}

      <line x1="40" y1="124" x2="1360" y2="124" strokeWidth="1.5" className="stroke-[#ebebeb] dark:stroke-zinc-800" />

      {SECTIONS.map((s) => (
        <g key={s.num}>
          {s.dividerX ? (
            <line
              x1={s.dividerX}
              y1="140"
              x2={s.dividerX}
              y2="660"
              strokeWidth="1.5"
              className="stroke-[#ebebeb] dark:stroke-zinc-800"
            />
          ) : null}
          <text x={s.x} y="160" fontSize="13" fontWeight="600" letterSpacing="1.5" className="fill-[#888888] dark:fill-white">
            {s.num}  {s.label}
          </text>
          <text x={s.x} y="188" fontSize="17" className="fill-[#4d4d4d] dark:fill-white">
            {s.sub}
          </text>
        </g>
      ))}

      {NODES.map((n) => (
        <motion.g key={n.title} variants={step}>
          <NodeBox {...n} />
        </motion.g>
      ))}

      {/* LangGraph Agent — hero box with nested db_agent subgraph */}
      <motion.g variants={step}>
        <rect x="360" y="360" width="620" height="150" rx="12" fill="none" strokeWidth="2" className="stroke-[#171717] dark:stroke-white" />
        <text x="384" y="394" fontSize="19" fontWeight="600" className="fill-[#171717] dark:fill-white">
          LangGraph Agent
        </text>
        <text x="384" y="417" fontSize="14" className="fill-[#888888] dark:fill-white">
          관련성 판단 → 병렬 수집 → 정보추출 → 응답생성
        </text>
        <SiLangchain x="920" y="374" size="28" className="text-[#171717] dark:text-white" />
        <rect x="384" y="450" width="572" height="42" rx="8" fill="none" strokeDasharray="4 4" className="stroke-[#a1a1a1] dark:stroke-zinc-700" />
        <text x="670" y="476" fontSize="15" fontWeight="500" textAnchor="middle" className="fill-[#4d4d4d] dark:fill-white">
          db_agent 서브그래프 (3-노드, LLM 호출 1회)
        </text>
      </motion.g>

      {/* connectors */}
      {/* 01 -> 02, across the section divider */}
      <motion.g variants={fade}>
        <path d="M280 270 L352 270" strokeWidth="2" fill="none" strokeLinecap="round" stroke="#0070f3" className="chatbot-architecture-flow" markerEnd="url(#chatbot-architecture-arrow-blue)" />
      </motion.g>
      <motion.g variants={fade}>
        <path d="M550 310 L550 352" strokeWidth="2" fill="none" strokeLinecap="round" stroke="#0070f3" className="chatbot-architecture-flow" markerEnd="url(#chatbot-architecture-arrow-blue)" />
      </motion.g>
      {/* 답변: LangGraph Agent -> 프론트엔드 Chat UI, elbow left then up */}
      <motion.g variants={fade}>
        <path d="M360 435 L172 435 Q160 435 160 423 L160 318" strokeWidth="2" fill="none" strokeLinecap="round" stroke="#0070f3" className="chatbot-architecture-flow" markerEnd="url(#chatbot-architecture-arrow-blue)" />
        <text x="204" y="424" fontSize="15" fontWeight="600" textAnchor="middle" fill="#0070f3">
          답변
        </text>
      </motion.g>
      <motion.g variants={fade}>
        <path d="M510 510 L510 552" strokeWidth="2" fill="none" strokeLinecap="round" stroke="#0070f3" className="chatbot-architecture-flow" markerEnd="url(#chatbot-architecture-arrow-blue)" />
      </motion.g>
      <motion.g variants={fade}>
        <path d="M650 592 L682 592" strokeWidth="2" fill="none" strokeLinecap="round" stroke="#0070f3" className="chatbot-architecture-flow" markerEnd="url(#chatbot-architecture-arrow-blue)" />
      </motion.g>

      {/* dashed observability edge: serving -> langfuse */}
      <motion.g variants={fade} className="text-[#888888] dark:text-zinc-500">
        <path d="M740 270 L772 270" strokeWidth="2" fill="none" strokeLinecap="round" stroke="currentColor" strokeDasharray="5 5" markerEnd="url(#chatbot-architecture-arrow-gray)" />
      </motion.g>

      <motion.g variants={fade}>
        <path d="M1210 310 L1210 352" strokeWidth="2" fill="none" strokeLinecap="round" stroke="#7928ca" className="chatbot-architecture-flow" markerEnd="url(#chatbot-architecture-arrow-violet)" />
      </motion.g>
      <motion.g variants={fade}>
        <path d="M1210 440 L1210 482" strokeWidth="2" fill="none" strokeLinecap="round" stroke="#7928ca" className="chatbot-architecture-flow" markerEnd="url(#chatbot-architecture-arrow-violet)" />
      </motion.g>
    </motion.svg>
  )
}
