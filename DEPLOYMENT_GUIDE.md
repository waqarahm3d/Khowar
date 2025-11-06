# Qoqnuz VPS Deployment Guide

Complete step-by-step guide to deploy Qoqnuz music streaming platform on a VPS.

---

## Prerequisites

### What You'll Need:
- ✅ VPS (DigitalOcean, Linode, Vultr, AWS EC2, etc.)
- ✅ Domain name (e.g., qoqnuz.com)
- ✅ At least 2GB RAM (4GB recommended)
- ✅ Ubuntu 22.04 LTS (recommended)
- ✅ SSH access to your VPS

### Recommended VPS Specs:
- **Development/Testing:** 2GB RAM, 1 CPU, 50GB SSD
- **Production (Small):** 4GB RAM, 2 CPU, 80GB SSD
- **Production (Medium):** 8GB RAM, 4 CPU, 160GB SSD

---

## Part 1: Initial VPS Setup

### Step 1: Connect to Your VPS

```bash
# Replace with your VPS IP address
ssh root@your-vps-ip

# Example:
# ssh root@159.89.123.456
```

### Step 2: Update System

```bash
# Update package lists
sudo apt update

# Upgrade all packages
sudo apt upgrade -y
```

### Step 3: Create a Non-Root User (Security Best Practice)

```bash
# Create new user (replace 'qoqnuz' with your preferred username)
adduser qoqnuz

# Add user to sudo group
usermod -aG sudo qoqnuz

# Switch to new user
su - qoqnuz
```

### Step 4: Set Up Firewall

```bash
# Enable UFW firewall
sudo ufw enable

# Allow SSH (IMPORTANT: Do this first!)
sudo ufw allow OpenSSH

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check firewall status
sudo ufw status
```

---

## Part 2: Install Required Software

### Step 5: Install Node.js 18.x

```bash
# Download and install Node.js setup script
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 6: Install MongoDB

**Option A: Install MongoDB Locally (Recommended for Production)**

```bash
# Import MongoDB public key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package list
sudo apt update

# Install MongoDB
sudo apt install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod

# Enable MongoDB to start on boot
sudo systemctl enable mongod

# Check MongoDB status
sudo systemctl status mongod
```

**Option B: Use MongoDB Atlas (Cloud Database)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Skip to Part 3 and use the Atlas connection string in `.env`

### Step 7: Install PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 --version
```

### Step 8: Install Nginx (Web Server)

```bash
# Install Nginx
sudo apt install -y nginx

# Start Nginx
sudo systemctl start nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx

# Check Nginx status
sudo systemctl status nginx
```

### Step 9: Install Git

```bash
# Install Git
sudo apt install -y git

# Verify installation
git --version
```

---

## Part 3: Clone and Setup Backend

### Step 10: Clone Your Repository

```bash
# Navigate to home directory
cd ~

# Clone your repository
git clone https://github.com/waqarahm3d/Khowar.git

# Navigate to project
cd Khowar

# Checkout the correct branch
git checkout claude/qoqnuz-spotify-admin-panel-011CUsPJ4xJhagYCUWzngUeb
```

### Step 11: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create uploads directories
mkdir -p uploads/audio uploads/images
```

### Step 12: Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit the .env file
nano .env
```

**Update these values in `.env`:**

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database - Choose one option:
# Option A: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/qoqnuz

# Option B: MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/qoqnuz

# JWT Secrets (Generate random strings)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_123456789
JWT_EXPIRE=7d
SESSION_SECRET=your_super_secret_session_key_change_this_also_987654321

# Storage Provider (Choose one: local, aws, wasabi, backblaze, cloudflare)
STORAGE_PROVIDER=local
# For production, configure your S3 provider credentials below

# Email Configuration (Example with Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=noreply@qoqnuz.com

# URLs (Replace with your actual domains)
CLIENT_URL=https://play.qoqnuz.com
ADMIN_URL=https://admin.qoqnuz.com

# Google OAuth (Optional - set up later)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=https://api.qoqnuz.com/api/auth/google/callback

# Facebook OAuth (Optional - set up later)
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
FACEBOOK_CALLBACK_URL=https://api.qoqnuz.com/api/auth/facebook/callback

# Google Analytics (Optional)
GA_TRACKING_ID=
```

**Save and exit:** Press `CTRL + X`, then `Y`, then `ENTER`

### Step 13: Start Backend with PM2

```bash
# Start the backend
pm2 start server.js --name qoqnuz-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Follow the command it outputs

