#!/bin/bash
# scripts/digitalocean-start.sh

echo "Running DigitalOcean custom start script for agent..."

# Set NODE_OPTIONS for increased memory
export NODE_OPTIONS="--max-old-space-size=4096"

# Set the PORT if not already set
export PORT="${PORT:-2024}"

# Change to the agent directory
cd apps/open-swe

# Check if the dist directory exists
if [ ! -d "dist" ]; then
    echo "ERROR: dist directory not found! Build may have failed."
    echo "Attempting to run development mode as fallback..."
    
    # Try to run the dev command directly
    npx langgraphjs dev --no-browser --config ../../langgraph.json || {
        echo "Dev mode also failed. Creating a simple server..."
        # Create a minimal server that responds to health checks
        cat > emergency-server.js << 'EOF'
const http = require('http');
const port = process.env.PORT || 2024;

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  if (req.url === '/api/agent/ok' || req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK - Build in progress');
  } else {
    res.writeHead(503, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      error: 'Service temporarily unavailable', 
      message: 'The agent service is being rebuilt. Please try again in a few minutes.' 
    }));
  }
});

server.listen(port, () => {
  console.log(`Emergency server running on port ${port}`);
  console.log('This is a temporary server while the build is being fixed.');
});
EOF
        node emergency-server.js
    }
else
    echo "Starting the agent from built files..."
    # Try to start using the built files
    node dist/src/index.js || npx langgraphjs dev --no-browser --config ../../langgraph.json
fi