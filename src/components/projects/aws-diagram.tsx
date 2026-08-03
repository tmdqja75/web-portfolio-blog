"use client"

import { useRef, useState } from "react"
import { motion, useInView, useReducedMotion } from "motion/react"

import type { ProjectDiagram } from "@/app/projects/data"
import { AWS_ICONS } from "./aws-icons/registry"

export function AwsDiagram({ diagram }: { diagram: ProjectDiagram }) {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null)
  const activeNode = diagram.nodes.find((n) => n.id === activeNodeId)

  const nodeById = Object.fromEntries(diagram.nodes.map((n) => [n.id, n]))

  const svgRef = useRef<SVGSVGElement>(null)
  const isInView = useInView(svgRef, { once: false, amount: 0.4 })
  const shouldReduceMotion = useReducedMotion()
  const animateFlow = isInView && !shouldReduceMotion

  return (
    <div className="relative mt-8">
      <h2 className="mb-3 text-sm font-semibold text-[#171717] dark:text-white">Architecture</h2>
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        className="w-full rounded-xl border border-[#ebebeb] bg-white dark:border-zinc-800 dark:bg-zinc-950"
        onClick={(e) => {
          if (e.target === e.currentTarget) setActiveNodeId(null)
        }}
      >
        {diagram.edges.map((edge, i) => {
          const from = nodeById[edge.from]
          const to = nodeById[edge.to]
          if (!from || !to) return null
          const midX = (from.x + to.x) / 2
          const d = `M ${from.x} ${from.y} L ${midX} ${from.y} L ${midX} ${to.y} L ${to.x} ${to.y}`
          return (
            <g key={i}>
              <path d={d} fill="none" stroke="#a1a1a1" strokeWidth={0.5} />
              {animateFlow && (
                <motion.circle
                  r={1.2}
                  fill="#171717"
                  style={{ offsetPath: `path("${d}")`, offsetRotate: "0deg" }}
                  animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: i * 0.3 }}
                />
              )}
            </g>
          )
        })}

        {diagram.nodes.map((node) => {
          const Icon = AWS_ICONS[node.service]
          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              onMouseEnter={() => setActiveNodeId(node.id)}
              onMouseLeave={() => setActiveNodeId((current) => (current === node.id ? null : current))}
              onClick={(e) => {
                e.stopPropagation()
                setActiveNodeId((current) => (current === node.id ? null : node.id))
              }}
              className="cursor-pointer"
            >
              <rect x={-6} y={-6} width={12} height={12} rx={2} fill="white" stroke="#ebebeb" />
              {Icon && <Icon x={-4} y={-4} width={8} height={8} className="text-[#171717]" />}
              <text y={10} textAnchor="middle" fontSize={2.5} fill="#4d4d4d">
                {node.label}
              </text>
            </g>
          )
        })}
      </svg>

      {activeNode && (
        <div
          className="pointer-events-none absolute z-10 max-w-56 rounded-[6px] bg-[#171717] px-3 py-2 text-xs text-white shadow-md"
          style={{
            left: `${Math.min(Math.max(activeNode.x, 15), 85)}%`,
            top: `${Math.min(activeNode.y + 12, 85)}%`,
            transform: "translateX(-50%)",
          }}
        >
          {activeNode.detail}
        </div>
      )}
    </div>
  )
}
