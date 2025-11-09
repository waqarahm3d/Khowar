# Voice of Chitral - ServerAvatar Deployment Guide

Complete step-by-step guide to deploy Voice of Chitral on ServerAvatar with clean repository setup.

---

## 📋 Your ServerAvatar Setup

### Application Paths:
- **Backend:** `/home/BlY2b1fmujDEpwrV/voice-of-chitral-backend/public_html/backend`
- **Frontend:** `/home/Q3WqLLwipXwy2dPS/voice-of-chitral-frontend/public_html/frontend`
- **Admin Panel:** `/home/5zk9nbpDokoHwxcR/voice-of-chitral-admin/public_html/admin-panel`

### Repository:
- **GitHub:** https://github.com/waqarahm3d/Khowar
- **Branch:** `claude/qoqnuz-spotify-admin-panel-011CUsPJ4xJhagYCUWzngUeb`

---

## ⚠️ IMPORTANT: Read This First

**This deployment will:**
- ❌ Remove ALL existing code in the three directories
- ✅ Pull fresh code from GitHub
- ✅ Keep your data (MongoDB, uploads, .env will be backed up)

**Estimated time:** 15-20 minutes

---

## Part 1: Backup Everything

### Step 1: SSH to Server

```bash
ssh root@your-server-ip
```

### Step 2: Create Backup

```bash
# Create timestamped backup directory
BACKUP_DIR=~/voice-of-chitral-backup-$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup .env files
cp /home/BlY2b1fmujDEpwrV/voice-of-chitral-backend/public_html/backend/.env $BACKUP_DIR/backend.env 2>/dev/null || echo "No backend .env"
cp /home/Q3WqLLwipXwy2dPS/voice-of-chitral-frontend/public_html/frontend/.env $BACKUP_DIR/frontend.env 2>/dev/null || echo "No frontend .env"
cp /home/5zk9nbpDokoHwxcR/voice-of-chitral-admin/public_html/admin-panel/.env $BACKUP_DIR/admin.env 2>/dev/null || echo "No admin .env"

# Backup uploads
cp -r /home/BlY2b1fmujDEpwrV/voice-of-chitral-backend/public_html/backend/uploads $BACKUP_DIR/uploads-backup 2>/dev/null || echo "No uploads"

# Backup MongoDB (if local)
mongodump --db qoqnuz --out $BACKUP_DIR/mongodb-backup 2>/dev/null || echo "MongoDB backup skipped"

echo "✅ Backup saved to: $BACKUP_DIR"
ls -la $BACKUP_DIR
```

---

## Part 2: Stop Services & Remove Old Code

### Step 3: Stop Backend

```bash
# Stop PM2 process
pm2 list
pm2 stop all
pm2 delete all 2>/dev/null || echo "No PM2 processes"
```

### Step 4: Remove Old Code

```bash
# Remove backend
rm -rf /home/BlY2b1fmujDEpwrV/voice-of-chitral-backend/public_html/backend
echo "✅ Backend removed"

# Remove frontend
rm -rf /home/Q3WqLLwipXwy2dPS/voice-of-chitral-frontend/public_html/frontend
echo "✅ Frontend removed"

# Remove admin panel
rm -rf /home/5zk9nbpDokoHwxcR/voice-of-chitral-admin/public_html/admin-panel
echo "✅ Admin panel removed"
```

---

## Part 3: Clone Fresh Code

### Step 5: Clone Backend

```bash
cd /home/BlY2b1fmujDEpwrV/voice-of-chitral-backend/public_html

git clone -b claude/qoqnuz-spotify-admin-panel-011CUsPJ4xJhagYCUWzngUeb \
  https://github.com/waqarahm3d/Khowar.git temp-repo

mv temp-repo/backend ./backend
rm -rf temp-repo

echo "✅ Backend cloned"
ls -la backend
```

### Step 6: Clone Frontend

```bash
cd /home/Q3WqLLwipXwy2dPS/voice-of-chitral-frontend/public_html

git clone -b claude/qoqnuz-spotify-admin-panel-011CUsPJ4xJhagYCUWzngUeb \
  https://github.com/waqarahm3d/Khowar.git temp-repo

mv temp-repo/frontend ./frontend
rm -rf temp-repo

echo "✅ Frontend cloned"
ls -la frontend
```

### Step 7: Clone Admin Panel

