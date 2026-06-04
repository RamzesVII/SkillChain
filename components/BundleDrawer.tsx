"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useBundleStore } from "@/lib/bundle"

export function BundleDrawer() {
  const { items, isOpen, closeDrawer, remove, total } = useBundleStore()
  const router = useRouter()
  const fee = total() * 0.05
  const grand = total() + fee

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeDrawer() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [closeDrawer])

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  return (
    <>
      {/* Scrim */}
      {isOpen && (
        <div
          onClick={closeDrawer}
          style={{
            position: "fixed", inset: 0, zIndex: 48,
            background: "oklch(0 0 0 / 0.55)",
            backdropFilter: "blur(2px)",
            animation: "fadein 0.25s ease",
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, zIndex: 49,
        width: "min(480px, 100vw)",
        height: "100dvh",
        background: "var(--bg)",
        borderLeft: "1px solid var(--line)",
        display: "flex", flexDirection: "column",
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(.3,.7,.3,1)",
        willChange: "transform",
        overflow: "hidden",
      }}>

        {/* Header */}
        <div style={{ padding: "28px 28px 20px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 500, fontSize: 36, lineHeight: 1, letterSpacing: "-0.5px", color: "var(--ink)", margin: 0 }}>
              Your Bundle
            </h2>
            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", color: "var(--ink-3)", marginTop: 8 }}>
              {items.length} Block{items.length !== 1 ? "s" : ""} · Composable License
            </p>
          </div>
          <button
            onClick={closeDrawer}
            style={{ width: 40, height: 40, border: "1px solid var(--line)", background: "transparent", color: "var(--ink-2)", cursor: "pointer", borderRadius: 6, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--ink)"; (e.currentTarget as HTMLElement).style.color = "var(--ink)" }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--line)"; (e.currentTarget as HTMLElement).style.color = "var(--ink-2)" }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
          {items.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16, textAlign: "center", padding: 40 }}>
              <h3 style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 400, fontSize: 28, color: "var(--ink-3)", margin: 0 }}>
                Nothing curated yet
              </h3>
              <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, letterSpacing: 1, color: "var(--ink-3)", lineHeight: 1.8, textAlign: "center", maxWidth: "26ch", margin: 0 }}>
                Add knowledge blocks from the gallery to mint a single composable license.
              </p>
            </div>
          ) : (
            <div>
              {items.map((block, i) => {
                const ip = block.ip_id ? `IP-${block.ip_id.slice(-4).toUpperCase()}` : "IP ASSET"
                return (
                  <div key={block.id} style={{ padding: "16px 28px", borderBottom: "1px solid var(--line-soft)", display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 20, color: "var(--ink-3)", flexShrink: 0, lineHeight: 1, paddingTop: 2 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", lineHeight: 1.35, margin: 0 }}>{block.title}</p>
                      <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, color: "var(--ink-3)", marginTop: 4, letterSpacing: 1.5, textTransform: "uppercase" }}>
                        {ip} · @{block.creator_name || block.creator_address.slice(0, 6)}
                      </p>
                    </div>
                    <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "var(--ink-2)", fontVariantNumeric: "tabular-nums" }}>
                        {block.price_ip} IP
                      </span>
                      <button
                        onClick={() => remove(block.id)}
                        style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--ink-3)", background: "none", border: "none", cursor: "pointer", padding: "2px 4px", lineHeight: 1 }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink)")}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink-3)")}
                      >✕</button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "20px 28px", borderTop: "1px solid var(--line)", background: "var(--bg)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-geist-mono)", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase" }}>
              <span style={{ color: "var(--ink-3)" }}>Subtotal</span>
              <span style={{ color: "var(--ink-2)", fontVariantNumeric: "tabular-nums" }}>{total().toFixed(2)} IP</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-geist-mono)", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase" }}>
              <span style={{ color: "var(--ink-3)" }}>Protocol Fee · 5%</span>
              <span style={{ color: "var(--ink-2)", fontVariantNumeric: "tabular-nums" }}>{fee.toFixed(2)} IP</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 10, borderTop: "1px solid var(--line-soft)", marginTop: 4 }}>
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "var(--ink)" }}>Total</span>
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 26, fontWeight: 700, color: "var(--ink)", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
                {grand.toFixed(2)}<span style={{ fontSize: 12, color: "var(--ink-3)", marginLeft: 4 }}>IP</span>
              </span>
            </div>
          </div>
          <button
            onClick={() => { closeDrawer(); router.push("/bundle") }}
            style={{ width: "100%", padding: "16px", background: "var(--grad)", color: "#fff", border: "none", borderRadius: 6, fontFamily: "var(--font-geist-mono)", fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", cursor: "pointer", boxShadow: "0 8px 24px -8px oklch(0.55 0.2 340 / 0.8)", transition: "transform .15s, box-shadow .15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px -8px oklch(0.55 0.2 340 / 0.9)" }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px -8px oklch(0.55 0.2 340 / 0.8)" }}
          >
            Unlock Blocks
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadein { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
    </>
  )
}
