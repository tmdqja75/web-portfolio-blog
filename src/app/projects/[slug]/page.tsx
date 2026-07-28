import { notFound } from "next/navigation"

import TransitionLink from "@/components/ui/transition-link"
import { getProject } from "@/app/projects/data"

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  return (
    <main className="relative min-h-screen w-full bg-zinc-50 px-6 pb-24 dark:bg-black">
      <TransitionLink
        href="/projects"
        className="fixed top-6 left-6 z-10 flex h-7 items-center rounded-[6px] bg-[#171717] px-2 text-sm font-medium text-white dark:bg-white dark:text-[#171717]"
      >
        ← Back
      </TransitionLink>
      <div className="mx-auto max-w-3xl pt-24">
        <h1 className="text-2xl font-semibold text-[#171717] dark:text-white">{project.title}</h1>
        <p className="mt-2 text-[#4d4d4d] dark:text-zinc-400">{project.description}</p>
      </div>
    </main>
  )
}
