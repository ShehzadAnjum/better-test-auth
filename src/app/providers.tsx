"use client"

import { createAuthClient } from "better-auth/react"
import { ReactNode } from "react"

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  basePath: "/api/auth",
})

export const { signIn, signOut, useSession } = authClient

export function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>
}

