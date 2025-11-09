# Voice of Chitral Frontend Deployment Guide

## Overview
This guide will help you deploy the Voice of Chitral frontend application to ServerAvatar.

## Prerequisites
- ServerAvatar account with server access
- Backend API already deployed and running
- Admin panel already deployed

## Step 1: Create Frontend Application on ServerAvatar

1. **Log into ServerAvatar**
2. **Go to Applications → Create Application**
3. **Configure Application:**
   - **Application Name:** `voice-of-chitral-frontend`
   - **Primary Domain:** `voiceofchitral.com` (or your domain)
   - **Application Type:** `Static Site` or `Node.js` (use Static Site)
   - **Method:** `Git`
   - **Repository:** `https://github.com/waqarahm3d/Khowar.git`
   - **Branch:** `claude/qoqnuz-spotify-admin-panel-011CUsPJ4xJhagYCUWzngUeb`
   - **Root Directory:** `frontend`

## Step 2: SSH into Server and Configure

```bash
# SSH into your ServerAvatar server
ssh root@your-server-ip

# Navigate to the frontend directory
cd /home/{USER_ID}/voice-of-chitral-frontend/public_html

# If not already cloned, clone the repository
git clone -b claude/qoqnuz-spotify-admin-panel-011CUsPJ4xJhagYCUWzngUeb https://github.com/waqarahm3d/Khowar.git .

# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create production .env file
nano .env
```

## Step 3: Configure Environment Variables

Add this to `.env` file:

```bash
# IMPORTANT: Replace with your actual backend URL
VITE_API_URL=https://api.voiceofchitral.com/api

# Or if backend is on subdomain:
# VITE_API_URL=https://backend.voiceofchitral.com/api

# Or if using IP:
# VITE_API_URL=http://YOUR_SERVER_IP:5000/api
```

**To find your backend URL:**
- If you deployed backend on ServerAvatar, check the domain in backend application settings
- Test it by visiting: `https://your-backend-url/api/health` (should return JSON)

## Step 4: Build the Frontend

```bash
# Build for production
npm run build

# This creates a 'dist' folder with optimized files
```

## Step 5: Configure Nginx for SPA

The frontend is a Single Page Application (SPA), so we need to configure Nginx properly:

```bash
# Find your nginx config file
cd /home/{USER_ID}/voice-of-chitral-frontend/conf

# Edit nginx config
nano nginx.conf
```

**Add/Update the location block:**

```nginx
# Inside the server block, find or add:
location / {
    root /home/{USER_ID}/voice-of-chitral-frontend/public_html/frontend/dist;
    try_files $uri $uri/ /index.html;
    index index.html;
}

# Add these headers for better performance
location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$ {
    root /home/{USER_ID}/voice-of-chitral-frontend/public_html/frontend/dist;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

**Reload Nginx:**
```bash
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

## Step 6: Alternative - Use ServerAvatar GUI

If ServerAvatar has a GUI for static sites:

1. **Set Web Root:** `/home/{USER_ID}/voice-of-chitral-frontend/public_html/frontend/dist`
2. **Enable SPA Mode** (if available in settings)
3. **Configure Build Command:** `npm run build`
4. **Set Build Output Directory:** `dist`

## Step 7: Set Up SSL Certificate

In ServerAvatar dashboard:
1. Go to your frontend application
2. Navigate to SSL section
3. Click "Install Let's Encrypt SSL"
4. Select your domain
5. Click "Install"

This will enable HTTPS automatically.

## Step 8: Update CORS on Backend

**Important:** Update your backend to allow the frontend domain:

```bash
# SSH into backend server
cd /home/{USER_ID}/voice-of-chitral-backend/public_html/backend

# Edit .env file
nano .env
```

Add/update these lines:

```bash
CLIENT_URL=https://voiceofchitral.com
ADMIN_URL=https://admin.voiceofchitral.com

# Or if testing with IP:
# CLIENT_URL=http://YOUR_SERVER_IP:3000
```

**Restart backend:**
```bash
pm2 restart voice-of-chitral-backend
```

## Step 9: Test the Deployment

Visit your frontend URL: `https://voiceofchitral.com`

**Test these features:**

1. **Registration:** Create a new account
2. **Login:** Log in with the account
3. **Home Page:** Check if songs/artists load
4. **Search:** Search for content
5. **Artist Page:** Click on an artist
6. **Album Page:** Click on an album
7. **Play Song:** Try playing a song
8. **Player Controls:** Test play/pause/next/previous
9. **Profile:** Check profile settings
10. **Logout:** Logout and login again

## Step 10: Troubleshooting

### Issue: API calls failing (CORS errors)

**Solution:**
```bash
# Check backend .env has correct CLIENT_URL
# Check backend CORS configuration in server.js
# Restart backend after changes
```

### Issue: 404 on page refresh

**Solution:**
```bash
# Ensure nginx has try_files $uri $uri/ /index.html;
# Reload nginx: sudo systemctl reload nginx
```

### Issue: Blank page or JS errors

**Solution:**
```bash
# Check browser console for errors
# Verify .env has correct VITE_API_URL
# Rebuild: npm run build
# Check nginx is serving from correct dist folder
```

### Issue: Songs not playing

**Solution:**
```bash
# Check backend STORAGE_PROVIDER in settings
# Verify audio files are accessible
# Check browser console for streaming errors
```

## Quick Deployment Commands

If you need to update the frontend after changes:

```bash
# SSH into server
cd /home/{USER_ID}/voice-of-chitral-frontend/public_html/frontend

# Pull latest changes
git pull origin claude/qoqnuz-spotify-admin-panel-011CUsPJ4xJhagYCUWzngUeb

# Or download specific files via curl
curl -o src/pages/Home.jsx https://raw.githubusercontent.com/waqarahm3d/Khowar/claude/qoqnuz-spotify-admin-panel-011CUsPJ4xJhagYCUWzngUeb/frontend/src/pages/Home.jsx

# Rebuild
npm run build

# No need to restart - nginx serves static files
```

## Local Testing (Before Deployment)

Test locally first to ensure everything works:

```bash
cd /home/user/Khowar/frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Visit http://localhost:5173
```

## Configuration Summary

**Frontend URLs:**
- Local: `http://localhost:5173`
- Production: `https://voiceofchitral.com`

**Backend URLs:**
- Local: `http://localhost:5000/api`
- Production: `https://api.voiceofchitral.com/api` (or your backend URL)

**Admin Panel:**
- Production: `https://admin.voiceofchitral.com`

## Next Steps After Deployment

1. **Test end-to-end:** Go through all features
2. **Create test data:** Add songs, artists, albums via admin panel
3. **Test playback:** Ensure songs play correctly
4. **Mobile testing:** Test on mobile devices
5. **Performance:** Check page load times
6. **SEO:** Add meta tags if needed

## Support

If you encounter issues:
1. Check browser console for errors
2. Check nginx error logs: `tail -f /var/log/nginx/error.log`
3. Verify backend is running: `pm2 status`
4. Check backend logs: `pm2 logs voice-of-chitral-backend`

---

**Ready to deploy!** Follow these steps and let me know what's working and what needs improvement.
