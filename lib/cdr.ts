import { CDRClient } from "@piplabs/cdr-sdk"
import type { StorageProvider } from "@piplabs/cdr-sdk"
import { createPublicClient, createWalletClient, http, encodeAbiParameters } from "viem"
import { aeneid } from "@story-protocol/core-sdk"
import { CDR_CONTRACTS, STORY_CDR_API_URL, STORY_RPC_URL } from "./constants"
import { getPlatformAccount } from "./story"
import { createAdminClient } from "./supabase"
import { randomUUID } from "crypto"

export class SupabaseStorageProvider implements StorageProvider {
  private bucket: string

  constructor(bucket = "cdr-content") {
    this.bucket = bucket
  }

  async upload(data: Uint8Array): Promise<string> {
    const supabase = createAdminClient()
    const path = `cdr/${randomUUID()}.bin`
    const { error } = await supabase.storage
      .from(this.bucket)
      .upload(path, data, { contentType: "application/octet-stream" })
    if (error) throw new Error(`Supabase upload failed: ${error.message}`)
    return path
  }

  async download(cid: string): Promise<Uint8Array> {
    const supabase = createAdminClient()
    const { data, error } = await supabase.storage.from(this.bucket).download(cid)
    if (error || !data) throw new Error(`Supabase download failed: ${error?.message}`)
    return new Uint8Array(await data.arrayBuffer())
  }
}

function createServerCDRClient() {
  const account = getPlatformAccount()
  const publicClient = createPublicClient({
    chain: aeneid,
    transport: http(STORY_RPC_URL),
  })
  const walletClient = createWalletClient({
    account,
    chain: aeneid,
    transport: http(STORY_RPC_URL),
  })
  return new CDRClient({
    network: "testnet",
    publicClient,
    walletClient,
    apiUrl: STORY_CDR_API_URL,
  })
}

export type UploadBlockResult = {
  uuid: number
  cid: string
}

export async function uploadBlockContent(params: {
  content: Uint8Array
  ipId: `0x${string}`
  ownerAddress: `0x${string}`
}): Promise<UploadBlockResult> {
  const client = createServerCDRClient()
  const storageProvider = new SupabaseStorageProvider()

  const writeCondData = encodeAbiParameters(
    [{ type: "address" }],
    [params.ownerAddress],
  )
  const readCondData = encodeAbiParameters(
    [{ type: "address" }, { type: "address" }],
    [CDR_CONTRACTS.LICENSE_TOKEN, params.ipId],
  )

  const result = await client.uploader.uploadFile({
    content: params.content,
    storageProvider,
    updatable: false,
    writeConditionAddr: CDR_CONTRACTS.OWNER_WRITE_CONDITION,
    writeConditionData: writeCondData,
    readConditionAddr: CDR_CONTRACTS.LICENSE_READ_CONDITION,
    readConditionData: readCondData,
    accessAuxData: "0x",
  })

  return { uuid: result.uuid, cid: result.cid }
}

export function buildAccessAuxData(licenseTokenId: bigint): `0x${string}` {
  return encodeAbiParameters([{ type: "uint256[]" }], [[licenseTokenId]])
}
