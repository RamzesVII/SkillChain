import { NextRequest, NextResponse } from "next/server"
import { initWasm } from "@piplabs/cdr-crypto"
import { createAdminClient } from "@/lib/supabase"
import { registerBlock } from "@/lib/story"
import { uploadBlockContent } from "@/lib/cdr"

export const maxDuration = 60 // Story tx needs ~20-30s to confirm

export async function POST(req: NextRequest) {
  try {
    await initWasm()
    const formData = await req.formData()

    const title = formData.get("title") as string
    const preview_text = formData.get("preview_text") as string
    const category = formData.get("category") as string
    const price_ip = formData.get("price_ip") as string
    const content_type = formData.get("content_type") as string
    const creator_address = formData.get("creator_address") as string
    const creator_name = (formData.get("creator_name") as string) || ""

    if (!title || !preview_text || !creator_address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get full content bytes
    let contentBytes: Uint8Array
    if (content_type === "markdown") {
      const text = formData.get("content") as string
      contentBytes = new TextEncoder().encode(text)
    } else {
      const file = formData.get("file") as File
      if (!file) return NextResponse.json({ error: "File required" }, { status: 400 })
      contentBytes = new Uint8Array(await file.arrayBuffer())
    }

    // 1. Register IP on Story Protocol
    console.log("[upload] Step 1: Registering on Story Protocol...")
    const { ipId, licenseTermsId, txHash: storyTx } = await registerBlock({
      title,
      creatorAddress: creator_address as `0x${string}`,
      priceIp: price_ip,
    })
    console.log("[upload] Story registered:", ipId)

    // 2. Upload encrypted content to CDR
    console.log("[upload] Step 2: Uploading to CDR...", process.env.STORY_CDR_API_URL)
    const { uuid } = await uploadBlockContent({
      content: contentBytes,
      ipId,
      ownerAddress: creator_address as `0x${string}`,
    })
    console.log("[upload] CDR uuid:", uuid)

    // 3. Save to Supabase
    const supabase = createAdminClient()
    const { data, error } = await supabase.from("blocks").insert({
      title,
      preview_text,
      category,
      price_ip,
      content_type,
      creator_address,
      creator_name,
      ip_id: ipId,
      license_terms_id: licenseTermsId.toString(),
      cdr_uuid: uuid,
    }).select().single()

    if (error) throw new Error(error.message)

    return NextResponse.json({ block: data, storyTx })
  } catch (err: unknown) {
    console.error("Upload error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    )
  }
}
