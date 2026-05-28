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

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold">Discover Web3 Skills</h1>
          <p className="text-zinc-400 mt-2">Knowledge blocks from verified Web3 experts. Buy once, access forever.</p>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {CATEGORIES.map((cat) => (
            <a
              key={cat}
              href={cat === "All" ? "/" : `/?category=${cat}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                (category ?? "All") === cat
                  ? "bg-violet-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {cat}
            </a>
          ))}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-zinc-500 text-lg">No blocks yet.</p>
            <a href="/create" className="mt-4 inline-block px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-medium transition-colors">
              Create the first block
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((block) => (
              <BlockCard key={block.id} block={block} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
