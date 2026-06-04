# Project Status

## Product
SkillChain — "TikTok for Web3 knowledge blocks"
Hackathon: CDR Hackathon @ Story Protocol | Deadline: June 3, 2026
Track: Best CDR Application ($1k + $1k runner-up)
Repo: https://github.com/RamzesVII/SkillChain

## Current Phase
Day 5 of 7 — Polish + Seed + Deploy

## Done
- [x] Full stack setup: Next.js 14, Privy auth, wagmi, Supabase, Tailwind v4
- [x] Creator upload flow: Story IP registration + CDR vault + Supabase save
- [x] Discovery feed with category filters (DeFi, Trading, Dev, Research, Growth, Predictions)
- [x] Bundle builder (Zustand store, sticky summary panel)
- [x] Purchase flow: client-side Story mintLicenseTokens (user wallet signs)
- [x] /api/record-purchase: saves tx result to Supabase
- [x] CDR decrypt: ContentViewer with buyer wallet (markdown/pdf/video/image/text)
- [x] Design system: Tailwind v4 @theme tokens, Fraunces serif, masonry layout
- [x] Playwright MCP connected for browser testing
- [x] ROADMAP.md with revenue model

## In Progress
- [ ] Seed 4-5 real Web3 demo blocks
- [ ] Deploy to Vercel

## Blockers
- Platform wallet needs IP tokens on Aeneid to pay minting fees for demo purchases
- Faucet: https://faucet.story.foundation