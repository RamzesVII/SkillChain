"use client"

import type { Block } from "@/lib/supabase"
import { useBundleStore } from "@/lib/bundle"

const TYPE_LABELS: Record<string, string> = {
  markdown: "MD", text: "TXT", pdf: "PDF", video: "VID", image: "IMG",
}

const LICENSE_CONFIG: Record<string, { label: string; color: string }> = {
  pdf:      { label: "COMMERCIAL-USE", color: "oklch(0.72 0.15 150)" },
  video:    { label: "COMMERCIAL-USE", color: "oklch(0.72 0.15 150)" },
  image:    { label: "REMIX-ONLY",     color: "oklch(0.74 0.17 55)" },
  markdown: { label: "READ-ONLY",      color: "oklch(0.68 0.14 245)" },
  text:     { label: "READ-ONLY",      color: "oklch(0.68 0.14 245)" },
}

function LockedMedia({ type, height = 128 }: { type: string; height?: number }) {
  const isTextual = type === "markdown" || type === "text" || type === "pdf"
  return (
    <div className={`sc-media sc-t-${type}`} style={{ height }}>
      <div className="sc-media-bg" />
      {isTextual && (
        <div className="sc-lines">
          {[88, 72, 94, 64, 80, 58].map((w, i) => <i key={i} style={{ width: `${w}%` }} />)}
        </div>
      )}
      {type === "video" && <div className="sc-play" />}
      {type === "image" && <div className="sc-img-grid" />}
      <div className="sc-media-scan" />
      <div className="sc-media-lock">
        <span>🔒</span> CDR-Encrypted
      </div>
      <span className="sc-media-meta">
        {type === "video" ? "12:44" : type === "pdf" ? "18 pages" : type === "image" ? "4096×2160" : "8 min read"}
      </span>
    </div>
  )
}

type Variant = "feat" | "wide" | "tall" | "normal"

