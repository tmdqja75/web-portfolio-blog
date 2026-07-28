"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"
import TransitionLink from "@/components/ui/transition-link"
import { ProjectCard } from "@/components/projects/project-card"
import { categories, getCategoryProjects } from "./data"

export default function ProjectsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get("category")
  const visibleProjects = getCategoryProjects(activeCategory)

  const setCategory = (category: string | null) => {
    const params = new URLSearchParams(searchParams)
    if (category) params.set("category", category)
    else params.delete("category")
    router.push(`/projects${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false })
  }

  return (
    <main className="relative min-h-screen w-full bg-zinc-50 px-6 pb-24 dark:bg-black">
      <TransitionLink
        href="/"
        className="fixed top-6 left-6 z-10 flex h-7 items-center rounded-[6px] bg-[#171717] px-2 text-sm font-medium text-white dark:bg-white dark:text-[#171717]"
      >
        ← Back
      </TransitionLink>

      <div className="mx-auto max-w-5xl pt-24">
        <h1
          className="px-0 pb-8 font-sans text-2xl font-semibold text-[#171717] dark:text-white"
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
                ? "bg-[#171717] text-white dark:bg-white dark:text-[#171717]"
                : "bg-zinc-200 text-[#171717] hover:bg-zinc-300 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
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
                  ? "bg-[#171717] text-white dark:bg-white dark:text-[#171717]"
                  : "bg-zinc-200 text-[#171717] hover:bg-zinc-300 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project, index) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2, delay: index * 0.04 }}
              >
                <ProjectCard project={project} categoryParam={activeCategory} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}
