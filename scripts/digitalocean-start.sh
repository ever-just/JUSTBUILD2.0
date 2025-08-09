#!/bin/bash
set -e

# Use the local Yarn binary directly
YARN_BINARY=".yarn/releases/yarn-3.5.1.cjs"

if [ ! -f "$YARN_BINARY" ]; then
    echo "❌ Error: Yarn binary not found at $YARN_BINARY"
    exit 1
fi

# Start the specified workspace
if [ "$1" == "web" ]; then
    echo "🌐 Starting web service..."
    cd apps/web && node "../../$YARN_BINARY" start
elif [ "$1" == "agent" ]; then
    echo "🤖 Starting agent service..."
    cd apps/open-swe && node "../../$YARN_BINARY" dev
elif [ "$1" == "docs" ]; then
    echo "📚 Starting docs service..."
    cd apps/docs && node "../../$YARN_BINARY" start
else
    echo "❌ Error: Please specify which service to start (web, agent, or docs)"
    exit 1
fi
