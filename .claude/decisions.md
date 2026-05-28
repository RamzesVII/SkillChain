# Architectural Decisions

## Core framing (updated after Jacob's feedback)
**Два главных героя: creator и learner.**

**Creator:** публикует talent как on-chain IP → CDR защищает контент → Story регистрирует провенанс → каждая продажа = роялти + рост on-chain репутации. Верификация и монетизация — одно действие.

**Learner:** находит верифицированных экспертов в ленте → собирает персональный бандл → платит один раз → Story автоматически делит между авторами.

Ключевой инсайт от Jacob (судья): он говорил про creator-path — "человек приходит с талантом, верифицирует его, начинает зарабатывать". Это снимает проблему трафика для демо: нужно показать путь creator'а, а не 1000 пользователей.

On-chain верификация = чтение истории: сколько блоков опубликовано, куплено, переиспользовано в бандлах, накоплено роялти. Не соцсети, не скоринг — просто красивый вывод onchain-данных.

## Product
**Dec-01: Web3 niche only**
Not "courses on anything". Focus: DeFi, trading, dev tutorials, ecosystem research.
Why: Jacob (judge) explicitly said he likes specific use cases over "solve everything" platforms.

**Dec-02: TikTok-style feed, not catalog**
Discovery-first. Cards with preview → lock icon → add to bundle.
Why: Jacob said "if you make it like Spotify/TikTok it will be in demand". Free courses kill catalog-style platforms.

**Dec-03: CDR teasers**
Preview (title + preview_text + preview_image) is PUBLIC in Supabase.
Full content is CDR-encrypted. Users see the hook before paying.
Why: CDR show-partial-without-exposing-full-IP mechanic, also better UX.

**Dec-04: No AI curator (MVP)**
Manual bundle building by user. Dropped AI curator to save scope.
Why: 5-6 days. Core value is CDR + royalty split, not AI recommendation.

**Dec-05: On-chain verification badge (lightweight)**
"Verified" = boolean in DB for now (manual for demo).
Future: based on Story IP ownership count + sales history.
Why: Jacob mentioned talent verification but we have 800 followers — can't use social metrics. On-chain reputation is more honest for crypto audience.

## Tech
**Dec-06: GatewayProvider + Pinata for CDR file storage**
Available storage providers: Helia (local IPFS node), Storacha, Synapse, GatewayProvider.
Chose GatewayProvider with Pinata because Pinata has a simple HTTP API compatible with GatewayProvider's apiUrl/gatewayUrl params.
Why: simplest to set up, reliable pinning, free tier available.

**Dec-07: Server-side CDR upload, client-side CDR download**
Upload (create vault): server API route, uses PLATFORM_PRIVATE_KEY.
Download (access vault): client-side with user's browser wallet signing the read() tx.
Why: upload requires platform wallet (no user wallet needed at creation time). Download must use user's wallet so CDR license condition checks user's license token.

**Dec-08: Separate mintLicenseTokens per block (no derivative IP)**
Buying a bundle = minting individual license tokens for each block.
NOT using registerDerivativeIp with multiple parents (too complex for MVP).
Why: mintLicenseTokens per block is proven pattern, derivative IP adds complexity without critical MVP value. Can add in v2.

**Dec-09: Supabase for metadata + previews, IPFS (Pinata) for encrypted files**
Supabase: blocks table, purchases table, preview images.
IPFS via Pinata: encrypted full content (via CDR uploadFile).
Why: Supabase is fast/free for metadata. CDR needs a StorageProvider — GatewayProvider+Pinata is the cleanest option.

## Network
**Dec-10: Aeneid testnet**
Story Protocol testnet. All tokens are test tokens.
RPC: https://aeneid.storyrpc.io
Chain ID: 1513
Explorer: https://aeneid.storyscan.xyz
