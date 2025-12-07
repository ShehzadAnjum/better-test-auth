# Environment Settings from evolution_to_do Project

## Backend Settings (from backend/.env)

```env
# Better-Auth Secret for JWT signing
BETTER_AUTH_SECRET=JU1I9zfPxGQAoOoeD+J/GWr0tyR3Zs4cO5kfQdmz/0E=

# Backend URL
BETTER_AUTH_URL=http://localhost:3000

# Allowed CORS origins
CORS_ORIGINS=http://localhost:3001
```

## Frontend Settings (from frontend/.env.local)

```env
# Better-Auth Secret (auto-generated)
BETTER_AUTH_SECRET=JU1I9zfPxGQAoOoeD+J/GWr0tyR3Zs4cO5kfQdmz/0E=

# Better-Auth Base URL (local development)
BETTER_AUTH_URL=http://localhost:3000

# Backend API URL (will update after backend deployment)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Google OAuth
GOOGLE_CLIENT_ID=1008434151113-hie7jtd2lr5pkms6fvqolnltv9ejvuo4.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

## Summary of Non-Database Settings

### Better Auth Configuration
- **BETTER_AUTH_SECRET**: `JU1I9zfPxGQAoOoeD+J/GWr0tyR3Zs4cO5kfQdmz/0E=`
- **BETTER_AUTH_URL**: `http://localhost:3000`

### Google OAuth
- **GOOGLE_CLIENT_ID**: `1008434151113-hie7jtd2lr5pkms6fvqolnltv9ejvuo4.apps.googleusercontent.com`
- **GOOGLE_CLIENT_SECRET**: `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`

### API Configuration
- **NEXT_PUBLIC_API_URL**: `http://localhost:8000` (frontend only)
- **CORS_ORIGINS**: `http://localhost:3001` (backend only)

## Recommended Settings for better-test-auth

Based on the evolution_to_do project, here are the recommended settings:

```env
# Better Auth
BETTER_AUTH_SECRET=JU1I9zfPxGQAoOoeD+J/GWr0tyR3Zs4cO5kfQdmz/0E=
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=1008434151113-hie7jtd2lr5pkms6fvqolnltv9ejvuo4.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Note**: You'll still need to add your own `DATABASE_URL` for the database connection.

