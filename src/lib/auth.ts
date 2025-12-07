import { betterAuth } from "better-auth"
import { Pool } from "pg"

// Lazy initialization of database pool
// This prevents errors during build time when DATABASE_URL might not be set
let pool: Pool | null = null
let poolConnectionString: string | null = null

const getPool = () => {
  const databaseUrl = process.env.DATABASE_URL
  
  // If we have a real DATABASE_URL and either:
  // 1. Pool doesn't exist yet, OR
  // 2. Pool exists but was created with placeholder, OR
  // 3. DATABASE_URL has changed
  // Then create/update the pool
  if (databaseUrl && (!pool || poolConnectionString !== databaseUrl)) {
    // Close existing pool if it was a placeholder
    if (pool && poolConnectionString !== databaseUrl) {
      pool.end().catch(() => {}) // Ignore errors when closing
    }
    pool = new Pool({
      connectionString: databaseUrl,
      // Optimize for serverless environments
      max: 1,
    })
    poolConnectionString = databaseUrl
  } else if (!pool) {
    // No DATABASE_URL available - use placeholder for build time
    // This allows builds to complete. At runtime, if DATABASE_URL is still missing,
    // the connection will fail when actually used, which is expected behavior
    pool = new Pool({
      connectionString: "postgresql://placeholder:placeholder@localhost:5432/placeholder",
      max: 1,
    })
    poolConnectionString = "postgresql://placeholder:placeholder@localhost:5432/placeholder"
  }
  
  return pool
}

export const auth = betterAuth({
  database: getPool(),
  emailAndPassword: {
    enabled: false, // We're only using Google OAuth
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  basePath: "/api/auth",
  secret: process.env.BETTER_AUTH_SECRET!,
})

export type Session = typeof auth.$Infer.Session

