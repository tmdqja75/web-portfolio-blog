"use client"

import { usePathname, useRouter } from "next/navigation"

import { cn } from "@/lib/utils"

const FADE_MS = 300

export default function TransitionLink({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  const router = useRouter()
  const pathname = usePathname()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    // Navigating to the current page is a no-op route change: PageTransition's
    // remount (which normally replays the fade-in and clears this opacity) never
    // happens, so the fade-out below would leave the page stuck invisible.
    if (href === pathname) return
    const page = document.getElementById("page-transition")
    if (page) {
      page.style.transition = `opacity ${FADE_MS}ms ease`
      page.style.opacity = "0"
      setTimeout(() => router.push(href), FADE_MS)
    } else {
      router.push(href)
    }
  }

  return (
    <a href={href} onClick={handleClick} className={cn(className)}>
      {children}
    </a>
  )
}
