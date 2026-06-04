"use client"

import { usePrivy } from "@privy-io/react-auth"

export function WalletButton() {
  const { ready, authenticated, user, login, logout } = usePrivy()

  if (!ready) return <div className="w-24 h-4 bg-rule-faint animate-pulse" />

  if (!authenticated) {
    return (
      <button
        onClick={login}
        className="border border-rule px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-ink-2 hover:text-ink hover:border-rule transition-colors"
      >
        Connect
      </button>
    )
  }

  const address = user?.wallet?.address
  const short = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "Connected"

  return (
    <button
      onClick={logout}
      className="flex items-center gap-2 font-mono text-[11px] text-ink-2 hover:text-ink transition-colors tabular"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
      {short}
    </button>
  )
}
