# Multi-stage Dockerfile for LangGraph Agent
FROM node:20-alpine AS base

# Install dependencies needed for building
RUN apk add --no-cache python3 make g++ git bash

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
COPY apps/open-swe/package.json ./apps/open-swe/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies (with fallback for lockfile issues)
RUN yarn install --immutable || yarn install --no-immutable

# Copy all source code
COPY . .

# Build the application
FROM base AS builder
# Run our custom build script with fallbacks
RUN bash scripts/railway-simple-build.sh

# Production stage
FROM node:20-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache git python3 bash

WORKDIR /app

# Copy built application
COPY --from=builder /app/package.json /app/yarn.lock /app/.yarnrc.yml ./
COPY --from=builder /app/.yarn ./.yarn
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/open-swe ./apps/open-swe
COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/langgraph.json ./langgraph.json

# Install production dependencies only (with fallback)
RUN yarn workspaces focus @open-swe/agent --production || echo "Skipping production focus"

# Set environment
ENV NODE_ENV=production
ENV PORT=2024

# Expose port
EXPOSE 2024

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:2024/api/agent/ok', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# Start the application
CMD ["yarn", "workspace", "@open-swe/agent", "dev"]
