import type { Metadata } from "next"
import type { IconType } from "react-icons"
import { SiGithub } from "react-icons/si"
import { RiLinkedinBoxFill, RiMailFill, RiNewspaperFill } from "react-icons/ri"

export const metadata: Metadata = {
  title: "Contact | 하승범",
  description: "하승범에게 연락하는 방법 — Mail, GitHub, LinkedIn, Newsletter",
}

const links: {
  name: string
  href: string
  icon: IconType
  iconColor?: string
  external?: boolean
}[] = [
  { name: "Mail", href: "mailto:tmdqja75@gmail.com", icon: RiMailFill },
  {
    name: "GitHub",
    href: "https://github.com/tmdqja75",
    icon: SiGithub,
    external: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/haseungbeom/",
    icon: RiLinkedinBoxFill,
    iconColor: "#0A66C2",
    external: true,
  },
  {
    name: "Newsletter",
    href: "https://maily.so/automata",
    icon: RiNewspaperFill,
    external: true,
  },
]

export default function ContactPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-10 bg-zinc-50 px-6 pb-24 pt-24 dark:bg-black">
      <h1 className="text-center text-[clamp(56px,11vw,132px)] leading-[0.9] font-semibold tracking-[-0.04em] text-[#171717] dark:text-white">
        Get in touch
      </h1>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
            className="flex h-14 items-center gap-3 rounded-full border border-black/10 px-6 text-base font-medium text-[#171717] transition-colors hover:bg-black/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
          >
            <link.icon
              aria-hidden
              className="h-5 w-5 shrink-0"
              style={link.iconColor ? { color: link.iconColor } : undefined}
            />
            {link.name}
          </a>
        ))}
      </div>
    </main>
  )
}
