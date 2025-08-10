# 📋 DigitalOcean Backend Update - Comprehensive Plan

## Current State Analysis (100% Confidence)

### ✅ What We Know:
1. **Frontend**: Already on Vercel at `justbuild.everjust.com` (confirmed by `server: Vercel` header)
2. **Backend**: Running on DigitalOcean but frontend gets 500 errors when calling `/api/agent`
3. **DigitalOcean**: Still has all 3 services (web, agent, docs) - web is redundant
4. **Domain**: `justbuild.everjust.com` points to Vercel, not DigitalOcean

### 🔍 Key Issue Found:
The Vercel frontend is trying to proxy API calls to DigitalOcean but it's not working properly. This needs to be fixed BEFORE we update DigitalOcean.

---

## 🎯 Action Plan

### Phase 1: Fix API Connection (PRIORITY)

**Problem**: API calls return 500 error from Vercel
**Solution**: Update Vercel environment variables

1. **Check Vercel Environment Variables**:
   ```
   LANGGRAPH_API_URL = Should point to DigitalOcean backend
   ```

2. **Options for Backend URL**:
   - Option A: Use DigitalOcean app URL directly
   - Option B: Configure subdomain (api.justbuild.everjust.com)

### Phase 2: Update DigitalOcean Configuration

1. **Remove redundant web service**
2. **Keep agent and docs services**
3. **Update ingress rules**

### Phase 3: Verify Everything Works

1. **Test API health check**
2. **Test full functionality**
3. **Monitor logs**

---

## 🚀 Execution Steps

### Step 1: Find DigitalOcean Backend URL

The backend is accessible at the DigitalOcean app's direct URL. We need to find this and update Vercel.

### Step 2: Update Vercel Environment Variables

Set in Vercel Dashboard:
```
LANGGRAPH_API_URL=https://open-swe-justbuild-xxxxx.ondigitalocean.app/api/agent
```

### Step 3: Update DigitalOcean

Run the update script:
```bash
./scripts/update-digitalocean-backend.sh
```

---

## ⚠️ Critical Considerations

1. **API Connection Must Work First**: Don't remove the web service until we confirm the API works
2. **Ingress Rules**: After removing web service, `/api/agent` will still route correctly
3. **No Downtime**: The backend remains accessible throughout

---

## 🔄 Rollback Plan

If issues occur:
1. The original configuration is backed up automatically
2. Rollback command: `doctl apps update <app-id> --spec app-backup-*.yaml`
3. Takes 5-10 minutes to restore

---

## ✅ Success Criteria

1. Frontend loads from Vercel ✓ (already working)
2. API calls succeed without 500 errors
3. Authentication works
4. Agent responds to messages
5. DigitalOcean only runs backend + docs
