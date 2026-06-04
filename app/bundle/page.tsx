"use client"

import Link from "next/link"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { Navbar } from "@/components/Navbar"
import { useBundleStore } from "@/lib/bundle"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { StoryClient } from "@story-protocol/core-sdk"
import { custom, parseEther, type Address } from "viem"
import { AENEID_CHAIN_ID } from "@/lib/constants"

export default function BundlePage() {
  const { authenticated, user, login } = usePrivy()
  const { wallets, ready: walletsReady } = useWallets()
  const { items, remove, clear, total } = useBundleStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState("")
  const router = useRouter()

  const getStoryClient = async (account: Address) => {
    const wallet = wallets.find((w) => w.address.toLowerCase() === account.toLowerCase())
    if (!wallet) {
      throw new Error("Wallet signer is not ready. Reconnect your wallet and try again.")
    }

    if (wallet.chainId !== `eip155:${AENEID_CHAIN_ID}`) {
      await wallet.switchChain(AENEID_CHAIN_ID)
    }

    const provider = await wallet.getEthereumProvider()
    return StoryClient.newClient({
      chainId: "aeneid",
      transport: custom(provider),
      account,
    })
  }

  const handlePurchase = async () => {
    if (!authenticated || !user?.wallet?.address) {
      login()
      return
    }
    setLoading(true)
    setError("")
    setStep("Preparing wallet…")

    try {
      const account = user.wallet.address as Address
      const storyClient = await getStoryClient(account)

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
          receiver: account,
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
        body: JSON.stringify({ purchases: recorded, buyer_address: account }),
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

  const fee = total() * 0.025

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8">

        <div className="mb-8">
          <p className="font-mono text-[9px] uppercase tracking-widest text-ink-3 mb-1">Checkout</p>
          <h1 className="font-display italic text-3xl text-ink">Current Bundle</h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-32">
            <h2 className="font-display italic text-2xl text-ink mb-2">Bundle is empty.</h2>
            <p className="font-mono text-[10px] text-ink-3 uppercase tracking-widest mb-6">Add blocks to get started</p>
            <Link href="/" className="px-6 py-2 border border-rule text-ink text-[11px] font-bold uppercase tracking-widest hover:border-ink transition-colors">
              Browse blocks
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">

            <div className="flex flex-col gap-px bg-rule-faint">
              {items.map((block, i) => (
                <div key={block.id} className="bg-canvas px-5 py-4 flex items-start gap-4">
                  <span className="font-mono text-[10px] text-ink-3 tabular mt-0.5 w-5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-ink text-sm leading-snug">{block.title}</p>
                    <p className="font-mono text-[9px] text-ink-3 mt-1 uppercase tracking-wider">
                      {block.ip_id ? `IP-${block.ip_id.slice(-4).toUpperCase()}` : "IP ASSET"} · @{block.creator_name || block.creator_address.slice(0, 8)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-[11px] font-bold text-ink tabular">{block.price_ip} IP</span>
                    <button onClick={() => remove(block.id)} className="font-mono text-[10px] text-ink-3 hover:text-ink transition-colors">✕</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:sticky lg:top-20 bg-paper border border-rule-faint p-5 flex flex-col gap-3">
              <div className="border-b border-rule-faint pb-3">
                <p className="font-mono text-[9px] uppercase tracking-widest text-ink-3 mb-1">Total</p>
                <p className="font-mono text-2xl font-bold text-ink tabular">
                  {(total() + fee).toFixed(3)} <span className="text-ink-3 text-sm">IP</span>
                </p>
              </div>
              <div className="flex flex-col gap-1.5 text-[10px] font-mono text-ink-3">
                <div className="flex justify-between">
                  <span className="uppercase tracking-wider">Protocol Fee (2.5%)</span>
                  <span className="tabular">{fee.toFixed(3)} IP</span>
                </div>
                <div className="flex justify-between">
                  <span className="uppercase tracking-wider">Creator Royalties</span>
                  <span>Included</span>
                </div>
              </div>

              {error && (
                <p className="font-mono text-[10px] text-[oklch(0.70_0.14_25)] bg-[oklch(0.16_0.04_25)] border border-[oklch(0.28_0.06_25)] px-3 py-2">
                  {error}
                </p>
              )}
              {step && <p className="font-mono text-[10px] text-accent uppercase tracking-wider">{step}</p>}

              {!authenticated ? (
                <button onClick={login} className="w-full py-3 bg-accent hover:bg-accent-hover text-canvas text-[10px] font-bold uppercase tracking-widest transition-colors">
                  Connect to purchase
                </button>
              ) : (
                <button
                  onClick={handlePurchase}
                  disabled={loading || !walletsReady}
                  className="w-full py-3 bg-accent hover:bg-accent-hover disabled:bg-rule text-canvas disabled:text-ink-3 text-[10px] font-bold uppercase tracking-widest transition-colors"
                >
                  {loading ? step || "Processing…" : !walletsReady ? "Preparing wallet…" : "Mint Bundle License"}
                </button>
              )}
              <p className="text-center font-mono text-[9px] text-ink-3 uppercase tracking-widest">(IP_0S)</p>
            </div>

          </div>
        )}
      </main>
    </div>
  )
}
