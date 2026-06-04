"use client"

import { useState } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { Navbar } from "@/components/Navbar"
import { useRouter } from "next/navigation"

const CATEGORIES = ["DeFi", "Trading", "Dev", "Research", "Growth", "Predictions"]
const CONTENT_TYPES = ["markdown", "pdf", "video", "image", "text"] as const

const inputClass = "w-full bg-paper border border-rule-faint px-4 py-2.5 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:border-rule transition-colors font-mono"
const labelClass = "block font-mono text-[10px] uppercase tracking-widest text-ink-3 mb-1.5"

export default function CreatePage() {
  const { authenticated, user, login } = usePrivy()
  const router = useRouter()

  const [form, setForm] = useState({
    title: "", preview_text: "", category: "DeFi",
    price_ip: "0.1", content_type: "markdown" as typeof CONTENT_TYPES[number], creator_name: "",
  })
  const [content, setContent] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState("")
  const [error, setError] = useState("")
  const [toast, setToast] = useState("")

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(""), 3500)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authenticated || !user?.wallet?.address) return
    setLoading(true)
    setError("")
    setStep("Registering on Story Protocol...")
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => formData.append(k, v))
      formData.append("creator_address", user.wallet.address)
      if (form.content_type === "markdown" || form.content_type === "text") {
        formData.append("content", content)
      } else if (file) {
        formData.append("file", file)
      }

      // Step 1 takes ~20s (Story tx), step 2 takes ~10s (CDR)
      const timer = setTimeout(() => setStep("Encrypting with CDR..."), 22000)
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      clearTimeout(timer)

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Upload failed")
      showToast("✓ Block registered on Story Protocol")
      setTimeout(() => router.push("/discover"), 1500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
      setStep("")
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-canvas">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <h1 className="font-display italic text-3xl text-ink">Publish your knowledge.</h1>
          <p className="font-mono text-[10px] text-ink-3 uppercase tracking-widest">Connect your wallet to create a block</p>
          <button onClick={login} className="mt-2 px-6 py-2 border border-rule text-ink text-[11px] font-bold uppercase tracking-widest hover:border-ink transition-colors">
            Connect wallet
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      {/* Toast notification */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 30, left: "50%", transform: "translateX(-50%)",
          zIndex: 80, background: "var(--grad)", color: "#fff",
          fontFamily: "var(--font-geist-mono)", fontSize: 11, fontWeight: 700,
          letterSpacing: 1.5, textTransform: "uppercase",
          padding: "14px 24px", borderRadius: 6,
          boxShadow: "0 16px 40px -12px oklch(0.55 0.2 340 / 0.9)",
          animation: "toastin 0.35s cubic-bezier(.2,.8,.25,1)",
          whiteSpace: "nowrap",
        }}>
          {toast}
        </div>
      )}

      <style>{`
        @keyframes toastin {
          from { opacity: 0; transform: translate(-50%, 16px); }
          to   { opacity: 1; transform: translateX(-50%); }
        }
      `}</style>
      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <p className="font-mono text-[9px] uppercase tracking-widest text-ink-3 mb-1">Creator</p>
          <h1 className="font-display italic text-3xl text-ink">New block</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Your name</label>
              <input value={form.creator_name} onChange={(e) => setForm({ ...form, creator_name: e.target.value })} placeholder="name or alias" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Title *</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. How Uniswap V3 liquidity works" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Preview — public teaser</label>
              <textarea required rows={3} value={form.preview_text} onChange={(e) => setForm({ ...form, preview_text: e.target.value })} placeholder="2–3 sentences that make someone want to buy this…" className={`${inputClass} resize-none`} />
            </div>
          </div>

          <div className="h-px bg-rule-faint" />

          <div className="flex gap-4">
            <div className="flex-1">
              <label className={labelClass}>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="w-32">
              <label className={labelClass}>Price (IP)</label>
              <input type="number" min="0.01" step="0.01" value={form.price_ip} onChange={(e) => setForm({ ...form, price_ip: e.target.value.replace(",", ".") })} className={`${inputClass} tabular`} />
            </div>
          </div>

          <div className="h-px bg-rule-faint" />

          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Content type</label>
              <div className="flex gap-1.5 flex-wrap">
                {CONTENT_TYPES.map((t) => (
                  <button key={t} type="button" onClick={() => setForm({ ...form, content_type: t })}
                    className={`px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest transition-colors border ${
                      form.content_type === t ? "border-accent text-accent" : "border-rule-faint text-ink-3 hover:text-ink"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Full content * — CDR-encrypted</label>
              {(form.content_type === "markdown" || form.content_type === "text") ? (
                <textarea required rows={10} value={content} onChange={(e) => setContent(e.target.value)} placeholder={form.content_type === "markdown" ? "Write in markdown…" : "Write your content…"} className={`${inputClass} resize-none text-xs leading-relaxed`} />
              ) : (
                <input type="file"
                  accept={form.content_type === "pdf" ? ".pdf" : form.content_type === "image" ? "image/*" : "video/*"}
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="w-full text-xs text-ink-2 file:mr-3 file:py-1.5 file:px-4 file:border file:border-rule-faint file:text-ink file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-transparent cursor-pointer"
                />
              )}
            </div>
          </div>

          {error && (
            <p className="font-mono text-[10px] text-[oklch(0.70_0.14_25)] bg-[oklch(0.16_0.04_25)] border border-[oklch(0.28_0.06_25)] px-3 py-2">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="w-full py-3 bg-accent hover:bg-accent-hover disabled:bg-rule text-canvas disabled:text-ink-3 text-[10px] font-bold uppercase tracking-widest transition-colors">
            {loading ? (step || "Publishing to Story & CDR…") : "Publish block"}
          </button>

        </form>
      </main>
    </div>
  )
}
