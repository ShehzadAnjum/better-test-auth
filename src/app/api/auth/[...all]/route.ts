import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

// Better-auth handler - try handler property first, fallback to auth
const handler = (auth as any).handler || auth
export const { GET, POST } = toNextJsHandler(handler)

