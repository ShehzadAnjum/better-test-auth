// Test route to verify API routes work
import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ message: "API route works!", timestamp: new Date().toISOString() })
}

