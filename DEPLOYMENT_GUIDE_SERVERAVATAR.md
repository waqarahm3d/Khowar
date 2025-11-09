# Complete Deployment Guide to ServerAvatar
## Voice of Chitral Platform - All Recent Updates

This guide will deploy **all recent changes** to your ServerAvatar server:
- ✅ Backend (with YouTube Import feature)
- ✅ Admin Panel (with YouTube Import page)
- ✅ Frontend (first-time deployment with all MVP features)

---

## 📋 What's Being Deployed

### **Backend Updates:**
- YouTube Music Import system
- Enhanced Song model (tags, youtubeUrl, imported fields)
- Performance optimizations (database indexes)
- New API endpoints for YouTube import
- Comments system backend

### **Admin Panel Updates:**
- YouTube Import page
- Settings page improvements
- Enhanced dashboard

### **Frontend (NEW Deployment):**
- Complete music streaming app
- Queue Management UI
- Recently Played page
- Comments system
- Playlist management
- Song detail pages
- All MVP features

---

## 🎯 Pre-Deployment Checklist

Before starting, ensure you have:

- [ ] ServerAvatar account with server access
- [ ] SSH access to your server
- [ ] Backend deployed (needs update)
- [ ] Admin Panel deployed (needs update)
- [ ] Latest code pulled from Git
- [ ] MongoDB connection string
- [ ] Domain names ready (e.g., api.voiceofchitral.com, admin.voiceofchitral.com, voiceofchitral.com)

---

## 📦 PART 1: Prepare Server Environment

### **Step 1.1: SSH into Your Server**

```bash
# SSH into ServerAvatar server
ssh root@YOUR_SERVER_IP

# Or if you have a non-root user:
ssh your_user@YOUR_SERVER_IP
```

### **Step 1.2: Install System Dependencies**

These are required for YouTube Import feature:

```bash
# Update package list
sudo apt-get update

# Install FFmpeg (audio processing)
sudo apt-get install -y ffmpeg

# Install Python 3 (required for yt-dlp)
sudo apt-get install -y python3

# Install yt-dlp (YouTube downloader)
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp

# Verify installations
yt-dlp --version
# Should output: 2024.xx.xx or similar

ffmpeg -version
# Should output: ffmpeg version 4.x.x or similar

python3 --version
# Should output: Python 3.x.x
```

### **Step 1.3: Find Your Application Paths**

```bash
# Find backend path
find /home -name "backend" -type d 2>/dev/null | grep -E "(Khowar|backend)"

# Find admin-panel path
find /home -name "admin-panel" -type d 2>/dev/null | grep -E "(Khowar|admin)"

# Typical ServerAvatar structure:
# /home/USERNAME/applications/APP_NAME/public_html/
```

**Note your paths:**
- Backend: `___________________________`
- Admin Panel: `___________________________`
- Frontend (will create): `___________________________`

---

## 🔧 PART 2: Deploy Backend Updates

### **Step 2.1: Navigate to Backend Directory**

```bash
# Replace with your actual path
cd /home/USERNAME/applications/BACKEND_APP/public_html

# Or common paths:
cd /home/*/Khowar/backend
# OR
cd /var/www/backend
```

### **Step 2.2: Pull Latest Changes**

```bash
# Check current branch
git branch

# Pull latest changes
git fetch origin
git pull origin claude/qoqnuz-spotify-admin-panel-011CUsPJ4xJhagYCUWzngUeb

# Or if you want to use main branch:
# git pull origin main
```

### **Step 2.3: Install New Dependencies**

```bash
# Install any new npm packages
npm install

# This will install any new dependencies added for YouTube import
```

### **Step 2.4: Update Environment Variables**

```bash
# Edit .env file
nano .env
```

**Add these new variables:**

```bash
# Existing variables (keep these)
PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
CLIENT_URL=https://voiceofchitral.com
ADMIN_URL=https://admin.voiceofchitral.com

# NEW: YouTube Import Settings
YOUTUBE_IMPORT_ENABLED=true
YOUTUBE_IMPORT_MAX_SIZE=100
YOUTUBE_IMPORT_AUDIO_QUALITY=320
YOUTUBE_IMPORT_TEMP_DIR=./uploads/temp/youtube-imports

# Storage settings (if using CDN)
STORAGE_PROVIDER=local
# Or: aws, wasabi, cloudflare, backblaze

# For Cloudflare R2 (recommended):
# STORAGE_PROVIDER=cloudflare
# CLOUDFLARE_ACCESS_KEY_ID=your_access_key
# CLOUDFLARE_SECRET_ACCESS_KEY=your_secret_key
# CLOUDFLARE_BUCKET_NAME=voice-of-chitral
# CLOUDFLARE_ACCOUNT_ID=your_account_id
```