```bash
cd /home/5zk9nbpDokoHwxcR/voice-of-chitral-admin/public_html

git clone -b claude/qoqnuz-spotify-admin-panel-011CUsPJ4xJhagYCUWzngUeb \
  https://github.com/waqarahm3d/Khowar.git temp-repo

mv temp-repo/admin-panel ./admin-panel
rm -rf temp-repo

echo "✅ Admin panel cloned"
ls -la admin-panel
```

---

## Part 4: Setup Backend

### Step 8: Install Backend Dependencies

```bash
cd /home/BlY2b1fmujDEpwrV/voice-of-chitral-backend/public_html/backend

npm install

echo "✅ Backend dependencies installed"
```

### Step 9: Restore Backend .env

```bash
# Find the latest backup
BACKUP_DIR=$(ls -td ~/voice-of-chitral-backup-* | head -1)

# Restore .env
if [ -f "$BACKUP_DIR/backend.env" ]; then
    cp "$BACKUP_DIR/backend.env" .env
    echo "✅ Restored .env from: $BACKUP_DIR"
else
    echo "⚠️  Creating new .env - YOU MUST EDIT THIS!"
    cp .env.example .env 2>/dev/null || cat > .env << 'EOF'
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/qoqnuz
JWT_SECRET=CHANGE_THIS_SECRET_KEY_123456789
JWT_EXPIRE=7d
SESSION_SECRET=CHANGE_THIS_SESSION_SECRET_987654321
STORAGE_PROVIDER=local
CLIENT_URL=https://your-frontend-domain.com
ADMIN_URL=https://your-admin-domain.com
EOF
    echo "⚠️  EDIT .env FILE NOW: nano .env"
fi

cat .env
```

### Step 10: Create & Restore Uploads

```bash
# Create uploads directories
mkdir -p uploads/audio uploads/images

# Restore uploads from backup
BACKUP_DIR=$(ls -td ~/voice-of-chitral-backup-* | head -1)
if [ -d "$BACKUP_DIR/uploads-backup" ]; then
    cp -r "$BACKUP_DIR/uploads-backup/"* uploads/ 2>/dev/null || echo "No files to restore"
    echo "✅ Restored uploads"
fi

chmod 755 uploads uploads/audio uploads/images
ls -la uploads/
```

### Step 11: Start Backend with PM2

```bash
# Start with PM2
pm2 start server.js --name qoqnuz-backend

# Save PM2 config
pm2 save

# Check status
pm2 status
pm2 logs qoqnuz-backend --lines 30
```

---

## Part 5: Setup Frontend

### Step 12: Configure Frontend

```bash
cd /home/Q3WqLLwipXwy2dPS/voice-of-chitral-frontend/public_html/frontend

# Restore or create .env
BACKUP_DIR=$(ls -td ~/voice-of-chitral-backup-* | head -1)

if [ -f "$BACKUP_DIR/frontend.env" ]; then
    cp "$BACKUP_DIR/frontend.env" .env
    echo "✅ Restored frontend .env"
else
    echo "VITE_API_URL=https://your-api-domain.com/api" > .env
    echo "⚠️  EDIT frontend .env: nano .env"
fi

cat .env
```

### Step 13: Build Frontend

```bash
# Install dependencies
npm install

# Build
npm run build

# Verify
ls -la dist/
echo "✅ Frontend built - files in dist/"
```

---

## Part 6: Setup Admin Panel

### Step 14: Configure Admin Panel

```bash
cd /home/5zk9nbpDokoHwxcR/voice-of-chitral-admin/public_html/admin-panel

# Restore or create .env
BACKUP_DIR=$(ls -td ~/voice-of-chitral-backup-* | head -1)

if [ -f "$BACKUP_DIR/admin.env" ]; then
    cp "$BACKUP_DIR/admin.env" .env
    echo "✅ Restored admin .env"
else
    echo "VITE_API_URL=https://your-api-domain.com/api" > .env
    echo "⚠️  EDIT admin .env: nano .env"
fi

cat .env
```

### Step 15: Build Admin Panel

```bash
# Install dependencies
npm install

# Build
npm run build

# Verify
ls -la dist/
echo "✅ Admin panel built - files in dist/"
```

---

## Part 7: Configure Nginx in ServerAvatar

### Step 16: Backend Nginx Config

