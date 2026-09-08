"use client"

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  type Variants,
} from "motion/react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import type { IconType } from "react-icons"
import {
  SiApacheairflow,
  SiBentoml,
  SiClaudecode,
  SiDocker,
  SiFastapi,
  SiGrafana,
  SiMlflow,
  SiModelcontextprotocol,
  SiPostgresql,
  SiPrometheus,
  SiPython,
} from "react-icons/si"
import { FaAws } from "react-icons/fa6"
import { RiNewspaperFill, RiRobot2Fill } from "react-icons/ri"
import TransitionLink from "@/components/ui/transition-link"
import { HermesAgentIcon } from "@/components/icons/hermes-agent"
import { cn } from "@/lib/utils"

const timeline: { period: string; org: string; detail: string }[] = [
  {
    period: "2015 — 2021",
    org: "The University of Texas at Austin",
    detail:
      "기계공학 학사. 졸업 이후 머신러닝과 데이터 엔지니어링으로 방향을 옮겨, 물리 시스템을 다루던 감각을 소프트웨어로 가져왔습니다.",
  },
  {
    period: "2023.06 — 현재",
    org: "RE-ABLE",
    detail:
      "건물 에너지 관리(BEMS) 플랫폼에서 LLM 에이전트를 설계·배포·운영합니다. LangGraph 기반 대화형 에이전트를 0에서 프로덕션까지 단독으로 올렸고, 평가 스위트와 Langfuse 관측성으로 품질을 정량 관리합니다. MLflow·BentoML·Airflow를 ECS에 올린 MLOps 파이프라인과 Prometheus/Grafana 모니터링까지 직접 운영합니다.",
  },
]

const stack: {
  name: string
  category: string
  icon: IconType | string
  color: string
  badge?: boolean
  badgeBg?: string
  badgeIconColor?: string
  badgeIconSize?: string
}[] = [
  { name: "Python", category: "언어", icon: SiPython, color: "#3776AB" },
  { name: "FastAPI", category: "백엔드", icon: SiFastapi, color: "#009688" },
  {
    name: "LangChain",
    category: "오케스트레이션",
    icon: "/icons/langchain.svg",
    color: "#7FC8FF",
  },
  {
    name: "LangGraph",
    category: "오케스트레이션",
    icon: "/icons/langgraph.svg",
    color: "#7FC8FF",
  },
  {
    name: "DeepAgents",
    category: "오케스트레이션",
    icon: "/icons/deepagents.svg",
    color: "#7FC8FF",
  },
  { name: "Airflow", category: "오케스트레이션", icon: SiApacheairflow, color: "#017CEE" },
  {
    name: "DSPy",
    category: "프레임워크",
    icon: "/icons/dspy.png",
    color: "#EF4036",
  },
  {
    name: "MCP",
    category: "프로토콜",
    icon: SiModelcontextprotocol,
    color: "#FFFFFF",
    badge: true,
  },
  { name: "Claude Code", category: "에이전트", icon: SiClaudecode, color: "#D97757" },
  {
    name: "Hermes Agent",
    category: "에이전트",
    icon: HermesAgentIcon,
    color: "#FFFFFF",
    badge: true,
    badgeIconSize: "h-9 w-9",
  },
  { name: "PostgreSQL", category: "데이터", icon: SiPostgresql, color: "#4169E1" },
  { name: "AWS", category: "인프라", icon: FaAws, color: "#FF9900" },
  { name: "Docker", category: "인프라", icon: SiDocker, color: "#2496ED" },
  { name: "BentoML", category: "서빙", icon: SiBentoml, color: "#FF6E42" },
  { name: "MLflow", category: "모델링", icon: SiMlflow, color: "#0194E2" },
  { name: "LangFuse", category: "관측성", icon: "/icons/langfuse.svg", color: "#0A60B5" },
  { name: "Prometheus", category: "관측성", icon: SiPrometheus, color: "#E6522C" },
  { name: "Grafana", category: "관측성", icon: SiGrafana, color: "#F46800" },
]

const rise: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
}

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const SNAP_STICK_MS = 350
const SNAP_TRANSITION_MS = 600

