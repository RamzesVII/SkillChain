"use client"

import type { Block } from "@/lib/supabase"
import { useBundleStore } from "@/lib/bundle"

const CATEGORY_COLORS: Record<string, string> = {
  DeFi: "bg-blue-500/20 text-blue-300",
  Trading: "bg-green-500/20 text-green-300",
  Dev: "bg-orange-500/20 text-orange-300",
  Research: "bg-purple-500/20 text-purple-300",
  Growth: "bg-pink-500/20 text-pink-300",
  Predictions: "bg-yellow-500/20 text-yellow-300",
}

export function BlockCard({ block }: { block: Block }) {
  const { add, remove, items } = useBundleStore()
  const inBundle = items.some((b) => b.id === block.id)

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-3 hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${CATEGORY_COLORS[block.category] ?? "bg-zinc-700 text-zinc-300"}`}>
          {block.category}
        </span>
        <span className="text-xs text-zinc-500 flex items-center gap-1">
          🔒 Locked
        </span>
      </div>

      <div>
        <h3 className="text-white font-semibold text-base leading-snug">{block.title}</h3>
        <p className="text-zinc-400 text-sm mt-1 leading-relaxed line-clamp-3">{block.preview_text}</p>
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-zinc-800">
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-500 text-xs">
            {block.creator_name || `${block.creator_address.slice(0, 6)}...${block.creator_address.slice(-4)}`}
          </span>
          {block.is_verified && (
            <span className="text-violet-400 text-xs">✓</span>
          )}
        </div>
        <span className="text-zinc-300 text-sm font-medium">{block.price_ip} IP</span>
      </div>

      <button
        onClick={() => inBundle ? remove(block.id) : add(block)}
        className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
          inBundle
            ? "bg-violet-600/20 border border-violet-600 text-violet-300 hover:bg-red-500/20 hover:border-red-500 hover:text-red-300"
            : "bg-violet-600 hover:bg-violet-500 text-white"
        }`}
      >
        {inBundle ? "Remove from bundle" : "Add to bundle"}
      </button>
    </div>
  )
}
