# 🚨 RAILWAY ENVIRONMENT VARIABLES NEEDED

The container is starting successfully but needs environment variables!

## Add These to Railway Variables Tab:

Go to your Railway service → **Variables** tab and add these (from your backend-env-variables.txt):

### Required Variables:

```
GITHUB_APP_ID=your_value
GITHUB_APP_NAME=your_value
GITHUB_APP_CLIENT_ID=your_value
GITHUB_APP_CLIENT_SECRET=your_value
GITHUB_APP_PRIVATE_KEY=your_value
GITHUB_WEBHOOK_SECRET=your_value
GITHUB_APP_REDIRECT_URI=https://justbuild20-production.up.railway.app/api/auth/github/callback

OPEN_SWE_APP_URL=https://justbuild20-production.up.railway.app

SECRETS_ENCRYPTION_KEY=your_value

# Optional but recommended:
LANGCHAIN_API_KEY=your_value
OPENAI_API_KEY=your_value
ANTHROPIC_API_KEY=your_value
```

### Important Notes:

1. **GITHUB_APP_PRIVATE_KEY**: This is a multi-line value. In Railway, you need to:
   - Paste the entire private key including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`
   - Railway should handle the newlines properly

2. **URLs**: Make sure to use your Railway public URL:
   - `https://justbuild20-production.up.railway.app`

3. **Port**: Railway automatically sets PORT, so we don't need to set it

## After Adding Variables:

Railway will automatically redeploy when you add/change variables.

## Current Status:

✅ Docker build successful
✅ Container starting
⏳ Waiting for environment variables
