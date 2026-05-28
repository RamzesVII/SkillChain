# LearnGraph — Product Concept

## One-liner
> Where Web3 creators prove their skills on-chain, learners assemble their path from knowledge blocks, and every purchase automatically pays all contributing authors.

## The problem
Free courses and AI killed the traditional education market. You can't win with another Coursera. But you also can't monetize talent without proving it's real — and today there's no trustworthy way to do that without social followers or a platform's certificate.

## The solution
Creators publish short Web3 knowledge blocks. Each block is encrypted via CDR with programmable access conditions enforced on-chain — giving it provenance from day one. Learners scroll a TikTok-style feed, see public teasers (CDR's partial disclosure — hook visible, full content locked), build a personal bundle from blocks by different creators, and pay once. Story executes an atomic exchange: one transaction unlocks all vaults in the bundle and automatically splits royalties between every creator whose block was included via `registerDerivativeIp` + royalty module.

Each sale is simultaneously: income for the creator, and verifiable on-chain proof that their talent was valued.

## Why CDR
Content stays private until purchased. The teaser hooks — the full knowledge stays locked via programmable access conditions. Public teaser is enforced by CDR's partial disclosure, not an off-chain preview cache. No centralized paywall server. Access enforced by on-chain license token ownership. Atomic exchange: if payment goes through, all vaults decrypt. If not, nothing.

## Why Story
Every block is IP. Every bundle is a composable derivative via `registerDerivativeIp` with multiple parent IPs. Royalties flow automatically to every parent through Story's royalty module. Creator reputation = their on-chain history: blocks published, times purchased, bundles reused, royalties earned. Not followers. Not a badge. A transparent, unforgeable record.

## Two heroes. One mechanism.
- **Buyer** scrolls → builds bundle → pays → unlocks
- **Creator** uploads → earns royalties → sees talent verified on-chain

The same transaction serves both.

## The "would someone actually use this?" answer
**Creator:** junior DeFi analyst who wants to prove skills to recruiters AND earn from every reuse of their research blocks.
**Buyer:** crypto newcomer who wants a 5-min bundle on perps from 3 verified experts instead of 1 hour on YouTube.

## Niche
Web3 know-how: DeFi, trading, Solidity dev, ecosystem research, on-chain reputation building.

## Format
Short modular blocks (not long courses). TikTok-style discovery feed. Spotify-style bundle assembly.

## Stack
- CDR: programmable access conditions + partial disclosure teasers
- Story: `registerDerivativeIp` (multiple parents) + royalty module + license tokens
- Next.js + Supabase + Pinata (IPFS) + RainbowKit
- Network: Aeneid testnet
