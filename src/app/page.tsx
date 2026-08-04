import TextRoll from "@/components/ui/text-roll"
import TransitionLink from "@/components/ui/transition-link"

const navigationItems: {
  name: string
  href?: string
  externalHref?: string
}[] = [
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Newsletter", externalHref: "https://maily.so/automata" },
  { name: "Contact" },
]

export default function Home() {
  return (
    <ul className="flex min-h-screen w-full flex-1 flex-col items-center justify-center gap-1.5 bg-zinc-50 px-7 py-3 dark:bg-black">
      {navigationItems.map((item, index) => (
        <li
          className="relative flex cursor-pointer flex-col items-center overflow-visible"
          key={index}
        >
          <div className="relative flex items-start">
            {item.href ? (
              <TransitionLink href={item.href}>
                <TextRoll
                  center
                  className="text-4xl leading-[0.8] font-extrabold tracking-[-0.03em] uppercase transition-colors lg:text-5xl"
                >
                  {item.name}
                </TextRoll>
              </TransitionLink>
            ) : item.externalHref ? (
              <a
                href={item.externalHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                <TextRoll
                  center
                  className="text-4xl leading-[0.8] font-extrabold tracking-[-0.03em] uppercase transition-colors lg:text-5xl"
                >
                  {item.name}
                </TextRoll>
              </a>
            ) : (
              <TextRoll
                center
                className="text-4xl leading-[0.8] font-extrabold tracking-[-0.03em] uppercase transition-colors lg:text-5xl"
              >
                {item.name}
              </TextRoll>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
