"use client"

import type { ComponentType } from "react"
import { motion, useReducedMotion } from "motion/react"

import type { Project, ProjectMetric } from "@/app/projects/data"
import { PipelineDiagram } from "@/components/projects/pipeline-diagram"
import { AnalysisDiagram } from "@/components/projects/analysis-diagram"
import { AccuracyDiagram } from "@/components/projects/accuracy-diagram"

const PAAR_EYEBROW = { problem: "PROBLEM", analysis: "ANALYSIS", action: "ACTION", result: "RESULT" } as const

const PAAR_DIAGRAM: Record<string, ComponentType | undefined> = {
  analysis: AnalysisDiagram,
  action: PipelineDiagram,
  result: AccuracyDiagram,
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
  diagram?: ComponentType
  stats?: ProjectMetric[]
}) {
  return (
    <div className="mt-10 border-t border-[#ebebeb] pt-8 first:mt-8 first:border-t-0 first:pt-0 dark:border-zinc-800">
      <span className="text-xs font-semibold tracking-[1.5px] text-[#888888] dark:text-zinc-500">{eyebrow}</span>
      <h2 className="mt-1 text-lg font-semibold text-[#171717] dark:text-white" style={{ letterSpacing: "-0.6px" }}>
        {heading}
      </h2>

      <ul className="mt-4 space-y-2.5">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex gap-3 text-[15px] leading-relaxed text-[#4d4d4d] dark:text-zinc-400">
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

      {Diagram && (
        <div className="mt-6 overflow-x-auto rounded-xl border border-[#ebebeb] dark:border-zinc-800">
          <div className="min-w-[640px]">
            <Diagram />
          </div>
        </div>
      )}
    </div>
  )
}

export function ProjectDetailContent({ project }: { project: Project }) {
  const shouldReduceMotion = useReducedMotion()
  const entranceTransition = shouldReduceMotion ? { duration: 0.15 } : { duration: 0.3 }

  return (
    <div className="mx-auto max-w-3xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={entranceTransition}
        className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-cover bg-center"
        style={{ backgroundImage: `url(${project.image})` }}
      />

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

        <p className="mt-4 text-[#4d4d4d] dark:text-zinc-400">
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
                <li key={metric.label} className="flex gap-3 text-[15px] leading-relaxed text-[#4d4d4d] dark:text-zinc-400">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-[2px] bg-[#a1a1a1] dark:bg-zinc-600" />
                  <span>
                    <strong className="font-semibold text-[#171717] dark:text-white">{metric.value}</strong> · {metric.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
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
              diagram={PAAR_DIAGRAM.analysis}
            />
            <PAARSection
              eyebrow={PAAR_EYEBROW.action}
              heading={project.paar.action.heading}
              bullets={project.paar.action.bullets}
              diagram={PAAR_DIAGRAM.action}
            />
            <PAARSection
              eyebrow={PAAR_EYEBROW.result}
              heading={project.paar.result.heading}
              bullets={project.paar.result.bullets}
              diagram={PAAR_DIAGRAM.result}
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
    </div>
  )
}
