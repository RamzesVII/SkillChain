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
        setStep(`Minting license ${i + 1}/${items.length}: ${block.title}`)

        if (!block.ip_id || !block.license_terms_id) {
          throw new Error(`Block "${block.title}" is not registered on Story`)
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

      setStep("Saving purchases...")
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
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-white text-2xl font-bold mb-6">Your Bundle</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-zinc-500">Your bundle is empty.</p>
            <a href="/" className="mt-4 inline-block px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm">
              Browse blocks
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((block) => (
              <div key={block.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-white font-medium">{block.title}</p>
                  <p className="text-zinc-500 text-sm mt-0.5">
                    {block.creator_name || `${block.creator_address.slice(0, 8)}...`} · {block.category}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-zinc-300 font-medium">{block.price_ip} IP</span>
                  <button onClick={() => remove(block.id)} className="text-zinc-600 hover:text-red-400 transition-colors text-sm">✕</button>
                </div>
              </div>
            ))}

            <div className="border-t border-zinc-800 pt-4 flex items-center justify-between">
              <span className="text-zinc-400">Total</span>
              <span className="text-white font-bold text-lg">{total().toFixed(3)} IP</span>
            </div>

            <div className="bg-zinc-800/50 rounded-lg px-4 py-3 text-zinc-400 text-xs">
              Your wallet will sign {items.length} transaction{items.length > 1 ? "s" : ""} — one per block. Story Protocol routes royalties directly to creators.
            </div>

            {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">{error}</p>}
            {step && <p className="text-violet-400 text-sm">{step}</p>}

            {!authenticated ? (
              <button onClick={login} className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium">
                Connect to purchase
              </button>
            ) : (
              <button
                onClick={handlePurchase}
                disabled={loading || !walletClient}
                className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-lg font-medium transition-colors"
              >
                {loading ? step || "Processing..." : `Pay ${total().toFixed(3)} IP → Unlock ${items.length} block${items.length > 1 ? "s" : ""}`}
              </button>
            )}

            {authenticated && !walletClient && (
              <p className="text-zinc-500 text-xs text-center">Wallet not connected — reload and reconnect</p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
