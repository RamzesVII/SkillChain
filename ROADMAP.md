# SkillChain Roadmap

## v1 — Hackathon MVP (June 3, 2026)
- [x] Creator upload: CDR-encrypted blocks + Story IP registration
- [x] Discovery feed with category filters + bento grid
- [x] Bundle builder with slide-over drawer
- [x] Purchase flow: client-side Story `mintLicenseTokens`
- [x] CDR decrypt: buyer wallet unlocks content
- [x] Cyberpunk redesign: hero landing, flip cards, locked media previews
- [x] Seed 12 real Web3 demo blocks
- [ ] Deploy to Vercel

---

## v2 — Revenue & Growth

### Platform Revenue
- **10% commercialRevShare** — Story Protocol routes 10% of every purchase to the platform wallet automatically, on-chain. No off-chain payment logic.
- **Featured slots** — creators pay to appear at the top of the feed (promoted blocks)
- **Creator Pro** — subscription for verified badge + sales analytics dashboard

### Creator Tools
- Sales dashboard: earnings, license token holders, views
- Block analytics: conversion rate (views → purchases)
- Bulk upload / series (linked blocks)

### Learner Experience
- Learning paths: curated sequences of blocks
- Progress tracking
- "Already purchased" indicator across sessions (on-chain lookup)

---

## v3 — Composability

### Derivative Works (Story Protocol native)
- Creators can build on top of existing blocks → royalties flow upstream automatically
- "Remix" a block: fork + extend + publish as derivative IP

### On-chain Creator Verification
Верификация через агрегацию публичных onchain-данных кошелька — без OAuth, без KYC.

**Сигналы (читаются через публичные RPC / индексеры):**
- **Story Protocol** — количество зарегистрированных IP assets, история роялти, производных работ
- **DeFi активность** — LP позиции (Uniswap, Curve), история свопов, TVL в протоколах
- **Trading** — объём транзакций, взаимодействие с DEX/CEX-мостами, исторический PnL
- **Ecosystem** — участие в governance (Snapshot), DAO-активность, NFT ownership
- **Reputation score** — взвешенная сумма сигналов → числовой рейтинг + уровень бейджа

**Уровни верификации:**
- ◆ `Verified` — подтверждён как активный Web3 участник (базовый порог)
- ◆◆ `Expert` — высокая DeFi/trading активность + Story IP история
- ◆◆◆ `Elite` — топ-100 по cumulative onchain score

**Реализация:**
- API route `/api/verify-creator?address=0x...` — агрегирует данные через Alchemy/The Graph/Dune
- Кэш в Supabase (re-check раз в 24h)
- Бейдж отображается на BlockCard и профиле создателя

### Leaderboard
- Топ creators по: revenue, licenses sold, remix count
- Публичный онchain-доступный рейтинг

### Multi-chain / Mainnet
- Migrate from Aeneid testnet to Story mainnet
- Real IP token payments