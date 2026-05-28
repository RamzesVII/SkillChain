# Feature: Knowledge Blocks

## What is a block
A short Web3 knowledge asset published by a verified creator.
Not a full course — one concept, one block (5-30 min content).

## Categories
- DeFi (protocols, strategies, mechanics)
- Trading (TA, signals, thesis, playbooks)
- Dev (tutorials: Solidity, Story SDK, CDR, etc.)
- Research (ecosystem maps, protocol analysis, airdrop guides)
- Growth (Web3 marketing, community building)

## Block structure
```
Public (Supabase):
  - title
  - preview_text (2-3 sentences that hook the reader)
  - preview_image_url
  - category
  - price_ip (in IP tokens, e.g. "0.1")
  - creator_address
  - creator_name
  - is_verified (boolean)
  - created_at

Private (CDR vault on IPFS):
  - full content: video URL / PDF bytes / markdown text
  - content_type: "video" | "pdf" | "markdown"

On-chain (Story Protocol):
  - ip_id (Story IP Asset ID)
  - license_terms_id (PIL terms with mintingFee)
```

## CDR vault conditions
- Write condition: ownerOnly (platform wallet can update)
- Read condition: tokenGate(licenseTokenAddress, minBalance=1)
  OR custom LicenseReadCondition if available on Aeneid

## Content types supported (MVP)
1. **Markdown** — rendered in browser (simplest)
2. **PDF** — rendered via iframe or react-pdf
3. **Video** — URL stored in encrypted vault, played via HTML5 video

## Creator verification (MVP)
- `is_verified` boolean in DB
- Set manually for demo
- Display as "✓ Verified" badge on card

## Pricing
- Set by creator in IP tokens
- Minimum: 0.01 IP
- Platform fee: 0% (for hackathon demo — simplicity)
