#!/bin/bash

#######################################################
# Voice of Chitral - VPS Deployment Script
# This script deploys all latest changes to your VPS
#######################################################

set -e  # Exit on error

echo "🚀 Starting deployment to VPS..."
echo "================================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Navigate to project directory
cd ~/Khowar

echo -e "${BLUE}📥 Step 1: Pulling latest changes...${NC}"
git pull origin claude/qoqnuz-spotify-admin-panel-011CUsPJ4xJhagYCUWzngUeb

echo ""
echo -e "${BLUE}📦 Step 2: Installing backend dependencies...${NC}"
cd backend
npm install

echo ""
echo -e "${BLUE}🔧 Step 3: Installing frontend dependencies...${NC}"
cd ../frontend
npm install

echo ""
echo -e "${BLUE}🏗️  Step 4: Building frontend...${NC}"
npm run build

echo ""
echo -e "${BLUE}📱 Step 5: Installing admin panel dependencies...${NC}"
cd ../admin-panel
npm install

echo ""
echo -e "${BLUE}🎨 Step 6: Building admin panel...${NC}"
npm run build

echo ""
echo -e "${BLUE}🔄 Step 7: Restarting backend with PM2...${NC}"
cd ../backend
pm2 restart qoqnuz-backend || pm2 start server.js --name qoqnuz-backend

echo ""
echo -e "${BLUE}🌐 Step 8: Reloading Nginx...${NC}"
sudo systemctl reload nginx

echo ""
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo "================================================"
echo ""
echo "📊 Checking services status:"
echo ""
pm2 status
echo ""
echo "🔗 Access your applications:"
echo "  • Backend API:    https://api.qoqnuz.com"
echo "  • Admin Panel:    https://admin.qoqnuz.com"
echo "  • Frontend (WIP):  https://play.qoqnuz.com"
echo ""
echo "📝 To view logs:"
echo "  • Backend logs:  pm2 logs qoqnuz-backend"
echo "  • Nginx logs:    sudo tail -f /var/log/nginx/error.log"
echo ""
echo -e "${YELLOW}💡 Tip: Run 'pm2 save' to save the current PM2 configuration${NC}"
