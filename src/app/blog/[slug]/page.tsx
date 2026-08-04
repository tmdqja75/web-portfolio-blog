import { notFound } from "next/navigation"

import TransitionLink from "@/components/ui/transition-link"
import ReadingRail from "@/components/blog/reading-rail"
import { getAllPosts, getPost } from "@/lib/blog"

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const post = await getPost((await params).slug)
  if (!post) return {}
  return { title: post.meta.title, description: post.meta.summary }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const { meta, html, headings } = post

  return (
    <main className="relative min-h-screen w-full bg-zinc-50 px-6 pb-32 dark:bg-black">
      <TransitionLink
        href="/blog"
        className="fixed top-6 left-6 z-10 flex h-7 items-center rounded-[6px] bg-[#171717] px-2 text-sm font-medium text-white dark:bg-white dark:text-[#171717]"
      >
        ← Back
      </TransitionLink>

      <div className="mx-auto grid max-w-5xl gap-12 pt-24 lg:grid-cols-[minmax(0,65ch)_180px]">
        {/* min-w-0 lets code blocks scroll inside the column instead of widening the page. */}
        <article className="w-full max-w-[65ch] min-w-0">
          <div className="font-mono text-[10px] tracking-[0.08em] text-zinc-500 uppercase">
            {meta.date.replaceAll("-", ".")} · {meta.tag} · {meta.minutes}분
          </div>
          <h1 className="mt-3 font-sans text-[30px] leading-[1.1] font-semibold tracking-[-1.2px] text-[#171717] sm:text-[38px] dark:text-white">
            {meta.title}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {meta.summary}
          </p>
          <div
            className="post-body mt-10 border-t border-zinc-200 pt-10 dark:border-zinc-800"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>

        <ReadingRail headings={headings} />
      </div>
    </main>
  )
}
