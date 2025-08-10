# NUCLEAR OPTION - Skip TypeScript Compilation Entirely

If the build continues to fail, we can bypass TypeScript compilation entirely by:

1. Installing tsx globally
2. Running the TypeScript files directly

## Implementation

Update railway.json to:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "yarn install --immutable && yarn global add tsx @langchain/langgraph-cli",
    "watchPatterns": ["apps/open-swe/**", "packages/shared/**"]
  },
  "deploy": {
    "startCommand": "cd apps/open-swe && langgraphjs dev --no-browser --config ../../langgraph.json",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3,
    "healthcheckPath": "/api/agent/ok",
    "healthcheckTimeout": 60,
    "numReplicas": 1
  }
}
```

This completely bypasses the TypeScript build step and runs the code directly.
