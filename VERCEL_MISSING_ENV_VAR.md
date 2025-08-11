# Critical Missing Environment Variable in Vercel

## 🚨 **Issue Found:**

The frontend is failing to connect to the Railway backend because of a **missing environment variable** in Vercel.

## 🔍 **Root Cause:**

The JUSTBUILD2.0 frontend uses **two different environment variables** for backend communication:

1. **`LANGGRAPH_API_URL`** ✅ - Used by server-side API passthrough (`/api/[..._path]/route.ts`)
2. **`NEXT_PUBLIC_API_URL`** ❌ - Used by client-side React components

## 📋 **Current Vercel Environment Variables:**

**Present:**

- `LANGGRAPH_API_URL` = `https://justbuild20-production.up.railway.app` ✅

**Missing:**

- `NEXT_PUBLIC_API_URL` = **NOT SET** ❌

## 🔧 **Fix Required:**

Add this environment variable to Vercel:

```
NEXT_PUBLIC_API_URL=https://justbuild20-production.up.railway.app
```

## 📁 **Where Client Components Use This:**

1. **`apps/web/src/providers/Thread.tsx:44`** - Creates LangGraph client
2. **`apps/web/src/components/thread/agent-inbox/components/thread-actions-view.tsx:88`** - Studio URL construction
3. **`apps/web/src/utils/github.ts:3`** - Base API URL with fallback to localhost

## 🎯 **Steps to Fix:**

1. Go to **Vercel Dashboard** → **justbuild-2-0-web** → **Settings** → **Environment Variables**
2. Click **"Add Environment Variable"**
3. Set:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://justbuild20-production.up.railway.app`
   - **Environment**: `Production` (or All Environments)
4. **Redeploy** the application

## ✅ **Expected Result:**

After adding this variable and redeploying:

- ✅ Frontend will connect to Railway backend
- ✅ No more 401 errors in browser console
- ✅ GitHub OAuth and app functionality will work
- ✅ Full end-to-end automation ready

## 🚀 **This is the final piece needed for full functionality!**
