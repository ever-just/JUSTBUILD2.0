#!/bin/bash

echo "🧪 Testing Vercel MCP Connection"
echo "================================"
echo ""
echo "This will test if the vercel-mcp package can be accessed via npx."
echo ""

# Export the API token
export VERCEL_API_TOKEN="lcinQcFYVmNBZd85QvXTw3cr"

echo "📦 Running @vercel/mcp-server with npx..."
echo "Note: This may take a moment on first run as it downloads the package."
echo ""

# Try to run the MCP server briefly
timeout 5 npx -y @vercel/mcp-server 2>&1 | head -20

echo ""
echo "✅ If you see output above without errors, the MCP server is accessible!"
echo ""
echo "📝 Next steps:"
echo "1. Restart Cursor"
echo "2. Check Settings > Features > MCP"
echo "3. You should see 'vercel' or 'vercel-mcp' in the list"
echo "4. Test with commands like 'List my Vercel projects'"
