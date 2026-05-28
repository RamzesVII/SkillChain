import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address")
  if (!address) return NextResponse.json({ error: "Missing address" }, { status: 400 })

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("purchases")
    .select("*, blocks(*)")
    .eq("buyer_address", address)
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ purchases: data })
}
