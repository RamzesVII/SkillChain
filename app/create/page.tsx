"use client"

import { useState } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { Navbar } from "@/components/Navbar"
import { useRouter } from "next/navigation"

const CATEGORIES = ["DeFi", "Trading", "Dev", "Research", "Growth"]
const CONTENT_TYPES = ["markdown", "pdf", "video"] as const

export default function CreatePage() {
  const { authenticated, user, login } = usePrivy()
  const router = useRouter()

  const [form, setForm] = useState({
    title: "",
    preview_text: "",
    category: "DeFi",
    price_ip: "0.1",
    content_type: "markdown" as typeof CONTENT_TYPES[number],
    creator_name: "",
  })
  const [content, setContent] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authenticated || !user?.wallet?.address) return
    setLoading(true)
    setError("")

    try {
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => formData.append(k, v))
      formData.append("creator_address", user.wallet.address)

      if (form.content_type === "markdown") {
        formData.append("content", content)
      } else if (file) {
        formData.append("file", file)
      }

      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Upload failed")
      router.push("/")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <p className="text-zinc-400">Connect your wallet to create a block</p>
          <button onClick={login} className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium">
            Connect
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-white text-2xl font-bold mb-6">Create Knowledge Block</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-400 text-sm">Creator name</label>
            <input
              value={form.creator_name}
              onChange={(e) => setForm({ ...form, creator_name: e.target.value })}
              placeholder="Your name or alias"
              className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-400 text-sm">Title *</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. How Uniswap V3 liquidity works"
              className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-400 text-sm">Preview text * <span className="text-zinc-600">(public teaser — hook the reader)</span></label>
            <textarea
              required
              rows={3}
              value={form.preview_text}
              onChange={(e) => setForm({ ...form, preview_text: e.target.value })}
              placeholder="2-3 sentences that make someone want to buy this block..."
              className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 resize-none"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-zinc-400 text-sm">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-zinc-400 text-sm">Price (IP tokens)</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.price_ip}
                onChange={(e) => setForm({ ...form, price_ip: e.target.value })}
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-400 text-sm">Content type</label>
            <div className="flex gap-2">
              {CONTENT_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({ ...form, content_type: t })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    form.content_type === t
                      ? "bg-violet-600 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-400 text-sm">Full content * <span className="text-zinc-600">(CDR-encrypted — only buyers will see this)</span></label>
            {form.content_type === "markdown" ? (
              <textarea
                required
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your full content in markdown..."
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 resize-none font-mono"
              />
            ) : (
              <input
                type="file"
                accept={form.content_type === "pdf" ? ".pdf" : "video/*"}
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-400 text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-violet-600 file:text-white file:text-xs cursor-pointer"
              />
            )}
          </div>

          {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-lg font-medium transition-colors"
          >
            {loading ? "Uploading to Story & CDR..." : "Publish Block"}
          </button>
        </form>
      </main>
    </div>
  )
}
