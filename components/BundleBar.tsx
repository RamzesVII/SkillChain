"use client"

import { useBundleStore } from "@/lib/bundle"
import { useRouter } from "next/navigation"

export function BundleBar() {
  const { items, total } = useBundleStore()
  const router = useRouter()

  if (items.length === 0) return null

  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, background: "oklch(0.145 0.014 320 / 0.92)", borderTop: "1px solid var(--line)", backdropFilter: "blur(12px)" }}>
      <div style={{ maxWidth: 1480, margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div>
          <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "var(--ink-3)" }}>
            Active Bundle · {items.length} block{items.length > 1 ? "s" : ""}
          </p>
          <p className="grad-text" style={{ fontFamily: "var(--font-geist-mono)", fontWeight: 700, fontSize: 14, fontVariantNumeric: "tabular-nums" }}>
            {total().toFixed(3)} IP
          </p>
        </div>
        <button
          onClick={() => router.push("/bundle")}
          style={{ padding: "10px 20px", background: "var(--grad)", color: "#fff", border: "none", borderRadius: 5, fontFamily: "var(--font-geist-mono)", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", flexShrink: 0, boxShadow: "0 6px 20px -8px oklch(0.55 0.2 340 / 0.8)" }}
        >
          Review →
        </button>
      </div>
    </div>
  )
}
