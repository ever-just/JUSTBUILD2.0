# 🚨 RAILWAY CACHE CLEARING INSTRUCTIONS

Since you can't find the "Clear build cache" button, here's what to do:

## IMMEDIATE ACTION: Add These Environment Variables

1. You're already in Settings - now go to the **Variables** tab (should be in the service view, not project settings)
2. Add these variables:
   ```
   NIXPACKS_NO_CACHE = true
   RAILWAY_SKIP_BUILD_CACHE = true
   ```

## What I Just Did:

- Pushed a new commit (e6e433b) to trigger a fresh deployment
- This should force Railway to pick up our new configuration

## Watch for These in the Build Logs:

### ❌ OLD (Cached) Build Shows:

```
build │ NODE_ENV=production yarn install --frozen-lockfile && yarn workspace @open-swe/agent build
```

### ✅ NEW (Our Fix) Build Should Show:

```
build │ bash scripts/railway-simple-build.sh
```

## If Still Using Old Build:

1. Try removing and re-adding the GitHub repo connection
2. Or create a new Railway service from scratch
3. Or contact Railway support - their cache might be stuck

## Current Status:

- Commit e6e433b pushed
- This includes all our fixes:
  - Custom nixpacks.toml
  - Enhanced build script with fallbacks
  - Fixed module exports

The deployment should start any moment. Check the logs!
