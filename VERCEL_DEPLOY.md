# Vercel Deployment Steps

## ✅ Setup Complete

I've created:
1. ✅ `api/gemini.js` - Serverless function for Gemini API
2. ✅ `vercel.json` - Vercel configuration
3. ⏳ Installing Vercel CLI...

## Next Steps

### Step 1: Install Vercel CLI (in progress)
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```
This will open your browser to authenticate.

### Step 3: Deploy
```bash
vercel
```

Answer the prompts:
- Set up and deploy? **Y**
- Which scope? Choose your account
- Link to existing project? **N**
- Project name? **singapore-stay-guide** (or your choice)
- Directory? **./** (press Enter)
- Override settings? **N**

### Step 4: Set Environment Variables

After deployment, go to your Vercel dashboard:
1. Go to https://vercel.com/dashboard
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```
GEMINI_API_KEY = your_gemini_api_key_here
GOOGLE_MAPS_API_KEY = your_google_maps_api_key_here
VITE_GEMINI_PROXY_URL = https://your-project.vercel.app/api/gemini
```

### Step 5: Redeploy with Environment Variables
```bash
vercel --prod
```

## Your App Will Be Live At:
`https://your-project-name.vercel.app`

## Troubleshooting

If the API doesn't work:
1. Check environment variables are set in Vercel dashboard
2. Check function logs in Vercel dashboard
3. Ensure `VITE_GEMINI_PROXY_URL` points to your Vercel URL

## Alternative: Manual Dashboard Deployment

If CLI doesn't work, you can deploy via GitHub:
1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Set environment variables
5. Deploy!
