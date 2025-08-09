#!/bin/bash
set -e

echo "🚀 Starting DigitalOcean build process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are we in the right directory?"
    exit 1
fi

# Use the local Yarn binary directly
YARN_BINARY=".yarn/releases/yarn-3.5.1.cjs"

if [ ! -f "$YARN_BINARY" ]; then
    echo "❌ Error: Yarn binary not found at $YARN_BINARY"
    exit 1
fi

echo "✅ Found Yarn binary at $YARN_BINARY"

# Install dependencies using the local Yarn
echo "📦 Installing dependencies..."
node "$YARN_BINARY" install

# Build the specified workspace
if [ "$1" == "web" ]; then
    echo "🔨 Building @open-swe/web..."
    node "$YARN_BINARY" workspace @open-swe/web build
elif [ "$1" == "agent" ]; then
    echo "🔨 Building @open-swe/agent..."
    node "$YARN_BINARY" workspace @open-swe/agent build
elif [ "$1" == "docs" ]; then
    echo "🔨 Building @open-swe/docs..."
    node "$YARN_BINARY" workspace @open-swe/docs build
else
    echo "❌ Error: Please specify which workspace to build (web, agent, or docs)"
    exit 1
fi

echo "✅ Build completed successfully!"
