"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"

import type { Project } from "@/app/projects/data"
import { ProjectDetailContent } from "./project-detail-content"

export function ProjectDetailOverlay({ project }: { project: Project }) {
  const router = useRouter()
  const panelRef = useRef<HTMLDivElement>(null)

  const close = () => router.back()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        <div
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          className="relative my-12 w-full max-w-3xl rounded-xl bg-white p-8 outline-none dark:bg-[#0a0a0a]"
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
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
