"use client"

import type { ComponentType } from "react"
import dynamic from "next/dynamic"
import { motion, useReducedMotion } from "motion/react"

import type { Project, ProjectMetric } from "@/app/projects/data"
import { ProjectBannerModal } from "@/components/projects/project-banner-modal"

// Dynamically imported: any single open project renders at most a handful of
// these, so loading all ten eagerly would bloat the /projects bundle for
// diagrams most page loads never see.
const PipelineDiagram = dynamic(() =>
  import("@/components/projects/pipeline-diagram").then((m) => m.PipelineDiagram)
)
const AnalysisDiagram = dynamic(() =>
  import("@/components/projects/analysis-diagram").then((m) => m.AnalysisDiagram)
)
const AccuracyDiagram = dynamic(() =>
  import("@/components/projects/accuracy-diagram").then((m) => m.AccuracyDiagram)
)
const ChatbotPipelineDiagram = dynamic(() =>
  import("@/components/projects/chatbot-pipeline-diagram").then((m) => m.ChatbotPipelineDiagram)
)
const ChatbotAnalysisDiagram = dynamic(() =>
  import("@/components/projects/chatbot-analysis-diagram").then((m) => m.ChatbotAnalysisDiagram)
)
const ChatbotLatencyDiagram = dynamic(() =>
  import("@/components/projects/chatbot-latency-diagram").then((m) => m.ChatbotLatencyDiagram)
)
const ChatbotArchitectureDiagram = dynamic(() =>
  import("@/components/projects/chatbot-architecture-diagram").then(
    (m) => m.ChatbotArchitectureDiagram
  )
)
const PdfViewer = dynamic(
  () => import("@/components/projects/pdf-viewer").then((m) => m.PdfViewer),
  { ssr: false }
)
const ChatbotV2AnalysisDiagram = dynamic(() =>
  import("@/components/projects/chatbot-v2-analysis-diagram").then(
    (m) => m.ChatbotV2AnalysisDiagram
  )
)
const MlopsArchitectureDiagram = dynamic(() =>
  import("@/components/projects/mlops-architecture-diagram").then(
    (m) => m.MlopsArchitectureDiagram
  )
)
const MlopsLeadtimeDiagram = dynamic(() =>
  import("@/components/projects/mlops-leadtime-diagram").then((m) => m.MlopsLeadtimeDiagram)
)
const NewsletterArchitectureDiagram = dynamic(() =>
  import("@/components/projects/newsletter-architecture-diagram").then(
    (m) => m.NewsletterArchitectureDiagram
  )
)

const PAAR_EYEBROW = { problem: "PROBLEM", analysis: "ANALYSIS", action: "ACTION", result: "RESULT" } as const

type PAARDiagramKey = "analysis" | "action" | "result"

// Each project's paar section can render its own diagram set — keyed by slug so
// projects don't accidentally share another project's illustrations. A section can
// point at one diagram or a list of diagrams stacked in order.
const PAAR_DIAGRAM_BY_PROJECT: Record<string, Partial<Record<PAARDiagramKey, ComponentType | ComponentType[]>>> = {
  "aws-mlops-platform": {
    action: MlopsArchitectureDiagram,
    result: MlopsLeadtimeDiagram,
  },
  "dxf-panel-parser": {
    analysis: AnalysisDiagram,
    action: PipelineDiagram,
    result: AccuracyDiagram,
  },
  "savee-chatbot-api": {
    analysis: ChatbotAnalysisDiagram,
    action: [ChatbotPipelineDiagram, ChatbotArchitectureDiagram],
    result: ChatbotLatencyDiagram,
  },
  "savee-chatbot-api-v2": {
    analysis: ChatbotV2AnalysisDiagram,
  },
  "newsletter-automation": {
    action: NewsletterArchitectureDiagram,
  },
}

