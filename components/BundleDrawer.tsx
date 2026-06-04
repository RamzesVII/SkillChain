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
      {/* Scrim — z-index 50 per design, purple-tinted dark */}
      <div
        onClick={closeDrawer}
        style={{
          position: "fixed", inset: 0, zIndex: 50,
          background: "oklch(0.05 0.01 320 / 0.6)",
          backdropFilter: "blur(3px)",
          pointerEvents: isOpen ? "auto" : "none",
          opacity: isOpen ? 1 : 0,
          transition: "opacity 0.25s ease",
        }}
      />

      {/* Drawer — z-index 60 per design */}
      <div style={{
        position: "fixed", top: 0, right: 0, zIndex: 60,
        width: 420, maxWidth: "92vw",
        height: "100dvh",
        background: "linear-gradient(180deg, oklch(0.155 0.014 320), oklch(0.115 0.013 320))",
        borderLeft: "1px solid var(--line)",
        boxShadow: "-30px 0 70px -30px rgba(0,0,0,0.8)",
        display: "flex", flexDirection: "column",
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.4s cubic-bezier(.2,.8,.25,1)",
        willChange: "transform",
        overflow: "hidden",
      }}>

        {/* Header */}
        <div style={{ padding: "28px 28px 20px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 500, fontSize: 26, lineHeight: 1, letterSpacing: "-0.4px", color: "var(--ink)", margin: 0 }}>
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
            <div style={{ padding: "14px 26px" }}>
              {items.map((block) => {
                const TYPE_LABELS: Record<string, string> = { markdown: "MD", text: "TXT", pdf: "PDF", video: "VID", image: "IMG" }
                const LICENSE_LABELS: Record<string, string> = { pdf: "COMMERCIAL-USE", video: "COMMERCIAL-USE", image: "REMIX-ONLY", markdown: "READ-ONLY", text: "READ-ONLY" }
                const typeLabel = TYPE_LABELS[block.content_type] ?? block.content_type.toUpperCase()
                const licLabel = LICENSE_LABELS[block.content_type] ?? "READ-ONLY"
                const creator = block.creator_name || block.creator_address.slice(0, 8)
                return (
                  <div key={block.id} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "10px 14px", padding: "15px 0", borderBottom: "1px solid var(--line-soft)", alignItems: "start" }}>
                    {/* Left: title + meta + remove */}
                    <div>
                      <div style={{ fontFamily: "var(--font-fraunces)", fontWeight: 600, fontSize: 15, lineHeight: 1.18, letterSpacing: "-0.2px", color: "var(--ink)" }}>
                        {block.title}
                      </div>
                      <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9.5, letterSpacing: 1, color: "var(--ink-3)", textTransform: "uppercase", marginTop: 5 }}>
                        @{creator} · {typeLabel} · {licLabel}
                      </div>
                      <button
                        onClick={() => remove(block.id)}
                        style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", color: "var(--ink-3)", background: "none", border: "none", cursor: "pointer", padding: "4px 0 0", display: "block", transition: "color .15s" }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "oklch(0.7 0.18 25)")}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink-3)")}
                      >
                        Remove
                      </button>
                    </div>
                    {/* Right: price */}
                    <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14, fontWeight: 600, fontVariantNumeric: "tabular-nums", textAlign: "right", color: "var(--ink)" }}>
                      {block.price_ip}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "22px 26px", borderTop: "1px solid var(--line)", background: "oklch(0.10 0.013 320 / 0.7)" }}>
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
            Unlock {items.length > 0 ? `${items.length} ` : ""}Block{items.length === 1 ? "" : "s"}
          </button>
        </div>
      </div>

    </>
  )
}
