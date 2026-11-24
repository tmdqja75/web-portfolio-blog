"use client"

import { useState, type ComponentType } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { GoArrowLeft, GoArrowRight } from "react-icons/go"

import { cn } from "@/lib/utils"
import type { ActionCarouselSlide } from "@/app/projects/data"

export function ActionCarousel({
  slides,
  diagrams,
}: {
  slides: ActionCarouselSlide[]
  diagrams?: Record<string, ComponentType>
}) {
  const [index, setIndex] = useState(0)
  const shouldReduceMotion = useReducedMotion()
  const slide = slides[index]
  const Diagram = diagrams?.[slide.key]

  return (
    <div className="mt-6 rounded-xl border border-[#ebebeb] p-5 dark:border-zinc-800">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {slides.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setIndex(i)}
              className={cn(
                "cursor-pointer rounded-[6px] px-3 py-1.5 text-sm font-medium transition-colors",
                i === index
                  ? "bg-[#171717] text-white dark:bg-white dark:text-[#171717]"
                  : "bg-zinc-200 text-[#4d4d4d] hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={() => setIndex((i) => i - 1)}
            disabled={index === 0}
            aria-label="Previous slide"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#ebebeb] text-[#4d4d4d] transition-colors hover:bg-zinc-100 disabled:pointer-events-none disabled:opacity-30 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <GoArrowLeft className="size-4" />
          </button>
          <button
            onClick={() => setIndex((i) => i + 1)}
            disabled={index === slides.length - 1}
            aria-label="Next slide"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#ebebeb] text-[#4d4d4d] transition-colors hover:bg-zinc-100 disabled:pointer-events-none disabled:opacity-30 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <GoArrowRight className="size-4" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={slide.key}
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -6 }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.2 }}
        >
          <h3 className="mt-5 text-base font-semibold text-[#171717] dark:text-white" style={{ letterSpacing: "-0.4px" }}>
            {slide.heading}
          </h3>

          <ul className="mt-3 space-y-2">
            {slide.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-3 text-sm leading-6 text-[#4d4d4d] dark:text-zinc-400">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-[2px] bg-[#a1a1a1] dark:bg-zinc-600" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          {slide.images && (
            <div className={cn("mt-4 grid grid-cols-1 gap-3", slide.images.length > 1 && "sm:grid-cols-2")}>
              {slide.images.map((image) => (
                <figure key={image.src}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full rounded-lg border border-[#ebebeb] dark:border-zinc-800"
                  />
                  {image.caption && (
                    <figcaption className="mt-1.5 text-xs text-[#888888] dark:text-zinc-500">{image.caption}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}

          {Diagram && (
            <div className="mt-4 overflow-x-auto rounded-lg border border-[#ebebeb] dark:border-zinc-800">
              <div className="min-w-[640px]">
                <Diagram />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
