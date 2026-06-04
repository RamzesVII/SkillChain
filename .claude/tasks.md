# Tasks

## Remaining (June 1-3)

### Critical for demo
- [ ] Seed 4-5 real Web3 demo blocks (real titles, real content)
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
- [x] app/page.tsx — discovery feed with category filter
- [x] components/BlockCard.tsx — card with bundle toggle
- [x] app/bundle/page.tsx — checkout with sticky summary
- [x] app/api/record-purchase/route.ts — saves purchase after client-side tx
- [x] app/learn/page.tsx — purchased blocks list
- [x] components/ContentViewer.tsx — CDR decrypt + render all content types
- [x] Design system: Tailwind v4 @theme, Fraunces font, masonry layout
- [x] DB migrations: content_type constraint, Predictions category
- [x] Playwright MCP configured (.mcp.json in Story CDR root)
- [x] ROADMAP.md created with v1/v2/v3 plan
