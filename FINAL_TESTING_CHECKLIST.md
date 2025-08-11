# JUSTBUILD2.0 - Final Testing Checklist

## 🎯 **Critical Items to Test Once Railway Deployment Completes**

### 1. ✅ **Infrastructure Tests**

- [x] Frontend accessible: `https://justbuild.everjust.com`
- [x] Backend accessible: `https://justbuild20-production.up.railway.app`
- [x] Backend health: LangGraph server responds to requests
- [x] CORS: Frontend can communicate with backend

### 2. 🔐 **Authentication Flow Tests**

- [ ] GitHub OAuth login works
- [ ] User can sign in and get redirected properly
- [ ] JWT tokens are generated and stored
- [ ] Auth status shows correctly in UI

### 3. 🔧 **GitHub App Integration Tests**

- [ ] App installation flow works
- [ ] Repository selection works
- [ ] Branch selection works
- [ ] Webhook delivery works (test with issue creation)

### 4. 🤖 **LangGraph Agent Tests**

- [ ] Agent API endpoints respond
- [ ] Graphs are registered (programmer, planner, manager)
- [ ] Agent can receive webhook events
- [ ] Agent can process GitHub issues

### 5. 🔄 **End-to-End Workflow Test**

- [ ] User signs in with GitHub
- [ ] User installs GitHub App on repository
- [ ] User creates/labels GitHub issue
- [ ] Webhook triggers agent processing
- [ ] Agent creates PR with solution

## 🧪 **Test Commands to Run**

### Backend API Tests:

```bash
# Basic connectivity
curl -I https://justbuild20-production.up.railway.app

# LangGraph API endpoints
curl https://justbuild20-production.up.railway.app/threads
curl https://justbuild20-production.up.railway.app/runs

# Health/status check
curl https://justbuild20-production.up.railway.app/api/agent/ok
```

### Frontend Tests:

```bash
# Basic connectivity
curl -I https://justbuild.everjust.com

# Check for CORS errors in browser console
# Navigate to site and open Developer Tools
```

### GitHub Integration Tests:

```bash
# Test webhook endpoint
curl -X POST https://justbuild20-production.up.railway.app/webhooks/github \
  -H "Content-Type: application/json" \
  -d '{"test": "webhook"}'
```

## 🚨 **Known Issues to Monitor**

1. **Port Binding**: Ensure LangGraph logs show `Server running at 0.0.0.0:2024`
2. **CORS Headers**: Check browser console for CORS errors
3. **Environment Variables**: Verify all API keys are set correctly
4. **GitHub App URLs**: Ensure webhook/callback URLs match deployment URLs

## ✅ **Success Criteria**

### Must Work:

1. Backend returns HTTP 200/404 (not 502)
2. Frontend loads without CORS errors
3. GitHub OAuth redirects properly
4. Webhook endpoint accepts POST requests

### Should Work:

1. Full GitHub App installation flow
2. Issue labeling triggers agent
3. Agent creates PRs
4. End-to-end automation

## 🔍 **Debugging Steps if Issues Persist**

### If Backend Still Returns 502:

1. Check Railway deploy logs for errors
2. Verify Dockerfile CMD uses `--host 0.0.0.0`
3. Check if port 2024 is properly exposed
4. Review environment variables

### If CORS Errors Occur:

1. Verify CORS middleware in `apps/open-swe/src/routes/app.ts`
2. Check that `justbuild.everjust.com` is in allowed origins
3. Ensure backend is accessible from frontend

### If GitHub Integration Fails:

1. Verify webhook URL: `https://justbuild20-production.up.railway.app/webhooks/github`
2. Check GitHub App redirect URI: `https://justbuild.everjust.com/api/auth/github/callback`
3. Verify environment variables match in both Vercel and Railway

## 📊 **Expected Response Examples**

### Healthy Backend Response:

```json
{
  "runs": [],
  "total": 0
}
```

### Healthy Frontend Response:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Open SWE</title>
    ...
  </head>
</html>
```

### Working Webhook Response:

```json
{
  "status": "ok",
  "message": "Webhook received"
}
```