**Go to ServerAvatar Dashboard:**

1. Open **Applications** > **voice-of-chitral-backend**
2. Click **Nginx** tab
3. Update configuration:

```nginx
location / {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    client_max_body_size 50M;
}
```

4. Click **Save**

### Step 17: Frontend Nginx Config

**Go to ServerAvatar Dashboard:**

1. Open **Applications** > **voice-of-chitral-frontend**
2. Click **Settings** tab
3. Set **Document Root** to:
   ```
   /home/Q3WqLLwipXwy2dPS/voice-of-chitral-frontend/public_html/frontend/dist
   ```
4. Click **Nginx** tab
5. Add this location block:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

6. Click **Save**

### Step 18: Admin Panel Nginx Config

**Go to ServerAvatar Dashboard:**

1. Open **Applications** > **voice-of-chitral-admin**
2. Click **Settings** tab
3. Set **Document Root** to:
   ```
   /home/5zk9nbpDokoHwxcR/voice-of-chitral-admin/public_html/admin-panel/dist
   ```
4. Click **Nginx** tab
5. Add this location block:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

6. Click **Save**

---

## Part 8: Fix Permissions

### Step 19: Set Ownership

```bash
# Fix ownership for each app
chown -R BlY2b1fmujDEpwrV:BlY2b1fmujDEpwrV /home/BlY2b1fmujDEpwrV/voice-of-chitral-backend/public_html/backend

chown -R Q3WqLLwipXwy2dPS:Q3WqLLwipXwy2dPS /home/Q3WqLLwipXwy2dPS/voice-of-chitral-frontend/public_html/frontend

chown -R 5zk9nbpDokoHwxcR:5zk9nbpDokoHwxcR /home/5zk9nbpDokoHwxcR/voice-of-chitral-admin/public_html/admin-panel

echo "✅ Ownership fixed"
```

### Step 20: Set Permissions

```bash
# Backend
chmod -R 755 /home/BlY2b1fmujDEpwrV/voice-of-chitral-backend/public_html/backend
chmod 600 /home/BlY2b1fmujDEpwrV/voice-of-chitral-backend/public_html/backend/.env

# Frontend
chmod -R 755 /home/Q3WqLLwipXwy2dPS/voice-of-chitral-frontend/public_html/frontend/dist

# Admin
chmod -R 755 /home/5zk9nbpDokoHwxcR/voice-of-chitral-admin/public_html/admin-panel/dist

echo "✅ Permissions set"
```

---

## Part 9: Reload Services

### Step 21: Reload Nginx

```bash
# Test config
nginx -t

# Reload
systemctl reload nginx

echo "✅ Nginx reloaded"
```

---

## Part 10: Verify Deployment

### Step 22: Check Everything

```bash
echo "🔍 Deployment Status Check"
echo "========================================="

# PM2 Status
echo ""
echo "📊 PM2 Backend:"
pm2 status

# Test Backend
echo ""
echo "🔌 Backend API Test:"
curl http://localhost:5000/health

# Nginx Status
echo ""
echo "🌐 Nginx Status:"
systemctl status nginx --no-pager

echo ""
echo "========================================="
```

### Step 23: Test Your Domains

```bash
echo ""
echo "🧪 Test these URLs in your browser:"
echo ""
echo "Backend API:"
echo "  https://your-backend-domain.com/health"
echo ""
echo "Frontend:"
echo "  https://your-frontend-domain.com"
echo ""
echo "Admin Panel:"
echo "  https://your-admin-domain.com"
echo ""
```

---

## Part 11: Enable SSL (If Not Already Done)

### Step 24: Enable SSL in ServerAvatar

**For each application:**

