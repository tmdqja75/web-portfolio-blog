"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import type { Heading } from "@/lib/blog"

export default function ReadingRail({ headings }: { headings: Heading[] }) {
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState(headings[0]?.id ?? "")

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 1)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const visible = new Map<string, boolean>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting)
        const first = headings.find((h) => visible.get(h.id))
        if (first) setActive(first.id)
      },
      { rootMargin: "0px 0px -70% 0px" }
    )
    for (const { id } of headings) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [headings])

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-20 h-0.5">
        <div
          className="h-full bg-[#171717] dark:bg-white"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* self-start keeps the nav content-height; a stretched grid item never sticks. */}
      {headings.length > 0 && (
        <nav className="sticky top-24 hidden self-start border-l border-zinc-200 pl-4 xl:col-start-3 xl:block dark:border-zinc-800">
          <div className="font-mono text-[10px] tracking-[0.08em] text-zinc-500 uppercase">
            목차
          </div>
          <ul className="mt-3 space-y-2">
            {headings.map((h) => (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  className={cn(
                    "block text-[11px] leading-snug transition-colors",
                    h.id === active
                      ? "font-medium text-[#171717] dark:text-white"
                      : "text-zinc-500 hover:text-[#171717] dark:hover:text-zinc-300"
                  )}
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  )
}