function useSnapScroll(containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const sections = Array.from(
      container.querySelectorAll<HTMLElement>("[data-snap]")
    )
    if (sections.length === 0) return

    let locked = false

    function activeIndex() {
      const top = container!.scrollTop
      for (let i = 0; i < sections.length; i++) {
        if (top < sections[i].offsetTop + sections[i].offsetHeight - 10) return i
      }
      return sections.length
    }

    function scrollToIndex(index: number) {
      const target = sections[index]
      if (!target) return
      locked = true
      // Let the browser's compositor drive the scroll instead of hand-rolling
      // it with rAF + scrollTop — a main-thread tween fights Framer Motion's
      // concurrent reveal animations and stutters.
      container!.scrollTo({ top: target.offsetTop, behavior: "smooth" })

      let settled = false
      function unlock() {
        if (settled) return
        settled = true
        container!.removeEventListener("scrollend", unlock)
        setTimeout(() => {
          locked = false
        }, SNAP_STICK_MS)
      }
      container!.addEventListener("scrollend", unlock, { once: true })
      // Safety net for browsers without "scrollend" support.
      setTimeout(unlock, SNAP_TRANSITION_MS)
    }

    function onWheel(e: WheelEvent) {
      if (locked) {
        e.preventDefault()
        return
      }
      if (Math.abs(e.deltaY) < 10) return
      const idx = activeIndex()
      if (e.deltaY > 0 && idx < sections.length - 1) {
        e.preventDefault()
        scrollToIndex(idx + 1)
      } else if (e.deltaY < 0) {
        if (idx === sections.length) {
          e.preventDefault()
          scrollToIndex(sections.length - 1)
        } else if (idx > 0) {
          e.preventDefault()
          scrollToIndex(idx - 1)
        }
      }
    }

    container.addEventListener("wheel", onWheel, { passive: false })
    return () => container.removeEventListener("wheel", onWheel)
  }, [containerRef])
}

function Section({ children }: { children: React.ReactNode }) {
  return (
    <motion.section
      data-snap
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="flex min-h-dvh snap-start flex-col justify-center border-t border-white/10 px-6 py-20 [scroll-snap-stop:always] md:px-12 md:py-24 lg:py-32"
    >
      <div className="mx-auto w-full max-w-5xl">{children}</div>
    </motion.section>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <motion.p
      variants={rise}
      className="mb-12 font-mono text-xs tracking-[0.2em] text-white/40 uppercase"
    >
      {children}
    </motion.p>
  )
}

function TechCard({ tech }: { tech: (typeof stack)[number] }) {
  const mouseX = useMotionValue(100)
  const mouseY = useMotionValue(100)
  const springX = useSpring(mouseX, { stiffness: 40, damping: 10, mass: 1 })
  const springY = useSpring(mouseY, { stiffness: 40, damping: 10, mass: 1 })
  const backgroundImage = useMotionTemplate`radial-gradient(circle at ${springX}% ${springY}%, ${tech.color}40, ${tech.color}29 50%, ${tech.color}14 90%, ${tech.color}08 140%, transparent 220%)`

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(((e.clientX - rect.left) / rect.width) * 100)
    mouseY.set(((e.clientY - rect.top) / rect.height) * 100)
  }

  function handleMouseLeave() {
    mouseX.set(100)
    mouseY.set(100)
  }

  return (
    <motion.div
      variants={rise}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col gap-1 overflow-hidden bg-black p-6"
      style={{ backgroundImage }}
    >
      {typeof tech.icon === "string" ? (
        <Image
          src={tech.icon}
          alt=""
          aria-hidden
          width={48}
          height={48}
          className="pointer-events-none absolute right-4 top-1/2 h-12 w-12 -translate-y-1/2 object-contain"
        />
      ) : tech.badge ? (
        <div
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-[9.6px]"
          style={{ backgroundColor: tech.badgeBg ?? "#FFFFFF" }}
        >
          <tech.icon
            className={tech.badgeIconSize ?? "h-7 w-7"}
            style={{ color: tech.badgeIconColor ?? "#000000" }}
          />
        </div>
      ) : (
        <tech.icon
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 h-12 w-12 -translate-y-1/2"
          style={{ color: tech.color }}
        />
      )}
      <span className="text-lg font-medium tracking-[-0.01em]">
        {tech.name}
      </span>
      <span className="font-mono text-xs text-white/40">{tech.category}</span>
    </motion.div>
  )
}

