"use client"

import { usePrivy } from "@privy-io/react-auth"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/Navbar"
import type { Block, Purchase } from "@/lib/supabase"
import { ContentViewer } from "@/components/ContentViewer"

type PurchaseWithBlock = Purchase & { blocks: Block }

const CONTENT_TYPE_LABELS: Record<string, string> = {
  markdown: "md",
  text: "txt",
  pdf: "pdf",
  video: "mp4",
  image: "img",
}

export default function LearnPage() {
  const { authenticated, user, login } = usePrivy()
  const [purchases, setPurchases] = useState<PurchaseWithBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [activeBlock, setActiveBlock] = useState<PurchaseWithBlock | null>(null)

  useEffect(() => {
    if (!authenticated || !user?.wallet?.address) {
      setLoading(false)
      return
    }
    fetch(`/api/my-purchases?address=${user.wallet.address}`)
      .then((r) => r.json())
      .then((d) => setPurchases(d.purchases ?? []))
      .finally(() => setLoading(false))
  }, [authenticated, user?.wallet?.address])

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-canvas">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <p className="font-display text-2xl font-semibold text-ink">Your library.</p>
          <p className="text-ink-3 text-sm">Connect to see your purchased blocks.</p>
          <button
            onClick={login}
            className="mt-2 px-6 py-3 bg-accent hover:bg-accent-hover text-paper rounded-full font-medium text-sm transition-colors"
          >
            Connect wallet
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">

        <div className="mb-8">
          <p className="text-xs font-medium text-ink-3 tracking-widest uppercase mb-2">Library</p>
          <h1 className="font-display text-4xl font-semibold text-ink">My blocks</h1>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-rule-faint animate-pulse" />
            ))}
          </div>
        ) : purchases.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-display text-2xl font-semibold text-ink mb-2">No blocks yet.</p>
            <p className="text-ink-3 text-sm mb-6">Browse and bundle knowledge blocks to get started.</p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-paper rounded-full text-sm font-medium transition-colors"
            >
              Browse blocks
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">

            {/* Sidebar */}
            <div className="flex flex-col gap-1">
              {purchases.map((p) => {
                const isActive = activeBlock?.id === p.id
                return (
                  <button
                    key={p.id}
                    onClick={() => setActiveBlock(p)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                      isActive
                        ? "bg-accent-dim text-ink"
                        : "text-ink-2 hover:bg-rule-faint hover:text-ink"
                    }`}
                  >
                    <p className={`text-sm font-medium leading-snug line-clamp-2 ${isActive ? "text-ink" : ""}`}>
                      {p.blocks.title}
                    </p>
                    <p className="text-ink-3 text-xs mt-0.5 flex items-center gap-1.5">
                      <span>{p.blocks.category}</span>
                      <span>·</span>
                      <span className="font-mono">{CONTENT_TYPE_LABELS[p.blocks.content_type] ?? p.blocks.content_type}</span>
                    </p>
                  </button>
                )
              })}
            </div>

            {/* Content viewer */}
            <div>
              {activeBlock ? (
                <ContentViewer purchase={activeBlock} />
              ) : (
                <div className="bg-paper border border-rule rounded-2xl h-64 flex items-center justify-center">
                  <p className="text-ink-3 text-sm">Select a block to read</p>
                </div>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  )
}
