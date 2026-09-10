import type { Project } from "@/app/projects/data"
import { BannerIcons, PROJECT_BANNER_ICONS } from "@/components/projects/project-banner"

export function ProjectBannerModal({ project }: { project: Pick<Project, "slug" | "title"> }) {
  const icons = PROJECT_BANNER_ICONS[project.slug]

  return (
    <div
      role="img"
      aria-label={`${project.title} 대표 기술`}
      className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-t-xl border-b border-white/10 bg-white/0 backdrop-blur-md [will-change:backdrop-filter]"
    >
      <div className="relative z-10 flex items-center justify-center gap-[84px] text-white">
        <BannerIcons icons={icons} sizePx={96} iconSizeClass="h-24 w-24" />
      </div>
    </div>
  )
}
