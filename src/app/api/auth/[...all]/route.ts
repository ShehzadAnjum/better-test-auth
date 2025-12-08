import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

console.log("[ROUTE INIT] Route module loading...")
console.log("[ROUTE INIT] NODE_ENV:", process.env.NODE_ENV)
console.log("[ROUTE INIT] Imports completed")
console.log("[ROUTE INIT] auth object received:", !!auth)
console.log("[ROUTE INIT] auth.handler exists:", !!auth.handler)

// Use the official Better-Auth pattern: directly export GET and POST
// This matches the official documentation exactly
// Wrapping them breaks route registration in Next.js App Router

let handlers: { GET: (request: Request) => Promise<Response>, POST: (request: Request) => Promise<Response> } | null = null
let initError: Error | null = null

try {
  console.log("[ROUTE INIT] Getting auth.handler...")
  const handler = auth.handler
  console.log("[ROUTE INIT] handler received:", !!handler, typeof handler)
  
  if (!handler) {
    throw new Error("auth.handler is undefined")
  }
  
  console.log("[ROUTE INIT] Calling toNextJsHandler...")
  handlers = toNextJsHandler(handler)
  console.log("[ROUTE INIT] Handlers received:", !!handlers.GET, !!handlers.POST)
  console.log("[ROUTE INIT] Handlers initialized successfully")
} catch (error) {
  console.error("[ROUTE INIT] CRITICAL: Failed to initialize better-auth handlers:", error)
  console.error("[ROUTE INIT] Error details:", error instanceof Error ? error.message : String(error))
  console.error("[ROUTE INIT] Error stack:", error instanceof Error ? error.stack : "No stack")
  initError = error instanceof Error ? error : new Error(String(error))
}

console.log("[ROUTE INIT] Route module initialization complete")

// Export the handlers directly - this is the official Better-Auth pattern
// This ensures Next.js properly registers the route
export const GET = handlers?.GET || (async () => {
  return new Response(JSON.stringify({ 
    error: "Auth handler not initialized",
    details: initError?.message || "Unknown error",
    timestamp: new Date().toISOString()
  }), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  })
})

export const POST = handlers?.POST || (async () => {
  return new Response(JSON.stringify({ 
    error: "Auth handler not initialized",
    details: initError?.message || "Unknown error",
    timestamp: new Date().toISOString()
  }), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  })
})
