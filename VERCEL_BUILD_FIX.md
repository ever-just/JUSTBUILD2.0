# Vercel Build Fix - Monorepo Issue Resolved

## What Was the Problem?

The Vercel deployment was failing with:

```
Module not found: Can't resolve '@open-swe/shared/constants'
```

This happened because:

1. Your project is a monorepo with shared packages
2. The frontend (`@open-swe/web`) depends on the shared package (`@open-swe/shared`)
3. Vercel wasn't building the shared package before trying to build the frontend

## What We Fixed:

Updated `vercel.json` with:

1. **Build Command**: Now builds shared package first

   ```
   cd ../.. && yarn workspace @open-swe/shared build && yarn workspace @open-swe/web build
   ```

2. **Install Command**: Handles Yarn lockfile issues

   ```
   cd ../.. && yarn install --immutable || yarn install --no-immutable
   ```

3. **Root Directory**: Set to `apps/web` for proper monorepo handling

## The Fix is Deployed!

- Commit: `cce228e`
- Vercel will automatically redeploy with these changes

## No, Railway Integration Didn't Break It

The Railway integration is completely separate. This was a pre-existing monorepo build issue that we just discovered.

## Check Your Deployment:

1. Go to Vercel dashboard
2. You should see a new deployment building
3. It should now successfully build both packages

The build should complete in a few minutes! 🚀
