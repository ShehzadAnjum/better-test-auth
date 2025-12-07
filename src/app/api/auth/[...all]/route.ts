import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

// Better-auth handler - use handler property if available
const authHandler = (auth as any).handler || auth
export const { GET, POST } = toNextJsHandler(authHandler)

