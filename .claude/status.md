# Project Status

## Product
Composable Web3 Skill Blocks — "Spotify for Web3 knowledge"
Hackathon: CDR Hackathon @ Story Protocol | Deadline: June 3, 2026
Track: Best CDR Application ($1k + $1k runner-up)

## Current Phase
Day 1 — Setup

## Done
- [x] Next.js 14 project exists
- [x] Dependencies installed: @piplabs/cdr-sdk, @story-protocol/core-sdk, @rainbow-me/rainbowkit, wagmi, viem, @supabase/supabase-js
- [x] .env.local.example created
- [x] Project directories created: lib/, app/api/, components/

## In Progress
- [ ] Supabase: create project + tables + storage bucket
- [ ] Pinata: get API key for IPFS
- [ ] WalletConnect: get project ID
- [ ] Fill .env.local

## Next Up
- [ ] lib/supabase.ts
- [ ] lib/cdr.ts (CDRClient wrapper)
- [ ] lib/story.ts (Story SDK wrapper)
- [ ] lib/providers.tsx (RainbowKit + wagmi)
- [ ] CDR uploadFile test with GatewayProvider + Pinata
- [ ] Wallet connection working

## Blockers
- Waiting for: Pinata API key, Supabase URL+keys, WalletConnect project ID
