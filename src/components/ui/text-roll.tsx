"use client"

import React from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

const STAGGER = 0.035

export default function TextRoll({
  children,
  className,
  center = false,
}: {
  children: string
  className?: string
  center?: boolean
}) {
  return (
    <motion.span
      initial="initial"
      whileHover="hovered"
      className={cn(
        "relative block overflow-hidden text-black transition-[filter] duration-500 ease-out will-change-[filter] [transform:translateZ(0)] [filter:drop-shadow(0_0_0px_rgba(23,23,23,0))] hover:[filter:drop-shadow(0_0_24px_rgba(23,23,23,0.85))] dark:text-white/90 dark:[filter:drop-shadow(0_0_0px_rgba(255,255,255,0))] dark:hover:[filter:drop-shadow(0_0_26px_rgba(255,255,255,0.95))]",
        className
      )}
      style={{
        lineHeight: 0.85,
      }}
    >
      {/* Top Text (Slides up) */}
      <div>
        {children.split("").map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i

          return (
            <motion.span
              variants={{
                initial: {
                  y: 0,
                },
                hovered: {
                  y: "-100%",
                },
              }}
              transition={{
                ease: "easeInOut",
                delay,
              }}
              className="inline-block"
              key={i}
            >
              {l}
            </motion.span>
          )
        })}
      </div>

      {/* Bottom Text (Slides in from bottom) */}
      <div className="absolute inset-0">
        {children.split("").map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i

          return (
            <motion.span
              variants={{
                initial: {
                  y: "100%",
                },
                hovered: {
                  y: 0,
                },
              }}
              transition={{
                ease: "easeInOut",
                delay,
              }}
              className="inline-block"
              key={i}
            >
              {l}
            </motion.span>
          )
        })}
      </div>
    </motion.span>
  )
}
