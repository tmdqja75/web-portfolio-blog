"use client"

import { useEffect, useRef, useState } from "react"
import { createRenderer } from "./renderer"
import { cn } from "@/lib/utils"

/** Fixed full-viewport WebGPU ocean, pinned behind page content regardless of scroll. */
export function OceanBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (typeof navigator === "undefined" || !navigator.gpu) return
    const renderer = createRenderer({ canvas })
    renderer.ready.then(() => setReady(true)).catch(() => setReady(false))
    return () => renderer.dispose()
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn(
        "fixed inset-0 -z-10 h-full w-full pointer-events-none touch-none transition-opacity duration-700",
        ready ? "opacity-100" : "opacity-0"
      )}
    />
  )
}

export default OceanBackground
