import TransitionLink from "@/components/ui/transition-link"
import { getAllPosts } from "@/lib/blog"

export const metadata = { title: "Blog" }

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <main className="relative min-h-screen w-full bg-zinc-50 px-6 pb-24 dark:bg-black">
      <TransitionLink
        href="/"
        className="fixed top-6 left-6 z-10 flex h-7 items-center rounded-[6px] bg-[#171717] px-2 text-sm font-medium text-white dark:bg-white dark:text-[#171717]"
      >
        ← Back
      </TransitionLink>

      <div className="mx-auto max-w-5xl pt-24">
        <h1
          className="pb-8 font-sans text-2xl font-semibold text-[#171717] dark:text-white"
          style={{ letterSpacing: "-0.96px", lineHeight: "32px" }}
        >
          Blog
        </h1>

        {posts.length === 0 ? (
          <p className="border-t border-zinc-200 pt-6 text-sm text-zinc-500 dark:border-zinc-800">
            아직 발행한 글이 없습니다.
          </p>
        ) : (
          posts.map((post) => (
            <TransitionLink
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block border-t border-zinc-200 py-7 dark:border-zinc-800"
            >
              <div className="font-mono text-[10px] tracking-[0.08em] text-zinc-500 uppercase">
                {post.date.replaceAll("-", ".")} · {post.tag} · {post.minutes}분
              </div>
              <h2 className="mt-2 font-sans text-[30px] leading-[1.1] font-semibold tracking-[-1.2px] text-zinc-400 transition-colors duration-200 group-hover:text-[#171717] group-focus-visible:text-[#171717] dark:text-zinc-600 dark:group-hover:text-white dark:group-focus-visible:text-white">
                {post.title}
              </h2>
              <span className="mt-3 block h-px w-0 bg-[#171717] transition-[width] duration-500 ease-out group-hover:w-full group-focus-visible:w-full dark:bg-white" />
            </TransitionLink>
          ))
        )}
      </div>
    </main>
  )
}
