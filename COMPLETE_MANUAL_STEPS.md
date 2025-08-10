# 🔧 Complete Manual Steps - Everything You Need

## Current Status

- ✅ DigitalOcean configuration updated (removed web service & domain)
- ❌ Deployment failing due to build error
- 🔄 Need to update Vercel with new backend URL

## Step 1: Update Vercel (Do This NOW)

### Backend URL to Use:

```
LANGGRAPH_API_URL=https://open-swe-justbuild-8ov9x.ondigitalocean.app/api/agent
```

### Manual Steps:

1. Go to: https://vercel.com/dashboard
2. Find your JUSTBUILD project
3. Click on the project
4. Go to "Settings" tab
5. Click "Environment Variables" (left sidebar)
6. Find `LANGGRAPH_API_URL`
7. Click the edit button (pencil icon)
8. Update value to: `https://open-swe-justbuild-8ov9x.ondigitalocean.app/api/agent`
9. Save changes
10. Go to "Deployments" tab
11. Click "Redeploy" on the latest deployment

## Step 2: Fix DigitalOcean Build (Optional)

The deployment is failing but the OLD deployment should still be running at the URL above.

To fix the build error:

1. Go to: https://cloud.digitalocean.com/apps/45438d08-38c3-4c82-8781-ed87b2a8bd0a
2. Click "Settings" → "Components"
3. Find "agent" component
4. Click "Edit"
5. Update Build Command to:

```bash
export NODE_OPTIONS="--max-old-space-size=4096"
yarn install --frozen-lockfile
yarn build
```

6. Save and redeploy

## Step 3: Test Everything

After Vercel redeploys (2-3 minutes):

1. Visit: https://justbuild.everjust.com
2. Try to log in
3. If it works - YOU'RE DONE! 🎉
4. If not, check browser console for errors

## Troubleshooting

### If API calls still fail:

- The backend URL might be different
- Check DigitalOcean dashboard for the actual URL
- Update Vercel again with correct URL

### If login redirects fail:

- GitHub App redirect URL is still set to justbuild.everjust.com
- This should work fine with Vercel

## Quick Test Commands

```bash
# Test backend directly
curl https://open-swe-justbuild-8ov9x.ondigitalocean.app/api/agent/ok

# Should return some response (not 404)
```

## Summary

The most important step is updating Vercel's `LANGGRAPH_API_URL` to point to the DigitalOcean backend URL. Everything else is optional optimization.
