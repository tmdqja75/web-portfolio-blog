import fs from "node:fs/promises"
import path from "node:path"

import matter from "gray-matter"
import { Marked } from "marked"
import { bundledLanguages, codeToHtml, type BundledLanguage } from "shiki"

const DIR = path.join(process.cwd(), "content/blog")

export type PostMeta = {
  slug: string
  title: string
  date: string
  tag: string
  summary: string
  minutes: number
}

export type Heading = { id: string; text: string }

/** ~500 characters per minute of Korean prose, code blocks excluded. */
function readingMinutes(body: string) {
  const prose = body.replace(/```[\s\S]*?```/g, "")
  return Math.max(1, Math.round(prose.length / 500))
}

/** Korean headings keep their own text as the id — percent-encoded, but stable. */
function slugify(text: string) {
  return encodeURIComponent(text.trim().replace(/\s+/g, "-"))
}

async function read(slug: string) {
  const file = await fs.readFile(path.join(DIR, `${slug}.md`), "utf8")
  const { data, content } = matter(file)
  const meta: PostMeta = {
    slug,
    title: data.title,
    date: data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : String(data.date),
    tag: data.tag,
    summary: data.summary,
    minutes: readingMinutes(content),
  }
  return { meta, content, draft: data.draft === true }
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const files = await fs.readdir(DIR)
  const posts = await Promise.all(
    files.filter((f) => f.endsWith(".md")).map((f) => read(f.slice(0, -3)))
  )
  return posts
    .filter((p) => !p.draft)
    .map((p) => p.meta)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export async function getPost(slug: string) {
  const post = await read(slug).catch(() => null)
  if (!post || post.draft) return null

  const headings: Heading[] = []
  const marked = new Marked({
    async: true,
    // Shiki highlights at build time; the renderer just passes its <pre> through.
    walkTokens: async (token) => {
      if (token.type !== "code") return
      const lang = token.lang?.split(/\s/)[0] ?? ""
      token.text = await codeToHtml(token.text, {
        lang: lang in bundledLanguages ? (lang as BundledLanguage) : "text",
        themes: { light: "github-light", dark: "github-dark" },
        defaultColor: false,
      })
    },
    renderer: {
      code: ({ text }) => text,
      heading(token) {
        const id = slugify(token.text)
        if (token.depth === 2) headings.push({ id, text: token.text })
        const inner = this.parser.parseInline(token.tokens)
        return `<h${token.depth} id="${id}">${inner}</h${token.depth}>\n`
      },
    },
  })

  const html = await marked.parse(post.content)
  return { meta: post.meta, html, headings }
}
