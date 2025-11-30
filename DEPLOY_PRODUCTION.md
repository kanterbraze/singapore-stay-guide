# Production Deployment Guide

## Overview
You have two components to deploy:
1. **Frontend** (React app) → GitHub Pages ✅ Already configured
2. **Backend** (Gemini API proxy) → Cloud Function ⚠️ Needs deployment

## Option 1: Quick Deploy (Frontend Only - Limited Functionality)

If you want to deploy quickly without the backend, the AI chat features won't work, but the rest of the app will:

```bash
# Deploy frontend to GitHub Pages
./deploy.sh
```

**Limitations**: AI chat, location discovery, and trail generation won't work without the backend.

## Option 2: Full Deploy (Recommended)

### Step 1: Install Google Cloud SDK

```bash
# Install gcloud CLI
curl https://sdk.cloud.google.com | bash

# Restart your terminal, then initialize
gcloud init
```

### Step 2: Deploy Cloud Function

```bash
# Navigate to functions directory
cd functions

# Deploy the function
gcloud functions deploy geminiProxy \
  --runtime nodejs20 \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=YOUR_ACTUAL_GEMINI_API_KEY \
  --region asia-southeast1 \
  --project YOUR_GCP_PROJECT_ID

# Get the function URL
gcloud functions describe geminiProxy --region asia-southeast1 --format="value(httpsTrigger.url)"
```

### Step 3: Configure Frontend

Create/update `.env.local` with the function URL:

```bash
# .env.local
GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_GEMINI_PROXY_URL=https://asia-southeast1-YOUR_PROJECT.cloudfunctions.net/geminiProxy
```

### Step 4: Build and Deploy Frontend

```bash
# Build with production environment
npm run build

# Deploy to GitHub Pages
./deploy.sh
```

## Option 3: Alternative - Vercel (Easiest)

Vercel can host both frontend and serverless functions:

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Create Vercel Function

Create `api/gemini.js`:

```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history, existingLocations } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // ... rest of your Cloud Function logic here
    
    res.status(200).json({ text: 'Response', route: null, generatedLocations: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Step 3: Deploy to Vercel

```bash
# Deploy
vercel

# Set environment variables in Vercel dashboard:
# - GEMINI_API_KEY
# - GOOGLE_MAPS_API_KEY

# Your function will be at: https://your-app.vercel.app/api/gemini
```

### Step 4: Update Frontend

Set in Vercel environment variables:
```
VITE_GEMINI_PROXY_URL=https://your-app.vercel.app/api/gemini
```

## Recommended Approach

**For you**: I recommend **Option 3 (Vercel)** because:
- ✅ Easiest setup (no GCP account needed)
- ✅ Free tier is generous
- ✅ Automatic HTTPS
- ✅ Built-in CI/CD from GitHub
- ✅ Environment variables in dashboard
- ✅ Hosts both frontend and backend

## Quick Start with Vercel

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy (it will ask you questions)
vercel

# 4. Set environment variables in dashboard
# Go to: https://vercel.com/your-username/your-project/settings/environment-variables
# Add: GEMINI_API_KEY and GOOGLE_MAPS_API_KEY

# 5. Redeploy with env vars
vercel --prod
```

## Current Status

- ✅ Frontend code is ready
- ✅ Backend function exists (`functions/index.js`)
- ⚠️ Backend not deployed yet
- ⚠️ `VITE_GEMINI_PROXY_URL` not configured

Choose your deployment method and let me know if you need help with any step!