export default function Home() {
  const mainRef = useRef<HTMLElement>(null)
  const atBottomRef = useRef(false)
  const [ctaGlow, setCtaGlow] = useState(false)
  useSnapScroll(mainRef)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const timer = setTimeout(() => setCtaGlow(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const container = mainRef.current
    if (!container) return
    function onScroll() {
      const { scrollTop, scrollHeight, clientHeight } = container!
      const atBottom = scrollTop + clientHeight >= scrollHeight - 4
      // Edge-triggered: replay the glow each time the user arrives at the
      // bottom, but not on every scroll event while already sitting there.
      if (atBottom && !atBottomRef.current) setCtaGlow(true)
      atBottomRef.current = atBottom
    }
    container.addEventListener("scroll", onScroll, { passive: true })
    return () => container.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <main
      ref={mainRef}
      className="font-kr h-dvh snap-y snap-mandatory overflow-y-scroll bg-black text-white/90 selection:bg-white selection:text-black"
    >
      {/* Hero */}
      <section
        data-snap
        className="relative flex min-h-dvh snap-start flex-col justify-center px-6 [scroll-snap-stop:always] md:px-12"
      >
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="mx-auto flex w-full max-w-5xl flex-col items-center text-center"
        >
          <motion.p
            variants={rise}
            className="mb-12 font-mono text-xs tracking-[0.2em] text-white/40 uppercase"
          >
            안녕하세요
          </motion.p>
          <motion.p
            variants={rise}
            className="mb-2 font-mono text-lg tracking-[-0.01em] text-white/50 md:text-xl"
          >
            AI Engineer
          </motion.p>
          <motion.h1
            variants={rise}
            className="text-[clamp(56px,11vw,132px)] leading-[0.9] font-semibold tracking-[-0.04em]"
          >
            하승범
          </motion.h1>
          <motion.p
            variants={rise}
            className="mt-6 font-mono text-lg tracking-[-0.01em] text-white/50 md:text-xl"
          >
            입니다
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-28 left-1/2 -translate-x-1/2"
        >
          <motion.span
            aria-hidden
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="block font-mono text-xl text-white/40"
          >
            ↓
          </motion.span>
        </motion.div>
      </section>

      {/* Timeline */}
      <Section>
        <Eyebrow>이력</Eyebrow>
        <div className="flex flex-col gap-12 md:gap-16">
          {timeline.map((item) => (
            <motion.div
              key={item.period}
              variants={rise}
              className="grid gap-3 md:grid-cols-[180px_1fr] md:gap-12"
            >
              <p className="font-mono text-sm text-white/40">{item.period}</p>
              <div>
                <h3 className="text-2xl font-semibold tracking-[-0.02em] md:text-3xl">
                  {item.org}
                </h3>
                <p className="mt-3 max-w-xl leading-relaxed text-white/60">
                  {item.detail}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Tech stack */}
      <Section>
        <Eyebrow>기술 스택</Eyebrow>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-black sm:grid-cols-3 lg:grid-cols-4">
          {stack.map((tech) => (
            <TechCard key={tech.name} tech={tech} />
          ))}
        </div>
      </Section>

      {/* Connect */}
      <Section>
        <Eyebrow>연락처</Eyebrow>
        <motion.h2
          variants={rise}
          className="max-w-3xl text-[clamp(28px,5vw,52px)] leading-[1.05] font-semibold tracking-[-0.03em]"
        >
          에이전트 아키텍처, 툴링, 혹은 풀어볼 만한 새로운 문제에 대해 언제든
          편하게 이야기 나누고 싶습니다.
        </motion.h2>
        <motion.div
          variants={rise}
          className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4"
        >
          <a
            href="mailto:tmdqja75@gmail.com"
            className="text-lg text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            tmdqja75@gmail.com
          </a>
          <a
            href="https://github.com/tmdqja75"
            target="_blank"
            rel="noreferrer"
            className="text-lg text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            GitHub
          </a>
        </motion.div>
      </Section>

      {/* Floating CTA cluster → projects / blog, stays fixed while the page scroll-snaps.
          Blog stays first in the DOM (so its hover reaches the projects pill via
          peer-hover, which only cascades to later siblings) but is reordered to
          sit visually on the right via flex `order`. */}
      <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3">
        <TransitionLink
          href="/blog"
          aria-label="블로그 보기"
          className="peer group order-2 flex h-14 w-14 shrink-0 items-center justify-center gap-3 overflow-hidden rounded-full border border-white/20 bg-black/60 px-0 text-lg text-white backdrop-blur-sm transition-all duration-300 ease-out hover:w-44 hover:px-6"
        >
          <RiNewspaperFill aria-hidden className="h-5 w-5 shrink-0" />
          <span className="hidden whitespace-nowrap group-hover:inline">
            블로그 보기
          </span>
        </TransitionLink>

        <TransitionLink
          href="/projects"
          onAnimationEnd={() => setCtaGlow(false)}
          className={cn(
            "order-1 flex h-14 w-44 shrink-0 items-center justify-center gap-3 overflow-hidden rounded-full border border-white/20 bg-black/60 px-8 text-lg text-white backdrop-blur-sm transition-all duration-300 ease-out hover:bg-white hover:text-black peer-hover:w-14 peer-hover:bg-black/60 peer-hover:px-0 peer-hover:text-white peer-hover:[&>span]:hidden",
            ctaGlow && "cta-glow"
          )}
        >
          <RiRobot2Fill aria-hidden className="h-5 w-5 shrink-0" />
          <span className="whitespace-nowrap">프로젝트 보기</span>
        </TransitionLink>
      </div>

    </main>
  )
}
