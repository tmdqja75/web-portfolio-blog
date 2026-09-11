"use client"

import { motion, useReducedMotion } from "motion/react"

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

export function NewsletterArchitectureDiagram() {
  const shouldReduceMotion = useReducedMotion()
  const { container, step, fade } = buildVariants(!!shouldReduceMotion)
  const flowClass = shouldReduceMotion ? "" : "newsletter-arch-flow"

  return (
    <motion.svg
      viewBox="0 0 1200 660"
      className="h-auto w-full"
      fontFamily="-apple-system, 'Segoe UI', ui-sans-serif, sans-serif"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={container}
    >
      <style>
        {`.newsletter-arch-flow { stroke-dasharray: 8 6; animation: newsletter-arch-dash 0.7s linear infinite; }
          @keyframes newsletter-arch-dash { to { stroke-dashoffset: -14; } }`}
      </style>

      <motion.g variants={fade}>
        <text x="600" y="36" textAnchor="middle" fontSize="26" fontWeight="600" className="fill-[#171717] dark:fill-white">
          뉴스레터 자동화 — 에이전트/도구 구조도
        </text>
        <text x="600" y="60" textAnchor="middle" fontSize="19" className="fill-[#4d4d4d] dark:fill-zinc-400">
          메인 오케스트레이터가 서브에이전트 2개와 도구들을 호출하는 구조
        </text>
      </motion.g>

      {/* Orchestrator */}
      <motion.g variants={step}>
        <rect x="30" y="84" width="1140" height="230" rx="12" fill="none" strokeWidth="2" className="stroke-[#171717] dark:stroke-white" />
        <text x="600" y="122" textAnchor="middle" fontSize="26" fontWeight="600" className="fill-[#171717] dark:fill-white">
          Orchestrator
        </text>
        <text x="600" y="148" textAnchor="middle" fontSize="20" className="fill-[#4d4d4d] dark:fill-zinc-400">
          뉴스레터 생성 전체를 조율하는 메인 에이전트
        </text>
      </motion.g>

      {/* Orchestrator's own tools */}
      <motion.g variants={step}>
        <rect x="60" y="178" width="203" height="120" rx="8" fill="none" className="stroke-[#a1a1a1] dark:stroke-zinc-700" />
        <text x="161.5" y="208" textAnchor="middle" fontSize="19" fontWeight="600" className="fill-[#171717] dark:fill-white">
          save_article
        </text>
        <text x="161.5" y="232" textAnchor="middle" fontSize="17" className="fill-[#888888] dark:fill-zinc-500">
          아티클을 파일로
        </text>
        <text x="161.5" y="252" textAnchor="middle" fontSize="17" className="fill-[#888888] dark:fill-zinc-500">
          저장
        </text>
      </motion.g>

      <motion.g variants={step}>
        <rect x="279" y="178" width="203" height="120" rx="8" fill="none" className="stroke-[#a1a1a1] dark:stroke-zinc-700" />
        <text x="380.5" y="208" textAnchor="middle" fontSize="19" fontWeight="600" className="fill-[#171717] dark:fill-white">
          merge_newsletter
        </text>
        <text x="380.5" y="232" textAnchor="middle" fontSize="17" className="fill-[#888888] dark:fill-zinc-500">
          저장된 아티클을
        </text>
        <text x="380.5" y="252" textAnchor="middle" fontSize="17" className="fill-[#888888] dark:fill-zinc-500">
          뉴스레터로 합침
        </text>
      </motion.g>

      <motion.g variants={step}>
        <rect x="498" y="178" width="203" height="120" rx="8" fill="none" className="stroke-[#a1a1a1] dark:stroke-zinc-700" />
        <text x="599.5" y="204" textAnchor="middle" fontSize="19" fontWeight="600" className="fill-[#171717] dark:fill-white">
          create_svg
        </text>
        <text x="599.5" y="224" textAnchor="middle" fontSize="19" fontWeight="600" className="fill-[#171717] dark:fill-white">
          _diagram
        </text>
        <text x="599.5" y="248" textAnchor="middle" fontSize="17" className="fill-[#888888] dark:fill-zinc-500">
          다이어그램
        </text>
        <text x="599.5" y="268" textAnchor="middle" fontSize="17" className="fill-[#888888] dark:fill-zinc-500">
          생성 도구
        </text>
      </motion.g>

      <motion.g variants={step}>
        <rect x="717" y="178" width="203" height="120" rx="8" fill="none" className="stroke-[#a1a1a1] dark:stroke-zinc-700" />
        <text x="818.5" y="204" textAnchor="middle" fontSize="19" fontWeight="600" className="fill-[#171717] dark:fill-white">
          run_weekly
        </text>
        <text x="818.5" y="224" textAnchor="middle" fontSize="19" fontWeight="600" className="fill-[#171717] dark:fill-white">
          _research
        </text>
        <text x="818.5" y="248" textAnchor="middle" fontSize="17" className="fill-[#888888] dark:fill-zinc-500">
          이번 주 뉴스
        </text>
        <text x="818.5" y="268" textAnchor="middle" fontSize="17" className="fill-[#888888] dark:fill-zinc-500">
          후보 수집
        </text>
      </motion.g>

      <motion.g variants={step}>
        <rect x="936" y="178" width="203" height="120" rx="8" fill="none" className="stroke-[#a1a1a1] dark:stroke-zinc-700" />
        <text x="1037.5" y="208" textAnchor="middle" fontSize="19" fontWeight="600" className="fill-[#171717] dark:fill-white">
          select_topics
        </text>
        <text x="1037.5" y="232" textAnchor="middle" fontSize="17" className="fill-[#888888] dark:fill-zinc-500">
          후보 중 토픽을
        </text>
        <text x="1037.5" y="252" textAnchor="middle" fontSize="17" className="fill-[#888888] dark:fill-zinc-500">
          자동/수동으로 확정
        </text>
        <rect x="1075" y="165" width="64" height="26" rx="13" className="fill-[#171717] dark:fill-white" />
        <text x="1107" y="182.5" textAnchor="middle" fontSize="17" fontWeight="700" className="fill-white dark:fill-[#171717]">
          HITL
        </text>
      </motion.g>

      {/* branch: Orchestrator -> subagents */}
      <motion.g variants={fade} className="text-[#a1a1a1] dark:text-zinc-600">
        <line x1="600" y1="314" x2="600" y2="349" strokeWidth="2.5" stroke="currentColor" className={flowClass} />
        <line x1="600" y1="349" x2="315" y2="349" strokeWidth="2.5" stroke="currentColor" className={flowClass} />
        <line x1="600" y1="349" x2="885" y2="349" strokeWidth="2.5" stroke="currentColor" className={flowClass} />
        <line x1="315" y1="349" x2="315" y2="404" strokeWidth="2.5" stroke="currentColor" className={flowClass} />
        <line x1="885" y1="349" x2="885" y2="404" strokeWidth="2.5" stroke="currentColor" className={flowClass} />
        <polygon points="308,393 315,404 322,393" fill="currentColor" />
        <polygon points="878,393 885,404 892,393" fill="currentColor" />
      </motion.g>

      {/* topic-researcher */}
      <motion.g variants={step}>
        <rect x="50" y="404" width="530" height="188" rx="12" fill="none" strokeWidth="1.5" className="stroke-[#171717] dark:stroke-white" />
        <text x="315" y="438" textAnchor="middle" fontSize="24" fontWeight="600" className="fill-[#171717] dark:fill-white">
          topic-researcher
        </text>
        <text x="315" y="462" textAnchor="middle" fontSize="19" className="fill-[#4d4d4d] dark:fill-zinc-400">
          사용자가 지정한 토픽 하나를 조사
        </text>

        <rect x="74" y="482" width="233" height="90" rx="7" fill="none" className="stroke-[#a1a1a1] dark:stroke-zinc-700" />
        <text x="190.5" y="510" textAnchor="middle" fontSize="18" fontWeight="600" className="fill-[#171717] dark:fill-white">
          search_ai_news
        </text>
        <text x="190.5" y="534" textAnchor="middle" fontSize="16" className="fill-[#888888] dark:fill-zinc-500">
          AI 뉴스 검색
        </text>

        <rect x="323" y="482" width="233" height="90" rx="7" fill="none" className="stroke-[#a1a1a1] dark:stroke-zinc-700" />
        <text x="439.5" y="510" textAnchor="middle" fontSize="18" fontWeight="600" className="fill-[#171717] dark:fill-white">
          fetch_article_content
        </text>
        <text x="439.5" y="534" textAnchor="middle" fontSize="16" className="fill-[#888888] dark:fill-zinc-500">
          기사 원문 가져오기
        </text>
      </motion.g>

      {/* article-writer */}
      <motion.g variants={step}>
        <rect x="620" y="404" width="530" height="188" rx="12" fill="none" strokeWidth="1.5" className="stroke-[#171717] dark:stroke-white" />
        <text x="885" y="438" textAnchor="middle" fontSize="24" fontWeight="600" className="fill-[#171717] dark:fill-white">
          article-writer
        </text>
        <text x="885" y="462" textAnchor="middle" fontSize="19" className="fill-[#4d4d4d] dark:fill-zinc-400">
          확정된 토픽으로 아티클 작성
        </text>

        <rect x="644" y="482" width="151" height="90" rx="7" fill="none" className="stroke-[#a1a1a1] dark:stroke-zinc-700" />
        <text x="719.5" y="510" textAnchor="middle" fontSize="17" fontWeight="600" className="fill-[#171717] dark:fill-white">
          search_ai_news
        </text>
        <text x="719.5" y="534" textAnchor="middle" fontSize="11.5" className="fill-[#888888] dark:fill-zinc-500">
          AI 뉴스 검색
        </text>

        <rect x="809" y="482" width="151" height="90" rx="7" fill="none" className="stroke-[#a1a1a1] dark:stroke-zinc-700" />
        <text x="884.5" y="506" textAnchor="middle" fontSize="17" fontWeight="600" className="fill-[#171717] dark:fill-white">
          fetch_article
        </text>
        <text x="884.5" y="524" textAnchor="middle" fontSize="17" fontWeight="600" className="fill-[#171717] dark:fill-white">
          _content
        </text>
        <text x="884.5" y="546" textAnchor="middle" fontSize="11.5" className="fill-[#888888] dark:fill-zinc-500">
          원문 가져오기
        </text>

        <rect x="974" y="482" width="151" height="90" rx="7" fill="none" className="stroke-[#a1a1a1] dark:stroke-zinc-700" />
        <text x="1049.5" y="506" textAnchor="middle" fontSize="17" fontWeight="600" className="fill-[#171717] dark:fill-white">
          create_svg
        </text>
        <text x="1049.5" y="524" textAnchor="middle" fontSize="17" fontWeight="600" className="fill-[#171717] dark:fill-white">
          _diagram
        </text>
        <text x="1049.5" y="546" textAnchor="middle" fontSize="11.5" className="fill-[#888888] dark:fill-zinc-500">
          다이어그램 생성
        </text>
      </motion.g>

      {/* legend */}
      <motion.g variants={fade}>
        <rect x="30" y="612" width="18" height="18" rx="3" fill="none" strokeWidth="2.5" className="stroke-[#171717] dark:stroke-white" />
        <text x="56" y="626" fontSize="16" className="fill-[#4d4d4d] dark:fill-zinc-400">
          에이전트
        </text>
        <rect x="150" y="612" width="18" height="18" rx="3" fill="none" strokeWidth="1" className="stroke-[#a1a1a1] dark:stroke-zinc-700" />
        <text x="176" y="626" fontSize="16" className="fill-[#4d4d4d] dark:fill-zinc-400">
          도구
        </text>
      </motion.g>
    </motion.svg>
  )
}
