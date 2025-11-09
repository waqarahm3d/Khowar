# Qoqnuz Quick Reference Guide

Quick commands and snippets for managing Qoqnuz on your VPS.

---

## 🚀 Quick Start Commands

### Connect to VPS
```bash
ssh your-username@your-vps-ip
```

### Check Application Status
```bash
pm2 status
sudo systemctl status nginx
sudo systemctl status mongod
```

---

## 📝 Common Tasks

### Restart Backend
```bash
cd ~/Khowar/backend
pm2 restart qoqnuz-backend
pm2 logs qoqnuz-backend
```

### Update Application
```bash
cd ~/Khowar
git pull
cd backend && npm install && pm2 restart qoqnuz-backend
cd ../admin-panel && npm install && npm run build
```

### View Logs
```bash
# Backend logs
pm2 logs qoqnuz-backend

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

### Reload Nginx
```bash
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

---

## 🔧 Environment Variables

### Edit Environment
```bash
nano ~/Khowar/backend/.env
# After changes:
pm2 restart qoqnuz-backend
```

### Essential Variables
```env
MONGODB_URI=mongodb://localhost:27017/qoqnuz
JWT_SECRET=your-secret
STORAGE_PROVIDER=wasabi
EMAIL_HOST=smtp.gmail.com
CLIENT_URL=https://play.qoqnuz.com
ADMIN_URL=https://admin.qoqnuz.com
```

---

## 💾 Database Operations

### Connect to MongoDB
```bash
mongosh
use qoqnuz
```

### Create Admin User
```javascript
db.users.updateOne(
  { email: "admin@qoqnuz.com" },
  { $set: { role: "admin" } }
)
```

### Backup Database
```bash
mongodump --out ~/backups/mongodb_$(date +%Y%m%d)
```

### Restore Database
```bash
mongorestore ~/backups/mongodb_20240115
```

---

## 🔐 SSL Certificates

### Renew SSL Certificates
```bash
sudo certbot renew
```

### Add New Domain
```bash
sudo certbot --nginx -d newdomain.qoqnuz.com
```

---

## 📊 Monitoring

### Check Disk Space
```bash
df -h
```

### Check Memory Usage
```bash
free -h
```

### Check CPU Usage
```bash
top
# or
htop
```

### Monitor PM2 Processes
```bash
pm2 monit
```

---

## 🔒 Security

### Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### Check Firewall
```bash
sudo ufw status
```

### Check Fail2Ban Status
```bash
sudo fail2ban-client status sshd
```

---

## 📦 Storage Configuration

### Switch to Wasabi
```env
STORAGE_PROVIDER=wasabi
WASABI_ACCESS_KEY_ID=your_key
WASABI_SECRET_ACCESS_KEY=your_secret
WASABI_BUCKET_NAME=qoqnuz-music
WASABI_ENDPOINT=https://s3.us-east-1.wasabisys.com
```

### Switch to AWS S3
```env
STORAGE_PROVIDER=aws
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_BUCKET_NAME=qoqnuz-music
AWS_REGION=us-east-1
```

### Enable Bunny CDN
```env
BUNNY_CDN_ENABLED=true
BUNNY_CDN_URL=https://qoqnuz.b-cdn.net
BUNNY_CDN_API_KEY=your_key
```

---

## 🐛 Troubleshooting

### Backend Not Starting
```bash
pm2 logs qoqnuz-backend --lines 100
cd ~/Khowar/backend && cat .env
sudo systemctl status mongod
```

### 502 Bad Gateway
```bash
pm2 status
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### MongoDB Connection Error
```bash
sudo systemctl restart mongod
mongosh  # Test connection
```

### High CPU Usage
```bash
pm2 monit
htop
# Restart if needed:
pm2 restart qoqnuz-backend
```

---

## 📧 Email Configuration

### Gmail SMTP Setup
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASSWORD=app_password_here
```

**Get Gmail App Password:**
1. Go to: https://myaccount.google.com/apppasswords
2. Generate app password
3. Use in `EMAIL_PASSWORD`

---

## 🎯 API Endpoints

### Test API
```bash
curl https://api.qoqnuz.com/health
```

### Register User
```bash
curl -X POST https://api.qoqnuz.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"pass123","displayName":"Test User"}'
```

### Login
```bash
curl -X POST https://api.qoqnuz.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@qoqnuz.com","password":"yourpassword"}'
```

