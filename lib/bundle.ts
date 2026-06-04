import { create } from "zustand"
import type { Block } from "./supabase"

type BundleStore = {
  items: Block[]
  isOpen: boolean
  add: (block: Block) => void
  remove: (id: string) => void
  clear: () => void
  total: () => number
  openDrawer: () => void
  closeDrawer: () => void
  toggleDrawer: () => void
}

export const useBundleStore = create<BundleStore>((set, get) => ({
  items: [],
  isOpen: false,
  add: (block) => {
    if (get().items.find((b) => b.id === block.id)) return
    set((s) => ({ items: [...s.items, block] }))
  },
  remove: (id) => set((s) => ({ items: s.items.filter((b) => b.id !== id) })),
  clear: () => set({ items: [] }),
  total: () => get().items.reduce((sum, b) => sum + parseFloat(b.price_ip), 0),
  openDrawer: () => set({ isOpen: true }),
  closeDrawer: () => set({ isOpen: false }),
  toggleDrawer: () => set((s) => ({ isOpen: !s.isOpen })),
}))