**Save and exit:** Press `Ctrl+X`, then `Y`, then `Enter`

### **Step 2.5: Create Required Directories**

```bash
# Create YouTube import temp directory
mkdir -p uploads/temp/youtube-imports
chmod 755 uploads/temp/youtube-imports

# Create songs and thumbnails directories
mkdir -p uploads/songs
mkdir -p uploads/thumbnails
mkdir -p uploads/albums
mkdir -p uploads/artists

# Set permissions
chmod -R 755 uploads/
chown -R www-data:www-data uploads/
# Or your user: chown -R $USER:$USER uploads/
```

### **Step 2.6: Build and Restart Backend**

```bash
# If you're using PM2:
pm2 restart backend

# Or if using systemd:
sudo systemctl restart backend

# Or if ServerAvatar auto-restarts:
# Just exit and it should restart automatically

# Check logs
pm2 logs backend --lines 50
# OR
tail -f logs/error.log
```

### **Step 2.7: Verify Backend is Running**

```bash
# Test health endpoint
curl http://localhost:5000/health

# Expected output:
# {"status":"ok","message":"Qoqnuz API is running"}

# Test YouTube import dependencies
curl http://localhost:5000/api/youtube-import/check-dependencies \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Expected output:
# {"success":true,"data":{"ytdlp":true,"ffmpeg":true,"ready":true}}
```

---

## 🎨 PART 3: Deploy Admin Panel Updates

### **Step 3.1: Navigate to Admin Panel Directory**

```bash
cd /home/USERNAME/applications/ADMIN_PANEL_APP/public_html

# Or:
cd /home/*/Khowar/admin-panel
```

### **Step 3.2: Pull Latest Changes**

```bash
git pull origin claude/qoqnuz-spotify-admin-panel-011CUsPJ4xJhagYCUWzngUeb
```

### **Step 3.3: Update Environment Variables**

```bash
nano .env
```

**Ensure these are correct:**

```bash
VITE_API_URL=https://api.voiceofchitral.com/api
# Or http://YOUR_BACKEND_URL/api
```

**Save and exit**

### **Step 3.4: Install Dependencies and Build**

```bash
# Install new dependencies
npm install

# Build for production
npm run build

# This creates a 'dist' folder with optimized files
```

### **Step 3.5: Deploy Build**

**Option A: If ServerAvatar serves from 'dist' folder:**
```bash
# Files are already in dist/
# ServerAvatar should auto-detect and serve
```

**Option B: If serving from root:**
```bash
# Copy dist files to public_html
cp -r dist/* ./
```

### **Step 3.6: Configure Nginx (if needed)**

```bash
sudo nano /etc/nginx/sites-available/admin.voiceofchitral.com
```

**Ensure it has:**

```nginx
server {
    listen 80;
    server_name admin.voiceofchitral.com;

    root /home/USERNAME/applications/ADMIN_PANEL/public_html/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (if needed)
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Reload Nginx:**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### **Step 3.7: Verify Admin Panel**

Visit: `https://admin.voiceofchitral.com`

- [ ] Can login
- [ ] Dashboard loads
- [ ] Can navigate to `/youtube-import`
- [ ] YouTube Import page shows dependency check

---

## 🎵 PART 4: Deploy Frontend (First Time)

### **Step 4.1: Create New Application in ServerAvatar**

**In ServerAvatar Dashboard:**

1. Click **"Create Application"**
2. Choose **"Custom App"** or **"Node.js"**
3. **Name:** `voice-of-chitral-frontend`
4. **Domain:** `voiceofchitral.com` (or your domain)
5. **Type:** Static/SPA
6. Click **"Create"**

### **Step 4.2: SSH and Navigate to Frontend Directory**

```bash
# ServerAvatar will create:
cd /home/USERNAME/applications/voice-of-chitral-frontend/public_html

# Or manually:
cd /home/USERNAME/
```

### **Step 4.3: Clone or Copy Frontend Code**

**Option A: From existing Khowar repo**
```bash
# Copy from existing repo
cp -r /home/USERNAME/Khowar/frontend/* ./
```

**Option B: Fresh clone**
```bash
# Clone repo
git clone YOUR_REPO_URL .
cd frontend
```

