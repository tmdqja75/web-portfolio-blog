import { notFound } from "next/navigation"

import TransitionLink from "@/components/ui/transition-link"
import { ProjectDetailContent } from "@/components/projects/project-detail-content"
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
      <div className="pt-24">
        <ProjectDetailContent project={project} />
      </div>
    </main>
  )
}
