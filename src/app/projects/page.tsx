"use client"

import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import { ProjectCard } from "@/components/projects/project-card"
import { categories, getCategoryProjects, getProject } from "./data"

const ProjectDetailOverlay = dynamic(() =>
  import("@/components/projects/project-detail-overlay").then((m) => m.ProjectDetailOverlay)
)

export default function ProjectsPage() {
  return (
    <Suspense fallback={null}>
      <ProjectsPageInner />
    </Suspense>
  )
}

function ProjectsPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const shouldReduceMotion = useReducedMotion()
  const activeCategory = searchParams.get("category")
  const visibleProjects = getCategoryProjects(activeCategory)
  const activeProject = getProject(searchParams.get("project") ?? "")

  const setCategory = (category: string | null) => {
    const params = new URLSearchParams(searchParams)
    if (category) params.set("category", category)
    else params.delete("category")
    router.push(`/projects${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false })
  }

  return (
    <main className="relative min-h-screen w-full px-6 pb-24">
      <div className="mx-auto max-w-5xl pt-24">
        <h1
          className="px-0 pb-8 font-sans text-2xl font-semibold text-white"
          style={{ letterSpacing: "-0.96px", lineHeight: "32px" }}
        >
          Projects
        </h1>

        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setCategory(null)}
            className={cn(
              "cursor-pointer rounded-[6px] px-3 py-1.5 text-sm font-medium transition-colors",
              !activeCategory
                ? "bg-white text-[#171717]"
                : "border border-white/15 bg-white/5 text-white/70 backdrop-blur-md hover:bg-white/10"
            )}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setCategory(category)}
              className={cn(
                "cursor-pointer rounded-[6px] px-3 py-1.5 text-sm font-medium transition-colors",
                activeCategory === category
                  ? "bg-white text-[#171717]"
                  : "border border-white/15 bg-white/5 text-white/70 backdrop-blur-md hover:bg-white/10"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project, index) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2, delay: shouldReduceMotion ? 0 : index * 0.04 }}
              >
                <ProjectCard project={project} categoryParam={activeCategory} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {activeProject && <ProjectDetailOverlay key={activeProject.slug} project={activeProject} />}
      </AnimatePresence>
    </main>
  )
}
