# LangGraph Agent Deployment Guide

Based on comprehensive research, here are your deployment options ranked by recommendation:

## 🥇 Option 1: Railway.app (Recommended - Immediate Fix)

### Why Railway?

- ✅ Excellent Yarn 3 support
- ✅ Simple deployment process
- ✅ Handles monorepos well
- ✅ Built-in health checks
- ✅ Automatic SSL

### Deployment Steps:

1. **Push railway.json to your repo** (already created)
2. **Connect GitHub to Railway**

   ```bash
   # Install Railway CLI
   npm install -g @railway/cli

   # Login and link project
   railway login
   railway link
   ```

3. **Set environment variables** in Railway dashboard
4. **Deploy**
   ```bash
   railway up
   ```

### Cost: ~$10-20/month

---

## 🥈 Option 2: Docker Deployment (Most Flexible)

### Files Created:

- `Dockerfile` - Multi-stage build optimized for production
- `docker-compose.yml` - Complete stack with optional Redis/PostgreSQL

### Quick Deploy to Any VPS:

```bash
# Build and run locally
docker-compose up -d

# Or deploy to production
docker build -t langgraph-agent .
docker run -p 2024:2024 --env-file .env langgraph-agent
```

### Deploy to:

- **DigitalOcean Droplet** (not App Platform)
- **AWS EC2**
- **Google Cloud Compute**
- **Linode**
- **Vultr**

### Cost: $5-20/month depending on provider

---

## 🥉 Option 3: LangGraph Platform (Long-term Solution)

### Self-Hosted Lite (FREE)

```bash
# Install LangGraph Platform
pip install langgraph-platform

# Initialize project
langgraph platform init

# Deploy
langgraph platform deploy
```

### Benefits:

- Official solution
- Free up to 1M executions
- Built-in monitoring
- LangGraph Studio included

---

## 🏃 Quick Test: Local + ngrok

For immediate testing while deciding on deployment:

```bash
# Terminal 1
cd apps/open-swe
yarn dev

# Terminal 2
ngrok http 2024

# Update Vercel with ngrok URL
```

---

## Environment Variables Checklist

Essential variables for all deployments:

```env
# Core
NODE_ENV=production
PORT=2024

# LangSmith (Required)
LANGCHAIN_PROJECT=default
LANGCHAIN_API_KEY=your-key
LANGCHAIN_TRACING_V2=true

# GitHub App (Required)
GITHUB_APP_NAME=your-app-name
GITHUB_APP_ID=your-app-id
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----..."
GITHUB_WEBHOOK_SECRET=your-webhook-secret

# Security (Required)
SECRETS_ENCRYPTION_KEY=your-32-byte-hex-key

# LLM Provider (At least one required)
ANTHROPIC_API_KEY=your-key
OPENAI_API_KEY=your-key
GOOGLE_API_KEY=your-key

# Execution Environment
DAYTONA_API_KEY=your-key  # Or use OPEN_SWE_LOCAL_MODE=true

# Tools
FIRECRAWL_API_KEY=your-key
```

---

## Architecture Summary

```mermaid
graph TB
    A[Vercel Frontend] --> B[LangGraph Agent]
    B --> C{Execution Mode}
    C -->|Production| D[Daytona Sandboxes]
    C -->|Local Mode| E[Local File System]
    B --> F[LangSmith Tracing]
    B --> G[GitHub API]
```

---

## Migration Path

### From DigitalOcean App Platform:

1. **Export environment variables**
2. **Choose deployment option** (Railway recommended)
3. **Deploy using this guide**
4. **Update Vercel's LANGGRAPH_API_URL**
5. **Test thoroughly**
6. **Shut down DigitalOcean app**

---

## Key Insights from Research

1. **`langgraphjs dev` is required** - No simple production build command exists
2. **Vercel is impossible** - LangGraph needs persistent server capabilities
3. **Yarn 3 issues** - Many platforms struggle with Yarn Berry
4. **State management** - Future versions may require Redis/PostgreSQL
5. **Local mode available** - Can bypass Daytona for development

---

## Troubleshooting

### "langgraphjs: command not found"

- Ensure `@langchain/langgraph-cli` is installed
- Use `npx langgraphjs` instead of direct command

### Yarn 3 errors

- Use Railway or Docker (both handle Yarn 3 well)
- Or convert to npm temporarily

### Port conflicts

- Ensure PORT=2024 is set
- Check no other services use this port

---

## Next Steps

1. **Immediate**: Deploy to Railway using the provided config
2. **This week**: Test thoroughly, monitor performance
3. **Long-term**: Evaluate LangGraph Platform for production

## Questions?

The created configurations are production-ready. Just choose your platform and deploy!
