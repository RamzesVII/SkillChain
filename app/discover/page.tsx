import { createAdminClient } from "@/lib/supabase"
import { BlockCard } from "@/components/BlockCard"
import { Navbar } from "@/components/Navbar"
import { Ticker } from "@/components/Ticker"
import type { Block } from "@/lib/supabase"

const CATEGORIES = ["All", "DeFi", "Trading", "Dev", "Research", "Growth", "Predictions"]

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const supabase = createAdminClient()

  let query = supabase.from("blocks").select("*").order("created_at", { ascending: false })
  if (category && category !== "All") {
    query = query.eq("category", category)
  }

  const { data: blocks } = await query
  // Sort: video first (best for featured 2×2), then image, then rest by price desc
  const typeOrder: Record<string, number> = { video: 0, image: 1, pdf: 2, markdown: 3, text: 4 }
  const items = ((blocks ?? []) as Block[]).sort((a, b) => {
    const ta = typeOrder[a.content_type] ?? 5
    const tb = typeOrder[b.content_type] ?? 5
    if (ta !== tb) return ta - tb
    return parseFloat(b.price_ip) - parseFloat(a.price_ip)
  })
  const active = category ?? "All"

  // Stats (all blocks, not filtered)
  const { count: totalBlocks } = await supabase.from("blocks").select("*", { count: "exact", head: true })
  const { count: totalCreators } = await supabase.from("blocks").select("creator_address", { count: "exact", head: true })
  const { count: totalPurchases } = await supabase.from("purchases").select("*", { count: "exact", head: true })

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />
      <Ticker blocks={items.slice(0, 8)} />

      <div style={{ minHeight: "calc(100vh - 94px)" }}>
        <div className="flex flex-col">

          {/* Page header */}
          <div style={{ maxWidth: 1480, margin: "0 auto", width: "100%", padding: "34px 40px 0" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 30, paddingBottom: 24 }}>
              <div>
                <div className="grad-text" style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10.5, letterSpacing: 4, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>
                  Curated IP Assets · Story Protocol
                </div>
                <div style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 500, fontSize: 50, lineHeight: 0.95, letterSpacing: "-1px", whiteSpace: "nowrap" }}>
                  Knowledge Blocks
                </div>
              </div>
              <div style={{ display: "flex", gap: 34, paddingBottom: 8 }}>
                {[
                  { n: totalBlocks ?? items.length, label: "Assets" },
                  { n: totalCreators ?? 0, label: "Creators" },
                  { n: totalPurchases ?? 0, label: "Licenses" },
                ].map(({ n, label }) => (
                  <div key={label}>
                    <b style={{ fontFamily: "var(--font-geist-mono)", fontSize: 25, fontWeight: 600, display: "block", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{n}</b>
                    <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", color: "var(--ink-3)" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filter bar */}
          <div style={{ maxWidth: 1480, margin: "0 auto", width: "100%", padding: "0 40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0 26px", flexWrap: "wrap" }}>
              {CATEGORIES.map((cat) => (
                <a
                  key={cat}
                  href={cat === "All" ? "/discover" : `/discover?category=${cat}`}
                  className={`cat-chip${active === cat ? " active" : ""}`}
                >
                  {cat === "All" ? "All Assets" : cat}
                </a>
              ))}
              <div style={{ flex: 1 }} />
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--ink-3)" }}>
                {items.length} result{items.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Grid */}
          <div style={{ maxWidth: 1480, margin: "0 auto", width: "100%", padding: "0 40px 120px" }}>
            {items.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, gap: 12, textAlign: "center" }}>
                <h2 style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 24, color: "var(--ink)" }}>Nothing here yet.</h2>
                <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: 2 }}>
                  Be the first to publish a knowledge block
                </p>
                <a href="/create" className="grad-btn" style={{ marginTop: 12, padding: "12px 24px", fontSize: 10 }}>
                  + Publish block
                </a>
              </div>
            ) : (
              <BentoGrid blocks={items} />
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

function BentoGrid({ blocks }: { blocks: Block[] }) {
  if (blocks.length === 0) return null

  // Featured = first video block (most expensive by query sort); fall back to first
  const isTall = (b: Block) => b.content_type === "video" || b.content_type === "image"
  const featIdx = blocks.findIndex(b => b.content_type === "video")
  const featuredBlock = featIdx >= 0 ? blocks[featIdx] : blocks[0]
  const remaining = blocks.filter(b => b.id !== featuredBlock.id)

  // Put normal cards before tall to fill the 2×2 space right of featured first
  const normalBlocks = remaining.filter(b => !isTall(b))
  const tallBlocks = remaining.filter(b => isTall(b))
  const rest = [...normalBlocks, ...tallBlocks]

  // Assign tall variant to video/image blocks (up to 3)
  const variants: Record<string, "tall" | "normal"> = {}
  let tallCount = 0
  for (const b of rest) {
    if (isTall(b) && tallCount < 3) {
      variants[b.id] = "tall"
      tallCount++
    }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, gridAutoRows: 236, gridAutoFlow: "dense" }}>
      {/* Featured card — 2×2 */}
      <div
        className="card-enter"
        style={{ gridColumn: "span 2", gridRow: "span 2", height: "100%" }}
      >
        <BlockCard block={featuredBlock} index={1} variant="feat" />
      </div>

      {/* Rest */}
      {rest.map((block, i) => {
        const v = variants[block.id] ?? "normal"
        return (
          <div
            key={block.id}
            className="card-enter"
            style={{
              gridColumn: "span 1",
              gridRow: v === "tall" ? "span 2" : "span 1",
              animationDelay: `${(i + 1) * 0.05}s`,
              height: "100%",
            }}
          >
            <BlockCard block={block} index={i + 2} variant={v} />
          </div>
        )
      })}
    </div>
  )
}
