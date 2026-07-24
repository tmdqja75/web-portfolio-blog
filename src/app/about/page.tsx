"use client"

import { motion, type Variants } from "motion/react"
import TransitionLink from "@/components/ui/transition-link"

const introText =
  "LLM을 신뢰할 수 있는 소프트웨어로 바꾸는 일에 집중합니다. 프롬프트 한 줄이 아니라, 도구를 쓰고 스스로 판단하며 실패를 복구하는 시스템을 설계합니다."

const timeline: { period: string; org: string; detail: string }[] = [
  {
    period: "2018 — 2022",
    org: "연세대학교",
    detail:
      "컴퓨터공학 학사, 머신러닝과 분산 시스템을 중점적으로 공부했습니다.",
  },
  {
    period: "2022 — 현재",
    org: "업스테이지",
    detail:
      "AI 에이전트 엔지니어로 재직 중이며, 오케스트레이션 로직부터 프로덕션 배포까지 기업용 자동화를 위한 멀티 에이전트 LLM 시스템을 설계하고 있습니다.",
  },
]

const stack: { name: string; category: string }[] = [
  { name: "Python", category: "언어" },
  { name: "TypeScript", category: "언어" },
  { name: "LangGraph", category: "오케스트레이션" },
  { name: "PyTorch", category: "모델링" },
  { name: "FastAPI", category: "서빙" },
  { name: "PostgreSQL", category: "데이터" },
  { name: "Redis", category: "데이터" },
  { name: "Docker", category: "인프라" },
  { name: "Kubernetes", category: "인프라" },
  { name: "AWS", category: "인프라" },
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

function Section({ children }: { children: React.ReactNode }) {
  return (
    <motion.section
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="border-t border-white/10 px-6 py-20 md:px-12 md:py-24 lg:py-32"
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

export default function About() {
  return (
    <main className="font-kr min-h-screen bg-black text-white/90 selection:bg-white selection:text-black">
      {/* Hero */}
      <section className="relative flex min-h-screen flex-col justify-center px-6 md:px-12">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="mx-auto w-full max-w-5xl"
        >
          <motion.p
            variants={rise}
            className="mb-8 font-mono text-xs tracking-[0.2em] text-white/40 uppercase"
          >
            AI 에이전트 엔지니어
          </motion.p>
          <motion.h1
            variants={rise}
            className="text-[clamp(56px,11vw,132px)] leading-[0.9] font-semibold tracking-[-0.04em]"
          >
            하승범
          </motion.h1>
          <motion.p
            variants={rise}
            className="mt-3 font-mono text-lg tracking-[-0.01em] text-white/50 md:text-xl"
          >
            Ha Seungbeom
          </motion.p>
          <motion.p
            variants={rise}
            className="mt-10 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl"
          >
            {introText}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
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
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-white/10 sm:grid-cols-3 lg:grid-cols-5">
          {stack.map((tech) => (
            <motion.div
              key={tech.name}
              variants={rise}
              className="flex flex-col gap-1 bg-black p-6"
            >
              <span className="text-lg font-medium tracking-[-0.01em]">
                {tech.name}
              </span>
              <span className="font-mono text-xs text-white/40">
                {tech.category}
              </span>
            </motion.div>
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
            href="mailto:hasb@example.com"
            className="text-lg text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            hasb@example.com
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-lg text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="text-lg text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            LinkedIn
          </a>
          <a
            href="/resume.pdf"
            className="font-mono text-sm text-white/60 transition-colors hover:text-white"
          >
            이력서 다운로드 ↓
          </a>
        </motion.div>
      </Section>

      {/* Bottom CTA */}
      <div className="flex justify-center border-t border-white/10 px-6 py-20 md:py-24">
        <TransitionLink
          href="/projects"
          className="group inline-flex items-center gap-3 rounded-full border border-white/20 px-8 py-4 text-lg text-white transition-colors hover:bg-white hover:text-black"
        >
          프로젝트 보기
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </TransitionLink>
      </div>

      {/* Floating arrow → projects */}
      <TransitionLink
        href="/projects"
        aria-label="프로젝트 페이지로 이동"
        className="fixed top-1/2 right-6 z-50 hidden -translate-y-1/2 md:block"
      >
        <motion.span
          aria-hidden
          animate={{ x: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/40 font-mono text-xl text-white/60 backdrop-blur-sm transition-colors hover:border-white hover:text-white"
        >
          →
        </motion.span>
      </TransitionLink>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-12 md:px-12">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-xs text-white/30">
            © 2026 하승범. 에이전트를 만드는, 에이전트 엔지니어가 만든 페이지.
          </p>
          <TransitionLink
            href="/"
            className="font-mono text-xs text-white/50 transition-colors hover:text-white"
          >
            ← 홈으로
          </TransitionLink>
        </div>
      </footer>
    </main>
  )
}
