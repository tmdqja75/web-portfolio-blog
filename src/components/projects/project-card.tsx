"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"

import type { Project } from "@/app/projects/data"

export function ProjectCard({
  project,
  categoryParam,
}: {
  project: Project
  categoryParam: string | null
}) {
  const shouldReduceMotion = useReducedMotion()
  const href = `/projects/${project.slug}${categoryParam ? `?category=${categoryParam}` : ""}`

  return (
    <Link href={href} scroll={false} className="group block">
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={shouldReduceMotion ? { duration: 0.15 } : { duration: 0.2 }}
        className="relative aspect-[16/9] overflow-hidden rounded-xl shadow-sm"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${project.image})` }}
        />

        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4">
          <h3 className="text-base font-semibold text-white" style={{ letterSpacing: "-0.28px" }}>
            {project.title}
          </h3>
          <p className="text-sm font-normal text-white/70" style={{ letterSpacing: "-0.28px" }}>
            {project.subtitle}
          </p>
          <div className="mt-2 flex flex-wrap gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {project.techStack.slice(0, 3).map((tech) => (
              <span key={tech} className="rounded-[6px] bg-white/20 px-2 py-0.5 text-xs text-white">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
