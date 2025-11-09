#!/bin/bash

###############################################################
# Voice of Chitral - ServerAvatar Automated Deployment Script
###############################################################

set -e  # Exit on error

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Paths
BACKEND_PATH="/home/BlY2b1fmujDEpwrV/voice-of-chitral-backend/public_html"
FRONTEND_PATH="/home/Q3WqLLwipXxy2dPS/voice-of-chitral-frontend/public_html"
ADMIN_PATH="/home/5zk9nbpDokoHwxcR/voice-of-chitral-admin/public_html"
REPO_URL="https://github.com/waqarahm3d/Khowar.git"
BRANCH="claude/qoqnuz-spotify-admin-panel-011CUsPJ4xJhagYCUWzngUeb"

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Voice of Chitral Deployment Script      ║${NC}"
echo -e "${BLUE}║   ServerAvatar Edition                     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ Please run as root: sudo ./deploy-serveravatar.sh${NC}"
    exit 1
fi

echo -e "${YELLOW}⚠️  This will remove all existing code and pull fresh from GitHub${NC}"
echo -e "${YELLOW}⚠️  Your .env files and uploads will be backed up${NC}"
echo ""
read -p "Continue? (yes/no): " -r
if [[ ! $REPLY =~ ^[Yy]es$ ]]; then
    echo "Deployment cancelled"
    exit 0
fi

# Step 1: Backup
echo ""
echo -e "${BLUE}📦 Step 1: Creating backup...${NC}"
BACKUP_DIR=~/voice-of-chitral-backup-$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

cp $BACKEND_PATH/backend/.env $BACKUP_DIR/backend.env 2>/dev/null || echo "No backend .env"
cp $FRONTEND_PATH/frontend/.env $BACKUP_DIR/frontend.env 2>/dev/null || echo "No frontend .env"
cp $ADMIN_PATH/admin-panel/.env $BACKUP_DIR/admin.env 2>/dev/null || echo "No admin .env"
cp -r $BACKEND_PATH/backend/uploads $BACKUP_DIR/uploads-backup 2>/dev/null || echo "No uploads"

echo -e "${GREEN}✅ Backup saved to: $BACKUP_DIR${NC}"

# Step 2: Stop backend
echo ""
echo -e "${BLUE}🛑 Step 2: Stopping backend...${NC}"
pm2 stop all 2>/dev/null || echo "No PM2 processes running"
echo -e "${GREEN}✅ Backend stopped${NC}"

# Step 3: Remove old code
echo ""
echo -e "${BLUE}🗑️  Step 3: Removing old code...${NC}"
rm -rf $BACKEND_PATH/backend
rm -rf $FRONTEND_PATH/frontend
rm -rf $ADMIN_PATH/admin-panel
echo -e "${GREEN}✅ Old code removed${NC}"

# Step 4: Clone backend
echo ""
echo -e "${BLUE}📥 Step 4: Cloning backend...${NC}"
cd $BACKEND_PATH
git clone -b $BRANCH $REPO_URL temp-repo
mv temp-repo/backend ./backend
rm -rf temp-repo
echo -e "${GREEN}✅ Backend cloned${NC}"

# Step 5: Clone frontend
echo ""
echo -e "${BLUE}📥 Step 5: Cloning frontend...${NC}"
cd $FRONTEND_PATH
git clone -b $BRANCH $REPO_URL temp-repo
mv temp-repo/frontend ./frontend
rm -rf temp-repo
echo -e "${GREEN}✅ Frontend cloned${NC}"

# Step 6: Clone admin panel
echo ""
echo -e "${BLUE}📥 Step 6: Cloning admin panel...${NC}"
cd $ADMIN_PATH
git clone -b $BRANCH $REPO_URL temp-repo
mv temp-repo/admin-panel ./admin-panel
rm -rf temp-repo
echo -e "${GREEN}✅ Admin panel cloned${NC}"

# Step 7: Setup backend
echo ""
echo -e "${BLUE}🔧 Step 7: Setting up backend...${NC}"
cd $BACKEND_PATH/backend

npm install

