# Deploy to Vercel

## Current Status

Your project is configured for Vercel deployment, but you may need to connect it to a Vercel project.

## Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**:
   - Visit: https://vercel.com/dashboard
   - Sign in with your GitHub account

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Select your GitHub repository: `ShehzadAnjum/better-test-auth`
   - Click "Import"

3. **Configure Project**:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Set Environment Variables**:
   Before deploying, add these environment variables in Vercel:
   
   **Required:**
   - `DATABASE_URL` - Your Neon PostgreSQL connection string
   - `BETTER_AUTH_SECRET` - Secret key (generate with `openssl rand -base64 32`)
   - `GOOGLE_CLIENT_ID` - Your Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET` - Your Google OAuth client secret
   
   **Recommended:**
   - `BETTER_AUTH_URL` - Your Vercel production URL (set after first deployment)
   - `NEXT_PUBLIC_APP_URL` - Your Vercel production URL (set after first deployment)
   
   **How to add:**
   - In the "Environment Variables" section
   - Add each variable for: Production, Preview, and Development
   - Click "Deploy"

5. **Deploy**:
   - Click "Deploy" button
   - Wait for build to complete
   - Your app will be live at: `https://your-project-name.vercel.app`

6. **Update Environment Variables After First Deployment**:
   - Once deployed, note your production URL
   - Go back to Settings → Environment Variables
   - Update `BETTER_AUTH_URL` to: `https://your-project-name.vercel.app`
   - Update `NEXT_PUBLIC_APP_URL` to: `https://your-project-name.vercel.app`
   - Redeploy (or it will auto-redeploy on next push)

## Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Link Project** (if not already linked):
   ```bash
   vercel link
   ```
   - Select your existing project or create a new one
   - Follow the prompts

4. **Deploy**:
   ```bash
   vercel --prod
   ```

5. **Set Environment Variables**:
   ```bash
   vercel env add DATABASE_URL
   vercel env add BETTER_AUTH_SECRET
   vercel env add GOOGLE_CLIENT_ID
   vercel env add GOOGLE_CLIENT_SECRET
   vercel env add BETTER_AUTH_URL
   vercel env add NEXT_PUBLIC_APP_URL
   ```
   
   For each variable, select: Production, Preview, Development

## Option 3: Auto-Deploy from GitHub (Recommended for Ongoing Development)

1. **Connect Repository** (if not already connected):
   - Go to Vercel Dashboard
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Vercel will automatically detect Next.js settings

2. **Enable Auto-Deploy**:
   - After first deployment, every push to `main` branch will auto-deploy
   - Preview deployments are created for pull requests

3. **Set Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add all required variables (see above)

## Check Deployment Status

1. **Vercel Dashboard**:
   - Go to: https://vercel.com/dashboard
   - Find your project: `better-test-auth`
   - Check "Deployments" tab for deployment history

2. **GitHub Integration**:
   - If connected, you'll see a Vercel deployment status check on your commits
   - Green checkmark = deployment successful

3. **Project URL**:
   - Production: `https://your-project-name.vercel.app`
   - Preview: `https://your-project-name-git-branch-username.vercel.app`

## Troubleshooting

### No Deployments Showing

1. **Check Repository Connection**:
   - Go to Vercel Dashboard → Your Project → Settings → Git
   - Verify GitHub repository is connected
   - If not, click "Connect Git Repository"

2. **Check Build Logs**:
   - Go to Deployments tab
   - Click on a deployment to see build logs
   - Look for errors in the build process

3. **Manual Trigger**:
   - Go to Deployments tab
   - Click "Redeploy" on the latest deployment
   - Or create a new deployment from a specific commit

### Build Failures

1. **Check Environment Variables**:
   - Ensure all required env vars are set
   - Check they're set for the correct environment (Production/Preview/Development)

2. **Check Build Logs**:
   - Look for specific error messages
   - Common issues:
     - Missing environment variables
     - TypeScript errors
     - Build command failures

3. **Local Build Test**:
   ```bash
   npm run build
   ```
   - If it fails locally, it will fail on Vercel
   - Fix local issues first

### Deployment Not Triggering

1. **Check GitHub Integration**:
   - Go to Project Settings → Git
   - Verify "Production Branch" is set to `main`
   - Check "Auto-deploy" is enabled

2. **Manual Deploy**:
   - Use Vercel CLI: `vercel --prod`
   - Or trigger from Vercel Dashboard

## Next Steps After Deployment

1. **Update Google OAuth Redirect URIs**:
   - Go to Google Cloud Console
   - Add your Vercel URL: `https://your-project-name.vercel.app/api/auth/callback/google`

2. **Update Environment Variables**:
   - Set `BETTER_AUTH_URL` to your production URL
   - Set `NEXT_PUBLIC_APP_URL` to your production URL

3. **Test the Deployment**:
   - Visit your Vercel URL
   - Try the Google login
   - Check browser console for errors
   - Check Vercel function logs

4. **Monitor Logs**:
   - Go to Vercel Dashboard → Your Project → Logs
   - Look for `[AUTH INIT]` logs to verify configuration
   - Check for any errors

## Quick Deploy Checklist

- [ ] Repository pushed to GitHub
- [ ] Vercel account created/logged in
- [ ] Project imported/created in Vercel
- [ ] Environment variables set in Vercel
- [ ] First deployment successful
- [ ] Production URL noted
- [ ] Environment variables updated with production URL
- [ ] Google OAuth redirect URIs updated
- [ ] Login tested on production
- [ ] Logs checked for errors

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Review the `COMPREHENSIVE_FIXES.md` document
4. Check Better-Auth documentation: https://www.better-auth.com/docs
5. Check Vercel documentation: https://vercel.com/docs

