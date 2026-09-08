"use client"

import { usePathname, useRouter } from "next/navigation"

import { cn } from "@/lib/utils"

const FADE_MS = 300

export default function TransitionLink({
  href,
  children,
  className,
  onClick,
  ...rest
}: React.ComponentPropsWithoutRef<"a"> & {
  href: string
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented) return
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    // Navigating to the current page (hash included) is a no-op route change:
    // PageTransition's remount (which normally replays the fade-in and clears
    // this opacity) never happens, so the fade-out below would leave the page
    // stuck invisible. Scroll to the hash target directly instead.
    const [path, hash] = href.split("#")
    if ((path || "/") === pathname) {
      if (hash) {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" })
      } else {
        // Home's snap-scroll happens inside #page-scroll-root, not the window.
        const root = document.getElementById("page-scroll-root")
        if (root) root.scrollTo({ top: 0, behavior: "smooth" })
        else window.scrollTo({ top: 0, behavior: "smooth" })
      }
      return
    }
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
    <a href={href} onClick={handleClick} className={cn(className)} {...rest}>
      {children}
    </a>
  )
}