# Restore .env
if [ -f "$BACKUP_DIR/backend.env" ]; then
    cp $BACKUP_DIR/backend.env .env
    echo "✅ Restored .env from backup"
else
    echo -e "${YELLOW}⚠️  No .env backup found. Please create .env file!${NC}"
fi

# Restore uploads
mkdir -p uploads/audio uploads/images
if [ -d "$BACKUP_DIR/uploads-backup" ]; then
    cp -r $BACKUP_DIR/uploads-backup/* uploads/ 2>/dev/null || echo "No uploads to restore"
    echo "✅ Restored uploads"
fi

chmod 755 uploads uploads/audio uploads/images

echo -e "${GREEN}✅ Backend setup complete${NC}"

# Step 8: Setup frontend
echo ""
echo -e "${BLUE}🎨 Step 8: Setting up frontend...${NC}"
cd $FRONTEND_PATH/frontend

npm install

# Restore .env
if [ -f "$BACKUP_DIR/frontend.env" ]; then
    cp $BACKUP_DIR/frontend.env .env
    echo "✅ Restored frontend .env"
else
    echo -e "${YELLOW}⚠️  No .env backup. Please create .env file!${NC}"
fi

npm run build

echo -e "${GREEN}✅ Frontend built${NC}"

# Step 9: Setup admin panel
echo ""
echo -e "${BLUE}🎨 Step 9: Setting up admin panel...${NC}"
cd $ADMIN_PATH/admin-panel

npm install

# Restore .env
if [ -f "$BACKUP_DIR/admin.env" ]; then
    cp $BACKUP_DIR/admin.env .env
    echo "✅ Restored admin .env"
else
    echo -e "${YELLOW}⚠️  No .env backup. Please create .env file!${NC}"
fi

npm run build

echo -e "${GREEN}✅ Admin panel built${NC}"

# Step 10: Fix permissions
echo ""
echo -e "${BLUE}🔐 Step 10: Fixing permissions...${NC}"

chown -R BlY2b1fmujDEpwrV:BlY2b1fmujDEpwrV $BACKEND_PATH/backend
chown -R Q3WqLLwipXwy2dPS:Q3WqLLwipXwy2dPS $FRONTEND_PATH/frontend
chown -R 5zk9nbpDokoHwxcR:5zk9nbpDokoHwxcR $ADMIN_PATH/admin-panel

chmod -R 755 $BACKEND_PATH/backend
chmod -R 755 $FRONTEND_PATH/frontend/dist
chmod -R 755 $ADMIN_PATH/admin-panel/dist
chmod 600 $BACKEND_PATH/backend/.env 2>/dev/null || true

echo -e "${GREEN}✅ Permissions fixed${NC}"

# Step 11: Start backend
echo ""
echo -e "${BLUE}🚀 Step 11: Starting backend...${NC}"
cd $BACKEND_PATH/backend

pm2 start server.js --name qoqnuz-backend
pm2 save

echo -e "${GREEN}✅ Backend started${NC}"

# Step 12: Reload Nginx
echo ""
echo -e "${BLUE}🌐 Step 12: Reloading Nginx...${NC}"
nginx -t && systemctl reload nginx

echo -e "${GREEN}✅ Nginx reloaded${NC}"

# Final status
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   🎉 Deployment Complete!                  ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📊 System Status:${NC}"
echo ""
pm2 status
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo ""
echo "1. Configure Nginx in ServerAvatar Dashboard"
echo "   - Backend: Proxy to http://localhost:5000"
echo "   - Frontend: Document root to /frontend/dist"
echo "   - Admin: Document root to /admin-panel/dist"
echo ""
echo "2. Enable SSL certificates in ServerAvatar"
echo ""
echo "3. Test your applications:"
echo "   - Backend: https://your-api-domain.com/health"
echo "   - Frontend: https://your-frontend-domain.com"
echo "   - Admin: https://your-admin-domain.com"
echo ""
echo -e "${BLUE}💾 Backup location: $BACKUP_DIR${NC}"
echo ""
echo -e "${YELLOW}📖 Full documentation: DEPLOYMENT_SERVERAVATAR.md${NC}"
echo ""