---

## 🔄 Auto-Update Script

Create `~/update-qoqnuz.sh`:

```bash
#!/bin/bash
cd ~/Khowar
echo "Pulling latest changes..."
git pull

echo "Updating backend..."
cd backend
npm install
pm2 restart qoqnuz-backend

echo "Updating admin panel..."
cd ../admin-panel
npm install
npm run build

echo "Reloading nginx..."
sudo systemctl reload nginx

echo "Update complete!"
pm2 logs qoqnuz-backend --lines 20
```

Make executable and run:
```bash
chmod +x ~/update-qoqnuz.sh
~/update-qoqnuz.sh
```

---

## 📱 URL Structure

- **API:** https://api.qoqnuz.com
- **Admin Panel:** https://admin.qoqnuz.com
- **User App:** https://play.qoqnuz.com (future)
- **Main Site:** https://qoqnuz.com (optional)

---

## 🔑 Access Details Template

Keep this information secure:

```
VPS IP: _______________
SSH User: _______________
SSH Port: _______________

MongoDB:
- User: _______________
- Password: _______________
- Database: qoqnuz

Admin Account:
- Email: admin@qoqnuz.com
- Password: _______________

Storage Provider:
- Type: Wasabi/AWS/Backblaze
- Access Key: _______________
- Secret Key: _______________
- Bucket: _______________

Email SMTP:
- Provider: _______________
- User: _______________
- Password: _______________

Domain Registrar:
- Provider: _______________
- Login: _______________

SSL Certificates:
- Auto-renew: Yes (Let's Encrypt)
- Expiry: Check with: sudo certbot certificates
```

---

## 📞 Emergency Contacts

### If Site is Down:

1. **Check backend:** `pm2 status`
2. **Check Nginx:** `sudo systemctl status nginx`
3. **Check logs:** `pm2 logs qoqnuz-backend`
4. **Restart all:**
   ```bash
   pm2 restart qoqnuz-backend
   sudo systemctl restart nginx
   ```

### If Database is Down:

```bash
sudo systemctl status mongod
sudo systemctl restart mongod
mongosh  # Test connection
```

### If Disk is Full:

```bash
df -h  # Check space
sudo du -sh /*  # Find large directories
# Clear PM2 logs:
pm2 flush
# Clear old backups:
rm -rf ~/backups/mongodb_old*
```

---

## 💡 Performance Tips

### Increase PM2 Instances (Cluster Mode)
```bash
pm2 delete qoqnuz-backend
pm2 start server.js -i max --name qoqnuz-backend
pm2 save
```

### Enable Nginx Caching
Add to Nginx config:
```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m;

location / {
    proxy_cache my_cache;
    proxy_cache_valid 200 60m;
    # ... rest of config
}
```

### MongoDB Indexing
```javascript
// Connect to MongoDB
mongosh
use qoqnuz

// Create indexes
db.songs.createIndex({ title: "text" })
db.users.createIndex({ email: 1 })
db.songs.createIndex({ artist: 1 })
```

---

## 🎓 Learning Resources

- **PM2 Docs:** https://pm2.keymetrics.io/docs
- **Nginx Docs:** https://nginx.org/en/docs
- **MongoDB Docs:** https://www.mongodb.com/docs
- **Let's Encrypt:** https://letsencrypt.org/docs

---

## ✅ Pre-Launch Checklist

Before going live:

- [ ] All environment variables configured
- [ ] SSL certificates installed and working
- [ ] MongoDB backups automated
- [ ] Admin account created and accessible
- [ ] Test file upload (songs, images)
- [ ] Test email sending (registration, OTP)
- [ ] Test OAuth (Google, Facebook) if configured
- [ ] Storage provider working (S3/Wasabi)
- [ ] CDN configured if using Bunny
- [ ] Firewall rules set
- [ ] Fail2Ban configured
- [ ] PM2 auto-start on reboot enabled
- [ ] Nginx auto-start on reboot enabled
- [ ] MongoDB auto-start on reboot enabled
- [ ] Log rotation configured
- [ ] Monitoring set up
- [ ] DNS records propagated
- [ ] All URLs accessible
- [ ] Test artist verification workflow
- [ ] Test comment posting
- [ ] Test social sharing
- [ ] Load test with multiple users

---

**Keep this guide handy for daily operations! 📋**
