import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"
import { NextRequest } from "next/server"

// Better-auth handler - use handler property with safety check
let baseGET: ((request: NextRequest) => Promise<Response>) | null = null
let basePOST: ((request: NextRequest) => Promise<Response>) | null = null

try {
  const handler = auth.handler
  if (!handler) {
    throw new Error("auth.handler is undefined")
  }
  const handlers = toNextJsHandler(handler)
  baseGET = handlers.GET
  basePOST = handlers.POST
} catch (error) {
  console.error("[API Route] Failed to initialize better-auth handlers:", error)
}

// Wrap handlers with error handling and logging
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    console.log("[API Route] GET request to:", url.pathname)
    
    if (!baseGET) {
      console.error("[API Route] baseGET handler is not initialized")
      return new Response(JSON.stringify({ error: "Auth handler not initialized" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }
    
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
    
    if (!basePOST) {
      console.error("[API Route] basePOST handler is not initialized")
      return new Response(JSON.stringify({ error: "Auth handler not initialized" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }
    
    return await basePOST(request)
  } catch (error) {
    console.error("[API Route] POST error:", error)
    return new Response(JSON.stringify({ error: "Internal server error", details: error instanceof Error ? error.message : String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

