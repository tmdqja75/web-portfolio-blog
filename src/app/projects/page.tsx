"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import TransitionLink from "@/components/ui/transition-link"

type Project = {
  title: string
  subtitle: string
  image: string
}

const columns: { header: string; projects: Project[] }[] = [
  {
    header: "MLOps",
    projects: [
      { title: "Model Registry", subtitle: "Versioned model lifecycle management", image: "https://picsum.photos/seed/mlops1/640/400" },
      { title: "Feature Store", subtitle: "Low-latency feature serving", image: "https://picsum.photos/seed/mlops2/640/400" },
      { title: "Training Pipeline", subtitle: "Distributed training orchestration", image: "https://picsum.photos/seed/mlops3/640/400" },
    ],
  },
  {
    header: "AI Agent",
    projects: [
      { title: "Research Agent", subtitle: "Autonomous literature review", image: "https://picsum.photos/seed/agent1/640/400" },
      { title: "Code Reviewer", subtitle: "LLM-powered PR analysis", image: "https://picsum.photos/seed/agent2/640/400" },
      { title: "Tool Router", subtitle: "Dynamic tool selection layer", image: "https://picsum.photos/seed/agent3/640/400" },
    ],
  },
  {
    header: "Side Project",
    projects: [
      { title: "Portfolio Blog", subtitle: "This site, built with Next.js", image: "https://picsum.photos/seed/side1/640/400" },
      { title: "Habit Tracker", subtitle: "Minimal daily streak app", image: "https://picsum.photos/seed/side2/640/400" },
      { title: "Recipe Box", subtitle: "Family recipes, searchable", image: "https://picsum.photos/seed/side3/640/400" },
    ],
  },
]

function ScrollColumn({ header, projects }: { header: string; projects: Project[] }) {
  const [atTop, setAtTop] = useState(true)

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <h2
        className="px-6 pt-12 pb-6 font-sans text-2xl font-semibold text-[#171717] dark:text-white"
        style={{ letterSpacing: "-0.96px", lineHeight: "32px" }}
      >
        {header}
      </h2>
      <div className="relative min-h-0 flex-1">
        <div
          className="h-full overflow-y-auto px-6"
          onScroll={(e) => setAtTop(e.currentTarget.scrollTop <= 0)}
        >
          <div className="flex flex-col items-center">
            {projects.map((project) => (
              <div
                key={project.title}
                className="relative mb-6 aspect-[4/5] w-5/6 max-w-72 shrink-0 overflow-hidden rounded-xl bg-cover bg-center"
                style={{ backgroundImage: `url(${project.image})` }}
              >
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4">
                  <h3 className="text-base font-semibold text-white" style={{ letterSpacing: "-0.28px" }}>
                    {project.title}
                  </h3>
                  <p className="text-sm font-normal text-white/70" style={{ letterSpacing: "-0.28px" }}>
                    {project.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-zinc-50 to-transparent transition-opacity duration-300 dark:from-black",
            atTop ? "opacity-0" : "opacity-100"
          )}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-50 to-transparent dark:from-black" />
      </div>
    </div>
  )
}

export default function ProjectsPage() {
  return (
    <main className="relative flex h-screen w-full flex-row gap-12 overflow-hidden bg-zinc-50 px-6 dark:bg-black">
      <TransitionLink
        href="/"
        className="absolute top-6 left-6 z-10 flex h-7 items-center rounded-[6px] bg-[#171717] px-2 text-sm font-medium text-white dark:bg-white dark:text-[#171717]"
      >
        ← Back
      </TransitionLink>
      {columns.map((column) => (
        <ScrollColumn key={column.header} header={column.header} projects={column.projects} />
      ))}
    </main>
  )
}
