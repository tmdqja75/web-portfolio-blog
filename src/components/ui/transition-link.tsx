"use client"

import { useRouter } from "next/navigation"

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

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
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
