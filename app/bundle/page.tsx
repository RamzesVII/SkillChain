"use client"

import { usePrivy } from "@privy-io/react-auth"
import { useWalletClient, usePublicClient } from "wagmi"
import { Navbar } from "@/components/Navbar"
import { useBundleStore } from "@/lib/bundle"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { StoryClient } from "@story-protocol/core-sdk"
import { parseEther } from "viem"

export default function BundlePage() {
  const { authenticated, user, login } = usePrivy()
  const { data: walletClient } = useWalletClient()
  usePublicClient()
  const { items, remove, clear, total } = useBundleStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState("")
  const router = useRouter()

  const handlePurchase = async () => {
    if (!authenticated || !user?.wallet?.address || !walletClient) return
    setLoading(true)
    setError("")

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const storyClient = StoryClient.newClient({
        chainId: "aeneid",
        transport: walletClient.transport as any,
        account: walletClient.account,
      })

      const recorded: { block_id: string; license_token_id: string; tx_hash: string }[] = []

      for (let i = 0; i < items.length; i++) {
        const block = items[i]
        setStep(`Minting license ${i + 1} of ${items.length}`)

        if (!block.ip_id || !block.license_terms_id) {
          throw new Error(`"${block.title}" is not registered on Story`)
        }

        const result = await storyClient.license.mintLicenseTokens({
          licensorIpId: block.ip_id as `0x${string}`,
          licenseTermsId: BigInt(block.license_terms_id),
          receiver: user.wallet.address as `0x${string}`,
          amount: 1,
          maxMintingFee: parseEther(block.price_ip),
          txOptions: {},
        })

        if (!result.licenseTokenIds?.[0]) throw new Error("No license token returned")

        recorded.push({
          block_id: block.id,
          license_token_id: result.licenseTokenIds[0].toString(),
          tx_hash: result.txHash || "",
        })
      }

      setStep("Saving purchases…")
      const res = await fetch("/api/record-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchases: recorded, buyer_address: user.wallet.address }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to record purchase")

      clear()
      router.push("/learn")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Purchase failed")
    } finally {
      setLoading(false)
      setStep("")
    }
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">

        <div className="mb-8">
          <p className="text-xs font-medium text-ink-3 tracking-widest uppercase mb-2">Checkout</p>
          <h1 className="font-display text-4xl font-semibold text-ink">Your Bundle</h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-display text-2xl font-semibold text-ink mb-2">Bundle is empty.</p>
            <p className="text-ink-3 text-sm mb-6">Browse blocks and add them to your bundle.</p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-paper rounded-full text-sm font-medium transition-colors"
            >
              Browse blocks
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

            {/* Block list */}
            <div className="flex flex-col gap-3">
              {items.map((block, i) => (
                <div
                  key={block.id}
                  className="bg-paper border border-rule rounded-2xl px-5 py-4 flex items-start gap-4"
                >
                  <span className="font-mono text-ink-3 text-sm tabular mt-0.5 w-5 shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-ink leading-snug">{block.title}</p>
                    <p className="text-ink-3 text-xs mt-0.5">
                      {block.creator_name || `${block.creator_address.slice(0, 8)}…`} · {block.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-sm font-medium text-ink tabular">{block.price_ip} IP</span>
                    <button
                      onClick={() => remove(block.id)}
                      aria-label="Remove"
                      className="text-ink-3 hover:text-[oklch(0.55_0.18_25)] transition-colors text-xs p-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Sticky summary */}
            <div className="lg:sticky lg:top-24 bg-paper border border-rule rounded-2xl p-6 flex flex-col gap-4">
              <div>
                <p className="text-xs text-ink-3 uppercase tracking-widest font-medium mb-1">Total</p>
                <p className="font-mono text-3xl font-semibold text-ink tabular">
                  {total().toFixed(3)} <span className="text-ink-3 text-lg">IP</span>
                </p>
              </div>

              <div className="border-t border-rule-faint pt-4 flex flex-col gap-1 text-xs text-ink-3">
                <p>{items.length} license transaction{items.length > 1 ? "s" : ""}</p>
                <p>Story routes royalties to each creator</p>
              </div>

              {error && (
                <p className="text-sm text-[oklch(0.50_0.18_25)] bg-[oklch(0.97_0.03_25)] border border-[oklch(0.88_0.06_25)] rounded-xl px-4 py-3">
                  {error}
                </p>
              )}

              {step && (
                <p className="text-xs text-accent">{step}</p>
              )}

              {!authenticated ? (
                <button
                  onClick={login}
                  className="w-full py-3 bg-accent hover:bg-accent-hover text-paper rounded-xl font-medium text-sm transition-colors"
                >
                  Connect to purchase
                </button>
              ) : (
                <button
                  onClick={handlePurchase}
                  disabled={loading || !walletClient}
                  className="w-full py-3 bg-accent hover:bg-accent-hover disabled:bg-rule text-paper disabled:text-ink-3 rounded-xl font-medium text-sm transition-colors"
                >
                  {loading
                    ? step || "Processing…"
                    : `Pay ${total().toFixed(3)} IP · Unlock ${items.length} block${items.length > 1 ? "s" : ""}`}
                </button>
              )}

              {authenticated && !walletClient && (
                <p className="text-ink-3 text-xs text-center">Wallet not connected — reload and reconnect</p>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  )
}
