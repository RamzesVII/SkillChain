"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"

function ScrambleText({ text }: { text: string }) {
  const glyphs = "ABCDEF0123456789/<>$#%&*+="
  const [out, setOut] = useState(() => {
    let s = ""
    for (const ch of text) {
      if (ch === " ") { s += " "; continue }
      s += glyphs[Math.floor(Math.random() * glyphs.length)]
    }
    return s
  })

  useEffect(() => {
    let reveal = 0
    const start = setTimeout(() => {
      const id = setInterval(() => {
        reveal += 0.8
        let s = ""
        for (let i = 0; i < text.length; i++) {
          if (text[i] === " ") { s += " "; continue }
          s += i < Math.floor(reveal) ? text[i] : glyphs[Math.floor(Math.random() * glyphs.length)]
        }
        setOut(s)
        if (reveal >= text.length) { clearInterval(id); setOut(text) }
      }, 28)
      return () => clearInterval(id)
    }, 300)
    return () => clearTimeout(start)
  }, [text])

  return <span>{out}</span>
}

export default function HeroPage() {
  const heroRef = useRef<HTMLElement>(null)
  const [sx, setSx] = useState(50)
  const [sy, setSy] = useState(35)

  const onMove = (e: React.MouseEvent) => {
    const el = heroRef.current; if (!el) return
    const r = el.getBoundingClientRect()
    setSx(((e.clientX - r.left) / r.width) * 100)
    setSy(((e.clientY - r.top) / r.height) * 100)
  }
  const onLeave = () => { setSx(50); setSy(35) }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ position: "relative", minHeight: "calc(100vh - 58px)", overflow: "hidden", display: "flex", flexDirection: "column" }}
      >
        {/* Neon perspective grid */}
        <div style={{
          position: "absolute", left: "50%", bottom: "-2%", width: "200%", height: "62%",
          transform: "translateX(-50%) perspective(420px) rotateX(62deg)",
          backgroundImage: "linear-gradient(oklch(0.7 0.18 330 / 0.32) 1px, transparent 1px), linear-gradient(90deg, oklch(0.7 0.16 200 / 0.22) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "linear-gradient(to top, #000 5%, transparent 75%)",
          WebkitMaskImage: "linear-gradient(to top, #000 5%, transparent 75%)",
          pointerEvents: "none",
          animation: "gridpan 7s linear infinite",
        }} />

        {/* Cursor spotlight */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", mixBlendMode: "screen",
          background: `radial-gradient(260px 260px at ${sx}% ${sy}%, oklch(0.62 0.22 330 / 0.20), oklch(0.55 0.18 280 / 0.10) 45%, transparent 72%)`,
          transition: "background 0.1s linear",
        }} />

        {/* Glow blobs */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(50% 40% at 50% 32%, oklch(0.55 0.2 330 / 0.30), transparent 70%), radial-gradient(40% 36% at 18% 70%, oklch(0.55 0.16 200 / 0.22), transparent 70%)",
        }} />

        {/* Scanlines */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 3, opacity: 0.5,
          background: "repeating-linear-gradient(to bottom, transparent 0 2px, oklch(0 0 0 / 0.22) 2px 4px)",
        }} />

        {/* Inner content */}
        <div style={{ position: "relative", zIndex: 4, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "40px 40px 64px", gap: 0 }}>

          {/* Tagline chip */}
          <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, letterSpacing: 5, textTransform: "uppercase", color: "oklch(0.78 0.10 200)", display: "flex", alignItems: "center", gap: 12, marginBottom: 34, whiteSpace: "nowrap" }}>
            <span style={{ width: 36, height: 1, background: "linear-gradient(90deg, transparent, oklch(0.7 0.14 200))", display: "inline-block" }} />
            COMPOSABLE KNOWLEDGE · ONCHAIN IP
            <span style={{ width: 36, height: 1, background: "linear-gradient(90deg, oklch(0.7 0.14 330), transparent)", display: "inline-block" }} />
          </div>

          {/* Logo with glitch */}
          <div style={{ position: "relative", width: "min(820px, 82vw)", margin: "0 auto" }}>
            <Image
              src="/skillchain-logo-cut.png"
              alt="SkillChain"
              width={820}
              height={160}
              style={{ display: "block", width: "100%", height: "auto", filter: "drop-shadow(0 0 22px oklch(0.6 0.22 330 / 0.55)) drop-shadow(0 0 50px oklch(0.55 0.2 320 / 0.35))" }}
              priority
            />
            <div className="hero-glitch-c" style={{ position: "absolute", inset: 0, backgroundImage: "url(/skillchain-logo-cut.png)", backgroundSize: "100% 100%", backgroundRepeat: "no-repeat", opacity: 0, filter: "drop-shadow(2px 0 0 oklch(0.7 0.2 200))" }} />
            <div className="hero-glitch-m" style={{ position: "absolute", inset: 0, backgroundImage: "url(/skillchain-logo-cut.png)", backgroundSize: "100% 100%", backgroundRepeat: "no-repeat", opacity: 0, filter: "drop-shadow(-2px 0 0 oklch(0.7 0.22 340))" }} />
          </div>

          {/* Headline */}
          <div style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 500, fontSize: 30, lineHeight: 1.18, letterSpacing: "-0.4px", color: "var(--ink)", maxWidth: "18ch", margin: "30px auto 0", textWrap: "balance" } as React.CSSProperties}>
            <ScrambleText text="A marketplace for knowledge that owns itself" />
          </div>

          {/* Lede */}
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--ink-2)", maxWidth: "54ch", margin: "20px auto 0", textWrap: "pretty" } as React.CSSProperties}>
            Each block is a CDR-encrypted IP asset on Story Protocol. Bundle blocks from multiple creators, mint a single composable license, and unlock the content - royalties split onchain automatically, no middlemen.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 14, marginTop: 38, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/discover" className="grad-btn">Enter the marketplace →</Link>
            <Link href="/create" className="ghost-btn">Publish a skill</Link>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ position: "relative", zIndex: 4, display: "flex", justifyContent: "center", gap: 0, borderTop: "1px solid var(--line)", background: "oklch(0.085 0.012 320 / 0.55)", backdropFilter: "blur(6px)" }}>
          {[
            { n: "247", label: "Knowledge Blocks" },
            { n: "89",  label: "Verified Creators" },
            { n: "1.4K", label: "Licenses Minted" },
            { n: "100%", label: "Onchain Royalties" },
          ].map(({ n, label }) => (
            <div key={label} style={{ flex: 1, maxWidth: 240, textAlign: "center", padding: "22px 10px", borderRight: "1px solid var(--line-soft)" }}>
              <b className="grad-text" style={{ display: "block", fontFamily: "var(--font-geist-mono)", fontSize: 26, fontWeight: 600, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{n}</b>
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", color: "var(--ink-3)" }}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY SKILLCHAIN ───────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1480, margin: "0 auto", padding: "96px 40px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 54 }}>
          <div className="grad-text" style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, letterSpacing: 4, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>
            Why SkillChain
          </div>
          <div style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 500, fontSize: 42, letterSpacing: "-0.7px" }}>
            Knowledge as a composable asset
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            {
              ico: "◆", n: "01",
              h: "CDR-encrypted, not paywalled",
              p: "Content lives in a threshold-encrypted CDR vault. No platform key, no login. The only way to unlock it is to hold a Story Protocol license token in your wallet.",
            },
            {
              ico: "⧉", n: "02",
              h: "Bundle many, one transaction",
              p: "Add blocks from multiple creators to your bundle. One Story Protocol transaction mints individual license tokens for each - royalties split to creators automatically, onchain.",
            },
            {
              ico: "↻", n: "03",
              h: "Creators own their IP",
              p: "Every block is registered as an IP asset on Story Protocol. Sales, license history, and earnings are onchain - visible in Story Explorer, forever. No platform can take it away.",
            },
          ].map(({ ico, n, h, p }) => (
            <div key={n} style={{ position: "relative", borderRadius: 10, padding: 30, overflow: "hidden", background: "linear-gradient(160deg, oklch(0.18 0.014 320 / 0.8), oklch(0.13 0.012 320 / 0.7))", border: "1px solid var(--line)", transition: "border-color .25s, transform .25s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.42 0.06 340)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--line)"; (e.currentTarget as HTMLElement).style.transform = ""; }}
            >
              <div style={{ position: "absolute", top: 24, right: 26, fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 40, color: "oklch(0.5 0.1 340 / 0.3)" }}>{ico}</div>
              <div className="grad-text" style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, letterSpacing: 2 }}>{n}</div>
              <h3 style={{ fontFamily: "var(--font-fraunces)", fontWeight: 600, fontSize: 22, lineHeight: 1.15, letterSpacing: "-0.3px", margin: "18px 0 12px" }}>{h}</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "var(--ink-2)", margin: 0 }}>{p}</p>
            </div>
          ))}
        </div>

        {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: 54, marginTop: 96 }}>
          <div className="grad-text" style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, letterSpacing: 4, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>
            How it works
          </div>
          <div style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 500, fontSize: 42, letterSpacing: "-0.7px" }}>
            Three steps to a license
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, marginTop: 14, border: "1px solid var(--line)", borderRadius: 10, overflow: "hidden" }}>
          {[
            { n: "01", h: "Discover & bundle", p: "Browse DeFi alpha, trading setups, dev guides, and predictions. Preview is public - content is CDR-encrypted. Add the blocks you want to your bundle." },
            { n: "02", h: "Mint the license",  p: "Your wallet signs one Story Protocol transaction. Individual license tokens mint for each block - creator royalties split onchain automatically, no intermediaries." },
            { n: "03", h: "CDR unlocks the content", p: "CDR validators check your wallet holds the license token. Threshold decryption runs - encrypted content appears in your library instantly. No platform key, no middleman." },
          ].map(({ n, h, p }, i, arr) => (
            <div key={n} style={{ padding: "34px 30px", borderRight: i < arr.length - 1 ? "1px solid var(--line-soft)" : "none", position: "relative" }}>
              <div className="grad-text" style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 500, fontSize: 46, lineHeight: 1 }}>{n}</div>
              <h4 style={{ fontFamily: "var(--font-fraunces)", fontWeight: 600, fontSize: 18, margin: "16px 0 9px", letterSpacing: "-0.2px" }}>{h}</h4>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--ink-2)", margin: 0 }}>{p}</p>
            </div>
          ))}
        </div>

        {/* ── FINAL CTA ─────────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", padding: "90px 0 60px" }}>
          <div className="grad-text" style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, letterSpacing: 4, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>
            Start now
          </div>
          <div style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 500, fontSize: 42, letterSpacing: "-0.7px" }}>
            Plug into the chain of knowledge
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 30, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/discover" className="grad-btn">Enter the marketplace →</Link>
            <Link href="/create" className="ghost-btn">Publish a skill</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