# Check if backend is running
pm2 status
pm2 logs qoqnuz-backend
```

---

## Part 4: Setup Admin Panel

### Step 14: Build Admin Panel

```bash
# Navigate to admin panel directory
cd ~/Khowar/admin-panel

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=https://api.qoqnuz.com/api" > .env

# Build the admin panel
npm run build

# The built files will be in the 'dist' folder
```

---

## Part 5: Configure Nginx

### Step 15: Setup Nginx for Backend API

```bash
# Create Nginx configuration for API
sudo nano /etc/nginx/sites-available/qoqnuz-api
```

**Add this configuration:**

```nginx
server {
    listen 80;
    server_name api.qoqnuz.com;

    # Increase upload size limit
    client_max_body_size 50M;

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
    }
}
```

**Save and exit:** `CTRL + X`, `Y`, `ENTER`

### Step 16: Setup Nginx for Admin Panel

```bash
# Create Nginx configuration for Admin Panel
sudo nano /etc/nginx/sites-available/qoqnuz-admin
```

**Add this configuration:**

```nginx
server {
    listen 80;
    server_name admin.qoqnuz.com;

    root /home/qoqnuz/Khowar/admin-panel/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Save and exit:** `CTRL + X`, `Y`, `ENTER`

### Step 17: Enable Nginx Sites

```bash
# Enable API site
sudo ln -s /etc/nginx/sites-available/qoqnuz-api /etc/nginx/sites-enabled/

# Enable Admin site
sudo ln -s /etc/nginx/sites-available/qoqnuz-admin /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## Part 6: Setup SSL with Let's Encrypt

### Step 18: Install Certbot

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx
```

### Step 19: Get SSL Certificates

**IMPORTANT:** Make sure your domain DNS is pointing to your VPS IP before running this!

```bash
# Get certificate for API domain
sudo certbot --nginx -d api.qoqnuz.com

# Get certificate for Admin domain
sudo certbot --nginx -d admin.qoqnuz.com

# Follow the prompts:
# - Enter your email
# - Agree to terms
# - Choose whether to redirect HTTP to HTTPS (recommended: Yes)
```

**Certbot will automatically:**
- Get SSL certificates
- Update Nginx configurations
- Setup auto-renewal

### Step 20: Test SSL Auto-Renewal

```bash
# Test certificate renewal
sudo certbot renew --dry-run
```

---

## Part 7: Configure DNS

### Step 21: Setup DNS Records

Go to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.) and add these DNS records:

```
Type    Name      Value              TTL
----    ----      -----              ---
A       api       your-vps-ip        300
A       admin     your-vps-ip        300
A       play      your-vps-ip        300  (for future frontend)
A       @         your-vps-ip        300  (optional, for main domain)
```

**Example:**
```
A       api       159.89.123.456     300
A       admin     159.89.123.456     300
```

**Wait 5-10 minutes** for DNS to propagate.

---

## Part 8: Create Admin User

### Step 22: Access MongoDB and Create Admin

**If using Local MongoDB:**

```bash
# Connect to MongoDB
mongosh

# Switch to qoqnuz database
use qoqnuz

# Create admin user
db.users.insertOne({
  username: "admin",
  email: "admin@qoqnuz.com",
  displayName: "Admin User",
  role: "admin",
  isPremium: true,
  emailVerified: true,
  verifiedAt: new Date(),
  authProvider: "local",
  likedSongs: [],
  playlists: [],
  followedArtists: [],
  followedPlaylists: [],
  artistVerificationStatus: "none",
  isDisabled: false,
  createdAt: new Date(),
  updatedAt: new Date()
})

# Exit MongoDB
exit
```

**Set the admin password using the API:**

```bash
# From your local machine or using curl on the server
curl -X POST https://api.qoqnuz.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@qoqnuz.com",
    "password": "YourSecurePassword123!",
    "displayName": "Admin User"
  }'
```

Or manually update the password in MongoDB:

```bash
# Generate password hash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YourPassword123', 10, (err, hash) => console.log(hash));"

# Copy the hash output, then in MongoDB:
mongosh
use qoqnuz
db.users.updateOne(
  { email: "admin@qoqnuz.com" },
  { $set: { password: "paste-hash-here", role: "admin" } }
)
```

---

## Part 9: Testing Everything

### Step 23: Test API

```bash
# Test health endpoint
curl https://api.qoqnuz.com/health

# Should return:
# {"status":"ok","message":"Qoqnuz API is running"}
```

### Step 24: Test Admin Panel

Open your browser and go to: `https://admin.qoqnuz.com`

You should see the login page. Login with:
- Email: `admin@qoqnuz.com`
- Password: (the password you set)

---