1. Go to ServerAvatar Dashboard
2. Open the application
3. Click **SSL** tab
4. Enable **Auto SSL** (Let's Encrypt)
5. Click **Install SSL Certificate**
6. Wait for certificate to install
7. Enable **Force HTTPS**

**Repeat for all 3 applications (Backend, Frontend, Admin)**

---

## 🎉 Deployment Complete!

### ✅ What You Should Have Now:

- ✅ Backend running on PM2
- ✅ Frontend served from `dist` folder
- ✅ Admin panel served from `dist` folder
- ✅ All Nginx configs updated
- ✅ SSL certificates installed
- ✅ Proper file permissions set

### 🔗 Access Your Apps:

Replace with your actual domains:
- **Backend:** `https://api.voiceofchitral.com`
- **Frontend:** `https://play.voiceofchitral.com`
- **Admin:** `https://admin.voiceofchitral.com`

---

## 📝 Quick Commands for Future Updates

### Update All Apps (Run this when you push new code):

```bash
# Update Backend
cd /home/BlY2b1fmujDEpwrV/voice-of-chitral-backend/public_html/backend
git pull origin claude/qoqnuz-spotify-admin-panel-011CUsPJ4xJhagYCUWzngUeb
npm install
pm2 restart qoqnuz-backend

# Update Frontend
cd /home/Q3WqLLwipXwy2dPS/voice-of-chitral-frontend/public_html/frontend
git pull origin claude/qoqnuz-spotify-admin-panel-011CUsPJ4xJhagYCUWzngUeb
npm install
npm run build

# Update Admin Panel
cd /home/5zk9nbpDokoHwxcR/voice-of-chitral-admin/public_html/admin-panel
git pull origin claude/qoqnuz-spotify-admin-panel-011CUsPJ4xJhagYCUWzngUeb
npm install
npm run build
```

### Monitoring:

```bash
# Backend logs
pm2 logs qoqnuz-backend

# Backend status
pm2 status

# Nginx logs
tail -f /var/log/nginx/error.log

# System resources
htop
```

---

## 🐛 Troubleshooting

### Backend 502 Error:

```bash
# Check if PM2 is running
pm2 status

# Check backend logs
pm2 logs qoqnuz-backend --lines 50

# Restart backend
pm2 restart qoqnuz-backend

# Check if port 5000 is listening
netstat -tlnp | grep 5000
```

### Frontend/Admin Not Loading:

```bash
# Check if dist folder exists
ls -la /home/Q3WqLLwipXwy2dPS/voice-of-chitral-frontend/public_html/frontend/dist
ls -la /home/5zk9nbpDokoHwxcR/voice-of-chitral-admin/public_html/admin-panel/dist

# Rebuild
cd /home/Q3WqLLwipXwy2dPS/voice-of-chitral-frontend/public_html/frontend
npm run build

# Check Nginx error logs
tail -f /var/log/nginx/error.log
```

### Permission Denied:

```bash
# Fix permissions again
chown -R BlY2b1fmujDEpwrV:BlY2b1fmujDEpwrV /home/BlY2b1fmujDEpwrV/voice-of-chitral-backend/public_html/backend
chown -R Q3WqLLwipXwy2dPS:Q3WqLLwipXwy2dPS /home/Q3WqLLwipXwy2dPS/voice-of-chitral-frontend/public_html/frontend
chown -R 5zk9nbpDokoHwxcR:5zk9nbpDokoHwxcR /home/5zk9nbpDokoHwxcR/voice-of-chitral-admin/public_html/admin-panel

chmod -R 755 /home/*/voice-of-chitral-*/public_html/*/
```

### MongoDB Connection Failed:

```bash
# Check MongoDB status
systemctl status mongod

# Check MongoDB logs
tail -f /var/log/mongodb/mongod.log

# Test connection
mongosh

# Check .env MONGODB_URI
cat /home/BlY2b1fmujDEpwrV/voice-of-chitral-backend/public_html/backend/.env | grep MONGODB
```

---

## ✅ Post-Deployment Checklist

- [ ] Backend API responding at `/health` endpoint
- [ ] Frontend loads and shows Spotify-style login
- [ ] Admin panel loads and shows login page
- [ ] Can login to admin panel
- [ ] PM2 shows backend running
- [ ] SSL certificates installed on all domains
- [ ] Can upload files through admin panel
- [ ] MongoDB connection working
- [ ] Uploads directory writable

---

## 🆘 Need Help?

If something goes wrong:

1. **Check logs:**
   - Backend: `pm2 logs qoqnuz-backend`
   - Nginx: `tail -f /var/log/nginx/error.log`

2. **Restore from backup:**
   ```bash
   # Your backup is in:
   ls -la ~/voice-of-chitral-backup-*
   ```

3. **Restart everything:**
   ```bash
   pm2 restart all
   systemctl reload nginx
   ```

---

**🎊 Congratulations! Your Voice of Chitral platform is now live with all the latest Spotify-style updates!**
