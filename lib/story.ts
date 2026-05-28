import { StoryClient, PILFlavor, WIP_TOKEN_ADDRESS, NativeRoyaltyPolicy } from "@story-protocol/core-sdk"
import { http } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { parseEther } from "viem"
import { CDR_CONTRACTS, STORY_RPC_URL } from "./constants"

export { WIP_TOKEN_ADDRESS }

export function getPlatformAccount() {
  const pk = process.env.PLATFORM_PRIVATE_KEY
  if (!pk) throw new Error("PLATFORM_PRIVATE_KEY not set")
  return privateKeyToAccount(pk as `0x${string}`)
}

export function createPlatformStoryClient() {
  const account = getPlatformAccount()
  return StoryClient.newClient({
    account,
    transport: http(STORY_RPC_URL),
    chainId: "aeneid",
  })
}

export type RegisterBlockResult = {
  ipId: `0x${string}`
  licenseTermsId: bigint
  tokenId: bigint
  txHash: string
}

export async function registerBlock(params: {
  title: string
  creatorAddress: `0x${string}`
  priceIp: string
}): Promise<RegisterBlockResult> {
  const client = createPlatformStoryClient()
  const mintingFee = parseEther(params.priceIp)

  const result = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
    spgNftContract: CDR_CONTRACTS.SPG_NFT_CONTRACT,
    licenseTermsData: [
      {
        terms: PILFlavor.commercialUse({
          defaultMintingFee: mintingFee,
          currency: WIP_TOKEN_ADDRESS,
          royaltyPolicy: NativeRoyaltyPolicy.LAP,
        }),
      },
    ],
    ipMetadata: {
      ipMetadataURI: `https://learngraph.xyz/block/${params.title}`,
    },
    allowDuplicates: true,
    txOptions: {},
  })

  if (!result.ipId || !result.licenseTermsIds?.[0] || !result.tokenId) {
    throw new Error("Story registration failed — missing ipId, licenseTermsId, or tokenId")
  }

  return {
    ipId: result.ipId,
    licenseTermsId: result.licenseTermsIds[0],
    tokenId: result.tokenId,
    txHash: result.txHash || "",
  }
}

export type MintLicenseResult = {
  licenseTokenId: bigint
  txHash: string
}

export async function mintLicenseForBlock(params: {
  ipId: `0x${string}`
  licenseTermsId: bigint
  receiverAddress: `0x${string}`
  priceIp: string
}): Promise<MintLicenseResult> {
  const client = createPlatformStoryClient()
  const mintingFee = parseEther(params.priceIp)

  const result = await client.license.mintLicenseTokens({
    licensorIpId: params.ipId,
    licenseTermsId: params.licenseTermsId,
    receiver: params.receiverAddress,
    amount: 1,
    maxMintingFee: mintingFee,
    txOptions: {},
  })

  if (!result.licenseTokenIds?.[0]) {
    throw new Error("mintLicenseTokens failed — no licenseTokenId returned")
  }

  return {
    licenseTokenId: result.licenseTokenIds[0],
    txHash: result.txHash || "",
  }
}
