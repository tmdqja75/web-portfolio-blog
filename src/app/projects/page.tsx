"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import type { IconType } from "react-icons"
import { SiSamsung, SiDocker, SiKubernetes, SiGithub } from "react-icons/si"
import { TbRobot, TbFileTypePdf, TbTrain, TbX } from "react-icons/tb"

import { cn } from "@/lib/utils"
import TransitionLink from "@/components/ui/transition-link"

type Project = {
  title: string
  subtitle: string
  icon: IconType
}

const CARD_TRANSITION = { duration: 0.6, ease: [0.65, 0, 0.35, 1] as const }

const PLACEHOLDER_DETAILS = [
  "프로젝트 배경과 문제 정의. 실제 콘텐츠(이미지, 다이어그램)는 추후 채워질 예정입니다.",
  "아키텍처 개요. 시스템 구성 요소와 데이터 흐름을 다이어그램으로 설명할 자리입니다.",
  "구현 세부사항. 주요 의사결정과 트레이드오프를 정리할 자리입니다.",
  "결과 및 회고. 성과 지표와 배운 점을 정리할 자리입니다.",
]

const columns: { header: string; projects: Project[] }[] = [
  {
    header: "MLOps",
    projects: [
      { title: "Samsung DT 프로젝트", subtitle: "삼성물산 Digital Twin 프로젝트", icon: SiSamsung },
      { title: "사내 MLOps 구축", subtitle: "사내 MLOps 구축", icon: SiKubernetes },
      { title: "EC2 → ECS", subtitle: "서버 마이그레이션 작업", icon: SiDocker },
    ],
  },
  {
    header: "AI Agent",
    projects: [
      { title: "Savee Assistant V1", subtitle: "BEMS내 챗봇 에이전트 V1", icon: TbRobot },
      { title: "Savee Assistant V2", subtitle: "BEMS내 챗봇 에이전트 V2", icon: TbRobot },
      { title: "분전반 도면 Parser", subtitle: "분전반 → 엑셀 파싱 자동화", icon: TbFileTypePdf },
      { title: "Automata Newsletter Agent", subtitle: "Langgraph 뉴스레터 에이전트", icon: TbFileTypePdf },
    ],
  },
  {
    header: "Side Project",
    projects: [
      { title: "agent-usage", subtitle: "Github에 Agent 사용통계 자동화", icon: SiGithub },
      { title: "subway-tracker", subtitle: "위치 기록 서버 지하철 트래킹", icon: TbTrain },
    ],
  },
]

function ProjectCard({ project, isExpanded, onOpen }: { project: Project; isExpanded: boolean; onOpen: () => void }) {
  return (
    <motion.div
      layoutId={`card-${project.title}`}
      onClick={onOpen}
      transition={CARD_TRANSITION}
      className="relative aspect-square w-40 shrink-0 overflow-hidden rounded-xl bg-white md:mb-6 md:aspect-[4/5] md:w-5/6 md:max-w-72"
      style={{ opacity: isExpanded ? 0 : 1 }}
    >
      <div className="flex h-full flex-col">
        <div className="flex flex-1 items-center justify-center">
          <project.icon className="h-24 w-24 text-[#171717]" />
        </div>
        <motion.div layoutId={`card-text-${project.title}`} layout="position" transition={CARD_TRANSITION} className="flex flex-col p-4">
          <h3 className="text-base font-semibold text-[#171717]" style={{ letterSpacing: "-0.28px" }}>
            {project.title}
          </h3>
          <p className="text-sm font-normal text-[#171717]/60" style={{ letterSpacing: "-0.28px" }}>
            {project.subtitle}
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

function ExpandedCard({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      layoutId={`card-${project.title}`}
      transition={CARD_TRANSITION}
      className="fixed inset-8 z-50 flex flex-col overflow-hidden rounded-xl bg-white md:inset-16"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-6 right-6 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-[#171717] hover:bg-zinc-200"
      >
        <TbX className="h-4 w-4" />
      </button>
      <motion.div layoutId={`card-text-${project.title}`} layout="position" transition={CARD_TRANSITION} className="flex flex-col p-6">
        <h3 className="text-3xl font-semibold text-[#171717]" style={{ letterSpacing: "-0.28px" }}>
          {project.title}
        </h3>
        <p className="text-lg font-normal text-[#171717]/60" style={{ letterSpacing: "-0.28px" }}>
          {project.subtitle}
        </p>
      </motion.div>
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {PLACEHOLDER_DETAILS.map((paragraph, i) => (
          <p key={i} className="mb-4 text-sm leading-relaxed text-[#171717]/80">
            {paragraph}
          </p>
        ))}
      </div>
    </motion.div>
  )
}

function ScrollColumn({
  header,
  projects,
  expanded,
  onOpen,
}: {
  header: string
  projects: Project[]
  expanded: Project | null
  onOpen: (project: Project) => void
}) {
  const [atStart, setAtStart] = useState(true)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches
    setAtStart(isMobile ? e.currentTarget.scrollLeft <= 0 : e.currentTarget.scrollTop <= 0)
  }

  return (
    <div className="flex min-h-0 flex-col md:flex-1">
      <h2
        className="px-6 pt-6 pb-4 font-sans text-2xl font-semibold text-[#171717] md:pt-12 md:pb-6 dark:text-white"
        style={{ letterSpacing: "-0.96px", lineHeight: "32px" }}
      >
        {header}
      </h2>
      <div className="relative min-h-0 md:flex-1">
        <div
          className="flex flex-row gap-4 overflow-x-auto px-6 pb-2 md:h-full md:flex-col md:items-center md:gap-0 md:overflow-x-hidden md:overflow-y-auto md:pb-0"
          onScroll={handleScroll}
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.title}
              project={project}
              isExpanded={expanded?.title === project.title}
              onOpen={() => onOpen(project)}
            />
          ))}
        </div>
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-black/20 to-transparent transition-opacity duration-300 md:inset-x-0 md:top-0 md:left-auto md:h-16 md:w-auto md:bg-gradient-to-b",
            atStart ? "opacity-0" : "opacity-100"
          )}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black/20 to-transparent md:inset-x-0 md:right-auto md:bottom-0 md:h-16 md:w-auto md:bg-gradient-to-t" />
      </div>
    </div>
  )
}

export default function ProjectsPage() {
  const [expanded, setExpanded] = useState<Project | null>(null)

  useEffect(() => {
    document.body.style.overflow = expanded ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [expanded])

  return (
    <main className="relative flex h-screen w-full flex-col gap-2 overflow-y-auto overflow-x-hidden bg-zinc-50 pt-16 md:flex-row md:gap-12 md:overflow-hidden md:px-6 md:pt-0 dark:bg-black">
      <TransitionLink
        href="/"
        className="absolute top-6 left-6 z-10 flex h-7 items-center rounded-[6px] bg-[#171717] px-2 text-sm font-medium text-white dark:bg-white dark:text-[#171717]"
      >
        ← Back
      </TransitionLink>
      {columns.map((column) => (
        <ScrollColumn
          key={column.header}
          header={column.header}
          projects={column.projects}
          expanded={expanded}
          onOpen={setExpanded}
        />
      ))}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpanded(null)}
          />
        )}
        {expanded && <ExpandedCard key={expanded.title} project={expanded} onClose={() => setExpanded(null)} />}
      </AnimatePresence>
    </main>
  )
}
