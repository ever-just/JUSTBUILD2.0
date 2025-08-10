# 🚨 FORCE RAILWAY TO USE NEW CONFIGURATION

Railway is caching the old build configuration. Here's how to force it to use our new setup:

## Option 1: Through Railway Dashboard (Recommended)

1. Go to your Railway project dashboard
2. Click on your service (JUSTBUILD2.0)
3. Go to **Settings** tab
4. Scroll down to **"Build"** section
5. Look for **"Clear build cache"** button and click it
6. Then go to **Variables** tab and add:
   - `NIXPACKS_NO_CACHE` = `true`
7. Trigger a new deployment by clicking **"Redeploy"**

## Option 2: Force Rebuild via Command

If you have Railway CLI installed:
```bash
railway up --no-cache
```

## Option 3: Manual Trigger with Environment Variable

1. In Railway dashboard, go to Variables
2. Add a new variable:
   - Name: `FORCE_REBUILD`
   - Value: Any random string (like current timestamp)
3. This will trigger a new deployment without cache

## What We Just Fixed

1. Added `nixpacks.toml` that explicitly defines our build process
2. This overrides Railway's default behavior
3. Our custom build script handles the TypeScript issues

## The Build Will Now:

1. Install dependencies with Yarn
2. Run our `scripts/railway-simple-build.sh`
3. Start the app with `yarn workspace @open-swe/agent dev`

**IMPORTANT**: You MUST clear the cache or Railway will keep using the old configuration!