### **Step 4.4: Configure Environment Variables**

```bash
nano .env
```

**Add:**

```bash
VITE_API_URL=https://api.voiceofchitral.com/api
```

**Save and exit**

### **Step 4.5: Install Dependencies and Build**

```bash
# Install dependencies
npm install

# Build for production
npm run build

# This creates optimized build in 'dist' folder
```

### **Step 4.6: Configure Nginx for Frontend**

```bash
sudo nano /etc/nginx/sites-available/voiceofchitral.com
```

**Add this configuration:**

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name voiceofchitral.com www.voiceofchitral.com;

    root /home/USERNAME/applications/voice-of-chitral-frontend/public_html/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/javascript application/xml+rss;

    # Browser caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # React Router (SPA support)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (optional - if API on same server)
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Uploads/static files proxy
    location /uploads {
        proxy_pass http://localhost:5000/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Create symlink and reload:**
```bash
sudo ln -s /etc/nginx/sites-available/voiceofchitral.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### **Step 4.7: Setup SSL (Let's Encrypt)**

```bash
# Install certbot (if not installed)
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d voiceofchitral.com -d www.voiceofchitral.com

# Follow prompts:
# Enter email
# Agree to terms
# Choose redirect HTTP to HTTPS: Yes
```

**Certbot will automatically update your Nginx config for HTTPS**

### **Step 4.8: Verify Frontend**

Visit: `https://voiceofchitral.com`

- [ ] Login page loads
- [ ] Can register/login
- [ ] Can navigate to Home
- [ ] Can play songs
- [ ] Queue button appears
- [ ] Recently Played page works
- [ ] Comments load on song page
- [ ] Playlists can be created/edited

---

## 🔄 PART 5: Update CORS and URLs

### **Step 5.1: Update Backend CORS**

```bash
# Navigate to backend
cd /home/USERNAME/Khowar/backend

# Edit .env
nano .env
```

**Update:**
```bash
CLIENT_URL=https://voiceofchitral.com
ADMIN_URL=https://admin.voiceofchitral.com
```

**Restart backend:**
```bash
pm2 restart backend
```

### **Step 5.2: Update Frontend API URL**

If you used a proxy in Nginx, frontend can use relative URLs. Otherwise, ensure `.env` has:

```bash
VITE_API_URL=https://api.voiceofchitral.com/api
```

### **Step 5.3: Test Cross-Origin Requests**

```bash
# From browser console on frontend:
fetch('https://api.voiceofchitral.com/api/songs')
  .then(r => r.json())
  .then(console.log)

# Should return songs data, not CORS error
```

---

## ✅ PART 6: Verification & Testing

### **Step 6.1: Backend Verification**

```bash
# Health check
curl https://api.voiceofchitral.com/health

# YouTube dependencies
curl https://api.voiceofchitral.com/api/youtube-import/check-dependencies \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get songs
curl https://api.voiceofchitral.com/api/songs

# Check logs
pm2 logs backend --lines 100
```

### **Step 6.2: Admin Panel Verification**

Visit `https://admin.voiceofchitral.com`:

- [ ] Login works
- [ ] Dashboard shows stats
- [ ] Can view songs/artists/albums
- [ ] Can upload songs
- [ ] YouTube Import page accessible
- [ ] YouTube Import shows: "All dependencies installed"
- [ ] Can navigate all pages

### **Step 6.3: Frontend Verification**

Visit `https://voiceofchitral.com`:

**Authentication:**
- [ ] Can register new account
- [ ] Can login
- [ ] Can logout
- [ ] Protected routes redirect to login

**Music Playback:**
- [ ] Can browse songs
- [ ] Can play a song
- [ ] Player controls work (play, pause, next, previous)
- [ ] Progress bar works
- [ ] Volume control works

**Queue Management:**
- [ ] Queue button appears in player
- [ ] Clicking queue button shows queue panel
- [ ] Can see "Now Playing"
- [ ] Can see "Next Up"
- [ ] Can see "Previously Played"
- [ ] Can remove songs from queue
- [ ] Can click song to jump to it

**Recently Played:**
- [ ] Navigate to `/recently-played`
- [ ] Shows listening history
- [ ] Songs are unique (no duplicates)
- [ ] Can play songs from history

**Comments:**
- [ ] Navigate to a song detail page `/song/:id`
- [ ] Comments section visible
- [ ] Can add new comment
- [ ] Can like comments
- [ ] Can delete own comments
- [ ] Comments show correct timestamps

**Playlists:**
- [ ] Navigate to Library
- [ ] Can click "Create Playlist"
- [ ] Modal opens
- [ ] Can create playlist (name, description, public/private)
- [ ] Playlist appears in library
- [ ] Can click playlist
- [ ] Can edit playlist (as owner)
- [ ] Can delete playlist (as owner)

**Navigation:**
- [ ] All menu items work
- [ ] Search works
- [ ] Browse works
- [ ] Artist pages load
- [ ] Album pages load

### **Step 6.4: YouTube Import Test**

**From Admin Panel:**

1. Navigate to `/youtube-import`
2. Check dependencies status: Should show ✓ yt-dlp ✓ ffmpeg
3. Enter a test YouTube URL (use a short Creative Commons video)
4. Click "Fetch Metadata"
5. Verify metadata appears (title, artist, thumbnail)
6. Click "Start Import"
7. Watch progress bar
8. Should complete successfully
9. Check Songs page - new song should appear
10. Go to frontend - song should be playable

**Test URLs (Creative Commons music):**
- `https://www.youtube.com/watch?v=ZCAnLxRvNNc` (short test)

---

## 🐛 PART 7: Troubleshooting

### **Issue 1: "yt-dlp not found"**

```bash
# Verify installation
which yt-dlp

# If not found, reinstall
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp

# Test
yt-dlp --version
```

### **Issue 2: "FFmpeg not found"**

```bash
# Verify
which ffmpeg

# Install
sudo apt-get install -y ffmpeg

# Test
ffmpeg -version
```

### **Issue 3: Frontend shows CORS errors**

```bash
# Check backend .env has correct CLIENT_URL
cat backend/.env | grep CLIENT_URL

# Should match your frontend domain
# CLIENT_URL=https://voiceofchitral.com

# Restart backend
pm2 restart backend
```

### **Issue 4: 404 on frontend routes**

**Nginx not configured for SPA:**

```bash
# Edit Nginx config
sudo nano /etc/nginx/sites-available/voiceofchitral.com

# Ensure this line exists:
location / {
    try_files $uri $uri/ /index.html;
}

# Reload
sudo nginx -t
sudo systemctl reload nginx
```

### **Issue 5: Upload directory permissions**

```bash
cd /home/USERNAME/Khowar/backend

# Fix permissions
sudo chown -R www-data:www-data uploads/
sudo chmod -R 755 uploads/

# Or for your user:
sudo chown -R $USER:$USER uploads/
chmod -R 755 uploads/
```

### **Issue 6: PM2 not restarting**

```bash
# Kill and restart
pm2 delete backend
pm2 start server.js --name backend

# Save
pm2 save
pm2 startup
```

### **Issue 7: MongoDB connection failed**

```bash
# Check .env
cat .env | grep MONGODB_URI

# Test connection
mongo "YOUR_MONGODB_URI"

# Or if using MongoDB Atlas, whitelist server IP
```

### **Issue 8: Build fails**

```bash
# Clear cache
rm -rf node_modules
rm package-lock.json

# Reinstall
npm install

# Build
npm run build
```

---

## 📊 PART 8: Performance Optimization

### **Step 8.1: Enable Compression (Backend)**

```bash
cd /home/USERNAME/Khowar/backend

# Install compression
npm install compression

# Add to server.js (if not already there)
# const compression = require('compression');
# app.use(compression());

pm2 restart backend
```

### **Step 8.2: Setup PM2 Cluster Mode**

```bash
cd /home/USERNAME/Khowar/backend

# Create ecosystem file
nano ecosystem.config.js
```

**Add:**
```javascript
module.exports = {
  apps: [{
    name: 'backend',
    script: './server.js',
    instances: 2, // Or 'max' to use all CPU cores
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
```

**Restart with cluster:**
```bash
pm2 delete backend
pm2 start ecosystem.config.js
pm2 save
```

### **Step 8.3: Setup CDN (Optional but Recommended)**

**For audio files, use Cloudflare R2 or Bunny CDN:**

1. Create R2 bucket in Cloudflare
2. Get Access Key and Secret
3. Update backend `.env`:
   ```bash
   STORAGE_PROVIDER=cloudflare
   CLOUDFLARE_ACCESS_KEY_ID=your_key
   CLOUDFLARE_SECRET_ACCESS_KEY=your_secret
   CLOUDFLARE_BUCKET_NAME=voice-of-chitral
   CLOUDFLARE_ACCOUNT_ID=your_account_id
   ```
4. Restart backend

---

## 🔐 PART 9: Security Checklist

- [ ] SSL certificates installed (Let's Encrypt)
- [ ] HTTPS redirect enabled
- [ ] CORS configured correctly
- [ ] JWT_SECRET is strong and unique
- [ ] MongoDB uses strong password
- [ ] Firewall configured (UFW)
  ```bash
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  sudo ufw allow 22/tcp
  sudo ufw enable
  ```
- [ ] File upload limits set
- [ ] Rate limiting enabled (to be added)
- [ ] Error messages don't expose sensitive info
- [ ] Environment variables not committed to Git

---

## 📝 PART 10: Post-Deployment Tasks

### **Step 10.1: Setup Monitoring**

```bash
# PM2 monitoring (free)
pm2 install pm2-logrotate

# View logs
pm2 logs

# Monitor
pm2 monit
```

### **Step 10.2: Setup Backups**

```bash
# MongoDB backup script
nano ~/backup-mongodb.sh
```

**Add:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="YOUR_MONGODB_URI" --out="/home/USERNAME/backups/mongodb_$DATE"
# Keep only last 7 days
find /home/USERNAME/backups -type d -mtime +7 -exec rm -rf {} \;
```

**Make executable and schedule:**
```bash
chmod +x ~/backup-mongodb.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /home/USERNAME/backup-mongodb.sh
```

### **Step 10.3: Setup Error Tracking (Optional)**

**Sentry (Free tier):**
1. Create Sentry account
2. Get DSN
3. Install in backend and frontend:
   ```bash
   npm install @sentry/node
   ```
4. Add to code

### **Step 10.4: Update DNS Records**

Ensure your domain DNS points to server:

```
Type  | Name  | Value          | TTL
------|-------|----------------|-----
A     | @     | YOUR_SERVER_IP | 3600
A     | www   | YOUR_SERVER_IP | 3600
A     | api   | YOUR_SERVER_IP | 3600
A     | admin | YOUR_SERVER_IP | 3600
```

---

## ✅ Final Verification Checklist

### **All Applications Running:**
- [ ] Backend: `https://api.voiceofchitral.com/health` returns `{"status":"ok"}`
- [ ] Admin Panel: `https://admin.voiceofchitral.com` loads
- [ ] Frontend: `https://voiceofchitral.com` loads

### **YouTube Import Working:**
- [ ] Dependencies installed (yt-dlp, ffmpeg)
- [ ] Admin panel shows: "All dependencies installed"
- [ ] Can import a test video successfully
- [ ] Imported song appears in songs list
- [ ] Imported song is playable on frontend

### **All MVP Features Working:**
- [ ] User registration and login
- [ ] Song playback
- [ ] Queue management
- [ ] Recently played
- [ ] Comments on songs
- [ ] Playlist create/edit/delete
- [ ] Search
- [ ] Browse

### **Performance:**
- [ ] Page load time < 3 seconds
- [ ] Songs play without buffering
- [ ] No console errors
- [ ] Mobile responsive

---

## 🎉 Deployment Complete!

Your Voice of Chitral platform is now fully deployed with all recent updates:

✅ **Backend:** Running with YouTube Import
✅ **Admin Panel:** Updated with YouTube Import page
✅ **Frontend:** Fully deployed with all MVP features

### **What You Can Do Now:**

1. **Start Importing Music:**
   - Login to admin panel
   - Navigate to YouTube Import
   - Import traditional Khowar music from YouTube

2. **Test Everything:**
   - Register a test user on frontend
   - Play songs
   - Create playlists
   - Leave comments
   - Check queue functionality

3. **Monitor:**
   - Watch PM2 logs: `pm2 logs`
   - Check server resources: `htop`
   - Monitor disk space: `df -h`

4. **Optimize:**
   - Setup CDN for audio files
   - Enable clustering
   - Add Redis caching
   - Implement rate limiting

---

## 📞 Quick Reference Commands

```bash
# Check all services
pm2 status

# Restart backend
pm2 restart backend

# View logs
pm2 logs backend --lines 100

# Check Nginx
sudo nginx -t
sudo systemctl status nginx

# Check disk space
df -h

# Check uploads directory
ls -lh /home/USERNAME/Khowar/backend/uploads/

# Test YouTube import dependencies
curl http://localhost:5000/api/youtube-import/check-dependencies
```

---

**Need Help?**
- Check logs: `pm2 logs`
- Review troubleshooting section
- Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`

**Your platform is ready to serve Chitral! 🎵🇵🇰**
