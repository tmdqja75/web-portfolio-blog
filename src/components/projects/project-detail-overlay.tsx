"use client"

import { useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"

import type { Project } from "@/app/projects/data"
import { getCategoryProjects } from "@/app/projects/data"
import { ProjectDetailContent } from "./project-detail-content"

export function ProjectDetailOverlay({ project }: { project: Project }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get("category")
  const panelRef = useRef<HTMLDivElement>(null)

  const navigable = getCategoryProjects(activeCategory)
  const currentIndex = navigable.findIndex((p) => p.slug === project.slug)
  const prevProject = currentIndex > 0 ? navigable[currentIndex - 1] : null
  const nextProject = currentIndex < navigable.length - 1 ? navigable[currentIndex + 1] : null

  const close = () => router.back()

  const goTo = (slug: string) => {
    const qs = activeCategory ? `?category=${activeCategory}` : ""
    router.replace(`/projects/${slug}${qs}`, { scroll: false })
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowLeft" && prevProject) goTo(prevProject.slug)
      if (e.key === "ArrowRight" && nextProject) goTo(nextProject.slug)
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevProject, nextProject])

  useEffect(() => {
    panelRef.current?.focus()
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-20 flex items-start justify-center overflow-y-auto bg-black/40 p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close()
        }}
      >
        {prevProject && (
          <button
            onClick={() => goTo(prevProject.slug)}
            aria-label="Previous project"
            className="fixed top-1/2 left-4 z-30 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-[#171717] shadow-md dark:bg-zinc-900 dark:text-white"
          >
            ←
          </button>
        )}
        {nextProject && (
          <button
            onClick={() => goTo(nextProject.slug)}
            aria-label="Next project"
            className="fixed top-1/2 right-4 z-30 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-[#171717] shadow-md dark:bg-zinc-900 dark:text-white"
          >
            →
          </button>
        )}

        <div
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          className="relative my-12 w-full max-w-3xl rounded-xl bg-white p-8 pb-24 outline-none dark:bg-[#0a0a0a]"
        >
          <button
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 flex h-7 w-7 cursor-pointer items-center justify-center rounded-[6px] bg-zinc-200 text-[#171717] dark:bg-zinc-800 dark:text-white"
          >
            ✕
          </button>
          <ProjectDetailContent
            project={project}
            imageLayoutId={`card-image-${project.slug}`}
            titleLayoutId={`card-title-${project.slug}`}
          />

          {navigable.length > 1 && (
            <div className="fixed inset-x-0 bottom-6 z-30 flex justify-center gap-2">
              {navigable.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => goTo(p.slug)}
                  aria-label={p.title}
                  className={`h-12 w-12 shrink-0 overflow-hidden rounded-[6px] bg-cover bg-center ring-2 transition-all ${
                    p.slug === project.slug ? "ring-[#171717] dark:ring-white" : "ring-transparent opacity-60"
                  }`}
                  style={{ backgroundImage: `url(${p.image})` }}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
