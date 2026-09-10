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
  SiGithub,
  SiGrafana,
  SiMlflow,
  SiModelcontextprotocol,
  SiPostgresql,
  SiPrometheus,
  SiPython,
} from "react-icons/si"
import { FaAws } from "react-icons/fa6"
import {
  RiLinkedinBoxFill,
  RiMailFill,
  RiNewspaperFill,
  RiRobot2Fill,
} from "react-icons/ri"
import TransitionLink from "@/components/ui/transition-link"
import { HermesAgentIcon } from "@/components/icons/hermes-agent"
import { cn } from "@/lib/utils"

const timeline: { period: string; org: string; detail: string | string[] }[] = [
  {
    period: "2015.08 — 2021.05",
    org: "The University of Texas at Austin",
    detail: ["기계공학과 학사", "The Elements of Computing Program Certificate 수료"],
  },
  {
    period: "2023.06 — 현재",
    org: "RE-ABLE",
    detail:
      "건물 에너지 관리(BEMS) 플랫폼에서 LLM 에이전트를 설계·배포·운영합니다. LangGraph 기반 대화형 에이전트를 0에서 프로덕션까지 단독으로 올렸고, 평가 스위트와 Langfuse 관측성으로 품질을 정량 관리합니다. MLflow·BentoML·Airflow를 ECS에 올린 MLOps 파이프라인과 Prometheus/Grafana 모니터링까지 직접 운영합니다.",
  },
]

const STACK_GROUPS = [
  "Agent systems",
  "Backend",
  "Infrastructure",
  "Observability",
] as const

const stack: {
  name: string
  group: (typeof STACK_GROUPS)[number]
  icon: IconType | string
  color: string
  badge?: boolean
  badgeBg?: string
  badgeIconColor?: string
  badgeIconSize?: string
}[] = [
  {
    name: "LangChain",
    group: "Agent systems",
    icon: "/icons/langchain.svg",
    color: "#7FC8FF",
  },
  {
    name: "LangGraph",
    group: "Agent systems",
    icon: "/icons/langgraph.svg",
    color: "#7FC8FF",
  },
  {
    name: "DeepAgents",
    group: "Agent systems",
    icon: "/icons/deepagents.svg",
    color: "#7FC8FF",
  },
  {
    name: "DSPy",
    group: "Agent systems",
    icon: "/icons/dspy.png",
    color: "#EF4036",
  },
  {
    name: "MCP",
    group: "Agent systems",
    icon: SiModelcontextprotocol,
    color: "#FFFFFF",
    badge: true,
  },
  { name: "Claude Code", group: "Agent systems", icon: SiClaudecode, color: "#D97757" },
  {
    name: "Hermes Agent",
    group: "Agent systems",
    icon: HermesAgentIcon,
    color: "#FFFFFF",
    badge: true,
    badgeIconSize: "h-9 w-9",
  },
  { name: "Python", group: "Backend", icon: SiPython, color: "#3776AB" },
  { name: "FastAPI", group: "Backend", icon: SiFastapi, color: "#009688" },
  { name: "PostgreSQL", group: "Backend", icon: SiPostgresql, color: "#4169E1" },
  { name: "BentoML", group: "Backend", icon: SiBentoml, color: "#FFFFFF" },
  { name: "Airflow", group: "Infrastructure", icon: SiApacheairflow, color: "#017CEE" },
  { name: "AWS", group: "Infrastructure", icon: FaAws, color: "#FF9900" },
  { name: "Docker", group: "Infrastructure", icon: SiDocker, color: "#2496ED" },
  { name: "MLflow", group: "Infrastructure", icon: SiMlflow, color: "#0194E2" },
  { name: "LangFuse", group: "Observability", icon: "/icons/langfuse.svg", color: "#0A60B5" },
  { name: "Prometheus", group: "Observability", icon: SiPrometheus, color: "#E6522C" },
  { name: "Grafana", group: "Observability", icon: SiGrafana, color: "#F46800" },
]

