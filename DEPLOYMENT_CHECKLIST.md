# ServerAvatar Deployment Checklist
## Quick Reference for Voice of Chitral Platform

Use this checklist while deploying to track your progress.

---

## ⚙️ PRE-DEPLOYMENT

- [ ] Have SSH access to ServerAvatar
- [ ] Have MongoDB connection string
- [ ] Have domain names ready
- [ ] ServerAvatar applications created
- [ ] Git credentials configured

---

## 🔧 SERVER SETUP

### Install System Dependencies:
- [ ] `sudo apt-get update`
- [ ] `sudo apt-get install -y ffmpeg python3`
- [ ] Install yt-dlp: `sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp`
- [ ] `sudo chmod a+rx /usr/local/bin/yt-dlp`
- [ ] Verify: `yt-dlp --version`
- [ ] Verify: `ffmpeg -version`

---

## 🔴 BACKEND DEPLOYMENT

### Navigate and Update:
- [ ] `cd /path/to/backend`
- [ ] `git pull origin claude/qoqnuz-spotify-admin-panel-011CUsPJ4xJhagYCUWzngUeb`
- [ ] `npm install`

### Configure:
- [ ] Edit `.env` - add YouTube import settings
- [ ] `mkdir -p uploads/temp/youtube-imports`
- [ ] `chmod -R 755 uploads/`

### Environment Variables to Add:
```bash
YOUTUBE_IMPORT_ENABLED=true
YOUTUBE_IMPORT_MAX_SIZE=100
YOUTUBE_IMPORT_AUDIO_QUALITY=320
CLIENT_URL=https://voiceofchitral.com
ADMIN_URL=https://admin.voiceofchitral.com
```

### Restart and Verify:
- [ ] `pm2 restart backend`
- [ ] Test: `curl http://localhost:5000/health`
- [ ] Test dependencies: `curl http://localhost:5000/api/youtube-import/check-dependencies`

---

## 🟠 ADMIN PANEL DEPLOYMENT

### Navigate and Update:
- [ ] `cd /path/to/admin-panel`
- [ ] `git pull origin claude/qoqnuz-spotify-admin-panel-011CUsPJ4xJhagYCUWzngUeb`
- [ ] `npm install`

### Configure:
- [ ] Edit `.env`:
  ```bash
  VITE_API_URL=https://api.voiceofchitral.com/api
  ```

### Build and Deploy:
- [ ] `npm run build`
- [ ] Files in `dist/` folder ready
- [ ] Nginx configured to serve from `dist/`
- [ ] `sudo nginx -t`
- [ ] `sudo systemctl reload nginx`

### Verify:
- [ ] Visit `https://admin.voiceofchitral.com`
- [ ] Can login
- [ ] Navigate to `/youtube-import`
- [ ] Shows "All dependencies installed"

---

## 🟢 FRONTEND DEPLOYMENT (First Time)

### Setup in ServerAvatar:
- [ ] Create new application
- [ ] Domain: `voiceofchitral.com`
- [ ] Type: Static/SPA

### Deploy Code:
- [ ] `cd /path/to/frontend`
- [ ] Copy or clone frontend code
- [ ] `npm install`

### Configure:
- [ ] Create `.env`:
  ```bash
  VITE_API_URL=https://api.voiceofchitral.com/api
  ```

### Build:
- [ ] `npm run build`
- [ ] Files in `dist/` folder

### Nginx Configuration:
- [ ] Edit `/etc/nginx/sites-available/voiceofchitral.com`
- [ ] Add SPA config: `try_files $uri $uri/ /index.html;`
- [ ] Add gzip compression
- [ ] Add caching headers
- [ ] `sudo nginx -t`
- [ ] `sudo systemctl reload nginx`

### SSL:
- [ ] `sudo certbot --nginx -d voiceofchitral.com -d www.voiceofchitral.com`
- [ ] Follow prompts
- [ ] Verify HTTPS redirect

### Verify:
- [ ] Visit `https://voiceofchitral.com`
- [ ] Can register/login
- [ ] Can play songs
- [ ] Queue works
- [ ] Recently Played works
- [ ] Comments work
- [ ] Playlists work

---

## ✅ VERIFICATION

### Backend:
- [ ] `curl https://api.voiceofchitral.com/health`
- [ ] `pm2 logs backend` - no errors
- [ ] YouTube import dependencies check passes

