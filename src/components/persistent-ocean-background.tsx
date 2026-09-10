"use client"

import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"

const OceanBackground = dynamic(() => import("@/components/ocean-background"), {
  ssr: false,
})

// Rendered once in the root layout, outside PageTransition's remounting subtree,
// so the WebGPU canvas survives "/" <-> "/projects" navigation instead of
// tearing down and replaying its fade-in on every route change.
export default function PersistentOceanBackground() {
  const pathname = usePathname()
  const showOcean = pathname === "/" || pathname.startsWith("/projects")

  if (!showOcean) return null

  return (
    <>
      <OceanBackground />
      <div className="fixed inset-0 -z-10 bg-black/55" />
    </>
  )
}
