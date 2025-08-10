# Vercel MCP Setup Guide

This guide will help you set up Vercel's Model Context Protocol (MCP) server with Cursor for your JUSTBUILD2.0 project.

## Prerequisites

- A Vercel account
- Cursor IDE installed
- Vercel API token

## Step 1: Deploy Vercel MCP Server

### Option A: Using Vercel's Official Template

1. Visit the Vercel MCP GitHub repository: https://github.com/vercel/vercel-mcp
2. Click "Deploy to Vercel" button
3. Configure the deployment:
   - Set your `VERCEL_API_TOKEN` environment variable
   - Choose a unique project name
4. Deploy the server

### Option B: Manual Deployment

1. Clone the Vercel MCP repository:

   ```bash
   git clone https://github.com/vercel/vercel-mcp.git
   cd vercel-mcp
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Create a `.env` file:

   ```
   VERCEL_API_TOKEN=lcinQcFYVmNBZd85QvXTw3cr
   ```

4. Deploy to Vercel:

   ```bash
   vercel
   ```

5. Note your deployment URL (e.g., `https://your-vercel-mcp.vercel.app`)

### Your Token Configuration

Your Vercel API token has been added to `vercel-env-variables.txt`:

- Token: `lcinQcFYVmNBZd85QvXTw3cr`

When deploying the MCP server to Vercel:

1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add: `VERCEL_API_TOKEN` = `lcinQcFYVmNBZd85QvXTw3cr`

## Step 2: Get Your Vercel API Token

1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Give it a descriptive name (e.g., "MCP Server")
4. Set appropriate scope (Full Access or scoped to specific projects)
5. Copy the token (you won't be able to see it again)

## Step 3: Configure MCP in Cursor

### Method 1: Through Cursor UI

1. Open Cursor
2. Go to Settings (Cmd+, on Mac, Ctrl+, on Windows/Linux)
3. Navigate to Features > MCP
4. Click "+ Add New MCP Server"
5. Configure:
   - **Name**: Vercel MCP
   - **Type**: Streamable HTTP
   - **URL**: Your deployment URL + `/api/mcp` (e.g., `https://your-vercel-mcp.vercel.app/api/mcp`)
6. Save the configuration

### Method 2: Using VS Code Settings

The `.vscode/settings.json` file has been created with a template configuration. Update it:

1. Open `.vscode/settings.json`
2. Replace `https://your-vercel-mcp-deployment.vercel.app/api/mcp` with your actual deployment URL
3. Save the file
4. Restart Cursor

## Step 4: Verify the Connection

1. In Cursor, check the MCP status indicator
2. Try using Vercel-specific commands in your prompts, such as:
   - "List my Vercel deployments"
   - "Show me the latest deployment logs"
   - "Get the environment variables for my project"

## Available Vercel MCP Tools

Once connected, you'll have access to these tools through AI prompts:

- **list_deployments**: List all deployments
- **get_deployment**: Get details about a specific deployment
- **list_projects**: List all projects
- **get_project**: Get details about a specific project
- **list_domains**: List all domains
- **get_logs**: Get deployment logs
- **list_env_vars**: List environment variables
- **create_env_var**: Create a new environment variable
- **update_env_var**: Update an existing environment variable
- **delete_env_var**: Delete an environment variable

## Troubleshooting

### Connection Issues

1. **Check the URL**: Ensure the MCP server URL is correct and includes `/api/mcp`
2. **Verify API Token**: Make sure your Vercel API token is valid and has proper permissions
3. **Check Deployment Status**: Ensure your MCP server is deployed and running on Vercel

### Permission Issues

If you're getting permission errors:

1. Check your Vercel API token has the necessary scopes
2. Ensure you're using the correct team/organization context

### Cursor Not Recognizing MCP

1. Restart Cursor after configuration changes
2. Check the Cursor logs for any error messages
3. Ensure you're using a compatible version of Cursor

## Integration with Your Project

Your JUSTBUILD2.0 project already has MCP support built-in:

- **MCP Client**: `apps/open-swe/src/utils/mcp-client.ts`
- **MCP Types**: `packages/shared/src/open-swe/mcp.ts`
- **Default MCP Servers**: Configured in `packages/shared/src/constants.ts`

The project includes a LangGraph docs MCP server by default, and you can add additional servers through the web UI configuration.

## Security Considerations

- Never commit your Vercel API token to version control
- Use environment variables for sensitive data
- Consider using scoped tokens with minimal permissions
- Regularly rotate your API tokens

## Next Steps

1. Explore using Vercel MCP to manage your deployments through Cursor
2. Integrate MCP commands into your development workflow
3. Consider adding custom MCP servers for other services you use

For more information, visit:

- [Vercel MCP Documentation](https://vercel.com/docs/mcp)
- [Cursor MCP Documentation](https://cursor.sh/docs/mcp)
- [Model Context Protocol Specification](https://modelcontextprotocol.org)