export function BlockCard({ block, index = 1, variant = "normal" }: {
  block: Block
  index?: number
  variant?: Variant
}) {
  const { add, remove, items } = useBundleStore()
  const inBundle = items.some((b) => b.id === block.id)

  const ipShort = block.ip_id ? `IP-${block.ip_id.slice(-4).toUpperCase()}` : "IP ASSET"
  const typeLabel = TYPE_LABELS[block.content_type] ?? block.content_type.toUpperCase()
  const license = LICENSE_CONFIG[block.content_type] ?? { label: "READ-ONLY", color: "oklch(0.68 0.14 245)" }
  const creator = block.creator_name || `${block.creator_address.slice(0, 8)}…`
  const idxStr = String(index).padStart(2, "0")

  const isRegistered = !!block.ip_id && !!block.license_terms_id

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isRegistered) return
    inBundle ? remove(block.id) : add(block)
  }

  // ── Featured card ──────────────────────────────────────────────────────
  if (variant === "feat") {
    return (
      <div className="featured-card" style={{ minHeight: "100%" }}>
        <span style={{ alignSelf: "flex-start", fontFamily: "var(--font-geist-mono)", fontSize: 9, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: "#fff", background: "var(--grad)", padding: "5px 11px", borderRadius: 3, whiteSpace: "nowrap" }}>
          ★ Editor's Pick
        </span>

        <LockedMedia type={block.content_type} height={132} />

        <div style={{ fontFamily: "var(--font-fraunces)", fontWeight: 600, fontSize: 32, lineHeight: 1.06, letterSpacing: "-0.5px", marginTop: 18, maxWidth: "18ch" }}>
          {block.title}
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--ink-2)", marginTop: 14, maxWidth: "46ch", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {block.preview_text}
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 22, paddingTop: 20, borderTop: "1px solid oklch(0.28 0.02 320)" }}>
          <span style={{ fontSize: 12.5, color: "var(--ink-2)" }}>
            By <b style={{ color: "var(--ink)", fontWeight: 500 }}>@{creator}</b>
            {block.is_verified && <span style={{ color: "var(--asolid)", marginLeft: 3 }}>◆</span>}
          </span>
          <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, fontWeight: 700, letterSpacing: 1, padding: "4px 8px", borderRadius: 3, color: "#fff", background: license.color, whiteSpace: "nowrap" }}>
            {license.label}
          </span>
          <button
            onClick={toggle}
            style={{ marginLeft: "auto", background: inBundle ? "oklch(0.22 0.02 320)" : "var(--grad)", color: inBundle ? "var(--asolid)" : "#fff", border: inBundle ? "1px solid var(--asolid)" : "none", borderRadius: 5, padding: "11px 18px", fontFamily: "var(--font-geist-mono)", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap" }}
          >
            {inBundle ? "✓ In Bundle" : `${block.price_ip} IP · Add +`}
          </button>
        </div>
      </div>
    )
  }

  // ── Flip card (normal / wide / tall) ──────────────────────────────────
  const showMedia = variant === "tall"
  const showPreview = variant === "wide" || variant === "tall"

  return (
    <div className="flip-card" style={{ height: "100%", minHeight: 236 }}>
      <div className="flip-inner" style={{ height: "100%", minHeight: 236 }}>
        {/* FRONT */}
        <div className="flip-face flip-front">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span className="grad-text" style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 500, fontSize: 27, lineHeight: 1, paddingLeft: 3, display: "inline-block" }}>
              {idxStr}
            </span>
            <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, letterSpacing: 2, color: "var(--ink-3)", border: "1px solid var(--line)", padding: "3px 7px", borderRadius: 3 }}>
              🔒 {typeLabel}
            </span>
          </div>

          {showMedia && <LockedMedia type={block.content_type} height={150} />}

          <div style={{ fontFamily: "var(--font-fraunces)", fontWeight: 600, fontSize: variant === "tall" ? 21 : 18, lineHeight: 1.14, letterSpacing: "-0.3px", marginTop: 16, color: "var(--ink)" }}>
            {block.title}
          </div>
          {showPreview && (
            <div style={{ fontSize: 13, lineHeight: 1.55, color: "var(--ink-2)", marginTop: 12, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: variant === "tall" ? 3 : 2, WebkitBoxOrient: "vertical" }}>
              {block.preview_text}
            </div>
          )}

          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, fontWeight: 700, letterSpacing: 1, padding: "4px 8px", borderRadius: 3, color: "#fff", background: license.color, alignSelf: "flex-start", marginTop: 12 }}>
            {license.label}
          </span>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 14, paddingTop: 13, borderTop: "1px solid var(--line)", gap: 8 }}>
            <span style={{ fontSize: 11, color: "var(--ink-3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>@{creator}</span>
            <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 15, fontWeight: 600, fontVariantNumeric: "tabular-nums", color: "var(--ink)", whiteSpace: "nowrap" }}>
              {block.price_ip}<span style={{ fontSize: 9, color: "var(--ink-3)" }}> IP</span>
            </span>
          </div>
        </div>

        {/* BACK */}
        <div className="flip-face flip-back">
          <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", opacity: 0.7 }}>
            {ipShort} · {block.category}
          </div>
          <div style={{ fontSize: 12.5, lineHeight: 1.5, fontWeight: 500, marginTop: 13, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 6, WebkitBoxOrient: "vertical" }}>
            {block.preview_text}
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9.5, letterSpacing: 1, display: "flex", justifyContent: "space-between", paddingTop: 11, borderTop: "1px solid rgba(20,8,20,0.22)", marginTop: "auto" }}>
            <span>@{creator}</span>
            <span>{block.price_ip} IP</span>
          </div>
          <button
            onClick={toggle}
            style={{ marginTop: 13, background: inBundle ? "rgba(20,8,20,0.18)" : "oklch(0.12 0.02 320)", color: inBundle ? "oklch(0.16 0.02 320)" : "#fff", border: "none", borderRadius: 5, padding: 11, fontFamily: "var(--font-geist-mono)", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", width: "100%" }}
          >
            {inBundle ? "✓ In Bundle" : `Add · ${block.price_ip} IP`}
          </button>
        </div>
      </div>
    </div>
  )
}
