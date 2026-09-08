import { SiClaudecode } from "react-icons/si"

import { HermesAgentIcon } from "@/components/icons/hermes-agent"

export default function MadeWithBadge() {
  return (
    <div className="fixed right-6 bottom-6 z-10 flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 py-2 text-xs text-white backdrop-blur-sm sm:text-sm">
      <span>Made with ❤️ using</span>
      <SiClaudecode aria-label="Claude Code" className="h-4 w-4 shrink-0" />
      <span>and</span>
      <HermesAgentIcon aria-label="Hermes Agent" className="h-4 w-4 shrink-0" />
    </div>
  )
}
