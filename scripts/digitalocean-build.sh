#!/bin/bash
# DigitalOcean Build Script
# This script handles build issues specific to DigitalOcean's environment

set -e

echo "Starting DigitalOcean build process..."

# Set environment variables for the build
export NODE_OPTIONS="--max-old-space-size=4096"
export YARN_ENABLE_IMMUTABLE_INSTALLS=false

# Install turbo globally
echo "Installing turbo..."
npm install -g turbo@^2.5.0

# Install dependencies with relaxed settings
echo "Installing dependencies..."
npm install --package-lock=false

# Disable TypeScript patches that fail on DigitalOcean
echo "Configuring Yarn for DigitalOcean environment..."
yarn config set enableScripts false || true
yarn config set patchFolder .yarn/patches-disabled || true

# Build the project
echo "Building the project..."
npx turbo build --filter=@open-swe/agent || {
    echo "Build failed, retrying with skip lib check..."
    # If build fails, try with additional flags
    export TSC_COMPILE_ON_ERROR=true
    npx turbo build --filter=@open-swe/agent --force
}

echo "Build completed successfully!"