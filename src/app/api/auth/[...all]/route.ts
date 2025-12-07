console.log("[ROUTE INIT] Route module loading...")
console.log("[ROUTE INIT] NODE_ENV:", process.env.NODE_ENV)

import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"
import { NextRequest } from "next/server"

console.log("[ROUTE INIT] Imports completed")
console.log("[ROUTE INIT] auth object received:", !!auth)
console.log("[ROUTE INIT] auth.handler exists:", !!(auth as any)?.handler)

// Better-auth handler - use handler property with safety check
let baseGET: ((request: NextRequest) => Promise<Response>) | null = null
let basePOST: ((request: NextRequest) => Promise<Response>) | null = null

console.log("[ROUTE INIT] Initializing handlers...")
try {
  console.log("[ROUTE INIT] Getting auth.handler...")
  const handler = auth.handler
  console.log("[ROUTE INIT] handler received:", !!handler, typeof handler)
  
  if (!handler) {
    throw new Error("auth.handler is undefined")
  }
  
  console.log("[ROUTE INIT] Calling toNextJsHandler...")
  const handlers = toNextJsHandler(handler)
  console.log("[ROUTE INIT] Handlers received:", !!handlers.GET, !!handlers.POST)
  
  baseGET = handlers.GET
  basePOST = handlers.POST
  console.log("[ROUTE INIT] Handlers assigned successfully")
} catch (error) {
  console.error("[ROUTE INIT] CRITICAL: Failed to initialize better-auth handlers:", error)
  console.error("[ROUTE INIT] Error details:", error instanceof Error ? error.message : String(error))
  console.error("[ROUTE INIT] Error stack:", error instanceof Error ? error.stack : "No stack")
}

console.log("[ROUTE INIT] Route module initialization complete")
console.log("[ROUTE INIT] baseGET ready:", !!baseGET)
console.log("[ROUTE INIT] basePOST ready:", !!basePOST)

// Wrap handlers with error handling and logging
export async function GET(request: NextRequest) {
  console.log("[API GET] ========== GET REQUEST RECEIVED ==========")
  console.log("[API GET] Request URL:", request.url)
  console.log("[API GET] Request method:", request.method)
  console.log("[API GET] baseGET handler available:", !!baseGET)
  
  try {
    const url = new URL(request.url)
    console.log("[API GET] Parsed URL pathname:", url.pathname)
    console.log("[API GET] Parsed URL search:", url.search)
    
    if (!baseGET) {
      console.error("[API GET] ERROR: baseGET handler is not initialized")
      console.error("[API GET] This means the route handler failed to initialize")
      return new Response(JSON.stringify({ 
        error: "Auth handler not initialized",
        path: url.pathname,
        timestamp: new Date().toISOString()
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }
    
    console.log("[API GET] Calling baseGET handler...")
    const response = await baseGET(request)
    console.log("[API GET] Handler returned response, status:", response.status)
    console.log("[API GET] Response headers:", Object.fromEntries(response.headers.entries()))
    return response
  } catch (error) {
    console.error("[API GET] EXCEPTION in GET handler:", error)
    console.error("[API GET] Error type:", error?.constructor?.name)
    console.error("[API GET] Error message:", error instanceof Error ? error.message : String(error))
    console.error("[API GET] Error stack:", error instanceof Error ? error.stack : "No stack")
    return new Response(JSON.stringify({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : String(error),
      path: request.url,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export async function POST(request: NextRequest) {
  console.log("[API POST] ========== POST REQUEST RECEIVED ==========")
  console.log("[API POST] Request URL:", request.url)
  console.log("[API POST] Request method:", request.method)
  console.log("[API POST] basePOST handler available:", !!basePOST)
  
  try {
    const url = new URL(request.url)
    console.log("[API POST] Parsed URL pathname:", url.pathname)
    console.log("[API POST] Parsed URL search:", url.search)
    
    if (!basePOST) {
      console.error("[API POST] ERROR: basePOST handler is not initialized")
      return new Response(JSON.stringify({ 
        error: "Auth handler not initialized",
        path: url.pathname,
        timestamp: new Date().toISOString()
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }
    
    console.log("[API POST] Calling basePOST handler...")
    const response = await basePOST(request)
    console.log("[API POST] Handler returned response, status:", response.status)
    return response
  } catch (error) {
    console.error("[API POST] EXCEPTION in POST handler:", error)
    console.error("[API POST] Error message:", error instanceof Error ? error.message : String(error))
    console.error("[API POST] Error stack:", error instanceof Error ? error.stack : "No stack")
    return new Response(JSON.stringify({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : String(error),
      path: request.url,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

