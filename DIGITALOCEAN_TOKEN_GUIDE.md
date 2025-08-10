# 🔑 DigitalOcean API Token Setup Guide

## The Issue

Your token appears to be invalid or doesn't have the correct permissions.

## Getting a Working Token

### 1. Go to DigitalOcean API Page

https://cloud.digitalocean.com/account/api/tokens

### 2. Create Personal Access Token

Click **"Generate New Token"**

### 3. CRITICAL Settings:

- **Token Name**: `JUSTBUILD-CLI-Access`
- **Expiration**: 90 days (or No expiry)
- **Scopes**:
  - ✅ **FULL ACCESS** (Select this option!)
  - OR if using custom scopes, you MUST include:
    - ✅ Read access
    - ✅ Write access
    - ✅ App Platform (read & write)
    - ✅ Projects (read & write)

### 4. Generate and Copy

- Click **"Generate Token"**
- **IMMEDIATELY COPY THE TOKEN** (it's only shown once!)
- It should look like: `dop_v1_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Test Your New Token

1. **Initialize doctl**:

```bash
doctl auth init
```

When prompted, paste your token.

2. **Test it works**:

```bash
doctl account get
```

This should show your account info.

## Alternative: Direct Update Without CLI

If tokens continue failing, I can show you how to:

1. Export the current app spec
2. Edit it manually
3. Upload it through the web interface

## Common Token Issues

❌ **Wrong Permissions**: Token only has "Read" access
❌ **Expired Token**: Token has expired
❌ **Copy Error**: Token was copied incorrectly
❌ **Region Restrictions**: Some tokens have region limits

## Need the Web Method Instead?

If you prefer, we can update through the DigitalOcean web dashboard directly. Just let me know!