## Part 10: Production Optimizations

### Step 25: Setup Log Rotation

```bash
# Install logrotate
sudo apt install -y logrotate

# Configure PM2 logs
pm2 install pm2-logrotate

# Set max log size
pm2 set pm2-logrotate:max_size 10M

# Keep logs for 30 days
pm2 set pm2-logrotate:retain 30
```

### Step 26: Setup Monitoring

```bash
# Install PM2 monitoring
pm2 install pm2-server-monit

# View monitoring
pm2 monit
```

### Step 27: Setup Automatic Backups (MongoDB)

```bash
# Create backup script
nano ~/backup-mongodb.sh
```

**Add this script:**

```bash
#!/bin/bash
BACKUP_DIR="/home/qoqnuz/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup MongoDB
mongodump --out=$BACKUP_DIR/mongodb_$DATE

# Keep only last 7 days of backups
find $BACKUP_DIR -name "mongodb_*" -mtime +7 -exec rm -rf {} \;

echo "Backup completed: $DATE"
```

**Make it executable:**

```bash
chmod +x ~/backup-mongodb.sh

# Add to crontab (daily at 2 AM)
crontab -e

# Add this line:
0 2 * * * /home/qoqnuz/backup-mongodb.sh >> /home/qoqnuz/backup.log 2>&1
```

---

## Part 11: Security Hardening

### Step 28: Secure MongoDB

```bash
# Enable MongoDB authentication
sudo nano /etc/mongod.conf
```

**Add these lines:**

```yaml
security:
  authorization: enabled
```

**Create MongoDB admin user:**

```bash
mongosh
use admin
db.createUser({
  user: "admin",
  pwd: "strong_password_here",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
})
exit

# Restart MongoDB
sudo systemctl restart mongod
```

**Update your `.env` with authentication:**

```env
MONGODB_URI=mongodb://admin:strong_password_here@localhost:27017/qoqnuz?authSource=admin
```

### Step 29: Setup Fail2Ban (Prevent Brute Force)

```bash
# Install Fail2Ban
sudo apt install -y fail2ban

# Copy default config
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Edit config
sudo nano /etc/fail2ban/jail.local

# Find and ensure these are set:
# [sshd]
# enabled = true
# maxretry = 3
# bantime = 3600

# Restart Fail2Ban
sudo systemctl restart fail2ban

# Check status
sudo fail2ban-client status
```

---

## Part 12: Useful Commands

### PM2 Commands

```bash
# View all processes
pm2 list

# View logs
pm2 logs qoqnuz-backend

# Restart backend
pm2 restart qoqnuz-backend

# Stop backend
pm2 stop qoqnuz-backend

# Delete process
pm2 delete qoqnuz-backend

# Monitor resources
pm2 monit
```

### Nginx Commands

```bash
# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx

# View error logs
sudo tail -f /var/log/nginx/error.log

# View access logs
sudo tail -f /var/log/nginx/access.log
```

### MongoDB Commands

```bash
# Check status
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod

# View logs
sudo tail -f /var/log/mongodb/mongod.log

# Connect to MongoDB
mongosh
```

### System Commands

```bash
# Check disk space
df -h

# Check memory usage
free -h

# Check running processes
htop

# Check open ports
sudo netstat -tlnp
```

---

## Part 13: Troubleshooting

### Issue: Backend Not Starting

```bash
# Check PM2 logs
pm2 logs qoqnuz-backend

# Common issues:
# 1. MongoDB not running
sudo systemctl status mongod

# 2. Port already in use
sudo netstat -tlnp | grep 5000

# 3. Environment variables not set
cd ~/Khowar/backend
cat .env
```

### Issue: Can't Access Admin Panel

```bash
# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Check if files exist
ls -la ~/Khowar/admin-panel/dist

# Rebuild admin panel
cd ~/Khowar/admin-panel
npm run build
```

### Issue: SSL Certificate Error

```bash
# Check certificate status
sudo certbot certificates

# Renew certificates
sudo certbot renew

# Check Nginx configuration
sudo nginx -t
```

### Issue: MongoDB Connection Failed

```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Test connection
mongosh

# Check .env MONGODB_URI
```

### Issue: File Upload Fails

```bash
# Check permissions on uploads folder
ls -la ~/Khowar/backend/uploads

# Fix permissions
cd ~/Khowar/backend
chmod 755 uploads
chmod 755 uploads/audio uploads/images

# Check Nginx upload size limit
sudo nano /etc/nginx/sites-available/qoqnuz-api
# Ensure: client_max_body_size 50M;
```

---

## Part 14: Updating Your Application

