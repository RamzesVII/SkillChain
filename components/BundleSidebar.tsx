"use client"

import { useBundleStore } from "@/lib/bundle"
import { useRouter } from "next/navigation"

export function BundleSidebar() {
  const { items, total, remove } = useBundleStore()
  const router = useRouter()
  const fee = total() * 0.025

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--bg)" }}>

      {/* Header */}
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--line-soft)" }}>
        <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 6 }}>
          Active Curation
        </p>
        <h2 style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 500, fontSize: 22, color: "var(--ink)", lineHeight: 1.1 }}>
          Current Bundle
        </h2>
        {items.length > 0 && (
          <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "var(--ink-3)", marginTop: 4 }}>
            {items.length} block{items.length > 1 ? "s" : ""} selected
          </p>
        )}
      </div>

      {/* Items */}
      {items.length === 0 ? (
        <div style={{ padding: "24px 20px" }}>
          <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--ink-3)", lineHeight: 1.6 }}>
            Add blocks from the grid to start curating your bundle.
          </p>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: "auto" }}>
          {items.map((block) => (
            <div key={block.id} style={{ padding: "12px 20px", borderBottom: "1px solid var(--line-soft)", display: "flex", alignItems: "flex-start", gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, color: "var(--ink)", lineHeight: 1.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                  {block.title}
                </p>
                <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, color: "var(--ink-3)", marginTop: 2, letterSpacing: 1, textTransform: "uppercase" }}>
                  {block.ip_id ? `IP-${block.ip_id.slice(-4).toUpperCase()}` : "IP ASSET"} · @{block.creator_name || block.creator_address.slice(0, 6)}
                </p>
              </div>
              <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "var(--ink-2)", fontVariantNumeric: "tabular-nums" }}>{block.price_ip}</span>
                <button onClick={() => remove(block.id)} style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "var(--ink-3)", background: "none", border: "none", cursor: "pointer", padding: "2px 4px" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink-3)")}
                >[x]</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Totals + CTA */}
      {items.length > 0 && (
        <div style={{ padding: "16px 20px", borderTop: "1px solid var(--line-soft)", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "var(--ink-3)" }}>
            <span style={{ textTransform: "uppercase", letterSpacing: 1 }}>Protocol Fee (2.5%)</span>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{fee.toFixed(3)} IP</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "var(--ink-3)" }}>
            <span style={{ textTransform: "uppercase", letterSpacing: 1 }}>Creator Royalties</span>
            <span>Included</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 8, borderTop: "1px solid var(--line-soft)" }}>
            <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, fontWeight: 700, color: "var(--ink)", textTransform: "uppercase", letterSpacing: 1 }}>Total</span>
            <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14, fontWeight: 700, color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>
              {(total() + fee).toFixed(3)} IP
            </span>
          </div>
          <button
            onClick={() => router.push("/bundle")}
            style={{ width: "100%", padding: "12px", background: "var(--grad)", color: "#fff", border: "none", borderRadius: 5, fontFamily: "var(--font-geist-mono)", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", marginTop: 4, boxShadow: "0 6px 20px -8px oklch(0.55 0.2 340 / 0.8)", transition: "transform .15s" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = "translateY(-1px)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = "")}
          >
            Mint Bundle License
          </button>
        </div>
      )}
    </div>
  )
}
