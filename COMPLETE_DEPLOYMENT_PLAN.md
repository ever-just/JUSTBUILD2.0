# Complete Deployment Plan for JUSTBUILD2.0

## Current Setup Review

### What You Have:

```
JUSTBUILD2.0/
├── apps/
│   ├── web/          → Frontend (Next.js)
│   ├── open-swe/     → Backend (LangGraph agent)
│   ├── docs/         → Documentation site
│   └── cli/          → CLI tool
└── packages/
    └── shared/       → Shared utilities
```

### Current Status:

- **Frontend**: Already on Vercel at justbuild.everjust.com ✅
- **Backend**: Failing on DigitalOcean (Yarn 3 issues) ❌
- **Problem**: LangGraph needs persistent server, Vercel is serverless

## The Hard Truth: You CANNOT Put Everything on Vercel

**Why?**

- Vercel = Serverless functions (max 5 min timeout)
- LangGraph = Persistent server (runs continuously)
- These are fundamentally incompatible

## Your Options (Ranked by Recommendation)

### Option 1: Vercel + Railway ⭐ RECOMMENDED

**Best balance of simplicity and cost**

```mermaid
graph LR
    A[Vercel<br/>Frontend<br/>$0-20/mo] --> B[Railway<br/>LangGraph Backend<br/>$10-20/mo]
    B --> C[Daytona<br/>Sandboxes]

    style A fill:#51cf66
    style B fill:#51cf66
```

**Total Cost**: $10-40/month
**Setup Time**: 30 minutes

### Option 2: Everything on Railway

**Simplest architecture**

```mermaid
graph LR
    A[Railway<br/>Frontend + Backend<br/>$20-30/mo] --> B[Daytona<br/>Sandboxes]

    style A fill:#51cf66
```

**Total Cost**: $20-30/month
**Setup Time**: 20 minutes

### Option 3: Fix DigitalOcean

**Keep current architecture**

```mermaid
graph LR
    A[Vercel<br/>Frontend<br/>$0-20/mo] --> B[DigitalOcean<br/>Backend<br/>$10-20/mo]
    B --> C[Daytona<br/>Sandboxes]

    style A fill:#51cf66
    style B fill:#ffd43b
```

**Total Cost**: $10-40/month
**Setup Time**: 2+ hours (dealing with npm/Yarn issues)

## Recommended Plan: Option 1 (Vercel + Railway)

### Step 1: Keep Frontend on Vercel ✅

No changes needed - it's already working!

### Step 2: Deploy Backend to Railway

#### 2.1 Prepare Repository

```bash
# Ensure railway.json is committed
git add railway.json
git commit -m "Add Railway configuration"
git push
```

#### 2.2 Set Up Railway

1. Go to [railway.app](https://railway.app)
2. Sign up/login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `ever-just/JUSTBUILD2.0` repository
5. Railway will detect the `railway.json` automatically

#### 2.3 Configure Environment Variables

In Railway dashboard, add all these:

```env
# Core
NODE_ENV=production
PORT=2024
OPEN_SWE_APP_URL=https://justbuild.everjust.com

# LangSmith (from backend-env-variables.txt)
LANGCHAIN_PROJECT=default
LANGCHAIN_API_KEY=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
LANGCHAIN_TRACING_V2=true

# GitHub App
GITHUB_APP_NAME=justbuild2-0
GITHUB_APP_ID=1091338
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
[full key from backend-env-variables.txt]
-----END RSA PRIVATE KEY-----"
GITHUB_WEBHOOK_SECRET=5f8e7d9c6b3a4f2e1d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e
SECRETS_ENCRYPTION_KEY=2e7f8d9a4b6c3e5f1a8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f

# LLM Providers
ANTHROPIC_API_KEY=[from backend-env-variables.txt]
OPENAI_API_KEY=[from backend-env-variables.txt]
GOOGLE_API_KEY=[from backend-env-variables.txt]

# Infrastructure
DAYTONA_API_KEY=[from backend-env-variables.txt]
FIRECRAWL_API_KEY=[from backend-env-variables.txt]
```

#### 2.4 Deploy

Railway will automatically:

- Build your app using Yarn 3
- Start the LangGraph server
- Provide you with a URL like: `your-app.railway.app`

### Step 3: Update Vercel Frontend

#### 3.1 Get Railway Backend URL

Once deployed, Railway provides: `https://your-app-name.railway.app`

#### 3.2 Update Vercel Environment Variables

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update:

```env
NEXT_PUBLIC_API_URL=https://your-app-name.railway.app/api/agent
LANGGRAPH_API_URL=https://your-app-name.railway.app
```

#### 3.3 Redeploy Vercel

```bash
vercel --prod
```

### Step 4: Update GitHub App Webhook

1. Go to GitHub → Settings → Developer settings → GitHub Apps
2. Select your app
3. Update Webhook URL to: `https://your-app-name.railway.app/api/webhooks/github`

### Step 5: Test Everything

1. Visit https://justbuild.everjust.com
2. Test GitHub authentication
3. Create a test issue
4. Verify agent responds

## Migration Timeline

### Day 1 (Today)

- [ ] Deploy backend to Railway (30 min)
- [ ] Update Vercel env vars (10 min)
- [ ] Update GitHub webhook (5 min)
- [ ] Basic testing (15 min)

### Day 2-3

- [ ] Monitor performance
- [ ] Check logs for errors
- [ ] Test all workflows

### Day 4-7

- [ ] If stable, cancel DigitalOcean
- [ ] Document new architecture
- [ ] Set up monitoring

## Why NOT DigitalOcean?

1. **Yarn 3 Issues**: Persistent build failures
2. **Complex Fixes**: Requires npm workarounds
3. **Time Sink**: Already spent hours debugging

## Why Railway?

1. **Yarn 3 Support**: Works out of the box
2. **Simple**: Connect GitHub and deploy
3. **Monitoring**: Built-in logs and metrics
4. **Scaling**: Easy to scale up/down

## Fallback Plan

If Railway doesn't work:

1. **Docker + VPS**: Use provided Dockerfile
2. **LangGraph Cloud**: Official managed solution
3. **Local + ngrok**: For immediate testing

## Cost Summary

| Component | Platform | Monthly Cost |
| --------- | -------- | ------------ |
| Frontend  | Vercel   | $0-20        |
| Backend   | Railway  | $10-20       |
| **Total** |          | **$10-40**   |

## Next Action

**Start with Step 2.1** - The Railway setup. I can help you through each step!

Ready to begin?
