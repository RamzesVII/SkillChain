"use client"

import Link from "next/link"
import { WalletButton } from "./WalletButton"
import { useBundleStore } from "@/lib/bundle"

export function Navbar() {
  const count = useBundleStore((s) => s.items.length)

  return (
    <nav className="sticky top-0 z-50 border-b border-rule-faint bg-canvas/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-display text-xl font-semibold text-ink tracking-tight">
          SkillChain
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/create"
            className="px-3 py-1.5 text-sm text-ink-3 hover:text-ink transition-colors"
          >
            Publish
          </Link>
          <Link
            href="/learn"
            className="px-3 py-1.5 text-sm text-ink-3 hover:text-ink transition-colors"
          >
            My Library
          </Link>
          <Link
            href="/bundle"
            className="relative ml-1 px-4 py-1.5 rounded-full border border-rule text-ink text-sm font-medium hover:border-accent hover:text-accent transition-colors"
          >
            Bundle
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-accent text-paper text-xs rounded-full w-5 h-5 flex items-center justify-center font-mono tabular leading-none">
                {count}
              </span>
            )}
          </Link>
          <div className="ml-2">
            <WalletButton />
          </div>
        </div>
      </div>
    </nav>
  )
}
