# Railway Deployment Troubleshooting

## Common Issues & Solutions

### 1. Build Fails

**Error**: "Cannot find module" or TypeScript errors
**Solution**:

- Railway should handle Yarn 3 automatically
- If issues persist, check Railway build logs
- Ensure all dependencies are in package.json

### 2. Port Issues

**Error**: "Port 2024 already in use" or app not accessible
**Solution**:

- Railway handles ports automatically
- The PORT env var (2024) tells your app which port to listen on
- Railway will expose it on HTTPS automatically

### 3. Environment Variables Not Working

**Error**: "Missing API key" or authentication errors
**Solution**:

- Double-check all vars are in Railway dashboard
- Use Raw Editor to paste all at once
- Check for line breaks in GITHUB_APP_PRIVATE_KEY

### 4. Health Check Failing

**Error**: Railway shows app as unhealthy
**Solution**:

- The health check endpoint is `/api/agent/ok`
- Check Railway logs for startup errors
- May take 2-3 minutes for first deployment

### 5. Memory Issues

**Error**: "JavaScript heap out of memory"
**Solution**:

- Railway provides 8GB RAM by default
- Should be sufficient for LangGraph
- If issues persist, can upgrade Railway plan

### 6. GitHub Webhook Not Working

**Symptoms**: Issues/PRs not triggering agent
**Solution**:

- Verify webhook URL includes `/api/webhooks/github`
- Check webhook secret matches env var
- Look for webhook delivery logs in GitHub

### 7. Vercel Not Connecting

**Error**: "Failed to fetch" or CORS errors
**Solution**:

- Ensure Railway URL is HTTPS (not HTTP)
- Update both NEXT_PUBLIC_API_URL and LANGGRAPH_API_URL
- Redeploy Vercel after updating env vars

## Getting Help

### Railway Logs

1. Go to Railway dashboard
2. Click on your deployment
3. Click "View Logs"
4. Look for error messages

### Quick Fixes

- **Restart**: Click "Restart" in Railway dashboard
- **Redeploy**: Push any small change to trigger rebuild
- **Environment**: Double-check all env vars are set

### Still Stuck?

- Railway Discord: https://discord.gg/railway
- Railway Docs: https://docs.railway.app
- Share the error logs and I can help debug!
