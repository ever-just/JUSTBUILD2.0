# 🔧 Manual DigitalOcean Update Instructions

Since the API tokens are having authentication issues, here's how to manually update your DigitalOcean app:

## Step 1: Access Your App

1. Go to: https://cloud.digitalocean.com/apps
2. Click on **"open-swe-justbuild"**

## Step 2: Edit App Spec

1. Click on **"Settings"** tab
2. Scroll to **"App Spec"** section
3. Click **"Edit"** button

## Step 3: Remove Web Service

Find this section and **DELETE IT ENTIRELY**:

```yaml
- name: web
  github:
    repo: ever-just/JUSTBUILD2.0
    branch: main
    deploy_on_push: true
  # ... (delete all of this service)
```

## Step 4: Remove Domain

Find and **DELETE** this section:

```yaml
domains:
  - domain: justbuild.everjust.com
    type: PRIMARY
```

## Step 5: Update Ingress Rules

Find the ingress rules and **REMOVE** the web route:

```yaml
ingress:
  rules:
    # Keep these two:
    - match:
        path:
          prefix: /api/agent
      component:
        name: agent
        rewrite: /

    - match:
        path:
          prefix: /docs
      component:
        name: docs

    # DELETE this one:
    - match:
        path:
          prefix: /
      component:
        name: web # <-- DELETE THIS ENTIRE RULE
```

## Step 6: Save and Deploy

1. Click **"Save"**
2. The app will automatically redeploy

## Step 7: Get New Backend URL

After deployment (5-10 minutes):

1. Go back to your app page
2. Look for **"Default Ingress"** or **"App URL"**
3. It will be something like: `https://open-swe-justbuild-xxxxx.ondigitalocean.app`

## Step 8: Update Vercel

1. Go to your Vercel project: https://vercel.com/dashboard
2. Go to **Settings** → **Environment Variables**
3. Update `LANGGRAPH_API_URL` to:
   ```
   https://open-swe-justbuild-xxxxx.ondigitalocean.app/api/agent
   ```
   (Replace xxxxx with your actual app ID)
4. **Redeploy** your Vercel app

## ✅ Success Indicators

- DigitalOcean only shows 2 services: `agent` and `docs`
- No domain is configured in DigitalOcean
- API calls from Vercel frontend work without 500 errors
- Authentication flows work properly

## 🚨 Important Notes

- The frontend will continue working during this update
- The backend URL will change - you MUST update Vercel
- Keep the `/api/agent` ingress rule - it's critical for routing
