"use client"

import { motion, useReducedMotion } from "motion/react"
import type { IconType } from "react-icons"
import {
  FaAws,
  FaBoxArchive,
  FaDatabase,
  FaPython,
  FaRotate,
  FaShieldHalved,
  FaSlack,
  FaTable,
  FaTowerBroadcast,
} from "react-icons/fa6"
import {
  SiApacheairflow,
  SiBentoml,
  SiDocker,
  SiGithubactions,
  SiGrafana,
  SiJupyter,
  SiMlflow,
  SiPostgresql,
  SiPrometheus,
} from "react-icons/si"

function buildVariants(instant: boolean) {
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: instant ? 0 : 0.015, delayChildren: instant ? 0 : 0.05 } },
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

type ColorKey = "ink" | "mute" | "border" | "blue" | "violet" | "red"

const STROKE: Record<ColorKey, string> = {
  ink: "stroke-[#171717] dark:stroke-white",
  mute: "stroke-[#888888] dark:stroke-zinc-500",
  border: "stroke-[#a1a1a1] dark:stroke-zinc-700",
  blue: "stroke-[#0070f3]",
  violet: "stroke-[#7928ca]",
  red: "stroke-[#ee0000]",
}

const ICON_COLOR: Record<ColorKey, string> = {
  ink: "text-[#171717] dark:text-white",
  mute: "text-[#888888] dark:text-zinc-500",
  border: "text-[#a1a1a1] dark:text-zinc-600",
  blue: "text-[#0070f3]",
  violet: "text-[#7928ca]",
  red: "text-[#ee0000]",
}

