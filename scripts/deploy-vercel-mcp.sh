#!/bin/bash

# Deploy Vercel MCP Server Script
# This script helps you quickly deploy the Vercel MCP server

set -e

echo "🚀 Vercel MCP Server Deployment Script"
echo "======================================"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI is not installed."
    echo "Installing Vercel CLI globally..."
    npm install -g vercel
fi

# Create temporary directory
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

echo "📥 Cloning Vercel MCP repository..."
git clone https://github.com/vercel/vercel-mcp.git
cd vercel-mcp

echo "📦 Installing dependencies..."
if command -v pnpm &> /dev/null; then
    pnpm install
else
    npm install
fi

echo "🔧 Creating .env file with your token..."
cat > .env << EOF
VERCEL_API_TOKEN=lcinQcFYVmNBZd85QvXTw3cr
EOF

echo ""
echo "✅ Setup complete! Now deploying to Vercel..."
echo ""
echo "📌 When prompted by Vercel CLI:"
echo "   1. Login to your Vercel account (if not already logged in)"
echo "   2. Choose a project name (e.g., 'vercel-mcp-server')"
echo "   3. Confirm the deployment settings"
echo ""

# Deploy to Vercel
vercel --prod

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Copy your deployment URL from above"
echo "   2. Add it to Cursor Settings > Features > MCP"
echo "   3. Use the URL format: https://your-deployment.vercel.app/api/mcp"
echo ""
echo "🗑️  Cleaning up temporary files..."
cd ../..
rm -rf "$TEMP_DIR"

echo "✨ Done!"

