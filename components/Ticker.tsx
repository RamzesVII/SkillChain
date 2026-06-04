import type { Block } from "@/lib/supabase"

const TYPE_LABELS: Record<string, string> = {
  markdown: "MD", text: "TXT", pdf: "PDF", video: "VID", image: "IMG",
}

export function Ticker({ blocks }: { blocks: Block[] }) {
  const items = blocks.length > 0
    ? blocks
    : [
        { id: "1", ip_id: "IP-A001", title: "DeFi Alpha — Yield Strategies", price_ip: "0.5", content_type: "markdown" },
        { id: "2", ip_id: "IP-A002", title: "Trading Psychology Masterclass", price_ip: "1.2", content_type: "video" },
        { id: "3", ip_id: "IP-A003", title: "Solidity Security Patterns", price_ip: "0.8", content_type: "pdf" },
        { id: "4", ip_id: "IP-A004", title: "Polymarket Alpha Breakdown", price_ip: "0.3", content_type: "text" },
      ]

  const track = [...items, ...items].map((b: any, i) => {
    const ip = b.ip_id ? `IP-${b.ip_id.slice(-4).toUpperCase()}` : "IP ASSET"
    const type = TYPE_LABELS[b.content_type] ?? "?"
    return (
      <span key={i} style={{ margin: "0 26px", fontFamily: "var(--font-geist-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--ink-3)" }}>
        <b className="grad-text">{ip}</b>
        {" · "}{b.title}{" · "}<b className="grad-text">{b.price_ip} IP</b>
        {" · "}<span style={{ color: "var(--ink-3)" }}>{type}</span>
      </span>
    )
  })

  return (
    <div style={{ overflow: "hidden", whiteSpace: "nowrap", borderBottom: "1px solid var(--line-soft)", padding: "9px 0", background: "oklch(0.085 0.012 320 / 0.5)", height: 36 }}>
      <div className="ticker-track">{track}</div>
    </div>
  )
}
