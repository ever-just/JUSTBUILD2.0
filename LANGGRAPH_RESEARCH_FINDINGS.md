# LangGraph Integration Research Findings

## Executive Summary

Based on my research, LangGraph currently runs using a development server (`langgraphjs dev`) which is not suitable for production. The project needs either:

1. LangGraph Platform (official solution)
2. Custom deployment with proper infrastructure

## Key Findings

### 1. Current Architecture Analysis

#### Development Mode (Current)

```bash
# From apps/open-swe/package.json
"dev": "langgraphjs dev --no-browser --config ../../langgraph.json"
```

- Uses `@langchain/langgraph-cli` (devDependency)
- Runs a development server on port 2024
- Configured via `langgraph.json`

#### Production Requirements

From `apps/open-swe/src/utils/langgraph-client.ts`:

```typescript
const productionUrl = process.env.LANGGRAPH_PROD_URL;
const port = process.env.PORT ?? "2024";
apiUrl: productionUrl ?? `http://localhost:${port}`;
```

### 2. LangGraph Platform Options

#### Option A: Self-Hosted Lite (FREE)

- **Cost**: Free up to 1 million node executions
- **Infrastructure**: You provide
- **Control**: Full control
- **Maintenance**: Self-managed

#### Option B: LangGraph Cloud (Managed)

- **Cost**: Variable (pricing not publicly available)
- **Infrastructure**: Managed by LangChain
- **Features**: LangGraph Studio, monitoring, auto-updates
- **Maintenance**: Fully managed

#### Option C: Bring Your Own Cloud (BYOC)

- **Cost**: Your cloud costs + LangChain management fee
- **Infrastructure**: Your AWS/GCP/Azure account
- **Control**: Hybrid approach
- **Maintenance**: LangChain manages

#### Option D: Self-Hosted Enterprise

- **Cost**: Enterprise pricing
- **Infrastructure**: Your infrastructure
- **Control**: Maximum control
- **Support**: Enterprise support

### 3. Production vs Development Differences

#### Development Server (`langgraphjs dev`)

- Hot reloading
- Debug mode
- Local file watching
- Development optimizations

#### Production Requirements

- Persistent state management (Redis/PostgreSQL)
- Process management (PM2, systemd, etc.)
- Load balancing
- Health checks
- Monitoring
- Log aggregation

### 4. Authentication & Security

From `apps/open-swe/src/security/auth.ts`:

- Production mode checks: `isProd = process.env.NODE_ENV === "production"`
- GitHub App authentication required
- Encryption key for secrets: `SECRETS_ENCRYPTION_KEY`
- Local mode available for development

### 5. Infrastructure Dependencies

#### Required Services

1. **Daytona** - For code execution sandboxes
   - API key required: `DAYTONA_API_KEY`
   - Can use local mode: `OPEN_SWE_LOCAL_MODE=true`

2. **LangSmith** - For tracing
   - `LANGCHAIN_API_KEY` required
   - `LANGCHAIN_TRACING_V2=true`

3. **GitHub App** - For authentication
   - App ID, Private Key, Client Secret

### 6. Deployment Challenges

#### Current Issues

1. **DigitalOcean App Platform**
   - Yarn 3 (Berry) incompatibility
   - TypeScript compilation errors
   - `langgraphjs` command not found

2. **Vercel Limitations**
   - Cannot run persistent servers
   - Maximum 5-minute function timeout
   - Stateless architecture

### 7. Recommended Deployment Strategies

#### Short-term Solution: Railway.app

```yaml
# Railway configuration
root_directory: /
build_command: yarn install && yarn workspace @open-swe/agent build
start_command: yarn workspace @open-swe/agent dev
```

#### Long-term Solution: LangGraph Platform

1. Install LangGraph Platform CLI
2. Configure deployment
3. Use official infrastructure

#### Alternative: Docker Deployment

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install -g @langchain/langgraph-cli
RUN yarn install
EXPOSE 2024
CMD ["yarn", "workspace", "@open-swe/agent", "dev"]
```

### 8. State Management & Persistence

The system maintains state for:

- Agent sessions
- Task plans
- Sandbox sessions
- GitHub installations

Requires persistent storage solution in production.

### 9. Monitoring & Debugging

- LangSmith integration for tracing
- Custom event system for workflow tracking
- LangGraph Studio (if using LangGraph Platform)

### 10. Cost Analysis

| Platform        | Monthly Cost        | Setup Complexity      | Maintenance |
| --------------- | ------------------- | --------------------- | ----------- |
| DigitalOcean    | $10-20              | High (current issues) | Medium      |
| Railway         | $10-20              | Low                   | Low         |
| Render          | $7-15               | Low                   | Low         |
| LangGraph Lite  | $0 + infrastructure | Medium                | High        |
| LangGraph Cloud | TBD                 | Very Low              | None        |
| Docker + VPS    | $5-20               | Medium                | Medium      |

## Next Steps

1. **Immediate**: Deploy to Railway.app for quick resolution
2. **Evaluate**: LangGraph Platform options
3. **Long-term**: Implement proper production deployment

## Critical Questions Answered

### Can we run without `langgraphjs dev`?

**Not easily**. The dev server handles:

- Graph compilation
- API routing
- WebSocket connections
- State management

Would require significant refactoring to run without it.

### Can it run on Vercel?

**No**. LangGraph requires:

- Persistent server process
- Stateful operations
- Long-running workflows
- WebSocket support

All incompatible with Vercel's serverless model.

### Best deployment option?

**Railway.app** for immediate deployment, then evaluate **LangGraph Platform** for production.
