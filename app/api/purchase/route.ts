import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"
import { mintLicenseForBlock } from "@/lib/story"
import type { Block } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const { block_ids, buyer_address } = await req.json()

    if (!block_ids?.length || !buyer_address) {
      return NextResponse.json({ error: "Missing block_ids or buyer_address" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Fetch all blocks
    const { data: blocks, error: fetchError } = await supabase
      .from("blocks")
      .select("*")
      .in("id", block_ids)

    if (fetchError || !blocks?.length) {
      return NextResponse.json({ error: "Blocks not found" }, { status: 404 })
    }

    const purchases = []

    for (const block of blocks as Block[]) {
      if (!block.ip_id || !block.license_terms_id) {
        throw new Error(`Block ${block.id} not registered on Story`)
      }

      const { licenseTokenId, txHash } = await mintLicenseForBlock({
        ipId: block.ip_id as `0x${string}`,
        licenseTermsId: BigInt(block.license_terms_id),
        receiverAddress: buyer_address as `0x${string}`,
        priceIp: block.price_ip,
      })

      const { data, error } = await supabase.from("purchases").insert({
        buyer_address,
        block_id: block.id,
        license_token_id: licenseTokenId.toString(),
        tx_hash: txHash,
      }).select().single()

      if (error) throw new Error(error.message)
      purchases.push(data)
    }

    return NextResponse.json({ purchases })
  } catch (err: unknown) {
    console.error("Purchase error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Purchase failed" },
      { status: 500 }
    )
  }
}
