"use client"

import { motion, useReducedMotion } from "motion/react"
import { FaAws, FaBoxOpen, FaDatabase, FaFlask, FaGlobe, FaSlack, FaUsers } from "react-icons/fa6"
import { SiGrafana, SiMlflow, SiPrometheus } from "react-icons/si"

function buildVariants(instant: boolean) {
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: instant ? 0 : 0.1, delayChildren: instant ? 0 : 0.05 } },
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

// Reserved width on the right of every box for its icon (icon + gap + margin).
const ICON_RESERVE = 56

const NODES = [
  { x: 40, y: 92, w: 330, h: 62, title: "DS 로컬 학습 코드", sub: "(전처리 · 모델 학습)", Icon: FaFlask },
  { x: 410, y: 92, w: 330, h: 62, title: "MLflow", sub: "(ECS · RDS 백엔드 · S3 아티팩트)", Icon: SiMlflow },
  { x: 40, y: 196, w: 700, h: 64, title: "BentoML 서비스 정의", sub: "(bentofile.yaml · 공통 API·오류 규칙)", Icon: FaBoxOpen },
  { x: 790, y: 196, w: 490, h: 64, title: "DynamoDB", sub: "(배포 레지스트리: 솔루션→컴포넌트→모델)", Icon: FaDatabase },
  { x: 790, y: 372, w: 235, h: 50, title: "Prometheus", sub: "(커스텀 지표)", Icon: SiPrometheus },
  { x: 1045, y: 372, w: 235, h: 50, title: "Grafana", sub: "(대시보드)", Icon: SiGrafana },
  { x: 40, y: 496, w: 360, h: 64, title: "Slack 알림", sub: "(임계치 초과 시 채널 전송)", Icon: FaSlack },
  { x: 440, y: 496, w: 360, h: 64, title: "웹 UI", sub: "(건물별 예측 결과 제공)", Icon: FaGlobe },
  { x: 840, y: 496, w: 400, h: 64, title: "다른 DS 2명", sub: "(공통 경로로 자기 서비스 배포)", Icon: FaUsers },
]

