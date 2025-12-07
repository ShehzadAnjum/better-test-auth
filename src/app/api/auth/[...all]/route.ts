import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"
import { NextRequest } from "next/server"

// Better-auth handler - use handler property
const handler = auth.handler
const { GET: baseGET, POST: basePOST } = toNextJsHandler(handler)

// Wrap handlers with error handling and logging
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    console.log("[API Route] GET request to:", url.pathname)
    return await baseGET(request)
  } catch (error) {
    console.error("[API Route] GET error:", error)
    return new Response(JSON.stringify({ error: "Internal server error", details: error instanceof Error ? error.message : String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url)
    console.log("[API Route] POST request to:", url.pathname)
    return await basePOST(request)
  } catch (error) {
    console.error("[API Route] POST error:", error)
    return new Response(JSON.stringify({ error: "Internal server error", details: error instanceof Error ? error.message : String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

