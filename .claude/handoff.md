# Handoff — Context for Resuming Work

## What we're building
Composable Web3 Skill Blocks. Creators upload short Web3 knowledge blocks (CDR-encrypted). Learners browse a TikTok-style feed with public previews, add blocks to a bundle, pay once → Story mints license tokens for each block → CDR unlocks full content → royalties split between creators automatically.

## Key flows
1. **Creator uploads block** → preview stored in Supabase (public) → full content CDR-encrypted + stored on IPFS via Pinata → Story IP Asset registered
2. **Learner browses** → sees preview cards → adds to bundle
3. **Learner pays** → API mints license tokens for each block → Story auto-pays creators
4. **Learner accesses** → browser wallet signs CDR read() tx → CDR checks license token → decrypts content

## Critical env vars needed (check .env.local)
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_KEY
- PLATFORM_PRIVATE_KEY (server only — never expose to client)
- STORY_RPC_URL=https://aeneid.storyrpc.io
- PINATA_API_KEY
- PINATA_API_SECRET
- PINATA_GATEWAY_URL
- NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID

## CDR SDK key facts — VERIFIED from jacob-tucker/cdr-skill examples

### Contract addresses (Aeneid testnet)
```
OWNER_WRITE_CONDITION = "0x4C9bFC96d7092b590D497A191826C3dA2277c34B"
LICENSE_READ_CONDITION = "0xC0640AD4CF2CaA9914C8e5C44234359a9102f7a3"
LICENSE_TOKEN          = "0xFe3838BFb30B34170F00030B52eA4893d8aAC6bC"
ROYALTY_MODULE         = "0xD2f60c40fEbccf6311f8B47c4f2Ec6b040400086"
SPG_NFT_CONTRACT       = "0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc"
```

### Upload pattern (license-gated + Supabase — combo of examples 03 + 04)
```typescript
// 1. AES-encrypt file locally
const { ciphertext: encryptedFile, key: aesKey } = encryptFile(fileBytes)
// 2. Upload encrypted bytes to Supabase
const path = await supabaseProvider.upload(encryptedFile)
// 3. CDR vault: write=owner, read=LICENSE_READ_CONDITION(ipId)
const writeCondData = encodeAbiParameters([{ type: "address" }], [owner])
const readCondData = encodeAbiParameters(
  [{ type: "address" }, { type: "address" }],
  [LICENSE_TOKEN, ipId]
)
const payload = encode({ path, key: toHex(aesKey) })
const { uuid } = await uploader.uploadCDR({
  dataKey: payload,
  writeConditionAddr: OWNER_WRITE_CONDITION,
  writeConditionData: writeCondData,
  readConditionAddr: LICENSE_READ_CONDITION,
  readConditionData: readCondData,
  accessAuxData: "0x",
})
```

### Download pattern (license-gated)
```typescript
const accessAuxData = encodeAbiParameters(
  [{ type: "uint256[]" }],
  [[BigInt(licenseTokenId)]]
)
const { dataKey } = await consumer.accessCDR({ uuid, accessAuxData })
const { path, key } = JSON.parse(decode(dataKey))
const encryptedBytes = await supabaseProvider.download(path)
const content = decryptFile(encryptedBytes, fromHex(key))
```

### Story mint flow
```typescript
// Wrap IP → WIP before minting
await storyClient.wipClient.deposit({ amount: parseEther("1") })
await storyClient.wipClient.approve({ spender: ROYALTY_MODULE, amount: parseEther("1") })
// Mint license
const { licenseTokenIds } = await storyClient.license.mintLicenseTokens({
  licensorIpId: ipId,
  licenseTermsId: BigInt(licenseTermsId),
  amount: 1,
})
```

### CDRClient init
```typescript
const cdrClient = new CDRClient({
  network: "testnet",
  publicClient,
  walletClient,
  apiUrl: "https://aeneid.storyrpc.io:1317", // verify current URL
})
```

## Story SDK key facts
- StoryClient.newClient({ account, transport, chainId: "aeneid" })
- client.ipAsset.register() → ipId
- client.license.attachLicenseTerms() → licenseTermsId
- client.license.mintLicenseTokens() → licenseTokenId
- PIL commercial terms: commercialUse: true, mintingFee in WIP tokens

## Aeneid testnet
- Chain ID: 1513
- RPC: https://aeneid.storyrpc.io
- Explorer: https://aeneid.storyscan.xyz
- Native token: IP (for gas)
- WIP token (wrapped IP): needed for license minting fees
- Faucet: check Story docs

## Reference code
- github.com/jacob-tucker/cdr-skill — examples 03 (license-gated) and 04 (file + Supabase)
- github.com/jacob-tucker/cdr-ai-negotiate — A2A + CDR full flow

## Supabase schema
See decisions.md Dec-09 and features/blocks.md
Tables: blocks, purchases

## What Jacob (judge) wants
- Specific Web3 niche ✓
- TikTok/Spotify format ✓
- Beautiful UI (use Claude for design)
- Evidence of real users wanting it (demo with real Web3 content)
- Story royalty split visible in explorer
