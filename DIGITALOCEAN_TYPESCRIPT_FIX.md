# DigitalOcean TypeScript Build Fix

## The Problem

The build is failing because:

1. **TypeScript isn't installed** - `npx tsc` can't find the TypeScript compiler
2. **langgraphjs isn't installed** - The CLI tool from @langchain/langgraph-cli is missing
3. DigitalOcean's environment doesn't have these tools pre-installed

## The Solution

We need to explicitly install TypeScript and @langchain/langgraph-cli in the build command.

## Updated Build Command for Agent Service

```yaml
build_command: |
  # Force npm usage by removing yarn.lock temporarily
  mv yarn.lock yarn.lock.backup 2>/dev/null || true
  export NODE_OPTIONS="--max-old-space-size=4096"

  # Install global dependencies
  npm install -g turbo@^2.5.0 typescript@~5.7.2

  # Install root dependencies with npm
  npm install --force --legacy-peer-deps

  # Install TypeScript and langgraph-cli in the workspace
  npm install --save-dev typescript@~5.7.2 @langchain/langgraph-cli@^0.0.47 --force --legacy-peer-deps

  # Build shared package first
  cd packages/shared && npm install --force --legacy-peer-deps && npm run build && cd ../..

  # Build agent
  cd apps/open-swe && npm install --force --legacy-peer-deps && npm run build && cd ../..

  # Restore yarn.lock
  mv yarn.lock.backup yarn.lock 2>/dev/null || true
```

## Updated Run Command for Agent Service

```yaml
run_command: |
  # Use npm to run the dev script which will call langgraphjs
  cd apps/open-swe && npm run dev
```

## Key Changes

1. **Install TypeScript globally** with `npm install -g typescript@~5.7.2`
2. **Install dev dependencies** including TypeScript and @langchain/langgraph-cli
3. **Use npm run build** instead of `npx tsc` to leverage the package.json scripts
4. **Use npm run dev** for the run command to properly resolve langgraphjs

This ensures all necessary tools are available during the build process.
