# Debugging 404 Error on `/api/auth/social/google`

## Issue
Getting 404 error when accessing `/api/auth/social/google` on Vercel deployment.

## Systematic Debugging Steps

### ✅ 1. Route File Structure
- **Status**: ✅ Correct
- **Location**: `src/app/api/auth/[...all]/route.ts`
- **Catch-all route**: `[...all]` should match all paths under `/api/auth/*`

### ✅ 2. Route Handler Implementation
- **Status**: ✅ Fixed
- **Handler**: Using `auth.handler` from better-auth
- **Wrapper**: Added error handling and logging
- **Build**: ✅ Compiles successfully

### ✅ 3. Better-Auth Configuration
- **Status**: ✅ Verified
- **Handler exists**: `auth.handler` is a function
- **toNextJsHandler**: Works correctly
- **GET/POST handlers**: Created successfully

### ⚠️ 4. Potential Issues

#### Issue A: Route Not Matching
**Possible cause**: The catch-all route `[...all]` might not be matching correctly on Vercel.

**Solution**: The route structure is correct. Next.js should handle `[...all]` as a catch-all.

#### Issue B: Runtime Error
**Possible cause**: Runtime error in the handler causing 404 instead of 500.

**Solution**: Added error handling and logging to catch runtime errors.

#### Issue C: Environment Variables
**Possible cause**: Missing or incorrect environment variables causing better-auth to fail.

**Check**:
- `DATABASE_URL` - ✅ Set in Vercel
- `BETTER_AUTH_SECRET` - ✅ Set in Vercel
- `GOOGLE_CLIENT_ID` - ✅ Set in Vercel
- `GOOGLE_CLIENT_SECRET` - ✅ Set in Vercel
- `BETTER_AUTH_URL` - ⚠️ Should be `https://better-test-auth.vercel.app`
- `NEXT_PUBLIC_APP_URL` - ⚠️ Should be `https://better-test-auth.vercel.app`

#### Issue D: Route Path
**Possible cause**: Better-auth might use a different route structure.

**Current path**: `/api/auth/social/google`
**Alternative paths to test**:
- `/api/auth/sign-in/social/google`
- `/api/auth/oauth/google`
- `/api/auth/callback/google` (for callback)

## Next Steps

### 1. Check Vercel Logs
After deployment, check Vercel function logs for:
- Console logs from our route handler
- Any error messages
- Request paths being received

### 2. Verify Environment Variables
In Vercel dashboard, verify:
- `BETTER_AUTH_URL` = `https://better-test-auth.vercel.app`
- `NEXT_PUBLIC_APP_URL` = `https://better-test-auth.vercel.app`

### 3. Test Route Directly
Try accessing these URLs directly:
- `https://better-test-auth.vercel.app/api/auth/social/google`
- `https://better-test-auth.vercel.app/api/auth/sign-in/social/google`
- `https://better-test-auth.vercel.app/api/auth/oauth/google`

### 4. Check Better-Auth Documentation
Verify the exact route structure better-auth uses for social sign-in.

## Current Implementation

```typescript
// Route handler with error handling
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    console.log("[API Route] GET request to:", url.pathname)
    return await baseGET(request)
  } catch (error) {
    console.error("[API Route] GET error:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
```

## Expected Behavior

1. User clicks "Sign in with Google"
2. Browser navigates to `/api/auth/social/google`
3. Route handler catches the request
4. Better-auth handler processes it
5. Redirects to Google OAuth consent screen
6. Google redirects back to `/api/auth/callback/google`
7. Better-auth handles callback and creates session
8. User redirected back to home page, authenticated

## Debugging Commands

```bash
# Check route file exists
ls -la src/app/api/auth/[...all]/route.ts

# Build and check for errors
npm run build

# Test locally
npm run dev
# Then visit: http://localhost:3000/api/auth/social/google
```

## Status
- ✅ Route file structure correct
- ✅ Handler implementation correct
- ✅ Build successful
- ⚠️ Need to verify on Vercel after deployment
- ⚠️ Need to check Vercel logs for runtime errors
- ⚠️ Need to verify environment variables are correct

