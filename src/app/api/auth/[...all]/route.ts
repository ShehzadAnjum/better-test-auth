import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

// Better-auth exports a handler property that we need to use
export const { GET, POST } = toNextJsHandler(auth.handler)

