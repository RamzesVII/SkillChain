"use client"

import { usePrivy } from "@privy-io/react-auth"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/Navbar"
import type { Block, Purchase } from "@/lib/supabase"
import { ContentViewer } from "@/components/ContentViewer"

type PurchaseWithBlock = Purchase & { blocks: Block }

const TYPE_LABELS: Record<string, string> = {
  markdown: "MD", text: "TXT", pdf: "PDF", video: "VID", image: "IMG",
}

export default function LearnPage() {
  const { authenticated, user, login } = usePrivy()
  const [purchases, setPurchases] = useState<PurchaseWithBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [activeBlock, setActiveBlock] = useState<PurchaseWithBlock | null>(null)

  useEffect(() => {
    if (!authenticated || !user?.wallet?.address) { setLoading(false); return }
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
          <h1 className="font-display italic text-3xl text-ink">Your library.</h1>
          <p className="font-mono text-[10px] text-ink-3 uppercase tracking-widest">Connect to see your purchased blocks</p>
          <button onClick={login} className="mt-2 px-6 py-2 border border-rule text-ink text-[11px] font-bold uppercase tracking-widest hover:border-ink transition-colors">
            Connect wallet
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <p className="font-mono text-[9px] uppercase tracking-widest text-ink-3 mb-1">Library</p>
          <h1 className="font-display italic text-3xl text-ink">My blocks</h1>
        </div>

        {loading ? (
          <div className="flex flex-col gap-px bg-rule-faint">
            {[1,2,3].map((i) => <div key={i} className="h-14 bg-canvas animate-pulse" />)}
          </div>
        ) : purchases.length === 0 ? (
          <div className="text-center py-32">
            <h2 className="font-display italic text-2xl text-ink mb-2">No blocks yet.</h2>
            <p className="font-mono text-[10px] text-ink-3 uppercase tracking-widest mb-6">Browse and bundle knowledge blocks</p>
            <a href="/" className="px-6 py-2 border border-rule text-ink text-[11px] font-bold uppercase tracking-widest hover:border-ink transition-colors">
              Browse blocks
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">

            <div className="flex flex-col gap-px bg-rule-faint">
              {purchases.map((p) => {
                const isActive = activeBlock?.id === p.id
                return (
                  <button key={p.id} onClick={() => setActiveBlock(p)}
                    className={`w-full text-left px-4 py-3 transition-colors border-l-2 ${
                      isActive ? "bg-paper border-accent" : "bg-canvas border-transparent hover:bg-paper"
                    }`}
                  >
                    <p className={`font-display font-bold text-[12px] leading-snug line-clamp-2 ${isActive ? "text-ink" : "text-ink-2"}`}>
                      {p.blocks.title}
                    </p>
                    <p className="font-mono text-[9px] text-ink-3 mt-0.5 uppercase tracking-wider">
                      {p.blocks.category} · {TYPE_LABELS[p.blocks.content_type] ?? p.blocks.content_type}
                    </p>
                  </button>
                )
              })}
            </div>

            <div>
              {activeBlock ? (
                <ContentViewer purchase={activeBlock} />
              ) : (
                <div className="bg-paper border border-rule-faint h-64 flex items-center justify-center">
                  <p className="font-mono text-[10px] text-ink-3 uppercase tracking-widest">Select a block to read</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
