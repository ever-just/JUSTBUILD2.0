# Understanding Daytona's Role in Your Architecture

## You're Right! Daytona IS Part of the Architecture

But not in the way you might think. Here's how it all fits together:

## The Three-Layer Architecture

### 1. Frontend (Vercel) - User Interface

- Next.js web application
- Where users interact with the agent
- Sends requests to the backend

### 2. Backend (DigitalOcean) - LangGraph Orchestrator

- The LangGraph server running on port 2024
- Manages agent workflows and state
- **Orchestrates** the AI agents

### 3. Execution Environment (Daytona) - Where the Magic Happens

- **This is where the agent actually does its work!**
- Creates isolated, temporary sandboxes
- Safe environment for code execution

## How It Works

```mermaid
graph LR
    A[User] --> B[Frontend<br/>(Vercel)]
    B --> C[LangGraph Backend<br/>(DigitalOcean)]
    C --> D[Daytona Sandboxes<br/>(Cloud Environments)]
    D --> E[Execute Code<br/>Run Tests<br/>Make Changes]
```

## What I Found in Your Code

From `apps/open-swe/src/utils/sandbox.ts`:

```typescript
import { Daytona, Sandbox, SandboxState } from "@daytonaio/sdk";

export function daytonaClient(): Daytona {
  if (!daytonaInstance) {
    daytonaInstance = new Daytona();
  }
  return daytonaInstance;
}
```

From `apps/open-swe/src/constants.ts`:

```typescript
export const DEFAULT_SANDBOX_CREATE_PARAMS: CreateSandboxFromSnapshotParams = {
  user: "daytona",
  snapshot: "open-swe-vcpu2-mem4-disk5",
  autoDeleteInterval: 15, // delete after 15 minutes
};
```

## What Daytona Does

1. **Provides Secure Sandboxes**: When the agent needs to work on code, it creates a Daytona sandbox
2. **Isolated Execution**: Each task runs in its own isolated environment
3. **Auto-Cleanup**: Sandboxes are automatically deleted after 15 minutes
4. **Fast Provisioning**: Environments spin up in under 90 milliseconds

## The Missing Piece: DAYTONA_API_KEY

Looking at your `backend-env-variables.txt`:

```
DAYTONA_API_KEY=
```

**This is empty!** The agent needs a valid Daytona API key to create sandboxes.

## What This Means for Deployment

### Can everything run on Vercel?

**No**, because:

- Vercel can't run the persistent LangGraph server
- Vercel can't manage Daytona sandbox creation
- The orchestration needs stateful management

### Does the backend need to be on DigitalOcean?

**Not necessarily**, but it needs to be on a platform that can:

- Run persistent servers
- Maintain WebSocket connections
- Orchestrate Daytona sandbox creation

### Where does Daytona fit?

**Daytona is a separate cloud service** that provides:

- On-demand development environments
- Secure code execution sandboxes
- Isolated testing environments

## Important: Local Mode Alternative!

I found that the agent also supports **Local Mode** which doesn't require Daytona:

```typescript
// From packages/shared/src/open-swe/local-mode.ts
export function isLocalMode(config?: GraphConfig): boolean {
  return (config.configurable as any)?.["x-local-mode"] === "true";
}
```

This means you have two options:

### Option 1: Production Mode (with Daytona)

```
User → Vercel (UI) → DigitalOcean (Orchestrator) → Daytona (Execution)
```

- Requires DAYTONA_API_KEY
- Creates isolated cloud sandboxes
- Safe for untrusted code execution
- Auto-cleanup after 15 minutes

### Option 2: Local Mode (without Daytona)

```
User → Vercel (UI) → DigitalOcean (Orchestrator) → Local Files
```

- Set `OPEN_SWE_LOCAL_MODE=true`
- Works directly on local files
- No Daytona required
- Good for development/testing

## Action Items

### If Using Daytona (Production):

1. **Get a Daytona API Key**
   - Sign up at [daytona.io](https://daytona.io)
   - Get your API key
   - Add it to DAYTONA_API_KEY environment variable

### If Using Local Mode (Development):

1. **Set Environment Variables**
   - `OPEN_SWE_LOCAL_MODE=true`
   - `OPEN_SWE_LOCAL_PROJECT_PATH=/path/to/projects`

### Either Way:

2. **Fix the DigitalOcean Deployment**
   - Use the simplified npm approach from `SIMPLE_DIGITALOCEAN_FIX.yaml`
   - Ensure all required environment variables are set

This is actually a sophisticated architecture that separates concerns beautifully:

- **Presentation** (Vercel)
- **Orchestration** (DigitalOcean)
- **Execution** (Daytona)

The agent doesn't "run on Daytona" - it uses Daytona to safely execute code in isolated environments!

## To Answer Your Original Question

**"What about Daytona? Isn't it supposed to be using Daytona to do the agent stuff?"**

Yes and no:

- **YES**: Daytona is used for code execution sandboxes (when in production mode)
- **NO**: Daytona is NOT the deployment platform for the agent itself
- **NO**: You don't NEED Daytona if you use local mode

The LangGraph agent (backend) still needs to be deployed somewhere that can run persistent servers - that's why we're using DigitalOcean. Daytona is just one of the tools the agent uses, not where it lives.
