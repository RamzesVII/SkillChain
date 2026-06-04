# Tasks

## Remaining (June 4 — deadline day)

### Critical for demo
- [ ] Fund platform wallet with IP tokens (faucet.story.foundation) for purchase testing
- [ ] E2E test: create block → add to bundle → buy → CDR unlock
- [ ] Deploy to Vercel

### Submission (June 3)
- [ ] Record demo video: creator uploads → learner buys → CDR unlocks content
- [ ] Write submission text: why CDR, why Story, revenue model (commercialRevShare)
- [ ] Submit before deadline

### Nice to have
- [ ] commercialRevShare: 10% platform fee in PIL terms (lib/story.ts)
- [ ] Creator profile page /creator/[address]
- [ ] "Already purchased" indicator on BlockCard

---

## Completed
- [x] Next.js 14 project + full dependency setup
- [x] Supabase schema: blocks, purchases tables + cdr-content bucket
- [x] lib/supabase.ts, lib/story.ts, lib/cdr.ts, lib/bundle.ts, lib/providers.tsx
- [x] Privy auth (email + wallet, Aeneid chain)
- [x] app/create/page.tsx — creator upload form (5 content types)
- [x] app/api/upload/route.ts — Story register + CDR vault + Supabase insert
- [x] app/discover/page.tsx — bento grid discover with bento layout + ticker
- [x] app/page.tsx — hero landing (neon grid, cursor spotlight, scramble text, why/how)
- [x] components/BlockCard.tsx — flip card with locked CDR media preview
- [x] components/Navbar.tsx — SkillChain logo, gradient Bundle button
- [x] components/Ticker.tsx — marquee ticker
- [x] app/bundle/page.tsx — checkout with sticky summary
- [x] app/api/record-purchase/route.ts — saves purchase after client-side tx
- [x] app/learn/page.tsx — purchased blocks list
- [x] components/ContentViewer.tsx — CDR decrypt + render all content types
- [x] Cyberpunk design system: globals.css dark tokens, glass, flip card, hero CSS
- [x] DB migrations: content_type constraint, Predictions category
- [x] Playwright MCP configured (.mcp.json in Story CDR root)
- [x] ROADMAP.md created with v1/v2/v3 plan
- [x] Seeded 12 real Web3 demo blocks (DeFi/Trading/Dev/Research/Growth/Predictions)
