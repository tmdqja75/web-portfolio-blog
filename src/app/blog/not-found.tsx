import TransitionLink from "@/components/ui/transition-link"

export default function NotFound() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-zinc-50 px-6 dark:bg-black">
      <p className="text-[#171717] dark:text-white">Post not found.</p>
      <TransitionLink
        href="/blog"
        className="flex h-7 items-center rounded-[6px] bg-[#171717] px-2 text-sm font-medium text-white dark:bg-white dark:text-[#171717]"
      >
        ← Back to blog
      </TransitionLink>
    </main>
  )
}
