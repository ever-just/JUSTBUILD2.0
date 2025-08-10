# Railway NPM Fallback Plan

If Yarn 3 continues to fail, here's a quick npm-based solution:

## Option 1: Force NPM in Railway

Add this environment variable in Railway:

```
NIXPACKS_PACKAGE_MANAGER=npm
```

## Option 2: Create a .npmrc file

Create `.npmrc` in your project root:

```
legacy-peer-deps=true
engine-strict=false
```

## Option 3: Custom Dockerfile

If all else fails, we can use a custom Dockerfile that uses npm instead of Yarn:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build --workspaces --if-present
EXPOSE 2024
CMD ["npx", "langgraphjs", "dev", "--no-browser", "--config", "langgraph.json"]
```

Then in Railway, it will auto-detect and use the Dockerfile instead of Nixpacks.