### When You Make Code Changes:

```bash
# Navigate to project
cd ~/Khowar

# Pull latest changes
git pull origin claude/qoqnuz-spotify-admin-panel-011CUsPJ4xJhagYCUWzngUeb

# Update backend
cd backend
npm install
pm2 restart qoqnuz-backend

# Update admin panel
cd ~/Khowar/admin-panel
npm install
npm run build

# No need to restart Nginx, just reload
sudo systemctl reload nginx
```

---

## Part 15: Setting Up Additional Features

### Configure Wasabi Storage

```bash
# Edit .env
nano ~/Khowar/backend/.env
```

**Update these values:**

```env
STORAGE_PROVIDER=wasabi
WASABI_ACCESS_KEY_ID=your_wasabi_key
WASABI_SECRET_ACCESS_KEY=your_wasabi_secret
WASABI_BUCKET_NAME=qoqnuz-music
WASABI_REGION=us-east-1
WASABI_ENDPOINT=https://s3.us-east-1.wasabisys.com
```

**Restart backend:**

```bash
pm2 restart qoqnuz-backend
```

### Configure Bunny CDN

1. **Create Bunny CDN Account:** https://bunny.net
2. **Create Storage Zone:** Name it `qoqnuz`
3. **Create Pull Zone:** Connect to your storage zone
4. **Get API Key:** From account settings

```bash
# Edit .env
nano ~/Khowar/backend/.env
```

**Update:**

```env
BUNNY_CDN_ENABLED=true
BUNNY_CDN_URL=https://qoqnuz.b-cdn.net
BUNNY_CDN_API_KEY=your_bunny_api_key
BUNNY_STORAGE_ZONE=qoqnuz
BUNNY_STORAGE_PASSWORD=your_storage_password
```

### Configure Google OAuth

1. Go to: https://console.cloud.google.com
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://api.qoqnuz.com/api/auth/google/callback`

```bash
# Update .env
nano ~/Khowar/backend/.env
```

**Add:**

```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=https://api.qoqnuz.com/api/auth/google/callback
```

---

## Checklist

Use this checklist to ensure everything is set up:

- [ ] VPS created and accessible via SSH
- [ ] Non-root user created
- [ ] Firewall configured (ports 22, 80, 443 open)
- [ ] Node.js installed
- [ ] MongoDB installed and running
- [ ] PM2 installed
- [ ] Nginx installed and running
- [ ] Repository cloned
- [ ] Backend dependencies installed
- [ ] `.env` file configured
- [ ] Backend running with PM2
- [ ] Admin panel built
- [ ] Nginx configured for both API and Admin
- [ ] DNS records added
- [ ] SSL certificates installed
- [ ] Admin user created
- [ ] API accessible via HTTPS
- [ ] Admin panel accessible via HTTPS
- [ ] Can login to admin panel
- [ ] Uploads directory created and writable
- [ ] MongoDB backup script configured
- [ ] MongoDB authentication enabled
- [ ] Fail2Ban installed

---

## Final Notes

### Production Checklist:

1. ✅ **Change all default passwords** in `.env`
2. ✅ **Enable MongoDB authentication**
3. ✅ **Setup backups** (automated daily backups)
4. ✅ **Configure monitoring** (PM2 monitoring)
5. ✅ **Setup log rotation**
6. ✅ **Configure firewall** properly
7. ✅ **Setup Fail2Ban** for SSH protection
8. ✅ **Enable SSL** for all domains
9. ✅ **Configure storage provider** (Wasabi/S3)
10. ✅ **Setup CDN** for better performance
11. ✅ **Configure email SMTP**
12. ✅ **Test all features** before going live

### Recommended Monitoring:

- **Uptime monitoring:** https://uptimerobot.com (free)
- **Error tracking:** https://sentry.io (free tier)
- **Analytics:** Google Analytics
- **Performance:** PM2 monitoring

### Backup Strategy:

- **Daily MongoDB backups** (automated script)
- **Weekly full server snapshots** (from VPS provider)
- **Keep 7 days of rolling backups**
- **Store critical backups offsite** (AWS S3, Google Drive)

---

## Support

If you encounter issues:

1. Check the logs: `pm2 logs qoqnuz-backend`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Check MongoDB logs: `sudo tail -f /var/log/mongodb/mongod.log`
4. Verify all environment variables in `.env`
5. Ensure DNS is properly configured
6. Test API endpoint: `curl https://api.qoqnuz.com/health`

---

**Congratulations! Your Qoqnuz platform is now live! 🎉**

Access your admin panel at: `https://admin.qoqnuz.com`
