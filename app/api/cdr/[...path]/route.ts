import { NextRequest, NextResponse } from "next/server"
import { STORY_CDR_API_URL } from "@/lib/constants"

export const dynamic = "force-dynamic"

function buildTargetUrl(req: NextRequest) {
  const source = new URL(req.url)
  const cdrBase = STORY_CDR_API_URL.replace(/\/+$/, "")
  const proxyPath = source.pathname.replace(/^\/api\/cdr/, "")
  return `${cdrBase}${proxyPath}${source.search}`
}

export async function GET(req: NextRequest) {
  try {
    const upstream = await fetch(buildTargetUrl(req), {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    })

    const body = await upstream.text()
    return new NextResponse(body, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") ?? "application/json",
        "Cache-Control": "no-store",
      },
    })
  } catch (err: unknown) {
    console.error("CDR proxy error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "CDR proxy failed" },
      { status: 502 },
    )
  }
}
