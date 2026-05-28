"use client"

import { usePrivy } from "@privy-io/react-auth"

export function WalletButton() {
  const { ready, authenticated, user, login, logout } = usePrivy()

  if (!ready) return <button className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-400 text-sm">Loading...</button>

  if (!authenticated) {
    return (
      <button
        onClick={login}
        className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
      >
        Connect
      </button>
    )
  }

  const address = user?.wallet?.address
  const short = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connected"

  return (
    <button
      onClick={logout}
      className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition-colors"
    >
      {short}
    </button>
  )
}
