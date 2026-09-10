import type { Project } from "@/app/projects/data"
import { BannerIcons, PROJECT_BANNER_ICONS } from "@/components/projects/project-banner"

export function ProjectBannerModal({ project }: { project: Pick<Project, "slug" | "title"> }) {
  const icons = PROJECT_BANNER_ICONS[project.slug]

  return (
    <div
      role="img"
      aria-label={`${project.title} 대표 기술`}
      className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-t-xl border-b border-black/10 bg-gradient-to-br from-black/[0.06] via-transparent to-transparent backdrop-blur-md [will-change:backdrop-filter] dark:border-white/10 dark:from-white/10"
    >
      <div className="relative z-10 flex items-center justify-center gap-14 text-white">
        <BannerIcons icons={icons} sizePx={64} iconSizeClass="h-16 w-16" />
      </div>
    </div>
  )
}
