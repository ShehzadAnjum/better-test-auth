import { betterAuth } from "better-auth"
import { Pool } from "pg"

// Lazy initialization of database pool
// This prevents errors during build time when DATABASE_URL might not be set
let pool: Pool | null = null

const getPool = () => {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL
    
    // During build time, use a placeholder connection
    // The actual connection will be established at runtime when the API is called
    if (!databaseUrl) {
      // Always use placeholder if DATABASE_URL is not set during initialization
      // This allows builds to complete. At runtime, if DATABASE_URL is still missing,
      // the connection will fail gracefully and the error will be caught by better-auth
      pool = new Pool({
        connectionString: "postgresql://placeholder:placeholder@localhost:5432/placeholder",
        max: 1,
      })
    } else {
      // We have a real DATABASE_URL - use it
      pool = new Pool({
        connectionString: databaseUrl,
        // Optimize for serverless environments
        max: 1,
      })
    }
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

