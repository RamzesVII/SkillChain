import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_KEY
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_KEY not set")
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  })
}

export type Block = {
  id: string
  creator_address: string
  title: string
  preview_text: string
  preview_image_url: string | null
  category: string
  price_ip: string
  ip_id: string | null
  license_terms_id: string | null
  cdr_uuid: number | null
  content_type: "video" | "pdf" | "markdown"
  is_verified: boolean
  created_at: string
}

export type Purchase = {
  id: string
  buyer_address: string
  block_id: string
  license_token_id: string
  tx_hash: string
  created_at: string
}
