"use client"

import { useEffect, useState } from "react"
import { useWalletClient, usePublicClient } from "wagmi"
import { CDRClient } from "@piplabs/cdr-sdk"
import { encodeAbiParameters } from "viem"
import { STORY_CDR_API_URL } from "@/lib/constants"
import type { Block, Purchase } from "@/lib/supabase"
import { createClient } from "@supabase/supabase-js"

type Props = {
  purchase: Purchase & { blocks: Block }
}

function UnlockIcon() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" fill="none" aria-hidden>
      <rect x="1" y="8" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M5 8V6a3 3 0 0 1 6 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export function ContentViewer({ purchase }: Props) {
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const unlock = async () => {
    if (!walletClient || !publicClient) return
    setLoading(true)
    setError("")

    try {
      const block = purchase.blocks
      if (!block.cdr_uuid) throw new Error("No CDR vault for this block")

      const cdrClient = new CDRClient({
        network: "testnet",
        publicClient,
        walletClient,
        apiUrl: STORY_CDR_API_URL,
      })

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      const storageProvider = {
        upload: async () => { throw new Error("Read-only") },
        download: async (cid: string) => {
          const { data, error } = await supabase.storage.from("cdr-content").download(cid)
          if (error || !data) throw new Error("Download failed")
          return new Uint8Array(await data.arrayBuffer())
        },
      }

      const accessAuxData = encodeAbiParameters(
        [{ type: "uint256[]" }],
        [[BigInt(purchase.license_token_id)]]
      )

      const { content: bytes } = await cdrClient.consumer.downloadFile({
        uuid: block.cdr_uuid,
        accessAuxData,
        storageProvider,
      })

      if (block.content_type === "markdown" || block.content_type === "text") {
        setContent(new TextDecoder().decode(bytes))
      } else if (block.content_type === "pdf") {
        const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" })
        setContent(URL.createObjectURL(blob))
      } else if (block.content_type === "video") {
        const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "video/mp4" })
        setContent(URL.createObjectURL(blob))
      } else if (block.content_type === "image") {
        const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "image/jpeg" })
        setContent(URL.createObjectURL(blob))
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to decrypt")
    } finally {
      setLoading(false)
    }
  }

  const block = purchase.blocks

  if (!content) {
    return (
      <div className="bg-paper border border-rule rounded-2xl p-8 flex flex-col items-center gap-5 min-h-64 justify-center text-center">
        <div>
          <p className="font-display font-semibold text-ink text-lg">{block.title}</p>
          <p className="text-ink-3 text-sm mt-1">{block.category} · {block.content_type}</p>
        </div>
        {error && (
          <p className="text-sm text-[oklch(0.50_0.18_25)] max-w-sm">{error}</p>
        )}
        <button
          onClick={unlock}
          disabled={loading || !walletClient}
          className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover disabled:bg-rule text-paper disabled:text-ink-3 rounded-full font-medium text-sm transition-colors"
        >
          <UnlockIcon />
          {loading ? "Decrypting via CDR…" : "Unlock content"}
        </button>
        {!walletClient && (
          <p className="text-ink-3 text-xs">Wallet not connected</p>
        )}
      </div>
    )
  }

  return (
    <div className="bg-paper border border-rule rounded-2xl p-6">
      <h2 className="font-display font-semibold text-ink text-xl mb-5">{block.title}</h2>
      {block.content_type === "markdown" && (
        <div className="text-ink-2 text-sm leading-relaxed whitespace-pre-wrap max-w-prose">
          {content}
        </div>
      )}
      {block.content_type === "text" && (
        <div className="text-ink-2 text-sm leading-relaxed whitespace-pre-wrap max-w-prose">
          {content}
        </div>
      )}
      {block.content_type === "pdf" && (
        <iframe src={content} className="w-full h-[600px] rounded-xl border border-rule-faint" />
      )}
      {block.content_type === "video" && (
        <video src={content} controls className="w-full rounded-xl" />
      )}
      {block.content_type === "image" && (
        <img src={content} alt={block.title} className="w-full rounded-xl" />
      )}
    </div>
  )
}