function PAARSection({
  eyebrow,
  heading,
  bullets,
  diagram: Diagram,
  stats,
}: {
  eyebrow: string
  heading: string
  bullets: string[]
  diagram?: ComponentType | ComponentType[]
  stats?: ProjectMetric[]
}) {
  const diagrams = Diagram ? (Array.isArray(Diagram) ? Diagram : [Diagram]) : []
  return (
    <div className="mt-10 border-t border-[#ebebeb] pt-8 first:mt-8 first:border-t-0 first:pt-0 dark:border-zinc-800">
      <span className="text-xs font-semibold tracking-[1.5px] text-[#888888] dark:text-zinc-500">{eyebrow}</span>
      <h2 className="mt-1 text-lg font-semibold text-[#171717] dark:text-white" style={{ letterSpacing: "-0.6px" }}>
        {heading}
      </h2>

      <ul className="mt-4 space-y-2.5">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex gap-3 text-base leading-6 text-[#4d4d4d] dark:text-zinc-400">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-[2px] bg-[#a1a1a1] dark:bg-zinc-600" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      {stats && (
        <div className="mt-5 grid grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-lg font-semibold text-[#171717] dark:text-white">{stat.value}</div>
              <div className="text-xs text-[#888888] dark:text-zinc-500">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {diagrams.length > 0 && (
        <div className="mt-6 space-y-4">
          {diagrams.map((D, i) => (
            <div key={i} className="overflow-x-auto rounded-xl border border-[#ebebeb] dark:border-zinc-800">
              <div className="min-w-[640px]">
                <D />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function ProjectDetailContent({ project }: { project: Project }) {
  const shouldReduceMotion = useReducedMotion()
  const entranceTransition = shouldReduceMotion ? { duration: 0.15 } : { duration: 0.3 }
  const paarDiagram = PAAR_DIAGRAM_BY_PROJECT[project.slug] ?? {}

  const rest = (
    <>
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={entranceTransition}
        className="mt-6 text-2xl font-semibold text-[#171717] dark:text-white"
        style={{ letterSpacing: "-0.96px" }}
      >
        {project.title}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          shouldReduceMotion
            ? { duration: 0.15, staggerChildren: 0 }
            : { delay: 0.2, duration: 0.3, staggerChildren: 0.06 }
        }
      >
        {(project.role || project.timeframe) && (
          <p className="mt-1 text-sm text-[#888888]">
            {[project.role, project.timeframe].filter(Boolean).join(" · ")}
          </p>
        )}

        <p className="mt-4 text-base leading-6 text-[#4d4d4d] dark:text-zinc-400">
          {project.paar ? project.subtitle : project.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-[6px] bg-zinc-200 px-2 py-1 text-xs font-medium text-[#171717] dark:bg-zinc-800 dark:text-white"
            >
              {tech}
            </span>
          ))}
        </div>

        {project.metrics && (
          <div className="mt-8">
            <span className="text-xs font-semibold tracking-[1.5px] text-[#888888] dark:text-zinc-500">TL;DR</span>
            <ul className="mt-2 space-y-2">
              {project.metrics.map((metric) => (
                <li key={metric.label} className="flex gap-3 text-base leading-6 text-[#4d4d4d] dark:text-zinc-400">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-[2px] bg-[#a1a1a1] dark:bg-zinc-600" />
                  <span>
                    <strong className="font-semibold text-[#171717] dark:text-white">{metric.value}</strong> · {metric.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {project.presentation && (
          <section
            className="mt-10 border-t border-[#ebebeb] pt-8 dark:border-zinc-800"
            aria-labelledby="presentation-heading"
          >
            <span className="text-xs font-semibold tracking-[1.5px] text-[#888888] dark:text-zinc-500">PRESENTATION</span>
            <h2
              id="presentation-heading"
              className="mt-1 text-lg font-semibold text-[#171717] dark:text-white"
              style={{ letterSpacing: "-0.6px" }}
            >
              {project.presentation.title}
            </h2>
            <p className="mt-1 text-sm text-[#888888] dark:text-zinc-500">
              직접 제작한 {project.presentation.pageCount}페이지 워크숍 자료
            </p>
            <PdfViewer
              src={project.presentation.src}
              pageCount={project.presentation.pageCount}
              title={project.presentation.title}
            />
          </section>
        )}

        {project.paar ? (
          <div>
            <PAARSection
              eyebrow={PAAR_EYEBROW.problem}
              heading={project.paar.problem.heading}
              bullets={project.paar.problem.bullets}
              stats={project.paar.problem.stats}
            />
            <PAARSection
              eyebrow={PAAR_EYEBROW.analysis}
              heading={project.paar.analysis.heading}
              bullets={project.paar.analysis.bullets}
              diagram={paarDiagram.analysis}
            />
            <PAARSection
              eyebrow={PAAR_EYEBROW.action}
              heading={project.paar.action.heading}
              bullets={project.paar.action.bullets}
              diagram={paarDiagram.action}
            />
            <PAARSection
              eyebrow={PAAR_EYEBROW.result}
              heading={project.paar.result.heading}
              bullets={project.paar.result.bullets}
              diagram={paarDiagram.result}
            />
          </div>
        ) : (
          project.diagramImage && (
            <div className="mt-8 overflow-hidden rounded-xl border border-[#ebebeb] dark:border-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.diagramImage} alt={`${project.title} 다이어그램`} className="w-full" />
            </div>
          )
        )}

        {project.links && (
          <div className="mt-8 flex flex-wrap gap-3">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-[6px] bg-[#171717] px-3 py-1.5 text-sm font-medium text-white dark:bg-white dark:text-[#171717]"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </motion.div>
    </>
  )

  return (
    <div>
      <ProjectBannerModal project={project} />
      <div className="bg-white p-8 pb-24 dark:bg-[#0a0a0a]">{rest}</div>
    </div>
  )
}
