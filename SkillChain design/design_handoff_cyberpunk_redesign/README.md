# Handoff: SkillChain — Cyberpunk UI Redesign

## Overview
A full visual redesign + clickable prototype for **SkillChain** — a Web3 marketplace
for composable "Knowledge Blocks" (on-chain IP assets built on Story Protocol).
Users browse curated knowledge blocks, flip cards to preview, bundle several blocks,
and mint a single composable license. Creators publish new blocks.

The aesthetic is **editorial × cyberpunk**: warm-dark background, serif display type,
a red→purple neon gradient accent, glass cards with depth, locked "CDR-Encrypted"
content previews, and a cursor-reactive hero.

## About the Design Files
The files in this bundle are **design references created in HTML/CSS/React (Babel JSX)** —
prototypes showing the intended look and behavior. They are **not** production code to
ship directly. The task is to **recreate these designs in the existing SkillChain
codebase** (Next.js App Router + React + Tailwind v4 + Supabase + Privy/wagmi — see
`skillchain-safe/`), using its established components and patterns.

Map the prototype's screens onto the real routes/components rather than dropping in the
HTML. The prototype runs on **mock data** (`lib/data.js`); wire the real data layer in.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, interactions, and animations are
all intentional. Recreate the UI faithfully (pixel-level intent), but using the
codebase's real component library, fonts (already wired via `next/font`), and data.

## Target codebase (existing)
- **Next.js** (App Router), React, TypeScript
- **Tailwind CSS v4** (`@theme` tokens in `app/globals.css`)
- **Supabase** (block data), **Privy** + **wagmi/viem** (wallet, on-chain license mint)
- Existing components: `Navbar`, `BlockCard`, `BundleSidebar`, `BundleBar`, `ContentViewer`
- Existing routes: `/` (discover), `/create` (publish), `/learn` (library), `/bundle` (checkout)

The prototype's screens map 1:1 onto these routes — see "Screens" below.

## Files in this bundle
- `SkillChain Discover Prototype.html` — entry; loads all CSS + JSX
- `app.jsx` — root app: routing (home/discover/publish/library/checkout), state, Tweaks
- `app.css` — global tokens + topbar, ticker, discover grid, cards, locked media preview
- `overlays.css` — bundle slide-over + block detail screen + toast
- `screens.css` — publish / library / checkout screens
- `hero.css` — landing/hero (neon grid, cursor spotlight, glitch logo, decode text)
- `components/cards.jsx` — Tilt, locked media preview, Featured card, Flip card
- `components/bundle.jsx` — bundle slide-over sidebar
- `components/detail.jsx` — block detail screen
- `components/publish.jsx` — publish form + live preview card
- `components/library.jsx` — owned blocks + reader
- `components/checkout.jsx` — bundle mint flow
- `components/hero.jsx` — hero/landing
- `lib/data.js` — mock blocks + license/type maps (REPLACE with real data)
- `assets/skillchain-logo-cut.png` — neon wordmark logo
- `DESIGN_TOKENS.md` — all colors, type, spacing, radii, shadows, animations
- `SCREENS.md` — per-screen layout, components, interactions, state

## Where to start
1. Read `DESIGN_TOKENS.md` → port tokens into Tailwind `@theme` / `globals.css`.
2. Read `SCREENS.md` → recreate each screen on its existing route.
3. Reference the HTML/JSX files for exact markup, class structure, and animation timing.

## Assets
- `assets/skillchain-logo-cut.png` — neon SkillChain wordmark (used in topbar + hero).
- All other visuals are CSS-generated (gradients, glass, neon grid, locked previews).
  The "locked media previews" are stylized placeholders — in production, creators upload
  real cover art / thumbnails; the encrypted teaser is the fallback for locked content.

## Notes
- Anthropic API / external services are NOT used. No keys required.
- Fonts: **Fraunces** (display, italic), **Geist** (body), **Geist Mono** (labels/numbers)
  — already wired in `skillchain-safe/app/layout.tsx` via `next/font/google`.
