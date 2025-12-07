# Better Auth - Google Login

A simple Next.js application with Google OAuth authentication using Better Auth, ready for deployment on Vercel.

## Features

- 🔐 Google OAuth authentication
- 🚀 Ready for Vercel deployment
- 📱 Responsive design
- ⚡ Built with Next.js 14 and TypeScript

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or hosted)
- Google OAuth credentials

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - For local: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://your-domain.vercel.app/api/auth/callback/google`
7. Copy the Client ID and Client Secret

### 3. Set Up Database

Better Auth requires a PostgreSQL database. You can use:

- **Local PostgreSQL**: Install and run PostgreSQL locally
- **Vercel Postgres**: Use Vercel's managed PostgreSQL
- **Other providers**: Supabase, Neon, Railway, etc.

The database tables will be automatically created by Better Auth on first run.

### 4. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in the values:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/better_auth
BETTER_AUTH_SECRET=your-secret-key-here-min-32-characters
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important**: Generate a secure random string for `BETTER_AUTH_SECRET` (at least 32 characters). You can use:

```bash
openssl rand -base64 32
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables in Vercel:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `BETTER_AUTH_SECRET` - Your secret key
   - `BETTER_AUTH_URL` - Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
   - `GOOGLE_CLIENT_ID` - Your Google OAuth Client ID
   - `GOOGLE_CLIENT_SECRET` - Your Google OAuth Client Secret
   - `NEXT_PUBLIC_APP_URL` - Your Vercel deployment URL

5. Click "Deploy"

### 3. Update Google OAuth Redirect URI

After deployment, update your Google OAuth redirect URI in Google Cloud Console to include your Vercel URL:

```
https://your-app.vercel.app/api/auth/callback/google
```

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── [...all]/
│   │   │           └── route.ts    # Auth API routes
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                 # Home page with login
│   │   ├── providers.tsx            # Auth provider wrapper
│   │   └── globals.css              # Global styles
│   └── lib/
│       └── auth.ts                  # Better Auth configuration
├── .env.example                     # Environment variables template
├── next.config.js                   # Next.js configuration
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript configuration
└── vercel.json                      # Vercel configuration
```

## How It Works

1. User clicks "Sign in with Google"
2. They are redirected to Google's OAuth consent screen
3. After authorization, Google redirects back to `/api/auth/callback/google`
4. Better Auth handles the callback and creates/updates the user session
5. User is redirected back to the home page, now authenticated

## Troubleshooting

### Database Connection Issues

- Ensure your `DATABASE_URL` is correct
- Check that your database is accessible
- For Vercel Postgres, use the connection string from the Vercel dashboard

### Google OAuth Issues

- Verify redirect URIs match exactly (including protocol and trailing slashes)
- Check that Client ID and Secret are correct
- Ensure Google+ API is enabled in Google Cloud Console

### Build Errors

- Make sure all environment variables are set
- Check that `BETTER_AUTH_SECRET` is at least 32 characters
- Verify database connection string format

## License

MIT

