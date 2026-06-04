# Screens — SkillChain Cyberpunk

Routing in the prototype is client-side state (`route` in `app.jsx`): `home`, `discover`,
`publish`, `library`, `checkout`. Map onto existing Next.js routes as noted. Shared chrome
(topbar + ticker) renders on every screen except inside full-screen overlays.

Shared state (lift into store / context in the real app):
- `bundle: Block[]` — blocks added to the current bundle (toggle add/remove)
- `owned: Block[]` — licensed blocks (seed empty in prod; from chain/Supabase)
- `extra: Block[]` — newly published blocks (prod: persist to Supabase)
- `detail: Block|null` — block open in detail overlay
- `bundleOpen: bool` — bundle slide-over visibility
- Tweaks: `accent`, `glow`, `density`, `animations`, `layout`

---

## Shared chrome
**Topbar** (sticky, blurred): neon logo (click → home) · nav Discover/Publish/Library
(active = gradient text) · search (discover only) · wallet pill (green dot = connected) ·
**Bundle** button with count badge (opens slide-over).
**Ticker**: marquee of `IP-id · title · price` for recent blocks; pauses when animations off.

---

## 1. Home / Hero  →  could be `/` intro or a marketing route
- Full-viewport hero. **Neon perspective grid** along the bottom (animated pan + cursor tilt).
- **Cursor spotlight**: radial neon glow follows the mouse (`--sx/--sy`); mix-blend screen.
- **Logo** with subtle RGB-split glitch layers + parallax on mouse move.
- **Decode headline**: "A marketplace for knowledge that owns itself." resolves from
  scrambled glyphs on load. Seeds already-scrambled (never empty).
- Tagline chip ("Composable Knowledge · On-Chain IP"), two CTAs (Enter / Publish),
  small stat row. All effects disabled when `animations` Tweak is off.

## 2. Discover  →  `/` (home, `app/page.tsx` + `BlockCard`)
- **Header**: kicker "Curated IP Assets · Story Protocol", h1 "Knowledge Blocks", stat trio
  (Assets / Creators / Licenses).
- **Filter bar**: category chips (All, DeFi, Trading, Dev, Research, Growth, Predictions);
  active = gradient. Right-aligned result count. Search filters title/creator/preview/category.
- **Bento grid** (default) — see DESIGN_TOKENS "Layout":
  - Featured card (2×2): Editor's Pick badge, locked media, title, preview, creator,
    license tag, price + Add button. Has cursor 3D tilt.
  - Flip cards: FRONT = index №, type (with 🔒), title, license tag, creator, price;
    tall cards also show a locked media preview; wide cards show a teaser line.
    BACK (on hover flip) = ip·category, full preview, reads, Add-to-bundle button.
  - Clicking a card (not its Add button) → opens **Detail** overlay.
- **Locked media preview** (type-aware, stylized "CDR-Encrypted"):
  - video → blurred frame + play glyph + duration ("10:44") + scanlines
  - image → frosted thumbnail + grid + dimensions ("4096×2160")
  - pdf/markdown/text → redacted fading lines + page/▢ count
  - all carry a "🔒 CDR-Encrypted" chip.

## 3. Publish  →  `/create` (`app/create/page.tsx`)
- Two-column: form (left) + **live preview card** (right, sticky) that updates as you type.
- Fields: creator/alias, title*, preview teaser, category (select), price (IP), content type
  (segmented: markdown/pdf/video/image/text), full content (textarea or file/URL input).
- Hint "🔒 CDR-encrypted · only unlocked for licensees".
- Submit → simulated publish (1.5s) → adds block to Discover, routes home, toast.
  (Prod: encrypt + store via CDR, register IP on Story, persist to Supabase.)

## 4. Library  →  `/learn` (`app/learn/page.tsx` + `ContentViewer`)
- Empty state: "No blocks yet" + Browse CTA.
- Populated: left rail of owned blocks (active = accent left-border) + right **reader**
  (glass) showing "✓ Licensed", title, meta, decrypted body. (Prod: gate on license token,
  decrypt via `ContentViewer`.)

## 5. Checkout / Bundle  →  `/bundle` (`app/bundle/page.tsx`)
- Empty state: "Bundle is empty" + Browse CTA.
- List of bundled blocks (№, title, ip·creator·license, price, remove ✕) + sticky summary:
  subtotal, protocol fee 2.5%, creator royalties "Included", total, **Mint Bundle License**.
- Mint → per-license progress ("Minting license 2 of 3") + gradient bar → on complete,
  blocks move to `owned`, bundle clears, route to Library, toast.
  (Prod: this is the on-chain mint via wagmi/viem — see existing `/bundle` logic + `lib/constants.ts`.)

---

## Bundle slide-over (overlay, any screen)
Scrim + right panel: header (count), list (title, meta, remove), footer with subtotal /
protocol fee 5% / total + **Unlock** → routes to Checkout.
> Note: slide-over shows a 5% fee for a quick estimate; the Checkout page is the source of
> truth (2.5%). Align these in production to one fee model.

## Block detail (overlay, full-screen)
Back bar → kicker (category·type), big title, creator row (avatar, verified ◆), locked hero
visual, two-column: body ("what's inside", provenance) + sticky buy card (price, license/
type/category/IP rows, Add-to-bundle, settle note).

## Tweaks panel (design knob — optional in prod, or a real theme switcher)
Accent (gradient/amber/cyan), Glow/depth slider (0–1), Density (compact/regular/comfy),
Animations toggle, Layout (bento/uniform). Driven entirely by CSS vars on `.app`.