const contactLinks: {
  name: string
  href: string
  icon: IconType
  iconColor?: string
  external?: boolean
}[] = [
  { name: "Mail", href: "mailto:tmdqja75@gmail.com", icon: RiMailFill },
  {
    name: "GitHub",
    href: "https://github.com/tmdqja75",
    icon: SiGithub,
    external: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/haseungbeom/",
    icon: RiLinkedinBoxFill,
    iconColor: "#0A66C2",
    external: true,
  },
  {
    name: "Newsletter",
    href: "https://maily.so/automata",
    icon: RiNewspaperFill,
    external: true,
  },
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

// Plain left-to-right reveal, one Latin character per frame.
function substringFrames(text: string): string[] {
  return Array.from({ length: text.length + 1 }, (_, i) => text.slice(0, i))
}

// Mirrors real 2-beolsik IME composition for "하승범": ㅎㅏㅅㅡㅇㅂㅓㅁ,
// where a trailing consonant provisionally attaches as batchim (ㅎㅏ+ㅅ ->
// 핫) until the next vowel arrives and reclaims it into a new syllable
// (+ㅡ -> 하 스).
const HERO_NAME_FRAMES = [
  "",
  "ㅎ",
  "하",
  "핫",
  "하스",
  "하승",
  "하승ㅂ",
  "하승버",
  "하승범",
]

const HERO_EYEBROW_FRAMES = substringFrames("AI Engineer")

// "입니다": ㅇㅣㅂㄴㅣㄷㅏ — ㅂ attaches as batchim of 이 (-> 입), then ㄴ
// starts a new block since 입's batchim slot is full, then ㄷ provisionally
// attaches as batchim of 니 (-> 닏) until ㅏ reclaims it into 다.
const HERO_SUFFIX_FRAMES = ["", "ㅇ", "이", "입", "입ㄴ", "입니", "입닏", "입니다"]

function useKoreanTyping(frames: string[], stepMs: number, startDelayMs: number) {
  const [text, setText] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? frames[frames.length - 1]
      : frames[0]
  )
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let i = 0
    let interval: ReturnType<typeof setInterval>
    const startTimer = setTimeout(() => {
      interval = setInterval(() => {
        i++
        setText(frames[i])
        if (i >= frames.length - 1) clearInterval(interval)
      }, stepMs)
    }, startDelayMs)
    return () => {
      clearTimeout(startTimer)
      clearInterval(interval)
    }
  }, [frames, stepMs, startDelayMs])
  return text
}

function Section({
  children,
  id,
}: {
  children: React.ReactNode
  id?: string
}) {
  return (
    <motion.section
      id={id}
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="flex min-h-dvh flex-col justify-center px-6 py-20 md:px-12 md:py-24 lg:py-32"
    >
      <div className="mx-auto w-full max-w-5xl">{children}</div>
    </motion.section>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      variants={rise}
      className="mb-12 text-[32px] leading-[40px] font-semibold tracking-[-1.28px] text-white"
    >
      {children}
    </motion.h2>
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
      className="relative flex flex-col gap-1 overflow-hidden rounded-xl border border-white/10 bg-white/0 p-4 backdrop-blur-md"
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
    </motion.div>
  )
}

