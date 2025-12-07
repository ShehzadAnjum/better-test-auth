// Debug script to check better-auth routes
import { betterAuth } from "better-auth"

const auth = betterAuth({
  basePath: "/api/auth",
  secret: "test-secret-123456789012345678901234567890",
  socialProviders: {
    google: {
      clientId: "test",
      clientSecret: "test",
    },
  },
})

console.log("Auth handler type:", typeof auth.handler)
console.log("Auth handler:", auth.handler)

// Check what routes better-auth expects
console.log("\nTesting route paths:")
const testPaths = [
  "/api/auth/social/google",
  "/api/auth/sign-in/social/google",
  "/api/auth/oauth/google",
]

testPaths.forEach(path => {
  console.log(`Path: ${path}`)
})

