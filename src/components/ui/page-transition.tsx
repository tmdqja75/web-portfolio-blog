"use client"

import { usePathname } from "next/navigation"

function transitionKey(pathname: string) {
  return pathname.startsWith("/projects") ? "/projects" : pathname
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div key={transitionKey(pathname)} id="page-transition" className="page-fade-in flex min-h-full flex-1 flex-col">
      {children}
    </div>
  )
}
