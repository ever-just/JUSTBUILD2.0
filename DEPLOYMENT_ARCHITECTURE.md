# JUSTBUILD2.0 Deployment Architecture

## Current Setup (As of December 2024)

### Frontend - Vercel

- **URL**: `https://justbuild.everjust.com` (main domain)
- **Technology**: Next.js
- **Why Vercel**: DigitalOcean couldn't handle Yarn 3.5+ properly
- **Benefits**: Better CDN, preview deployments, edge functions

### Backend - DigitalOcean

- **URL**: `https://justbuild.everjust.com/api/agent/*`
- **Technology**: LangGraph Agent (Node.js)
- **Port**: 2024
- **Why DigitalOcean**: Persistent server needed for LangGraph, WebSocket support

### Documentation - DigitalOcean

- **URL**: `https://justbuild.everjust.com/docs`
- **Port**: 3001

## Environment Variables

- **Frontend (Vercel)**: See `vercel-env-variables.txt`
- **Backend (DigitalOcean)**: See `backend-env-variables.txt`

## Deployment Commands

### Update Backend Only (DigitalOcean)

```bash
./scripts/update-digitalocean-backend.sh
```

### Manual Update

```bash
doctl apps update 45438d08-38c3-4c82-8781-ed87b2a8bd0a --spec app-backend-only.yaml
```

## Architecture Diagram

```
┌─────────────────┐         ┌──────────────────────┐
│                 │         │                      │
│     Vercel      │◄────────┤   User Browser       │
│   (Frontend)    │         │                      │
│                 │         └──────────────────────┘
└────────┬────────┘
         │
         │ API Calls
         │ /api/agent/*
         │
┌────────▼────────┐
│                 │
│  DigitalOcean   │
│ (LangGraph API) │
│    Port 2024    │
│                 │
└─────────────────┘
```

## Key Files

- `app.yaml` - Original DigitalOcean config (all services)
- `app-backend-only.yaml` - Updated config (backend only)
- `backend-env-variables.txt` - Environment vars for DigitalOcean backend