### Admin Panel:
- [ ] Login works
- [ ] Dashboard loads
- [ ] YouTube Import page accessible
- [ ] Can view songs/artists/albums
- [ ] Can upload songs

### Frontend:
- [ ] Login/register works
- [ ] Song playback works
- [ ] Queue button appears and works
- [ ] Recently Played page loads
- [ ] Can add comments
- [ ] Can create/edit playlists
- [ ] All navigation works

### YouTube Import Test:
- [ ] Use test URL: `https://www.youtube.com/watch?v=ZCAnLxRvNNc`
- [ ] Fetch metadata succeeds
- [ ] Import completes
- [ ] Song appears in songs list
- [ ] Song is playable on frontend

---

## 🔐 SECURITY

- [ ] SSL certificates installed
- [ ] HTTPS redirect enabled
- [ ] CORS configured (CLIENT_URL, ADMIN_URL)
- [ ] JWT_SECRET is strong
- [ ] MongoDB password is strong
- [ ] Firewall configured:
  ```bash
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  sudo ufw allow 22/tcp
  sudo ufw enable
  ```

---

## 📊 POST-DEPLOYMENT

### Monitoring:
- [ ] PM2 installed and running: `pm2 status`
- [ ] PM2 logs rotate: `pm2 install pm2-logrotate`
- [ ] Can view logs: `pm2 logs`

### Backups:
- [ ] MongoDB backup script created
- [ ] Cron job scheduled for daily backups
- [ ] Tested backup and restore

### DNS:
- [ ] A record: @ → Server IP
- [ ] A record: www → Server IP
- [ ] A record: api → Server IP
- [ ] A record: admin → Server IP

### Performance:
- [ ] Gzip enabled
- [ ] Browser caching enabled
- [ ] Static files cached (1 year)
- [ ] PM2 cluster mode (optional)
- [ ] CDN configured (optional)

---

## 🎯 FINAL TESTS

### User Journey Test:
- [ ] Register new account
- [ ] Login
- [ ] Browse songs
- [ ] Play a song
- [ ] Add to queue
- [ ] Check Recently Played
- [ ] Create playlist
- [ ] Add song to playlist
- [ ] Edit playlist
- [ ] Add comment on song
- [ ] Like a comment
- [ ] Logout

### Admin Journey Test:
- [ ] Login to admin
- [ ] View dashboard
- [ ] Navigate to YouTube Import
- [ ] Import a test song
- [ ] Verify song in songs list
- [ ] Verify song playable on frontend

---

## 📝 NOTES

**Application Paths:**
- Backend: `_______________________________`
- Admin Panel: `_______________________________`
- Frontend: `_______________________________`

**Credentials:**
- MongoDB URI: `_______________________________`
- Server IP: `_______________________________`
- SSH User: `_______________________________`

**PM2 Commands:**
```bash
pm2 status              # Check all apps
pm2 logs backend        # View backend logs
pm2 restart backend     # Restart backend
pm2 save               # Save PM2 config
```

**Nginx Commands:**
```bash
sudo nginx -t                    # Test config
sudo systemctl reload nginx      # Reload
sudo systemctl restart nginx     # Restart
tail -f /var/log/nginx/error.log # View errors
```

---

## ⚠️ COMMON ISSUES

| Issue | Solution |
|-------|----------|
| yt-dlp not found | `sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && sudo chmod a+rx /usr/local/bin/yt-dlp` |
| CORS errors | Check `CLIENT_URL` in backend `.env` |
| 404 on routes | Add `try_files $uri $uri/ /index.html;` to Nginx |
| Upload fails | `chmod -R 755 uploads/ && chown -R www-data:www-data uploads/` |
| Build fails | `rm -rf node_modules package-lock.json && npm install` |

---

## ✅ DEPLOYMENT COMPLETE!

Date Deployed: `_______________`

Time Taken: `_______________`

Deployed By: `_______________`

**All three applications are now running with all recent updates! 🎉**

---

**Next Steps:**
1. Import traditional Khowar music from YouTube
2. Test with real users
3. Monitor performance
4. Optimize as needed
5. Setup analytics (optional)

**Your Voice of Chitral platform is live! 🎵🇵🇰**
