import Image from "next/image"
import type { IconType } from "react-icons"
import { FaAws } from "react-icons/fa6"
import { SiClaudecode, SiFastapi, SiMlflow } from "react-icons/si"
import { RiClaudeLine, RiFileExcel2Line, RiMailSendLine, RiPresentationLine } from "react-icons/ri"

import type { Project } from "@/app/projects/data"

export type BannerIcon =
  | { id: string; kind: "react"; Icon: IconType }
  | { id: string; kind: "image"; src: string }

export const PROJECT_BANNER_ICONS: Record<string, BannerIcon[]> = {
  "aws-mlops-platform": [
    { id: "aws", kind: "react", Icon: FaAws },
    { id: "mlflow", kind: "react", Icon: SiMlflow },
  ],
  "dxf-panel-parser": [
    { id: "claude", kind: "react", Icon: RiClaudeLine },
    { id: "excel", kind: "react", Icon: RiFileExcel2Line },
  ],
  "savee-chatbot-api": [
    { id: "langgraph", kind: "image", src: "/icons/langgraph-white.svg" },
    { id: "fastapi", kind: "react", Icon: SiFastapi },
  ],
  "savee-chatbot-api-v2": [
    { id: "langgraph", kind: "image", src: "/icons/langgraph-white.svg" },
    { id: "dspy", kind: "image", src: "/icons/dspy.png" },
  ],
  "newsletter-automation": [
    { id: "deepagents", kind: "image", src: "/icons/deepagents-white.svg" },
    { id: "mail", kind: "react", Icon: RiMailSendLine },
  ],
  "claude-code-codex-training": [
    { id: "claude-code", kind: "react", Icon: SiClaudecode },
    { id: "presentation", kind: "react", Icon: RiPresentationLine },
  ],
}

export function BannerIcons({
  icons,
  sizePx,
  iconSizeClass,
}: {
  icons: BannerIcon[]
  sizePx: number
  iconSizeClass: string
}) {
  return icons.map((icon) => {
    if (icon.kind === "image") {
      return (
        <Image
          key={icon.id}
          src={icon.src}
          alt=""
          width={sizePx}
          height={sizePx}
          className={`${iconSizeClass} object-contain brightness-0 invert`}
        />
      )
    }

    const Icon = icon.Icon
    return <Icon key={icon.id} aria-hidden="true" className={iconSizeClass} />
  })
}

export function ProjectBanner({
  project,
  compact = false,
  showIcons = true,
}: {
  project: Pick<Project, "slug" | "title">
  compact?: boolean
  showIcons?: boolean
}) {
  const icons = PROJECT_BANNER_ICONS[project.slug]
  const iconSizeClass = compact ? "h-4 w-4" : "h-[60px] w-[60px]"

  return (
    <div
      role="img"
      aria-label={`${project.title} 대표 기술`}
      className={`relative flex w-full items-center justify-center overflow-hidden border border-white/10 bg-white/0 backdrop-blur-md ${
        compact ? "h-full rounded-[6px]" : "aspect-[16/9] rounded-xl"
      }`}
    >
      {showIcons && (
        <div className={`relative z-10 flex items-center justify-center text-white ${compact ? "gap-1.5" : "gap-[60px]"}`}>
          <BannerIcons icons={icons} sizePx={compact ? 16 : 60} iconSizeClass={iconSizeClass} />
        </div>
      )}
    </div>
  )
}
