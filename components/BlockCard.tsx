"use client"

import type { Block } from "@/lib/supabase"
import { useBundleStore } from "@/lib/bundle"

const CATEGORY_COLORS: Record<string, string> = {
  DeFi:        "bg-[oklch(0.55_0.15_260)]",
  Trading:     "bg-[oklch(0.52_0.15_145)]",
  Dev:         "bg-[oklch(0.58_0.16_35)]",
  Research:    "bg-[oklch(0.50_0.14_310)]",
  Growth:      "bg-[oklch(0.55_0.16_340)]",
  Predictions: "bg-[oklch(0.60_0.15_85)]",
}

function LockIcon() {
  return (
    <svg width="11" height="13" viewBox="0 0 11 13" fill="none" aria-hidden>
      <rect x="0.75" y="5.75" width="9.5" height="6.5" rx="1.25" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 5.5V4a2.5 2.5 0 0 1 5 0v1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function BlockCard({ block }: { block: Block }) {
  const { add, remove, items } = useBundleStore()
  const inBundle = items.some((b) => b.id === block.id)
  const dotColor = CATEGORY_COLORS[block.category] ?? "bg-[oklch(0.60_0.08_280)]"

  return (
    <article className="bg-paper border border-rule rounded-2xl p-5 flex flex-col gap-3 hover:border-[oklch(0.78_0.012_80)] transition-colors">
      <header className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs font-medium text-ink-2">
          <span className={`inline-block w-2 h-2 rounded-full ${dotColor}`} />
          {block.category}
        </span>
        <span className="text-ink-3 flex items-center gap-1">
          <LockIcon />
        </span>
      </header>

      <div className="flex flex-col gap-1.5">
        <h3 className="font-display font-semibold text-ink leading-snug">
          {block.title}
        </h3>
        <p className="text-ink-2 text-sm leading-relaxed">
          {block.preview_text}
        </p>
      </div>

      <footer className="flex items-center justify-between pt-3 border-t border-rule-faint mt-auto">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-ink-3 text-xs truncate">
            {block.creator_name || `${block.creator_address.slice(0, 6)}…${block.creator_address.slice(-4)}`}
          </span>
          {block.is_verified && (
            <span className="text-accent text-xs" title="Verified creator">✓</span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-sm font-medium text-ink tabular">
            {block.price_ip} IP
          </span>
          <button
            onClick={() => inBundle ? remove(block.id) : add(block)}
            aria-label={inBundle ? "Remove from bundle" : "Add to bundle"}
            className={`flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full transition-colors ${
              inBundle
                ? "bg-accent-dim text-accent"
                : "border border-rule text-ink-2 hover:border-accent hover:text-accent"
            }`}
          >
            {inBundle ? <><CheckIcon /> Added</> : "+ Bundle"}
          </button>
        </div>
      </footer>
    </article>
  )
}
