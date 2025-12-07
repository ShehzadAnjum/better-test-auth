import { betterAuth } from "better-auth"
import { Pool } from "pg"

console.log("[AUTH INIT] Starting auth module initialization...")
console.log("[AUTH INIT] NODE_ENV:", process.env.NODE_ENV)
console.log("[AUTH INIT] VERCEL:", process.env.VERCEL)

// Lazy initialization of database pool
// This prevents errors during build time when DATABASE_URL might not be set
let pool: Pool | null = null
let poolConnectionString: string | null = null

const getPool = () => {
  console.log("[AUTH INIT] getPool() called")
  const databaseUrl = process.env.DATABASE_URL
  console.log("[AUTH INIT] DATABASE_URL exists:", !!databaseUrl)
  console.log("[AUTH INIT] DATABASE_URL length:", databaseUrl?.length || 0)
  
  // If we have a real DATABASE_URL and either:
  // 1. Pool doesn't exist yet, OR
  // 2. Pool exists but was created with placeholder, OR
  // 3. DATABASE_URL has changed
  // Then create/update the pool
  if (databaseUrl && (!pool || poolConnectionString !== databaseUrl)) {
    console.log("[AUTH INIT] Creating new pool with real DATABASE_URL")
    // Close existing pool if it was a placeholder
    if (pool && poolConnectionString !== databaseUrl) {
      console.log("[AUTH INIT] Closing old pool")
      pool.end().catch(() => {}) // Ignore errors when closing
    }
    try {
      pool = new Pool({
        connectionString: databaseUrl,
        // Optimize for serverless environments
        max: 1,
      })
      poolConnectionString = databaseUrl
      console.log("[AUTH INIT] Pool created successfully")
    } catch (error) {
      console.error("[AUTH INIT] Error creating pool:", error)
      throw error
    }
  } else if (!pool) {
    console.log("[AUTH INIT] No DATABASE_URL, creating placeholder pool")
    // No DATABASE_URL available - use placeholder for build time
    // This allows builds to complete. At runtime, if DATABASE_URL is still missing,
    // the connection will fail when actually used, which is expected behavior
    pool = new Pool({
      connectionString: "postgresql://placeholder:placeholder@localhost:5432/placeholder",
      max: 1,
    })
    poolConnectionString = "postgresql://placeholder:placeholder@localhost:5432/placeholder"
    console.log("[AUTH INIT] Placeholder pool created")
  } else {
    console.log("[AUTH INIT] Reusing existing pool")
  }
  
  return pool
}

console.log("[AUTH INIT] Checking environment variables...")
console.log("[AUTH INIT] GOOGLE_CLIENT_ID exists:", !!process.env.GOOGLE_CLIENT_ID)
console.log("[AUTH INIT] GOOGLE_CLIENT_SECRET exists:", !!process.env.GOOGLE_CLIENT_SECRET)
console.log("[AUTH INIT] BETTER_AUTH_SECRET exists:", !!process.env.BETTER_AUTH_SECRET)
console.log("[AUTH INIT] BETTER_AUTH_URL:", process.env.BETTER_AUTH_URL)
console.log("[AUTH INIT] NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL)

console.log("[AUTH INIT] Creating betterAuth instance...")
const poolInstance = getPool()
console.log("[AUTH INIT] Pool instance obtained:", !!poolInstance)

// Determine base URL - prioritize explicit config, then Vercel URL, then fallback
const getBaseURL = () => {
  // Explicit configuration takes priority
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL
  }
  
  // On Vercel, use the deployment URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  // Fallback to public app URL or localhost
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
}

const baseURL = getBaseURL()
console.log("[AUTH INIT] Final baseURL:", baseURL)
console.log("[AUTH INIT] VERCEL_URL:", process.env.VERCEL_URL)
console.log("[AUTH INIT] VERCEL:", process.env.VERCEL)

// Build trusted origins for Vercel preview deployments
// This allows preview branches (e.g., branch-abc.vercel.app) to work
const trustedOrigins: string[] = []
if (process.env.VERCEL) {
  // Add current Vercel URL if available
  if (process.env.VERCEL_URL) {
    trustedOrigins.push(`https://${process.env.VERCEL_URL}`)
  }
  // Add wildcard for preview deployments
  trustedOrigins.push("https://*.vercel.app")
}
// Always trust localhost for development
if (process.env.NODE_ENV !== "production") {
  trustedOrigins.push("http://localhost:3000")
}
// Add explicit trusted origins from env if set
if (process.env.BETTER_AUTH_TRUSTED_ORIGINS) {
  const explicitOrigins = process.env.BETTER_AUTH_TRUSTED_ORIGINS.split(",").map(o => o.trim())
  trustedOrigins.push(...explicitOrigins)
}

console.log("[AUTH INIT] Trusted origins:", trustedOrigins)

const authConfig = {
  database: poolInstance,
  emailAndPassword: {
    enabled: false, // We're only using Google OAuth
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  baseURL,
  basePath: "/api/auth",
  secret: process.env.BETTER_AUTH_SECRET!,
  // Advanced configuration for Vercel compatibility
  advanced: {
    // Trust origins for preview deployments
    trustedOrigins: trustedOrigins.length > 0 ? trustedOrigins : undefined,
    // Cookie configuration for Vercel
    cookies: {
      sessionToken: {
        attributes: {
          sameSite: "lax" as const,
          secure: process.env.NODE_ENV === "production" || process.env.VERCEL === "1",
          // Don't set domain explicitly - let it default to current domain
        },
      },
    },
  },
}

console.log("[AUTH INIT] Auth config prepared, calling betterAuth()...")
console.log("[AUTH INIT] baseURL:", authConfig.baseURL)
console.log("[AUTH INIT] basePath:", authConfig.basePath)

let auth: ReturnType<typeof betterAuth>
try {
  auth = betterAuth(authConfig)
  console.log("[AUTH INIT] betterAuth() completed successfully")
  console.log("[AUTH INIT] auth object keys:", Object.keys(auth))
  console.log("[AUTH INIT] auth.handler exists:", !!auth.handler)
  console.log("[AUTH INIT] auth.handler type:", typeof auth.handler)
  console.log("[AUTH INIT] Auth module initialized successfully")
} catch (error) {
  console.error("[AUTH INIT] CRITICAL ERROR during auth initialization:", error)
  console.error("[AUTH INIT] Error stack:", error instanceof Error ? error.stack : "No stack")
  throw error
}

export { auth }

export type Session = typeof auth.$Infer.Session

