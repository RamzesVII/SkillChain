import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const { purchases, buyer_address } = await req.json()

    if (!purchases?.length || !buyer_address) {
      return NextResponse.json({ error: "Missing purchases or buyer_address" }, { status: 400 })
    }

    const supabase = createAdminClient()
    const results = []

    for (const p of purchases as { block_id: string; license_token_id: string; tx_hash: string }[]) {
      const { data, error } = await supabase.from("purchases").insert({
        buyer_address,
        block_id: p.block_id,
        license_token_id: p.license_token_id,
        tx_hash: p.tx_hash,
      }).select().single()

      if (error) throw new Error(error.message)
      results.push(data)
    }

    return NextResponse.json({ purchases: results })
  } catch (err: unknown) {
    console.error("Record purchase error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to record purchase" },
      { status: 500 }
    )
  }
}
