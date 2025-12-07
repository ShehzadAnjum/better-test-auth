# Setup Guide

## Quick Setup Checklist

### 1. Generate Secret Key
```bash
npm run generate-secret
```
Copy the generated secret to your `.env.local` file.

### 2. Set Up Google OAuth

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API** (or Google Identity API)
4. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
5. Configure OAuth consent screen (if not done):
   - User Type: External
   - App name: Your app name
   - Support email: Your email
   - Authorized domains: localhost (for dev)
6. Create OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Name: Better Auth App
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for local)
     - `https://your-app.vercel.app/api/auth/callback/google` (for production)
7. Copy **Client ID** and **Client Secret**

### 3. Set Up Database

Choose one of these options:

#### Option A: Vercel Postgres (Recommended for Vercel deployment)
1. In Vercel dashboard, go to your project
2. Navigate to **Storage** → **Create Database** → **Postgres**
3. Copy the connection string

#### Option B: Supabase (Free tier available)
1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Go to **Settings** → **Database**
4. Copy the connection string (URI format)

#### Option C: Neon (Serverless Postgres)
1. Go to [Neon](https://neon.tech/)
2. Create a new project
3. Copy the connection string

#### Option D: Local PostgreSQL
```bash
# Install PostgreSQL (if not installed)
# Create database
createdb better_auth

# Connection string format:
# postgresql://username:password@localhost:5432/better_auth
```

### 4. Create Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Better Auth
BETTER_AUTH_SECRET=<paste-generated-secret>
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000 and test the Google login!

### 6. Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click **New Project**
   - Import your GitHub repository
   - Add environment variables:
     - `DATABASE_URL`
     - `BETTER_AUTH_SECRET`
     - `BETTER_AUTH_URL` (your Vercel URL: `https://your-app.vercel.app`)
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`
     - `NEXT_PUBLIC_APP_URL` (your Vercel URL)
   - Click **Deploy**

3. **Update Google OAuth Redirect URI:**
   - Go back to Google Cloud Console
   - Edit your OAuth 2.0 Client ID
   - Add: `https://your-app.vercel.app/api/auth/callback/google`
   - Save

## Troubleshooting

### Build Errors
- Make sure all environment variables are set
- Verify `BETTER_AUTH_SECRET` is at least 32 characters
- Check database connection string format

### Google OAuth Issues
- Verify redirect URIs match exactly (including protocol)
- Check Client ID and Secret are correct
- Ensure Google+ API is enabled

### Database Connection Issues
- Verify `DATABASE_URL` format is correct
- Check database is accessible
- For Vercel Postgres, use the connection string from dashboard

### Runtime Errors
- Check browser console for errors
- Verify all environment variables are loaded
- Ensure database tables are created (Better Auth does this automatically)

## Next Steps

After successful setup:
- Customize the UI in `src/app/page.tsx`
- Add protected routes
- Extend authentication features
- Add user profile management

