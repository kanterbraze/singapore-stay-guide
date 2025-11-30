# Deploying the Gemini Proxy Function

## Overview
The Gemini API key is now secured server-side. The client calls a backend proxy function instead of calling Gemini directly.

## Deployment Options

### Option 1: Google Cloud Functions (Recommended)

1. **Install Google Cloud CLI**:
   ```bash
   # If not already installed
   curl https://sdk.cloud.google.com | bash
   gcloud init
   ```

2. **Deploy the function**:
   ```bash
   cd functions
   gcloud functions deploy geminiProxy \
     --runtime nodejs20 \
     --trigger-http \
     --allow-unauthenticated \
     --set-env-vars GEMINI_API_KEY=your_actual_gemini_api_key_here \
     --region asia-southeast1
   ```

3. **Get the function URL**:
   ```bash
   gcloud functions describe geminiProxy --region asia-southeast1
   ```
   
4. **Set the proxy URL** in your `.env.local`:
   ```
   VITE_GEMINI_PROXY_URL=https://asia-southeast1-YOUR_PROJECT.cloudfunctions.net/geminiProxy
   ```

### Option 2: Vercel Serverless Functions

1. **Create `api/gemini.js`** in your project root:
   ```javascript
   // Copy the content from functions/index.js
   // Adapt for Vercel's export format
   export default async function handler(req, res) {
     // ... function code here
   }
   ```

2. **Deploy to Vercel**:
   ```bash
   vercel
   ```

3. **Set environment variable** in Vercel dashboard:
   - `GEMINI_API_KEY` = your actual key

4. **Set proxy URL** in `.env.local`:
   ```
   VITE_GEMINI_PROXY_URL=https://your-app.vercel.app/api/gemini
   ```

### Option 3: Netlify Functions

1. **Create `netlify/functions/gemini.js`**:
   ```javascript
   // Adapt functions/index.js for Netlify format
   exports.handler = async (event, context) => {
     // ... function code here
   }
   ```

2. **Deploy to Netlify**:
   ```bash
   netlify deploy --prod
   ```

3. **Set environment variable** in Netlify dashboard:
   - `GEMINI_API_KEY` = your actual key

4. **Set proxy URL** in `.env.local`:
   ```
   VITE_GEMINI_PROXY_URL=https://your-app.netlify.app/.netlify/functions/gemini
   ```

## Local Development

For local development, you can still use the direct mode (with API key in .env.local) since the code falls back to direct mode when `VITE_GEMINI_PROXY_URL` is not set.

**However**, for production builds, you MUST set the proxy URL.

## Verification

After deployment:

1. Check that `VITE_GEMINI_PROXY_URL` is set
2. Build the app: `npm run build`
3. Search the build output for your Gemini API key - it should NOT appear
4. Test the chat functionality to ensure it works through the proxy

## Security Checklist

- ✅ Gemini API key removed from client bundle
- ✅ Backend function has API key in environment variables
- ✅ CORS properly configured in backend function
- ✅ Google Maps API key has HTTP referrer restrictions
- ✅ .env.local is gitignored
