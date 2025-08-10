# Quick Railway Deployment Guide

Since DigitalOcean is giving us trouble with Yarn 3, let's try Railway - it's much easier!

## Why Railway?

- ✅ Excellent Yarn 3 (Berry) support
- ✅ Understands monorepos
- ✅ One-click deployments
- ✅ No complex configuration needed

## Steps:

### 1. Prepare Your Repository

First, let's make sure your environment variables are committed safely:

```bash
# Create a .env.example for the agent
cp apps/open-swe/.env apps/open-swe/.env.example
```

### 2. Sign Up for Railway

- Go to [railway.app](https://railway.app)
- Sign in with GitHub
- Click "Start a New Project"

### 3. Deploy from GitHub

- Select "Deploy from GitHub repo"
- Choose your repository: `ever-just/JUSTBUILD2.0`
- Railway will auto-detect the monorepo structure

### 4. Configure the Service

In Railway dashboard:

- Click on your service
- Go to Settings tab
- Set Root Directory: `/`
- Set Build Command: `yarn install && yarn workspace @open-swe/agent build`
- Set Start Command: `yarn workspace @open-swe/agent dev`

### 5. Add Environment Variables

Click "Variables" and add all from your `backend-env-variables.txt`:

- NODE_ENV=production
- PORT=2024
- LANGCHAIN_API_KEY=...
- GITHUB_APP_ID=...
- etc.

### 6. Get Your URL

Once deployed, Railway will give you a URL like:
`https://your-app.up.railway.app`

### 7. Update Vercel

Go to your Vercel project and update:

```
LANGGRAPH_API_URL=https://your-app.up.railway.app
```

## Alternative: Quick Local Test with ngrok

If you want to test RIGHT NOW:

```bash
# Terminal 1: Start the agent locally
cd apps/open-swe
yarn dev

# Terminal 2: Expose it to the internet
ngrok http 2024

# You'll get a URL like: https://abc123.ngrok.io
# Update Vercel with this URL temporarily
```

## That's it!

Railway handles all the complexity that DigitalOcean is struggling with. Your Yarn 3 setup will just work!

Want me to help you set this up?
