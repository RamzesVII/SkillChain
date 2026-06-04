# Design Tokens — SkillChain Cyberpunk

All tokens live as CSS custom properties on `.app` in `app.css`. Port these into the
codebase's Tailwind v4 `@theme` block (or `globals.css`). Colors are authored in **oklch**
— keep oklch (wide gamut, easy lightness tweaks) or convert to hex as noted.

## Typography
| Role | Font | Notes |
|------|------|-------|
| Display / headings | **Fraunces** | serif; headings use `font-style: italic`, weight 500–600, negative letter-spacing (~-0.5 to -1px) |
| Body / UI | **Geist** | sans-serif, weight 400–700 |
| Labels, numbers, mono | **Geist Mono** | uppercase labels, `letter-spacing: 1.5–4px`, `font-variant-numeric: tabular-nums` |

Already wired in `app/layout.tsx` via `next/font/google` (Fraunces, Geist, Geist_Mono).

Type scale (px): hero ~ clamp/large; h1 page 50; section h1 46; featured title 32–34;
detail title 48; card title 16–20; body 14–16; mono labels 9–11.

## Color tokens (defaults = "gradient"/cyberpunk accent)
```
--bg:        oklch(0.105 0.013 320)   /* page background (≈ #15101a) */
--panel:     oklch(0.145 0.014 320)   /* card/panel base */
--line:      oklch(0.26 0.012 320)    /* borders */
--line-soft: oklch(0.20 0.010 320)    /* subtle dividers */
--ink:       oklch(0.94 0.008 320)    /* primary text */
--ink-2:     oklch(0.66 0.010 320)    /* secondary text */
--ink-3:     oklch(0.50 0.008 320)    /* tertiary / mono labels */
```

## Accent system (3 themes — user-switchable via Tweaks)
Each theme sets `--a1`, `--a2` (gradient stops), `--asolid` (solid accent for text/borders),
`--aglowH` (glow hue). The gradient is `--grad: linear-gradient(115deg, var(--a1), var(--a2))`.
```
gradient (default):  --a1 oklch(0.68 0.20 30)   --a2 oklch(0.62 0.21 320)
                     --asolid oklch(0.72 0.18 350)   --aglowH 340
                     (red→purple neon; hex ≈ #d8543a → #a24bd8)
amber:               --a1 oklch(0.70 0.19 45)   --a2 oklch(0.82 0.16 80)
                     --asolid oklch(0.78 0.15 62)    --aglowH 55
cyan:                --a1 oklch(0.72 0.13 195)  --a2 oklch(0.66 0.14 222)
                     --asolid oklch(0.74 0.13 198)   --aglowH 200
```
`--aglow` (0–1, default 0.55) scales glow/shadow intensity globally.

## License color coding (by content type)
```
commercial (pdf/video): oklch(0.72 0.15 150)  /* green  */
remix (image):          oklch(0.74 0.17 55)   /* orange */
read (markdown/text):   oklch(0.68 0.14 245)  /* blue   */
```
License labels: COMMERCIAL-USE, REMIX-ONLY, READ-ONLY. Type codes: MD, TXT, PDF, VID, IMG.

## Radii
Cards/panels 8px; media previews & chips 5–6px; small tags 3px; avatars/dots 50%.

## Shadows / glow (driven by `--aglowH` + `--aglow`)
- Card rest: `0 22px 50px -24px rgba(0,0,0,0.7)` + `inset 0 1px 0 oklch(0.5 0.02 320/.14)`
- Card hover adds: `0 0 60px -16px oklch(0.5 0.18 var(--aglowH) / calc(var(--aglow)*0.9))`
- Accent buttons: `0 10px 28px -10px oklch(0.55 0.2 var(--aglowH) / 0.8)`

## Glass surface (`.glass`)
`background: linear-gradient(160deg, oklch(0.20 0.015 320/.82), oklch(0.14 0.013 320/.7));`
`border: 1px solid oklch(0.30 0.014 320/.7); backdrop-filter: blur(12px);`

## Atmosphere (on `.app::before` / `::after`)
- Two radial neon glows top-right + bottom-left, tinted by `--aglowH`, scaled by `--aglow`
- Fine fractal-noise SVG overlay at ~0.035 opacity

## Spacing
Page gutters 40px; max content width 1480px (discover) / 1080px (detail). Grid gap 16–24px
by density. Card padding 20–22px; featured/detail 26–30px.

## Layout: bento grid (default) vs uniform (Tweak)
- 4-col grid; `grid-auto-flow: dense; grid-auto-rows: ~236px`.
- **Featured** = top-read block, spans 2×2, shows locked media + preview.
- **Wide** (`span 2`) = most-read *text* blocks, show a teaser line.
- **Tall** (`row span 2`) = *video/image* blocks, show a locked media preview.
- Size is a curatorial signal tied to content kind, not random.

## Animations (all gated by `.app.noanim` when Tweaks "Animations" is off)
- Card entrance: fade+rise 0.55s cubic-bezier(.2,.7,.3,1), staggered 0.05s.
- Flip card: `rotateY(180deg)` 0.55s cubic-bezier(.3,.8,.3,1) on hover.
- Hero decode: headline scrambles glyphs → resolves char-by-char (~setInterval 28ms).
- Hero cursor: neon radial spotlight follows `--sx/--sy`; grid tilts via `--gz`; logo parallax.
- Ticker marquee: 34s linear infinite.
- Checkout mint: per-license progress bar + spinner.
- Toast: slide-up 0.35s.
- 3D tilt on featured/glass cards: `perspective(900px) rotateX/Y` from cursor position.
