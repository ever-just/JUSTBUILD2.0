# 🚀 DigitalOcean Backend Update Guide

## Current Situation

Based on our deployment evolution [[memory:5713894]]:

- **Frontend**: Already deployed to Vercel (due to Yarn 3.5 compatibility issues)
- **Backend**: Needs to stay on DigitalOcean (LangGraph agent)
- **Current DO Setup**: Still has all services (web, agent, docs) from before

## Goal

Update DigitalOcean to only run the backend LangGraph agent, removing the redundant frontend service.

---

## Step 1: Create Updated app.yaml

Create `app-backend-only.yaml`:

```yaml
name: open-swe-justbuild
region: nyc
domains:
  - domain: justbuild.everjust.com
    type: PRIMARY

services:
  # Backend LangGraph Agent Service
  - name: agent
    github:
      repo: ever-just/JUSTBUILD2.0
      branch: main
      deploy_on_push: true
    source_dir: /
    build_command: |
      export NODE_OPTIONS="--max-old-space-size=4096"
      npm install -g turbo@^2.5.0
      npm install --package-lock=false
      npx turbo build --filter=@open-swe/agent
    run_command: |
      npx turbo dev --filter=@open-swe/agent
    http_port: 2024
    instance_count: 1
    instance_size_slug: professional-xs
    routes:
      - path: /api/agent
    health_check:
      http_path: /api/agent/ok
    envs:
      # All existing backend environment variables from backend-env-variables.txt
      - key: NODE_ENV
        value: production
        scope: RUN_AND_BUILD_TIME
      - key: PORT
        value: "2024"
        scope: RUN_AND_BUILD_TIME
      # ... (all other env vars remain the same)

  # Optional: Keep docs if needed
  - name: docs
    github:
      repo: ever-just/JUSTBUILD2.0
      branch: main
      deploy_on_push: true
    source_dir: /
    build_command: |
      export NODE_OPTIONS="--max-old-space-size=4096"
      npm install -g turbo@^2.5.0
      npm install --package-lock=false
      npx turbo build --filter=@open-swe/docs
    run_command: |
      npx turbo start --filter=@open-swe/docs
    http_port: 3001
    instance_count: 1
    instance_size_slug: professional-xs
    routes:
      - path: /docs

ingress:
  rules:
    # Backend API routes
    - match:
        path:
          prefix: /api/agent
      component:
        name: agent
        rewrite: /

    # Docs routes (if keeping docs)
    - match:
        path:
          prefix: /docs
      component:
        name: docs

    # Redirect root to Vercel frontend
    - match:
        path:
          prefix: /
      redirect:
        authority: "your-frontend.vercel.app" # Replace with actual Vercel URL
        scheme: https
```

---

## Step 2: Environment Variables Setup

The `backend-env-variables.txt` file contains all the environment variables needed for the DigitalOcean backend deployment:

### Key Variables:

- **LangChain/LangSmith**: API keys and tracing
- **LLM Providers**: OpenAI, Anthropic keys (if configured)
- **Infrastructure**: Daytona API keys
- **GitHub App**: App ID, private key, webhook secret
- **Port**: 2024 (for the LangGraph agent)

---

## Step 3: Deploy the Update

### Using DigitalOcean CLI:

```bash
# First, validate the configuration
doctl apps spec validate app-backend-only.yaml

# Update the app
doctl apps update 45438d08-38c3-4c82-8781-ed87b2a8bd0a --spec app-backend-only.yaml
```

### Using DigitalOcean Dashboard:

1. Go to App Platform
2. Select `open-swe-justbuild`
3. Click "Settings" → "App Spec"
4. Replace with contents of `app-backend-only.yaml`
5. Click "Save" and deploy

---

## Step 4: Update DNS/Routing

Since the frontend is on Vercel, you'll need to ensure:

1. **API subdomain** (recommended):

   ```
   api.justbuild.everjust.com → DigitalOcean (backend)
   justbuild.everjust.com → Vercel (frontend)
   ```

2. **Or use path-based routing**:
   - `/api/agent/*` → DigitalOcean
   - Everything else → Vercel

---

## Step 5: Update Frontend Environment Variables

Ensure the Vercel frontend has:

```
NEXT_PUBLIC_API_URL=https://justbuild.everjust.com/api/agent
LANGGRAPH_API_URL=https://justbuild.everjust.com/api/agent
```

---

## Step 6: Verify the Deployment

1. **Check backend health**:

   ```bash
   curl https://justbuild.everjust.com/api/agent/ok
   ```

2. **Test API connectivity from frontend**:
   - Create a thread
   - Send a message
   - Verify agent responds

3. **Monitor logs**:
   ```bash
   doctl apps logs 45438d08-38c3-4c82-8781-ed87b2a8bd0a --follow
   ```

---

## Benefits of This Architecture

1. **Frontend on Vercel**:
   - Better CDN performance
   - Automatic scaling
   - Preview deployments
   - Works with Yarn 3.5+

2. **Backend on DigitalOcean**:
   - Persistent connections for LangGraph
   - WebSocket support
   - Fixed costs
   - Better for long-running processes

---

## Rollback Plan

If issues arise:

1. Keep the original `app.yaml` backup
2. Revert using: `doctl apps update <app-id> --spec app-original.yaml`
3. Changes apply within 5-10 minutes

---

## Cost Optimization

With frontend removed from DigitalOcean:

- Reduced compute usage (1 less service)
- Lower bandwidth costs (static assets served by Vercel)
- Estimated savings: ~30-40% on DigitalOcean bill