function NodeBox({
  x,
  y,
  w,
  h = 80,
  title,
  detail,
  Icon,
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
  color?: ColorKey
  dashed?: boolean
}> = [
  // 01 데이터 기반
  { x: 40, y: 200, w: 210, title: "센서 데이터", detail: "빌딩 텔레메트리", Icon: FaTowerBroadcast },
  { x: 290, y: 200, w: 210, title: "BEMS DB", detail: "PostgreSQL · 운영 데이터", Icon: SiPostgresql, color: "ink" },
  { x: 540, y: 200, w: 280, title: "커스텀 데이터로더", detail: "학습 데이터 구성", Icon: FaPython, color: "blue" },
  { x: 860, y: 200, w: 220, title: "학습", detail: "Jupyter · 모델 실험", Icon: SiJupyter, color: "blue" },
  // 02 실험 · 배포 제어
  { x: 40, y: 420, w: 300, title: "MLflow", detail: "실험 · 모델 · 아티팩트 추적", Icon: SiMlflow, color: "blue" },
  { x: 380, y: 420, w: 300, title: "DynamoDB", detail: "배포 레지스트리 · 서빙 구성", Icon: FaTable, color: "violet" },
  { x: 40, y: 540, w: 150, h: 64, title: "RDS", detail: "백엔드", Icon: FaDatabase },
  { x: 210, y: 540, w: 150, h: 64, title: "S3", detail: "아티팩트", Icon: FaBoxArchive },
  // 03 CI/CD 배포
  { x: 40, y: 730, w: 200, title: "GitHub Actions", detail: "push 시 자동 실행", Icon: SiGithubactions, color: "violet" },
  { x: 280, y: 730, w: 220, title: "빌드 · 푸시", detail: "BentoML 빌드 · ECR 푸시", Icon: SiDocker, color: "violet" },
  { x: 540, y: 730, w: 280, title: "프로비저닝 · 검증", detail: "ECS 프로비저닝 · 라우팅 검증", Icon: FaShieldHalved, color: "violet" },
  { x: 860, y: 730, w: 220, title: "롤링 배포", detail: "무중단 롤링 업데이트", Icon: FaRotate, color: "violet" },
  // 04 서빙 · 관측
  { x: 40, y: 940, w: 220, title: "Airflow", detail: "팀 공유 오케스트레이션", Icon: SiApacheairflow, color: "mute", dashed: true },
  { x: 470, y: 1140, w: 220, title: "Prometheus", detail: "서비스 메트릭", Icon: SiPrometheus, color: "violet" },
  { x: 750, y: 1140, w: 220, title: "Grafana", detail: "대시보드", Icon: SiGrafana, color: "violet" },
  { x: 1030, y: 1140, w: 220, title: "Slack 알림", detail: "임계치 초과 알림", Icon: FaSlack, color: "red" },
]

const LEGEND: Array<{ label: string; color?: string; dashed?: boolean; gray?: boolean }> = [
  { color: "#0070f3", label: "데이터 · 실험 흐름" },
  { color: "#7928ca", dashed: true, label: "모델 · 배포 구성 · CI/CD" },
  { gray: true, dashed: true, label: "팀 공유 통합 · 피드백" },
  { color: "#ee0000", label: "알림" },
]

const SECTIONS = [
  { dividerY: 330, numY: 362, subY: 387, num: "02", label: "실험 · 배포 제어", sub: "실험·아티팩트 계층과 운영 서빙 구성을 분리" },
  { dividerY: 640, numY: 672, subY: 697, num: "03", label: "CI/CD 배포", sub: "GitHub Actions로 빌드부터 롤링 배포까지 자동화" },
  { dividerY: 850, numY: 882, subY: 907, num: "04", label: "서빙 · 관측", sub: "BentoML 서비스별 격리 배포와 메트릭 기반 피드백" },
  { dividerY: 1406, numY: 0, subY: 0, num: "", label: "", sub: "" }, // bottom rule only
]

export function MlopsArchitectureDiagram() {
  const shouldReduceMotion = useReducedMotion()
  const { container, step, fade } = buildVariants(!!shouldReduceMotion)

  return (
    <motion.svg
      viewBox="0 0 1300 1400"
      className="h-auto w-full"
      fontFamily="var(--font-sans)"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={container}
    >
      <defs>
        <pattern id="mlops-architecture-grid-fine" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" strokeWidth="1" className="stroke-black/[0.035] dark:stroke-white/[0.05]" />
        </pattern>
        <pattern id="mlops-architecture-grid-bold" width="120" height="120" patternUnits="userSpaceOnUse">
          <path d="M 120 0 L 0 0 0 120" fill="none" strokeWidth="1" className="stroke-black/[0.06] dark:stroke-white/[0.08]" />
        </pattern>
        <marker id="mlops-architecture-arrow-gray" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
          <path d="M0,0 L7,3 L0,6 Z" className="fill-[#888888] dark:fill-zinc-500" />
        </marker>
        <marker id="mlops-architecture-arrow-blue" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
          <path d="M0,0 L7,3 L0,6 Z" fill="#0070f3" />
        </marker>
        <marker id="mlops-architecture-arrow-violet" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
          <path d="M0,0 L7,3 L0,6 Z" fill="#7928ca" />
        </marker>
        <marker id="mlops-architecture-arrow-red" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
          <path d="M0,0 L7,3 L0,6 Z" fill="#ee0000" />
        </marker>
        <style>
          {`
            .mlops-architecture-flow { stroke-dasharray: 7 6; }
            @media (prefers-reduced-motion: no-preference) {
              .mlops-architecture-flow { animation: mlops-architecture-flow-dash 1.2s linear infinite; }
              @keyframes mlops-architecture-flow-dash { to { stroke-dashoffset: -26; } }
            }
          `}
        </style>
      </defs>

      <rect width="1300" height="1400" fill="url(#mlops-architecture-grid-fine)" />
      <rect width="1300" height="1400" fill="url(#mlops-architecture-grid-bold)" />

      <text x="40" y="42" fontSize="14" fontWeight="600" letterSpacing="1.8" className="fill-[#888888] dark:fill-white">
        ARCHITECTURE
      </text>
      <text x="40" y="74" fontSize="26" fontWeight="600" letterSpacing="-0.5" className="fill-[#171717] dark:fill-white">
        학습 · 배포 · 관측이 연결된 모델 서비스 운영 경로
      </text>
      <text x="40" y="100" fontSize="16" className="fill-[#4d4d4d] dark:fill-white">
        반복 가능한 실험 추적과 서비스 배포 표준화, 그리고 운영 메트릭 피드백
      </text>

      {LEGEND.map((item, i) => {
        const legendRowGap = 28
        const headerDividerY = 124
        const legendStartY = headerDividerY / 2 - ((LEGEND.length - 1) / 2) * legendRowGap
        const y = legendStartY + i * legendRowGap
        return (
          <g key={item.label}>
            <line
              x1="950"
              y1={y}
              x2="982"
              y2={y}
              strokeWidth="2"
              stroke={item.gray ? undefined : item.color}
              strokeDasharray={item.dashed ? "5 5" : undefined}
              className={item.gray ? "stroke-[#888888] dark:stroke-zinc-500" : undefined}
            />
            <text x="992" y={y + 5} fontSize="15" className="fill-[#888888] dark:fill-white">
              {item.label}
            </text>
          </g>
        )
      })}

      <line x1="40" y1="124" x2="1260" y2="124" strokeWidth="1.5" className="stroke-[#ebebeb] dark:stroke-zinc-800" />

      <text x="40" y="154" fontSize="13" fontWeight="600" letterSpacing="1.5" className="fill-[#888888] dark:fill-white">
        01  데이터 기반
      </text>
      <text x="40" y="179" fontSize="18" className="fill-[#4d4d4d] dark:fill-white">
        BEMS 운영 데이터를 학습 가능한 입력으로 구성
      </text>

      {SECTIONS.map((s) => (
        <g key={s.dividerY}>
          <line x1="40" y1={s.dividerY} x2="1260" y2={s.dividerY} strokeWidth="1.5" className="stroke-[#ebebeb] dark:stroke-zinc-800" />
          {s.num ? (
            <>
              <text x="40" y={s.numY} fontSize="13" fontWeight="600" letterSpacing="1.5" className="fill-[#888888] dark:fill-white">
                {s.num}  {s.label}
              </text>
              <text x="40" y={s.subY} fontSize="18" className="fill-[#4d4d4d] dark:fill-white">
                {s.sub}
              </text>
            </>
          ) : null}
        </g>
      ))}

      {NODES.map((n) => (
        <motion.g key={n.title} variants={step}>
          <NodeBox {...n} />
        </motion.g>
      ))}

      {/* ECS Fargate — hero box with nested BentoML services */}
      <motion.g variants={step}>
        <rect x="40" y="1060" width="380" height="300" rx="12" fill="none" strokeWidth="2" className="stroke-[#171717] dark:stroke-white" />
        <text x="64" y="1093" fontSize="19" fontWeight="600" className="fill-[#171717] dark:fill-white">
          AWS ECS Fargate
        </text>
        <text x="64" y="1116" fontSize="14" className="fill-[#888888] dark:fill-white">
          모델별 독립 컨테이너 · 장애 격리 배포 단위
        </text>
        <FaAws x="370" y="1074" size="28" className="text-[#171717] dark:text-white" />
        <NodeBox x={64} y={1140} w={332} h={72} title="BentoML 서비스 A" detail="모델 서빙" Icon={SiBentoml} color="ink" />
        <NodeBox x={64} y={1250} w={332} h={72} title="BentoML 서비스 B" detail="모델 서빙" Icon={SiBentoml} color="ink" />
      </motion.g>

      {/* connectors */}
      <motion.g variants={fade}>
        <path d="M250 240 L280 240" strokeWidth="2" fill="none" strokeLinecap="round" stroke="#0070f3" className="mlops-architecture-flow" markerEnd="url(#mlops-architecture-arrow-blue)" />
      </motion.g>
      <motion.g variants={fade}>
        <path d="M500 240 L530 240" strokeWidth="2" fill="none" strokeLinecap="round" stroke="#0070f3" className="mlops-architecture-flow" markerEnd="url(#mlops-architecture-arrow-blue)" />
      </motion.g>
      <motion.g variants={fade}>
        <path d="M820 240 L850 240" strokeWidth="2" fill="none" strokeLinecap="round" stroke="#0070f3" className="mlops-architecture-flow" markerEnd="url(#mlops-architecture-arrow-blue)" />
      </motion.g>
      <motion.g variants={fade}>
        <path
          d="M970 280 L970 292 Q970 300 962 300 L32 300 Q24 300 24 308 L24 397 Q24 405 32 405 L182 405 Q190 405 190 413 L190 420"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          stroke="#0070f3"
          className="mlops-architecture-flow"
          markerEnd="url(#mlops-architecture-arrow-blue)"
        />
      </motion.g>
      <motion.g variants={fade} className="text-[#888888] dark:text-zinc-500">
        <path d="M115 500 L115 530" strokeWidth="2" fill="none" strokeLinecap="round" stroke="currentColor" markerEnd="url(#mlops-architecture-arrow-gray)" />
      </motion.g>
      <motion.g variants={fade} className="text-[#888888] dark:text-zinc-500">
        <path d="M285 500 L285 530" strokeWidth="2" fill="none" strokeLinecap="round" stroke="currentColor" markerEnd="url(#mlops-architecture-arrow-gray)" />
      </motion.g>

      <motion.g variants={fade}>
        <path d="M240 770 L270 770" strokeWidth="2" fill="none" strokeLinecap="round" stroke="#7928ca" className="mlops-architecture-flow" markerEnd="url(#mlops-architecture-arrow-violet)" />
      </motion.g>
      <motion.g variants={fade}>
        <path d="M500 770 L530 770" strokeWidth="2" fill="none" strokeLinecap="round" stroke="#7928ca" className="mlops-architecture-flow" markerEnd="url(#mlops-architecture-arrow-violet)" />
      </motion.g>
      <motion.g variants={fade}>
        <path d="M820 770 L850 770" strokeWidth="2" fill="none" strokeLinecap="round" stroke="#7928ca" className="mlops-architecture-flow" markerEnd="url(#mlops-architecture-arrow-violet)" />
      </motion.g>

      <motion.g variants={fade} className="text-[#888888] dark:text-zinc-500">
        <path d="M150 1020 L150 1060" strokeWidth="2" fill="none" strokeLinecap="round" stroke="currentColor" className="mlops-architecture-flow" markerEnd="url(#mlops-architecture-arrow-gray)" />
      </motion.g>
      <motion.g variants={fade}>
        <path
          d="M680 450 L1252 450 Q1260 450 1260 458 L1260 972 Q1260 980 1252 980 L260 980"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          stroke="#7928ca"
          strokeDasharray="5 5"
          markerEnd="url(#mlops-architecture-arrow-violet)"
        />
      </motion.g>
      <motion.g variants={fade}>
        <path
          d="M680 470 L1267 470 Q1275 470 1275 478 L1275 1092 Q1275 1100 1267 1100 L420 1100"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          stroke="#7928ca"
          strokeDasharray="5 5"
          markerEnd="url(#mlops-architecture-arrow-violet)"
        />
      </motion.g>
      <motion.g variants={fade}>
        <path
          d="M970 810 L970 1044 Q970 1052 962 1052 L368 1052 Q360 1052 360 1060"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          stroke="#7928ca"
          className="mlops-architecture-flow"
          markerEnd="url(#mlops-architecture-arrow-violet)"
        />
      </motion.g>
      <motion.g variants={fade}>
        <path d="M420 1180 L460 1180" strokeWidth="2" fill="none" strokeLinecap="round" stroke="#7928ca" className="mlops-architecture-flow" markerEnd="url(#mlops-architecture-arrow-violet)" />
      </motion.g>
      <motion.g variants={fade}>
        <path d="M690 1180 L740 1180" strokeWidth="2" fill="none" strokeLinecap="round" stroke="#7928ca" className="mlops-architecture-flow" markerEnd="url(#mlops-architecture-arrow-violet)" />
      </motion.g>
      <motion.g variants={fade}>
        <path d="M970 1180 L1020 1180" strokeWidth="2" fill="none" strokeLinecap="round" stroke="#ee0000" className="mlops-architecture-flow" markerEnd="url(#mlops-architecture-arrow-red)" />
      </motion.g>
      <motion.g variants={fade} className="text-[#888888] dark:text-zinc-500">
        <path
          d="M64 1286 L18 1286 Q10 1286 10 1278 L10 353 Q10 345 18 345 L385 345 Q395 345 395 335 L395 280"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          stroke="currentColor"
          strokeDasharray="5 5"
          markerEnd="url(#mlops-architecture-arrow-gray)"
        />
      </motion.g>

    </motion.svg>
  )
}
