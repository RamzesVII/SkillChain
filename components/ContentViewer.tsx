"use client"

import { useState } from "react"
import { useWalletClient, usePublicClient } from "wagmi"
import { CDRClient } from "@piplabs/cdr-sdk"
import { encodeAbiParameters } from "viem"
import type { Block, Purchase } from "@/lib/supabase"
import { createClient } from "@supabase/supabase-js"

type Props = { purchase: Purchase & { blocks: Block } }

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
        network: "testnet", publicClient, walletClient, apiUrl: "/api/cdr",
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
        [{ type: "uint256[]" }], [[BigInt(purchase.license_token_id)]]
      )

      const { content: bytes } = await cdrClient.consumer.downloadFile({
        uuid: block.cdr_uuid, accessAuxData, storageProvider,
      })

      if (block.content_type === "markdown" || block.content_type === "text") {
        setContent(new TextDecoder().decode(bytes))
      } else if (block.content_type === "pdf") {
        setContent(URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" })))
      } else if (block.content_type === "video") {
        setContent(URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: "video/mp4" })))
      } else if (block.content_type === "image") {
        setContent(URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: "image/jpeg" })))
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
      <div className="bg-paper border border-rule-faint p-8 flex flex-col items-center gap-5 min-h-64 justify-center text-center">
        <div>
          <p className="font-display font-bold text-ink text-base">{block.title}</p>
          <p className="font-mono text-[10px] text-ink-3 uppercase tracking-widest mt-1">{block.category} · {block.content_type}</p>
        </div>
        {error && <p className="font-mono text-[10px] text-[oklch(0.70_0.14_25)] max-w-sm">{error}</p>}
        <button
          onClick={unlock}
          disabled={loading || !walletClient}
          className="px-6 py-2 bg-accent hover:bg-accent-hover disabled:bg-rule text-canvas disabled:text-ink-3 text-[10px] font-bold uppercase tracking-widest transition-colors"
        >
          {loading ? "Decrypting via CDR…" : "Unlock content"}
        </button>
        {!walletClient && <p className="font-mono text-[9px] text-ink-3 uppercase tracking-widest">Wallet not connected</p>}
      </div>
    )
  }

  return (
    <div className="bg-paper border border-rule-faint p-6">
      <h2 className="font-display font-bold text-ink text-base mb-5">{block.title}</h2>
      {(block.content_type === "markdown" || block.content_type === "text") && (
        <div className="text-ink-2 text-sm leading-relaxed whitespace-pre-wrap max-w-prose">{content}</div>
      )}
      {block.content_type === "pdf" && <iframe src={content} className="w-full h-[600px] border border-rule-faint" />}
      {block.content_type === "video" && <video src={content} controls className="w-full" />}
      {block.content_type === "image" && <img src={content} alt={block.title} className="w-full" />}
    </div>
  )
}
