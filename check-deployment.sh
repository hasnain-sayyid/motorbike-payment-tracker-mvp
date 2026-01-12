#!/bin/bash

echo "🔍 Motorbike Payment Tracker - Deployment Readiness Check"
echo "==========================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Initialize counters
checks_passed=0
total_checks=0

# Function to run check
run_check() {
    local description=$1
    local command=$2
    local expected_result=$3
    
    total_checks=$((total_checks + 1))
    echo -n "[$total_checks] $description... "
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASS${NC}"
        checks_passed=$((checks_passed + 1))
    else
        echo -e "${RED}✗ FAIL${NC}"
    fi
}

echo
echo -e "${BLUE}🔧 System Requirements:${NC}"

# Check Node.js
run_check "Node.js installed" "command -v node"
run_check "Node.js version >=16" "node -p 'process.version.split(\".\")[0].slice(1) >= 16'"
run_check "npm installed" "command -v npm"

echo
echo -e "${BLUE}📁 Project Structure:${NC}"

run_check "Backend package.json exists" "test -f backend/package.json"
run_check "Frontend package.json exists" "test -f frontend/package.json"
run_check "Render config exists" "test -f render.yaml"
run_check "Vercel config exists" "test -f frontend/vercel.json"

echo
echo -e "${BLUE}📦 Dependencies:${NC}"

run_check "Root dependencies" "test -d node_modules"
run_check "Backend dependencies" "test -d backend/node_modules"
run_check "Frontend dependencies" "test -d frontend/node_modules"

echo
echo -e "${BLUE}🔐 Configuration Files:${NC}"

run_check "Backend .env.example exists" "test -f backend/.env.example"
run_check "Frontend .env.example exists" "test -f frontend/.env.example"
run_check ".gitignore exists" "test -f .gitignore"

echo
echo -e "${BLUE}🏗️ Build Process:${NC}"

run_check "Frontend builds successfully" "cd frontend && npm run build"
run_check "Backend starts without errors" "cd backend && timeout 5s npm start"

echo
echo "==========================================================="

if [ $checks_passed -eq $total_checks ]; then
    echo -e "${GREEN}🎉 ALL CHECKS PASSED! ($checks_passed/$total_checks)${NC}"
    echo -e "${GREEN}✅ Your project is ready for deployment!${NC}"
    echo
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Push your code to GitHub"
    echo "2. Deploy backend on Render: https://render.com"
    echo "3. Deploy frontend on Vercel: https://vercel.com"
    echo "4. Configure environment variables"
    echo "5. Update API URLs after deployment"
    echo
    echo "📖 See DEPLOYMENT.md for detailed instructions"
    exit 0
else
    echo -e "${RED}❌ SOME CHECKS FAILED ($checks_passed/$total_checks passed)${NC}"
    echo
    echo -e "${YELLOW}Please fix the issues above before deploying.${NC}"
    echo "Run this script again after fixing the issues."
    exit 1
fi