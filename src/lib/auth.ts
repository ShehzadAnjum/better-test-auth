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
      // Check if we're in build phase
      // Vercel sets VERCEL=1 during build, and VERCEL_ENV during runtime
      // Next.js sets NEXT_PHASE during build
      const isBuildPhase = 
        process.env.NEXT_PHASE === 'phase-production-build' ||
        (process.env.VERCEL === '1' && !process.env.VERCEL_ENV) ||
        process.env.NODE_ENV !== 'production'
      
      if (isBuildPhase) {
        // Build phase - use placeholder that won't actually connect
        // This allows the build to complete successfully
        pool = new Pool({
          connectionString: "postgresql://placeholder:placeholder@localhost:5432/placeholder",
          max: 1,
        })
      } else {
        // Runtime without DATABASE_URL - this is an error
        throw new Error("DATABASE_URL is not set in environment variables. Please set it in your Vercel project settings.")
      }
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

