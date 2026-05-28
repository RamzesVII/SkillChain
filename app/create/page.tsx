"use client"

import { useState } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { Navbar } from "@/components/Navbar"
import { useRouter } from "next/navigation"

const CATEGORIES = ["DeFi", "Trading", "Dev", "Research", "Growth", "Predictions"]
const CONTENT_TYPES = ["markdown", "pdf", "video", "image", "text"] as const

const inputClass =
  "w-full bg-paper border border-rule rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:border-accent transition-colors"

const labelClass = "block text-xs font-medium text-ink-2 uppercase tracking-wider mb-1.5"

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

      if (form.content_type === "markdown" || form.content_type === "text") {
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
      <div className="min-h-screen bg-canvas">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <p className="font-display text-2xl font-semibold text-ink">Publish your knowledge.</p>
          <p className="text-ink-3 text-sm">Connect your wallet to create a block.</p>
          <button
            onClick={login}
            className="mt-2 px-6 py-3 bg-accent hover:bg-accent-hover text-paper rounded-full font-medium text-sm transition-colors"
          >
            Connect wallet
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-10">

        <div className="mb-8">
          <p className="text-xs font-medium text-ink-3 tracking-widest uppercase mb-2">Creator</p>
          <h1 className="font-display text-4xl font-semibold text-ink">New block</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">

          {/* Identity */}
          <section className="flex flex-col gap-5">
            <div>
              <label className={labelClass}>Your name</label>
              <input
                value={form.creator_name}
                onChange={(e) => setForm({ ...form, creator_name: e.target.value })}
                placeholder="Name or alias"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Title *</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. How Uniswap V3 liquidity works"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Preview <span className="normal-case font-normal text-ink-3 tracking-normal">— public teaser, hook the reader</span>
              </label>
              <textarea
                required
                rows={3}
                value={form.preview_text}
                onChange={(e) => setForm({ ...form, preview_text: e.target.value })}
                placeholder="2–3 sentences that make someone want to buy this block…"
                className={`${inputClass} resize-none`}
              />
            </div>
          </section>

          <div className="h-px bg-rule-faint" />

          {/* Metadata */}
          <section className="flex gap-4">
            <div className="flex-1">
              <label className={labelClass}>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClass}
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="w-36">
              <label className={labelClass}>Price (IP)</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.price_ip}
                onChange={(e) => setForm({ ...form, price_ip: e.target.value.replace(",", ".") })}
                className={`${inputClass} font-mono tabular`}
              />
            </div>
          </section>

          <div className="h-px bg-rule-faint" />

          {/* Content */}
          <section className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Content type</label>
              <div className="flex gap-1.5 flex-wrap">
                {CONTENT_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm({ ...form, content_type: t })}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      form.content_type === t
                        ? "bg-ink text-paper"
                        : "border border-rule text-ink-2 hover:text-ink"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Full content * <span className="normal-case font-normal text-ink-3 tracking-normal">— CDR-encrypted, only buyers see this</span>
              </label>
              {(form.content_type === "markdown" || form.content_type === "text") ? (
                <textarea
                  required
                  rows={10}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    form.content_type === "markdown"
                      ? "Write in markdown…"
                      : "Write your content…"
                  }
                  className={`${inputClass} resize-none font-mono text-xs leading-relaxed`}
                />
              ) : (
                <input
                  type="file"
                  accept={
                    form.content_type === "pdf" ? ".pdf" :
                    form.content_type === "image" ? "image/*" :
                    "video/*"
                  }
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm text-ink-2 file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border file:border-rule file:text-ink file:text-xs file:font-medium file:bg-canvas cursor-pointer"
                />
              )}
            </div>
          </section>

          {error && (
            <p className="text-sm text-[oklch(0.50_0.18_25)] bg-[oklch(0.97_0.03_25)] border border-[oklch(0.88_0.06_25)] rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent hover:bg-accent-hover disabled:bg-rule text-paper disabled:text-ink-3 rounded-xl font-medium text-sm transition-colors"
          >
            {loading ? "Publishing to Story & CDR…" : "Publish block"}
          </button>

        </form>
      </main>
    </div>
  )
}
