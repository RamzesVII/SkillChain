"use client"

import { usePrivy } from "@privy-io/react-auth"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/Navbar"
import type { Block, Purchase } from "@/lib/supabase"
import { ContentViewer } from "@/components/ContentViewer"

type PurchaseWithBlock = Purchase & { blocks: Block }

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
      <div className="min-h-screen bg-zinc-950">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <p className="text-zinc-400">Connect to see your purchased skills</p>
          <button onClick={login} className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium">
            Connect
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-white text-2xl font-bold mb-6">My Skills</h1>

        {loading ? (
          <p className="text-zinc-500">Loading...</p>
        ) : purchases.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-zinc-500">No purchased skills yet.</p>
            <a href="/" className="mt-4 inline-block px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm">
              Browse blocks
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="flex flex-col gap-3">
              {purchases.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActiveBlock(p)}
                  className={`text-left bg-zinc-900 border rounded-xl p-4 transition-colors ${
                    activeBlock?.id === p.id ? "border-violet-500" : "border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <p className="text-white font-medium text-sm">{p.blocks.title}</p>
                  <p className="text-zinc-500 text-xs mt-1">{p.blocks.category} · {p.blocks.content_type}</p>
                </button>
              ))}
            </div>

            <div className="lg:col-span-2">
              {activeBlock ? (
                <ContentViewer purchase={activeBlock} />
              ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl h-64 flex items-center justify-center">
                  <p className="text-zinc-500">Select a block to view content</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
