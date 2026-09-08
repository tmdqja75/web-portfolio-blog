"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"
import { RiExternalLinkLine } from "react-icons/ri"
import TextRoll from "@/components/ui/text-roll"
import TransitionLink from "@/components/ui/transition-link"

const navigationItems: {
  name: string
  href?: string
  externalHref?: string
}[] = [
  { name: "About", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Newsletter", externalHref: "https://maily.so/automata" },
  { name: "Contact", href: "/contact" },
]

const navItemClassName =
  "text-base font-semibold tracking-[-0.02em] uppercase transition-colors sm:text-lg"

export default function SiteHeader() {
  const pathname = usePathname()
  // Optimistic: TransitionLink fades out for 300ms before router.push actually
  // changes the route, so waiting on pathname alone makes the indicator lag
  // behind the click. Set this immediately on click and resync on real nav
  // (covers back/forward, direct loads) via the effect below.
  const [activeHref, setActiveHref] = useState(pathname)

  useEffect(() => {
    setActiveHref(pathname)
  }, [pathname])

  return (
    <header className="fixed inset-x-0 top-0 z-10 border-b border-black/5 bg-zinc-50/80 backdrop-blur dark:border-white/10 dark:bg-black/80">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-6 pt-5 pb-4">
        {navigationItems.map((item) => {
          const isActive = item.href === "/"
            ? activeHref === "/"
            : Boolean(item.href) && activeHref.startsWith(item.href!)

          return (
            <div key={item.name} className="flex flex-col items-center gap-1">
              {item.href ? (
                <TransitionLink
                  href={item.href}
                  onClick={() => setActiveHref(item.href!)}
                >
                  <TextRoll className={navItemClassName}>{item.name}</TextRoll>
                </TransitionLink>
              ) : (
                <a
                  href={item.externalHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  <TextRoll className={navItemClassName}>{item.name}</TextRoll>
                  <RiExternalLinkLine className="size-4 shrink-0" aria-hidden />
                </a>
              )}
              <div className="h-0.5 w-full">
                {isActive && (
                  <motion.div
                    layoutId="nav-active-indicator"
                    className="h-0.5 w-full rounded-full bg-[#171717] dark:bg-white"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </div>
            </div>
          )
        })}
      </nav>
    </header>
  )
}
