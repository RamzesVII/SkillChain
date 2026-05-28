"use client"

import { useEffect, useState } from "react"
import { useWalletClient, usePublicClient } from "wagmi"
import { CDRClient } from "@piplabs/cdr-sdk"
import { encodeAbiParameters } from "viem"
import { SupabaseStorageProvider } from "@/lib/cdr"
import { STORY_CDR_API_URL, STORY_RPC_URL } from "@/lib/constants"
import type { Block, Purchase } from "@/lib/supabase"
import { createClient } from "@supabase/supabase-js"

type Props = {
  purchase: Purchase & { blocks: Block }
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
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center gap-4 min-h-64">
        <div className="text-center">
          <p className="text-white font-semibold">{block.title}</p>
          <p className="text-zinc-500 text-sm mt-1">{block.category} · {block.content_type}</p>
        </div>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <button
          onClick={unlock}
          disabled={loading || !walletClient}
          className="px-6 py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-lg font-medium transition-colors"
        >
          {loading ? "Decrypting via CDR..." : "🔓 Unlock Content"}
        </button>
        {!walletClient && <p className="text-zinc-600 text-xs">Wallet not connected</p>}
      </div>
    )
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h2 className="text-white font-semibold mb-4">{block.title}</h2>
      {block.content_type === "markdown" && (
        <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{content}</div>
      )}
      {block.content_type === "pdf" && (
        <iframe src={content} className="w-full h-96 rounded-lg" />
      )}
      {block.content_type === "video" && (
        <video src={content} controls className="w-full rounded-lg" />
      )}
      {block.content_type === "image" && (
        <img src={content} alt={block.title} className="w-full rounded-lg" />
      )}
    </div>
  )
}
