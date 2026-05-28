import { createAdminClient } from "@/lib/supabase"
import { BlockCard } from "@/components/BlockCard"
import { Navbar } from "@/components/Navbar"
import type { Block } from "@/lib/supabase"

const CATEGORIES = ["All", "DeFi", "Trading", "Dev", "Research", "Growth", "Predictions"]

export default async function Home({
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
  const items = (blocks ?? []) as Block[]
  const active = category ?? "All"

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-10">

        <div className="mb-8">
          <p className="text-xs font-medium text-ink-3 tracking-widest uppercase mb-2">Knowledge blocks</p>
          <h1 className="font-display text-4xl font-semibold text-ink">Discover</h1>
        </div>

        <div className="flex gap-1 mb-8 flex-wrap">
          {CATEGORIES.map((cat) => (
            <a
              key={cat}
              href={cat === "All" ? "/" : `/?category=${cat}`}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                active === cat
                  ? "bg-ink text-paper font-medium"
                  : "text-ink-2 hover:text-ink"
              }`}
            >
              {cat}
            </a>
          ))}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-display text-2xl font-semibold text-ink mb-2">Nothing here yet.</p>
            <p className="text-ink-3 text-sm mb-6">Be the first to publish a knowledge block.</p>
            <a
              href="/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-paper rounded-full text-sm font-medium transition-colors"
            >
              Publish a block
            </a>
          </div>
        ) : (
          <div className="masonry">
            {items.map((block) => (
              <div key={block.id} className="masonry-item">
                <BlockCard block={block} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
