"use client"

import TextRoll from "@/components/ui/text-roll"
import TransitionLink from "@/components/ui/transition-link"

const navigationItems: {
  name: string
  href?: string
  externalHref?: string
  emailHref?: string
}[] = [
  { name: "About", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Newsletter", externalHref: "https://maily.so/automata" },
  { name: "Contact", emailHref: "mailto:tmdqja75@gmail.com" },
]

const navItemClassName =
  "text-base font-semibold tracking-[-0.02em] uppercase transition-colors sm:text-lg"

export default function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-10 border-b border-black/5 bg-zinc-50/80 backdrop-blur dark:border-white/10 dark:bg-black/80">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-6 pt-5 pb-4">
        {navigationItems.map((item) => (
          <div key={item.name} className="flex items-start">
            {item.href ? (
              <TransitionLink href={item.href}>
                <TextRoll className={navItemClassName}>{item.name}</TextRoll>
              </TransitionLink>
            ) : item.externalHref ? (
              <a
                href={item.externalHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                <TextRoll className={navItemClassName}>{item.name}</TextRoll>
              </a>
            ) : (
              <a href={item.emailHref}>
                <TextRoll className={navItemClassName}>{item.name}</TextRoll>
              </a>
            )}
          </div>
        ))}
      </nav>
    </header>
  )
}
