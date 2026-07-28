"use client"

import { motion } from "motion/react"

import type { Project } from "@/app/projects/data"

export function ProjectDetailContent({
  project,
  titleLayoutId,
  imageLayoutId,
}: {
  project: Project
  titleLayoutId?: string
  imageLayoutId?: string
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <motion.div
        layoutId={imageLayoutId}
        className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-cover bg-center"
        style={{ backgroundImage: `url(${project.image})` }}
      />

      <motion.h1
        layoutId={titleLayoutId}
        className="mt-6 text-2xl font-semibold text-[#171717] dark:text-white"
        style={{ letterSpacing: "-0.96px" }}
      >
        {project.title}
      </motion.h1>

      {(project.role || project.timeframe) && (
        <p className="mt-1 text-sm text-[#888888]">
          {[project.role, project.timeframe].filter(Boolean).join(" · ")}
        </p>
      )}

      <p className="mt-4 text-[#4d4d4d] dark:text-zinc-400">{project.description}</p>

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
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {project.metrics.map((metric) => (
            <div key={metric.label} className="rounded-xl border border-[#ebebeb] p-4 dark:border-zinc-800">
              <div className="text-2xl font-semibold text-[#171717] dark:text-white">{metric.value}</div>
              <div className="text-sm text-[#888888]">{metric.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* project.diagram rendering added in Task 10 */}

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
    </div>
  )
}
