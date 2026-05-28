"use client"

import { usePrivy } from "@privy-io/react-auth"

export function WalletButton() {
  const { ready, authenticated, user, login, logout } = usePrivy()

  if (!ready) {
    return (
      <div className="h-8 w-24 rounded-full bg-rule-faint animate-pulse" />
    )
  }

  if (!authenticated) {
    return (
      <button
        onClick={login}
        className="px-4 py-1.5 rounded-full bg-accent hover:bg-accent-hover text-paper text-sm font-medium transition-colors"
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
      className="px-4 py-1.5 rounded-full border border-rule text-ink-2 text-sm font-mono hover:border-ink-2 transition-colors tabular"
    >
      {short}
    </button>
  )
}
