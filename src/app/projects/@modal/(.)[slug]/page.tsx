import { notFound } from "next/navigation"

import { getProject } from "@/app/projects/data"
import { ProjectDetailOverlay } from "@/components/projects/project-detail-overlay"

export default async function InterceptedProjectModal({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  return <ProjectDetailOverlay project={project} />
}
