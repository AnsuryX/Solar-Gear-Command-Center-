# SolaGear Nexus Deployment Guide

This guide outlines the technical requirements and steps to deploy SolaGear Nexus in a production environment.

## 1. Prerequisites
- **Node.js 20+**
- **Firebase Project:**
  - Enable Firestore.
  - Enable Google Authentication.
  - Create a web app and obtain the config.
- **Developer Portals:**
  - **Google (GA4 & GMB):** Create project in Google Cloud Console, enable "My Business Business Information API" and "Google Analytics Data API".
  - **LinkedIn:** Create app at LinkedIn Developers.
  - **Meta:** Create app at Meta for Developers (for Instagram Graph API).

## 2. Environment Variables
Configure these in your production environment (Cloud Run, Vercel, etc.):

```env
# Core
GEMINI_API_KEY="your-gemini-key"
APP_URL="https://your-app-url.com"

# AI Intelligence
OPENROUTER_API_KEY="your-openrouter-key"
VITE_AI_PROVIDER="openrouter"
VITE_AI_MODEL_ID="google/gemini-2.0-flash-lite-001"

# OAuth (Google, LinkedIn, Meta)
GOOGLE_ADS_CLIENT_ID="xxx"
GOOGLE_ADS_CLIENT_SECRET="xxx"
LINKEDIN_CLIENT_ID="xxx"
LINKEDIN_CLIENT_SECRET="xxx"
META_APP_ID="xxx"
META_APP_SECRET="xxx"
```

## 3. Deployment Steps

### Build Frontend
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## 4. OAuth Callbacks
Ensure your developers ports authorize these URIs:
- `${APP_URL}/api/auth/google/callback`
- `${APP_URL}/api/auth/linkedin/callback`
- `${APP_URL}/api/auth/meta/callback`

## 5. Security Protocols
- All tokens are stored in `localStorage` for privacy (Zero-Server-Storage approach).
- Firebase Security Rules are managed via `firestore.rules`.
- Ensure `NODE_ENV=production` is set to serve static assets from `/dist`.
