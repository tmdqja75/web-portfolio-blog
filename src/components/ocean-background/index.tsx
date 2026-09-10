"use client"

import { useEffect, useRef, useState } from "react"
import { FaCode, FaWrench } from "react-icons/fa6"
import { RiRobot2Fill } from "react-icons/ri"
import { createRenderer } from "./renderer"
import { cn } from "@/lib/utils"

// Skip the splash flash on connections fast enough that it would never be seen.
const LOADER_DELAY_MS = 200
const SPLASH_ICON_INTERVAL_MS = 300
const SPLASH_ICONS = [FaWrench, RiRobot2Fill, FaCode]

/** Cycles the three brand icons underneath the splash text every 300ms. */
function SplashIcon() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(
      () => setIndex((i) => (i + 1) % SPLASH_ICONS.length),
      SPLASH_ICON_INTERVAL_MS
    )
    return () => clearInterval(interval)
  }, [])

  const Icon = SPLASH_ICONS[index]

  return <Icon className="h-8 w-8 text-white/60" />
}

/** Fixed full-viewport WebGPU ocean, pinned behind page content regardless of scroll. */
export function OceanBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)
  const [supported, setSupported] = useState(
    () => typeof navigator !== "undefined" && !!navigator.gpu
  )
  const [showLoader, setShowLoader] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !supported) return
    const loaderTimer = setTimeout(() => setShowLoader(true), LOADER_DELAY_MS)
    const renderer = createRenderer({ canvas })
    renderer.ready
      .then(() => setReady(true))
      .catch(() => setSupported(false))
      .finally(() => clearTimeout(loaderTimer))
    return () => {
      clearTimeout(loaderTimer)
      renderer.dispose()
    }
  }, [supported])

  const showSplash = showLoader && !ready && supported

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className={cn(
          "fixed inset-0 -z-10 h-full w-full pointer-events-none touch-none transition-opacity duration-700",
          ready ? "opacity-100" : "opacity-0"
        )}
      />
      <div
        aria-hidden
        className={cn(
          "fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-[#171717] transition-opacity duration-500",
          showSplash ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <p className="text-2xl font-semibold tracking-[-0.96px] text-white">
          Loading...
        </p>
        <SplashIcon />
      </div>
    </>
  )
}

export default OceanBackground
