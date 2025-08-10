# ⚠️ IMPORTANT SECURITY NOTICE

## Exposed Credentials Warning

The `vercel-env-variables.txt` file contains sensitive API keys and tokens that should NEVER be committed to version control or shared publicly.

### Immediate Actions Required:

1. **NEVER commit `vercel-env-variables.txt` to Git**
   - Add it to `.gitignore` immediately
   - If already committed, rotate ALL exposed credentials

2. **Rotate Exposed Credentials**
   If any of these files have been committed to Git, you MUST rotate these credentials immediately:
   - GitHub App Client Secret
   - All API Keys (OpenAI, Anthropic, Vercel, etc.)
   - Webhook secrets
   - Encryption keys

3. **Use Environment Variables Properly**
   - Local development: Use `.env.local` (automatically ignored by Git)
   - Vercel deployment: Add variables through Vercel Dashboard
   - Never hardcode credentials in source files

### Vercel API Token

Your Vercel API token has been added: `lcinQcFYVmNBZd85QvXTw3cr`

To use it safely:

1. **For MCP Server Deployment**:
   - Add it as an environment variable in Vercel Dashboard
   - Variable name: `VERCEL_API_TOKEN`

2. **For Local Development**:
   - Create `.env.local` file (if it doesn't exist)
   - Add: `VERCEL_API_TOKEN=lcinQcFYVmNBZd85QvXTw3cr`

3. **In Vercel Dashboard**:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add all variables from `vercel-env-variables.txt`

### Security Best Practices

1. Use different API keys for development and production
2. Regularly rotate credentials
3. Use scoped tokens with minimal permissions
4. Enable 2FA on all services
5. Monitor API key usage

### If Credentials Were Exposed

If you've accidentally exposed any credentials:

1. **GitHub App**: Regenerate client secret at https://github.com/settings/apps
2. **OpenAI**: Create new key at https://platform.openai.com/api-keys
3. **Anthropic**: Regenerate at https://console.anthropic.com/
4. **Vercel**: Create new token at https://vercel.com/account/tokens
5. **All other services**: Check their respective dashboards

Remember: It only takes one exposed credential to compromise your entire application!