export function MlopsArchitectureDiagram() {
  const shouldReduceMotion = useReducedMotion()
  const { container, step, fade } = buildVariants(!!shouldReduceMotion)

  return (
    <motion.svg
      viewBox="0 0 1320 610"
      className="h-auto w-full"
      fontFamily="-apple-system, 'Segoe UI', ui-sans-serif, sans-serif"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={container}
    >
      <defs>
        <pattern id="mlops-architecture-grid-fine" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" strokeWidth="1" className="stroke-black/[0.035] dark:stroke-white/[0.05]" />
        </pattern>
        <pattern id="mlops-architecture-grid-bold" width="120" height="120" patternUnits="userSpaceOnUse">
          <path d="M 120 0 L 0 0 0 120" fill="none" strokeWidth="1" className="stroke-black/[0.06] dark:stroke-white/[0.08]" />
        </pattern>
      </defs>

      <rect width="1320" height="610" fill="url(#mlops-architecture-grid-fine)" />
      <rect width="1320" height="610" fill="url(#mlops-architecture-grid-bold)" />

      <text x="40" y="30" fontSize="20" fontWeight="600" letterSpacing="1.7" className="fill-[#888888] dark:fill-zinc-500">
        ARCHITECTURE
      </text>
      <text x="40" y="60" fontSize="22" className="fill-[#4d4d4d] dark:fill-zinc-400">
        실험 기록부터 배포·관측·알림까지 이어지는 표준 경로
      </text>

      {NODES.map((n) => (
        <motion.g key={n.title} variants={step}>
          <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="10" fill="none" className="stroke-[#a1a1a1] dark:stroke-zinc-700" />
          <text
            x={n.x + (n.w - ICON_RESERVE) / 2}
            y={n.y + n.h / 2 - 5}
            fontSize="19"
            fontWeight="600"
            textAnchor="middle"
            className="fill-[#171717] dark:fill-white"
          >
            {n.title}
          </text>
          <text
            x={n.x + (n.w - ICON_RESERVE) / 2}
            y={n.y + n.h / 2 + 15}
            fontSize="16"
            textAnchor="middle"
            className="fill-[#888888] dark:fill-zinc-500"
          >
            {n.sub}
          </text>
          <n.Icon
            x={n.x + n.w - 36}
            y={n.y + n.h / 2 - 10}
            size={20}
            className="text-[#888888] dark:text-zinc-500"
          />
        </motion.g>
      ))}

      {/* ECS Fargate — hero box with nested CD mechanism */}
      <motion.g variants={step}>
        <rect x="40" y="302" width="700" height="120" rx="10" fill="none" strokeWidth="2" className="stroke-[#171717] dark:stroke-white" />
        <text x="64" y="336" fontSize="22" fontWeight="600" className="fill-[#171717] dark:fill-white">
          ECS Fargate 서비스
        </text>
        <text x="64" y="360" fontSize="16" className="fill-[#888888] dark:fill-zinc-500">
          (모델별 독립 컨테이너, 장애 격리 단위)
        </text>
        <FaAws x="696" y="318" size="26" className="text-[#171717] dark:text-white" />
        <rect x="64" y="376" width="652" height="38" rx="8" fill="none" strokeDasharray="4 4" className="stroke-[#a1a1a1] dark:stroke-zinc-700" />
        <text x="390" y="400" fontSize="17" fontWeight="500" textAnchor="middle" className="fill-[#4d4d4d] dark:fill-zinc-400">
          GitHub Actions CD: 변경 감지 → 빌드 → ECR 푸시 → ALB 라우팅 검증 → 갱신
        </text>
      </motion.g>

      {/* connectors */}
      <motion.g variants={fade} className="text-[#888888] dark:text-zinc-500">
        <line x1="205" y1="154" x2="205" y2="186" strokeWidth="2" stroke="currentColor" />
        <polygon points="199,186 205,196 211,186" fill="currentColor" />
      </motion.g>
      <motion.g variants={fade} className="text-[#888888] dark:text-zinc-500">
        <line x1="575" y1="154" x2="575" y2="186" strokeWidth="2" stroke="currentColor" />
        <polygon points="569,186 575,196 581,186" fill="currentColor" />
      </motion.g>
      <motion.g variants={fade} className="text-[#888888] dark:text-zinc-500">
        <line x1="390" y1="260" x2="390" y2="292" strokeWidth="2" stroke="currentColor" />
        <polygon points="384,292 390,302 396,292" fill="currentColor" />
      </motion.g>
      <motion.g variants={fade} className="text-[#888888] dark:text-zinc-500">
        <line x1="716" y1="396" x2="780" y2="396" strokeWidth="2" stroke="currentColor" />
        <polygon points="780,390 790,396 780,402" fill="currentColor" />
      </motion.g>
      <motion.g variants={fade} className="text-[#888888] dark:text-zinc-500">
        <line x1="1025" y1="397" x2="1035" y2="397" strokeWidth="2" stroke="currentColor" />
        <polygon points="1035,391 1045,397 1035,403" fill="currentColor" />
      </motion.g>

      {/* dashed config edge: ECS deploy -> DynamoDB registry */}
      <motion.g variants={fade} className="text-[#a1a1a1] dark:text-zinc-600">
        <path d="M 740 330 C 810 330, 810 280, 850 262" fill="none" strokeWidth="2" strokeDasharray="5 5" stroke="currentColor" />
        <polygon points="844,270 850,260 856,270" fill="currentColor" />
      </motion.g>

      <line x1="40" y1="452" x2="1280" y2="452" strokeWidth="1.5" className="stroke-[#ebebeb] dark:stroke-zinc-800" />

      <text x="40" y="478" fontSize="18" fontWeight="600" letterSpacing="1.5" className="fill-[#888888] dark:fill-zinc-500">
        MONITORING
      </text>

      <text x="40" y="584" fontSize="16" className="fill-[#888888] dark:fill-zinc-500">
        * Airflow 오케스트레이션은 본인 담당 범위 밖이라 이 다이어그램에서 제외
      </text>
    </motion.svg>
  )
}
