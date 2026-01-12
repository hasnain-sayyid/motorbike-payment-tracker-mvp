#!/bin/bash

echo "🚀 Starting automated deployment process for Render + Vercel..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if required tools are installed
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Installing Vercel CLI...${NC}"
    npm install -g vercel
fi

echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm run install:all

echo -e "${BLUE}🔧 Building frontend...${NC}"
npm run build:frontend

# Deploy frontend to Vercel
echo -e "${GREEN}🎨 Deploying frontend to Vercel...${NC}"
cd frontend
vercel login
echo -e "${GREEN}🚀 Deploying to production...${NC}"
vercel --prod

# Get Railway URL
echo "🔗 Getting Railway backend URL..."
BACKEND_URL=$(railway status --json | jq -r '.deployments[0].url')
echo -e "${GREEN}Backend deployed at: $BACKEND_URL${NC}"

# Update frontend environment
echo "📝 Updating frontend configuration..."
echo "REACT_APP_API_URL=$BACKEND_URL" > frontend/.env.production

# Deploy frontend to Vercel
echo -e "${GREEN}🎨 Deploying frontend to Vercel...${NC}"
cd frontend
vercel --prod
cd ..

# Update backend CORS settings
echo "🔄 Updating backend CORS configuration..."
FRONTEND_URL=$(vercel ls --json | jq -r '.[0].url')
echo -e "${GREEN}Frontend deployed at: https://$FRONTEND_URL${NC}"

# Update Railway environment variable
railway variables set FRONTEND_URL=https://$FRONTEND_URL

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Your app is live at: https://$FRONTEND_URL${NC}"
echo -e "${GREEN}🔧 Backend API at: $BACKEND_URL${NC}"