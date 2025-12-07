# Quick Start Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Generate Secret Key

```bash
npm run generate-secret
```

Copy the generated secret to your `.env.local` file.

## 3. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select a project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add redirect URI: `http://localhost:3000/api/auth/callback/google`

## 4. Set Up Database

You need a PostgreSQL database. Options:

- **Vercel Postgres**: Free tier available, perfect for deployment
- **Supabase**: Free PostgreSQL database
- **Neon**: Serverless PostgreSQL
- **Local PostgreSQL**: For development

## 5. Create `.env.local` File

```env
DATABASE_URL=postgresql://user:password@host:5432/database
BETTER_AUTH_SECRET=<paste-generated-secret>
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 6. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000 and click "Sign in with Google"!

## 7. Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Update Google OAuth redirect URI to your Vercel URL
5. Deploy!

For detailed instructions, see [README.md](./README.md)

