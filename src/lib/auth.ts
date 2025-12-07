import { betterAuth } from "better-auth"
import { Pool } from "pg"

// Lazy initialization of database pool
// This prevents errors during build time when DATABASE_URL might not be set
let pool: Pool | null = null

const getPool = () => {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      // During build time, provide a dummy connection string
      // This will be replaced at runtime with the actual connection
      if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
        throw new Error("DATABASE_URL is not set in environment variables")
      }
      // For build time, use a placeholder (won't be used)
      pool = new Pool({
        connectionString: "postgresql://placeholder:placeholder@localhost:5432/placeholder",
        max: 1,
      })
    } else {
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