export default function Home() {
  const mainRef = useRef<HTMLElement>(null)
  const atBottomRef = useRef(false)
  const [ctaGlow, setCtaGlow] = useState(false)
  const heroEyebrow = useKoreanTyping(HERO_EYEBROW_FRAMES, 45, 400)
  const heroName = useKoreanTyping(HERO_NAME_FRAMES, 60, 400)
  const heroSuffix = useKoreanTyping(HERO_SUFFIX_FRAMES, 70, 400)

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
      id="page-scroll-root"
      ref={mainRef}
      className="font-kr relative h-dvh overflow-y-scroll text-white/90 selection:bg-white selection:text-black"
    >
      {/* Hero */}
      <section className="relative flex min-h-dvh flex-col justify-center px-6 md:px-12">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="mx-auto flex w-full max-w-5xl flex-col items-center text-center"
        >
          <motion.p
            variants={rise}
            className="mb-12 font-mono text-lg tracking-[0.2em] text-white/40 uppercase md:text-xl"
          >
            안녕하세요
          </motion.p>
          <motion.p
            variants={rise}
            className="relative mb-2 font-mono text-lg tracking-[-0.01em] text-white/50 md:text-xl"
          >
            <span className="opacity-0">AI Engineer</span>
            <span aria-hidden className="absolute inset-0">
              {heroEyebrow || " "}
            </span>
          </motion.p>
          <motion.h1
            variants={rise}
            className="relative text-[clamp(56px,11vw,132px)] leading-[0.9] font-semibold tracking-[-0.04em]"
          >
            <span className="opacity-0">하승범</span>
            <span aria-hidden className="absolute inset-0">
              {heroName || " "}
            </span>
          </motion.h1>
          <motion.p
            variants={rise}
            className="relative mt-6 font-mono text-lg tracking-[-0.01em] text-white/50 md:text-xl"
          >
            <span className="opacity-0">입니다</span>
            <span aria-hidden className="absolute inset-0">
              {heroSuffix || " "}
            </span>
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
        <div className="rounded-xl border border-white/10 bg-white/0 p-8 backdrop-blur-md md:p-12">
          <Eyebrow>이력</Eyebrow>
          <div className="flex flex-col gap-12 md:gap-16">
            {timeline.map((item) => (
              <motion.div
                key={item.period}
                variants={rise}
                className="grid gap-3 md:grid-cols-[180px_1fr] md:gap-12"
              >
                <p className="font-mono text-base text-white/40">{item.period}</p>
                <div>
                  <h3 className="text-2xl font-semibold tracking-[-0.02em] md:text-[32px] md:leading-[40px] md:tracking-[-1.28px]">
                    {item.org}
                  </h3>
                  {Array.isArray(item.detail) ? (
                    <ul className="mt-3 max-w-xl list-disc space-y-1 pl-5 leading-relaxed text-white/60">
                      {item.detail.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 max-w-xl leading-relaxed text-white/60">
                      {item.detail}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Tech stack */}
      <Section>
        <Eyebrow>기술 스택</Eyebrow>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STACK_GROUPS.map((group) => (
            <div key={group} className="flex flex-col gap-3">
              <h3 className="mb-1 text-[24px] leading-[32px] font-semibold tracking-[-0.96px] text-white">
                {group}
              </h3>
              {stack
                .filter((tech) => tech.group === group)
                .map((tech) => (
                  <TechCard key={tech.name} tech={tech} />
                ))}
            </div>
          ))}
        </div>
      </Section>

      {/* Connect */}
      <Section id="contact">
        <motion.h2
          variants={rise}
          className="text-center text-[clamp(28px,5vw,52px)] leading-[1.05] font-semibold tracking-[-0.03em]"
        >
          Lets Get in touch!
        </motion.h2>
        <motion.div
          variants={rise}
          className="mt-12 flex flex-wrap items-center justify-center gap-3"
        >
          {contactLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
              className="flex h-14 items-center gap-3 rounded-full border border-white/10 bg-white/0 px-6 text-base font-medium text-white backdrop-blur-md transition-colors hover:bg-white/10"
            >
              <link.icon
                aria-hidden
                className="h-5 w-5 shrink-0"
                style={link.iconColor ? { color: link.iconColor } : undefined}
              />
              {link.name}
            </a>
          ))}
        </motion.div>
      </Section>

      {/* Floating CTA cluster → projects / blog, stays fixed while the page scroll-snaps.
          Blog stays first in the DOM (so its hover reaches the projects pill via
          peer-hover, which only cascades to later siblings) but is reordered to
          sit visually on the right via flex `order`. */}
      <div className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 sm:bottom-10">
        <TransitionLink
          href="/blog"
          aria-label="블로그 보기"
          className="peer group order-2 flex h-14 w-14 shrink-0 items-center justify-center gap-3 overflow-hidden rounded-full border border-black/10 bg-white px-0 text-lg text-black transition-all duration-300 ease-out hover:w-44 hover:border-white/20 hover:bg-black hover:px-6 hover:text-white"
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
            "order-1 flex h-14 w-44 shrink-0 items-center justify-center gap-3 overflow-hidden rounded-full border border-black/10 bg-white px-8 text-lg text-black transition-all duration-300 ease-out hover:border-white/20 hover:bg-black hover:text-white peer-hover:w-14 peer-hover:px-0 peer-hover:[&>span]:hidden",
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
