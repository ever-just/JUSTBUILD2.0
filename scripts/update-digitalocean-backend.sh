#!/bin/bash

# Script to update DigitalOcean to backend-only configuration

echo "🚀 Updating DigitalOcean to backend-only configuration..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# DigitalOcean App ID
APP_ID="45438d08-38c3-4c82-8781-ed87b2a8bd0a"

# Check if doctl is installed
if ! command -v doctl &> /dev/null; then
    echo -e "${RED}Error: doctl CLI not found. Please install it first.${NC}"
    echo "Visit: https://docs.digitalocean.com/reference/doctl/how-to/install/"
    exit 1
fi

# Validate the new configuration
echo -e "${YELLOW}Validating app-backend-only.yaml...${NC}"
if doctl apps spec validate app-backend-only.yaml; then
    echo -e "${GREEN}✓ Configuration is valid${NC}"
else
    echo -e "${RED}✗ Configuration validation failed${NC}"
    exit 1
fi

# Create backup of current configuration
echo -e "${YELLOW}Creating backup of current configuration...${NC}"
doctl apps spec get $APP_ID > app-backup-$(date +%Y%m%d-%H%M%S).yaml
echo -e "${GREEN}✓ Backup created${NC}"

# Update the app
echo -e "${YELLOW}Updating DigitalOcean app...${NC}"
echo "This will:"
echo "  - Remove the frontend service (now on Vercel)"
echo "  - Keep the LangGraph agent backend"
echo "  - Keep the documentation service"
echo ""
read -p "Continue? (y/N) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    if doctl apps update $APP_ID --spec app-backend-only.yaml; then
        echo -e "${GREEN}✓ App update initiated successfully!${NC}"
        echo ""
        echo "Next steps:"
        echo "1. Monitor deployment progress in DigitalOcean dashboard"
        echo "2. Check logs: doctl apps logs $APP_ID --follow"
        echo "3. Verify backend health: curl https://justbuild.everjust.com/api/agent/ok"
        echo "4. Test from frontend to ensure API connectivity"
    else
        echo -e "${RED}✗ App update failed${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}Update cancelled${NC}"
fi
