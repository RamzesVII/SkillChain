"use client"

import Link from "next/link"
import { WalletButton } from "./WalletButton"
import { useBundleStore } from "@/lib/bundle"

export function Navbar() {
  const count = useBundleStore((s) => s.items.length)

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link href="/" className="text-white font-bold text-xl tracking-tight">
        SkillChain
      </Link>
      <div className="flex items-center gap-3">
        <Link href="/create" className="px-4 py-2 rounded-lg border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-sm transition-colors">
          + Create Block
        </Link>
        <Link href="/bundle" className="relative px-4 py-2 rounded-lg border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-sm transition-colors">
          Bundle
          {count > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-violet-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {count}
            </span>
          )}
        </Link>
        <Link href="/learn" className="px-4 py-2 text-zinc-400 hover:text-zinc-200 text-sm transition-colors">
          My Skills
        </Link>
        <WalletButton />
      </div>
    </nav>
  )
}
