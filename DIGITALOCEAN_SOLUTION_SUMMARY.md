# DigitalOcean Deployment Solution

## The Problems

1. **Directory navigation failing**: `cd apps/open-swe` was failing because the build process wasn't in the expected directory
2. **Yarn interference**: Even when moving yarn.lock, DigitalOcean was still detecting and using Yarn
3. **langgraphjs not found**: The langgraph CLI wasn't available at runtime

## The Solution

The fixed app spec (`FINAL_APP_SPEC_SOLUTION.yaml`) addresses these issues by:

1. **Using npm prefix commands** instead of cd:
   - `npm install --prefix packages/shared` instead of `cd packages/shared && npm install`
   - `npm run build --prefix packages/shared` instead of `cd packages/shared && npm run build`
2. **Installing langgraph-cli globally** during build:
   - `npm install -g @langchain/langgraph-cli@^0.0.47`
   - This makes it available for the run command

3. **Using npm prefix for run command**:
   - `npm run dev --prefix apps/open-swe`
   - This runs the dev script from the correct directory

## What You Need to Do

1. **Copy the ENTIRE content** from `FINAL_APP_SPEC_SOLUTION.yaml`
2. Go to DigitalOcean App Platform dashboard
3. Click on your app
4. Go to Settings → App Spec
5. Replace the ENTIRE content with what you copied
6. Click "Save"
7. This will trigger a new deployment

## Important Notes

- The build process will temporarily move yarn.lock to force npm usage
- Global installations include both TypeScript and langgraph-cli
- All paths use --prefix to avoid cd command failures
- The docs service build remains unchanged as it was working

## Expected Outcome

Once deployed, you should see:

- No more "directory not found" errors
- No more "langgraphjs: not found" errors
- Both agent and docs services running successfully
- Backend accessible at: https://open-swe-justbuild-fh949.ondigitalocean.app/api/agent
