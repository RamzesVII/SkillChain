# Tasks

## Active (Day 1 — May 27)

### Blocked on user input
- [ ] Fill .env.local: need Pinata API key, Supabase URL+keys, WalletConnect project ID

### Ready to build (once env ready)
- [ ] lib/supabase.ts — createClient + createAdminClient
- [ ] lib/story.ts — StoryClient wrapper: registerIpAsset, attachLicenseTerms, mintLicenseTokens
- [ ] lib/cdr.ts — CDRClient wrapper: uploadFile (server), downloadFile (client)
- [ ] lib/providers.tsx — RainbowKit + wagmi config (Aeneid chain)
- [ ] Update app/layout.tsx — wrap with Providers
- [ ] Supabase: create blocks + purchases tables (SQL migration)
- [ ] Test: CDR uploadFile with GatewayProvider + Pinata (small text file)
- [ ] Test: CDR downloadFile with license token condition

## Day 2 (May 28)
- [ ] app/create/page.tsx — form: title, preview_text, category, price, file upload
- [ ] app/api/upload/route.ts — CDR encrypt → Pinata → Story registerIp → save to Supabase
- [ ] Test: full creator flow end-to-end

## Day 3 (May 29)
- [ ] app/page.tsx — discovery feed: grid of BlockCard components
- [ ] components/BlockCard.tsx — preview card with lock icon + add to bundle button
- [ ] components/BundleDrawer.tsx — side panel with bundle contents + total price

## Day 4 (May 30)
- [ ] app/api/purchase/route.ts — mintLicenseTokens for all bundle blocks
- [ ] app/bundle/page.tsx — checkout page
- [ ] Save purchases to Supabase after tx confirms

## Day 5 (May 31)
- [ ] app/learn/page.tsx — purchased blocks view
- [ ] components/ContentViewer.tsx — CDR downloadFile + render (video/pdf/markdown)
- [ ] app/api/verify-license/route.ts — check license ownership on-chain
- [ ] E2E test: create → buy → access

## Day 5.5 — Creator profile page (added)
- [ ] app/creator/[address]/page.tsx — профиль: список блоков, кол-во продаж, бандлы, накопленные роялти
- [ ] Читать данные из Supabase (purchases) + Story explorer API для роялти
- [ ] Verified badge на основе on-chain истории

## Day 6 (June 1-2)
- [ ] UI polish with Claude (feed layout, cards, bundle drawer)
- [ ] Seed 4-5 real Web3 demo blocks
- [ ] Deploy to Vercel
- [ ] Fix any bugs from testing

## Day 7 (June 3)
- [ ] Record demo video (creator uploads → learner buys → CDR unlocks)
- [ ] Prepare submission text (why CDR, why Story, real use case)
- [ ] Submit before deadline

## Completed
- [x] Next.js project created
- [x] Dependencies installed
- [x] .env.local.example created
- [x] Project directories created
- [x] .claude second brain created
