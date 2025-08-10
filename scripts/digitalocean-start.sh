#!/bin/bash
# DigitalOcean Start Script
# This script starts the LangGraph agent on DigitalOcean

set -e

echo "Starting LangGraph agent..."

# Set runtime environment
export NODE_OPTIONS="--max-old-space-size=4096"

# Start the agent
npx turbo dev --filter=@open-swe/agent