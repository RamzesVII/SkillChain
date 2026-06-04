"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { WalletButton } from "./WalletButton"
import { useBundleStore } from "@/lib/bundle"

const NAV = [
  { label: "Discover", href: "/discover" },
  { label: "Publish",  href: "/create" },
  { label: "Library",  href: "/learn" },
]

export function Navbar() {
  const pathname = usePathname()
  const { items } = useBundleStore()

  return (
    <nav style={{ display: "flex", alignItems: "center", gap: 30, padding: "0 40px", height: 58, borderBottom: "1px solid var(--line)", position: "sticky", top: 0, zIndex: 40, background: "oklch(0.105 0.013 320 / 0.78)", backdropFilter: "blur(14px)" }}>
      {/* Logo */}
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
        <Image
          src="/skillchain-logo-cut.png"
          alt="SkillChain"
          width={120}
          height={24}
          style={{ height: 24, width: "auto", filter: "drop-shadow(0 0 6px oklch(0.62 0.22 330 / 0.6)) drop-shadow(0 0 14px oklch(0.55 0.2 320 / 0.35))", transition: "filter .2s, transform .2s" }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.filter = "drop-shadow(0 0 8px oklch(0.66 0.24 330 / 0.85)) drop-shadow(0 0 20px oklch(0.6 0.22 320 / 0.5))")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.filter = "drop-shadow(0 0 6px oklch(0.62 0.22 330 / 0.6)) drop-shadow(0 0 14px oklch(0.55 0.2 320 / 0.35))")}
        />
      </Link>

      {/* Nav links */}
      <div style={{ display: "flex", gap: 22, fontFamily: "var(--font-geist-mono)", fontSize: 10.5, letterSpacing: 2, textTransform: "uppercase", color: "var(--ink-3)" }}>
        {NAV.map(({ label, href }) => {
          const active = pathname === href || (href === "/discover" && pathname === "/discover")
          return (
            <Link
              key={href}
              href={href}
              style={{ textDecoration: "none", transition: "color .15s", ...(active ? { color: "transparent", background: "var(--grad)", WebkitBackgroundClip: "text", backgroundClip: "text", fontWeight: 700 } : { color: "var(--ink-3)" }) }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = "var(--ink)" }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = "var(--ink-3)" }}
            >
              {label}
            </Link>
          )
        })}
      </div>

      {/* Right side */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
        <WalletButton />

        {/* Bundle button */}
        <Link
          href="/bundle"
          style={{ position: "relative", background: "var(--grad)", color: "#fff", border: "none", borderRadius: 5, padding: "10px 16px", fontFamily: "var(--font-geist-mono)", fontSize: 10.5, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 6px 20px -8px oklch(0.55 0.2 340 / 0.8)", transition: "transform .15s, box-shadow .15s", textDecoration: "none" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 26px -8px oklch(0.55 0.2 340 / 0.9)" }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px -8px oklch(0.55 0.2 340 / 0.8)" }}
        >
          Bundle
          {items.length > 0 && (
            <span style={{ background: "oklch(1 0 0 / 0.22)", borderRadius: 20, minWidth: 20, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, padding: "0 5px" }}>
              {items.length}
            </span>
          )}
        </Link>
      </div>
    </nav>
  )
}
