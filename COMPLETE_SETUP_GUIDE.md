# Qoqnuz Complete Setup Guide - From Zero to Production

**Version:** 2.0
**Last Updated:** November 2025
**Difficulty:** Beginner-Friendly
**Time Required:** 45-60 minutes

This guide takes you from a fresh VPS to a fully working music streaming platform with admin panel.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Part 1: VPS Initial Setup](#part-1-vps-initial-setup)
3. [Part 2: Install Software](#part-2-install-software)
4. [Part 3: Clone and Build Project](#part-3-clone-and-build-project)
5. [Part 4: Configure Backend](#part-4-configure-backend)
6. [Part 5: Configure Admin Panel](#part-5-configure-admin-panel)
7. [Part 6: Setup Nginx](#part-6-setup-nginx)
8. [Part 7: Create Admin User](#part-7-create-admin-user)
9. [Part 8: Test Everything](#part-8-test-everything)
10. [Part 9: Setup SSL (Optional)](#part-9-setup-ssl-optional)
11. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### What You Need:

- ✅ **VPS Server** (DigitalOcean, Linode, Vultr, etc.)
  - Minimum: 2GB RAM, 1 CPU, 25GB SSD
  - Recommended: 4GB RAM, 2 CPU, 50GB SSD
- ✅ **Domain Name** (e.g., voiceofchitral.com)
- ✅ **SSH Access** to your VPS
- ✅ **30-60 minutes** of your time

### Operating System:

This guide assumes **Ubuntu 22.04 LTS** (recommended). Commands work on Ubuntu 20.04+ and Debian 11+.

---

## Part 1: VPS Initial Setup

### Step 1.1: Connect to VPS

```bash
ssh root@YOUR_VPS_IP

# Example:
# ssh root@165.227.123.45
```

### Step 1.2: Update System

```bash
apt update && apt upgrade -y
```

### Step 1.3: Set Hostname (Optional)

```bash
hostnamectl set-hostname qoqnuz-server
```

### Step 1.4: Configure Firewall

```bash
# Install UFW
apt install -y ufw

# Allow SSH (CRITICAL - do this first!)
ufw allow 22/tcp

# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw --force enable

# Verify
ufw status numbered
```

You should see:
```
Status: active

     To                         Action      From
     --                         ------      ----
[ 1] 22/tcp                     ALLOW IN    Anywhere
[ 2] 80/tcp                     ALLOW IN    Anywhere
[ 3] 443/tcp                    ALLOW IN    Anywhere
```

---

## Part 2: Install Software

### Step 2.1: Install Node.js 18

```bash
# Download Node.js setup script
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -

# Install Node.js
apt install -y nodejs

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x or higher
```

### Step 2.2: Install MongoDB

```bash
# Import MongoDB GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
  gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
  tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package list
apt update

# Install MongoDB
apt install -y mongodb-org

# Start MongoDB
systemctl start mongod
systemctl enable mongod

# Verify MongoDB is running
systemctl status mongod
```

You should see: `Active: active (running)`

### Step 2.3: Install PM2

```bash
# Install PM2 globally
npm install -g pm2

# Verify
pm2 --version
```

### Step 2.4: Install Nginx

```bash
# Install Nginx
apt install -y nginx

# Start and enable Nginx
systemctl start nginx
systemctl enable nginx

# Verify
systemctl status nginx
```

### Step 2.5: Install Git

```bash
apt install -y git
git --version
```

---

## Part 3: Clone and Build Project

### Step 3.1: Clone Repository

```bash
# Clone to /root directory
cd /root
git clone https://github.com/waqarahm3d/Khowar.git
cd Khowar

# Checkout the correct branch
git checkout claude/qoqnuz-spotify-admin-panel-011CUsPJ4xJhagYCUWzngUeb

# Verify you're on the right branch
git branch
```

---

## Part 4: Configure Backend

### Step 4.1: Install Backend Dependencies

```bash
cd /root/Khowar/backend
npm install
```

This will take 2-3 minutes.

### Step 4.2: Create Upload Directories

```bash
mkdir -p uploads/audio uploads/images
chmod 755 uploads uploads/audio uploads/images
```

### Step 4.3: Create Environment File

```bash
cp .env.example .env
nano .env
```

**Edit these values** (use arrow keys to navigate):

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb://localhost:27017/qoqnuz

# JWT Secrets (CHANGE THESE!)
JWT_SECRET=change_this_to_a_very_long_random_string_12345678901234567890
JWT_EXPIRE=7d
SESSION_SECRET=change_this_to_another_very_long_random_string_0987654321

# Storage (local for now, can change later)
STORAGE_PROVIDER=local

# URLs (CHANGE TO YOUR DOMAIN!)
CLIENT_URL=http://play.voiceofchitral.com
ADMIN_URL=http://admin.voiceofchitral.com

# Email (Optional - leave empty for now)
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=noreply@voiceofchitral.com

# OAuth (Optional - leave empty for now)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=

FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
FACEBOOK_CALLBACK_URL=
```

**IMPORTANT Changes:**
1. Change `JWT_SECRET` to a long random string
2. Change `SESSION_SECRET` to a different long random string
3. Change domain from `voiceofchitral.com` to YOUR domain

**Save and exit:**
- Press `CTRL + X`
- Press `Y`
- Press `ENTER`

### Step 4.4: Start Backend with PM2

```bash
# Start backend
pm2 start server.js --name qoqnuz-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup systemd
```

**Copy and run the command** that PM2 outputs (looks like: `sudo env PATH=...`)

### Step 4.5: Verify Backend is Running

```bash
# Check PM2 status
pm2 status

# Should show:
# ┌─────┬──────────────────┬─────────┬─────────┐
# │ id  │ name             │ status  │ restart │
# ├─────┼──────────────────┼─────────┼─────────┤
# │ 0   │ qoqnuz-backend   │ online  │ 0       │
# └─────┴──────────────────┴─────────┴─────────┘

# Check logs
pm2 logs qoqnuz-backend --lines 20

# Should see:
# ✅ MongoDB connected successfully
# 🚀 Server running on port 5000

# Test backend directly
curl http://localhost:5000/health

# Should return:
# {"status":"ok","message":"Qoqnuz API is running"}
```

✅ **If you see the above, backend is working!**

---

## Part 5: Configure Admin Panel

### Step 5.1: Install Admin Panel Dependencies

```bash
cd /root/Khowar/admin-panel
npm install
```

This will take 3-5 minutes.

### Step 5.2: Create Admin Panel Environment File

```bash
# Create .env file (CHANGE TO YOUR DOMAIN!)
echo "VITE_API_URL=http://api.voiceofchitral.com/api" > .env

# Verify
cat .env
```

Should show: `VITE_API_URL=http://api.voiceofchitral.com/api`

### Step 5.3: Build Admin Panel

```bash
npm run build
```

This will take 1-2 minutes.

### Step 5.4: Verify Build Succeeded

```bash
ls -la dist/

# Should show:
# index.html
# assets/
# vite.svg
```

✅ **If you see these files, build succeeded!**

---

## Part 6: Setup Nginx

### Step 6.1: Remove Default Nginx Site

```bash
rm /etc/nginx/sites-enabled/default
```

### Step 6.2: Create API Nginx Configuration

```bash
nano /etc/nginx/sites-available/qoqnuz-api
```

**Paste this configuration:**

```nginx
server {
    listen 80;
    server_name api.voiceofchitral.com;

    client_max_body_size 100M;

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
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
```

**Change `api.voiceofchitral.com` to YOUR API domain!**

**Save:** `CTRL + X`, `Y`, `ENTER`

### Step 6.3: Create Admin Panel Nginx Configuration

```bash
nano /etc/nginx/sites-available/qoqnuz-admin
```

**Paste this configuration:**

```nginx
server {
    listen 80;
    server_name admin.voiceofchitral.com;

    root /root/Khowar/admin-panel/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Change `admin.voiceofchitral.com` to YOUR admin domain!**

**Save:** `CTRL + X`, `Y`, `ENTER`

### Step 6.4: Fix Permissions (CRITICAL!)

```bash
# Give nginx permission to read files in /root
chmod 755 /root
chmod 755 /root/Khowar
chmod 755 /root/Khowar/admin-panel
chmod 755 /root/Khowar/admin-panel/dist
chmod -R 755 /root/Khowar/admin-panel/dist
```

### Step 6.5: Enable Sites and Reload Nginx

```bash
# Enable API site
ln -s /etc/nginx/sites-available/qoqnuz-api /etc/nginx/sites-enabled/

# Enable Admin site
ln -s /etc/nginx/sites-available/qoqnuz-admin /etc/nginx/sites-enabled/

# Test nginx configuration
nginx -t

# Should show:
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful

# Reload nginx
systemctl reload nginx
```

✅ **If nginx test passed, configuration is correct!**

---

## Part 7: Create Admin User

### Step 7.1: Generate Password Hash

```bash
cd /root/Khowar/backend

# Generate hash for your password (change "YourPassword123!" to your desired password)
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YourPassword123!', 10, (err, hash) => console.log(hash));"
```

**Copy the output** (starts with `$2a$10$...`)

### Step 7.2: Create Admin User in MongoDB

```bash
mongosh
```

You're now in MongoDB shell. Run these commands:

```javascript
// Switch to qoqnuz database
use qoqnuz

// Create admin user (PASTE YOUR HASH from Step 7.1)
db.users.insertOne({
  username: "admin",
  email: "admin@voiceofchitral.com",
  password: "$2a$10$PASTE_YOUR_HASH_HERE",
  displayName: "Admin User",
  role: "admin",
  isPremium: true,
  emailVerified: true,
  verifiedAt: new Date(),
  authProvider: "local",
  profileImage: "",
  bio: "",
  likedSongs: [],
  playlists: [],
  followedArtists: [],
  followedPlaylists: [],
  followingUsers: [],
  followers: [],
  artistVerificationStatus: "none",
  artistVerificationDetails: null,
  isDisabled: false,
  lastLogin: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
})

// Verify user was created
db.users.findOne({ email: "admin@voiceofchitral.com" }, { email: 1, username: 1, role: 1 })

// Exit MongoDB
exit
```

✅ **You should see your admin user details!**

### Step 7.3: Test Login

```bash
# Test login (change password if you used different one)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@voiceofchitral.com",
    "password": "YourPassword123!"
  }'
```

**Should return:** `{"success":true,"data":{...},"token":"..."}`

✅ **If you see a token, login is working!**

---

## Part 8: Test Everything

### Step 8.1: Configure DNS

Before testing from browser, configure your DNS records.

**In your domain registrar** (GoDaddy, Namecheap, Cloudflare, etc.):

```
Type    Name      Value               TTL
----    ----      -----               ---
A       api       YOUR_VPS_IP_HERE    300
A       admin     YOUR_VPS_IP_HERE    300
```

**Example:**
```
A       api       165.227.123.45      300
A       admin     165.227.123.45      300
```

**Wait 5-10 minutes** for DNS to propagate.

### Step 8.2: Test API from Internet

```bash
# From your local computer or VPS
curl http://api.voiceofchitral.com/health

# Should return:
# {"status":"ok","message":"Qoqnuz API is running"}
```

### Step 8.3: Test Admin Panel

Open your browser and go to:

```
http://admin.voiceofchitral.com
```

You should see the **login page**!

### Step 8.4: Login to Admin Panel

**Login with:**
- Email: `admin@voiceofchitral.com`
- Password: `YourPassword123!` (or whatever you chose)

✅ **You should now be in the admin dashboard!**

---

## Part 9: Setup SSL (Optional but Recommended)

### Step 9.1: Install Certbot

```bash
apt install -y certbot python3-certbot-nginx
```

### Step 9.2: Get SSL Certificates

```bash
# Get certificate for API
certbot --nginx -d api.voiceofchitral.com

# Get certificate for Admin
certbot --nginx -d admin.voiceofchitral.com
```

**Follow the prompts:**
1. Enter your email
2. Agree to terms (press `Y`)
3. Choose to redirect HTTP to HTTPS (press `2`)

Certbot will automatically:
- Get SSL certificates
- Update nginx configs
- Setup auto-renewal

### Step 9.3: Update Admin Panel for HTTPS

```bash
cd /root/Khowar/admin-panel

# Update API URL to HTTPS
echo "VITE_API_URL=https://api.voiceofchitral.com/api" > .env

# Rebuild
npm run build

# Reload nginx
systemctl reload nginx
```

### Step 9.4: Test HTTPS

Open browser to:
```
https://admin.voiceofchitral.com
```

You should see the padlock icon 🔒 in the address bar!

---

## Troubleshooting

### Issue: Backend shows "MongoDB connection error"

**Solution:**
```bash
# Check MongoDB status
systemctl status mongod

# If not running
systemctl start mongod
systemctl enable mongod

# Check logs
tail -50 /var/log/mongodb/mongod.log

# Restart backend
pm2 restart qoqnuz-backend
```

### Issue: Admin panel shows 500 error

**Solution:**
```bash
# Check nginx error logs
tail -50 /var/log/nginx/error.log

# Most common issue: Permission denied
# Fix permissions:
chmod 755 /root
chmod -R 755 /root/Khowar/admin-panel/dist

# Reload nginx
systemctl reload nginx
```

### Issue: "Invalid credentials" when logging in

**Solution:**
```bash
# Reset password
cd /root/Khowar/backend
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('NewPassword123!', 10, (err, hash) => console.log(hash));"

# Copy the hash, then:
mongosh
use qoqnuz
db.users.updateOne(
  { email: "admin@voiceofchitral.com" },
  { $set: { password: "PASTE_HASH_HERE" } }
)
exit

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@voiceofchitral.com","password":"NewPassword123!"}'
```

### Issue: Can't access from browser (DNS not working)

**Solution:**
```bash
# Check DNS propagation
nslookup api.voiceofchitral.com
nslookup admin.voiceofchitral.com

# If not resolved, wait 10-30 minutes for DNS propagation
# Or use Cloudflare DNS for faster propagation
```

### Issue: Backend not starting (PM2 errors)

**Solution:**
```bash
# Check logs
pm2 logs qoqnuz-backend --lines 50

# Common fixes:
# 1. Missing .env file
cd /root/Khowar/backend
ls -la .env

# 2. Port already in use
lsof -i :5000
# Kill the process if needed

# 3. Missing dependencies
npm install

# Restart
pm2 restart qoqnuz-backend
```

---

## Verification Checklist

Run these commands to verify everything:

```bash
# ✅ MongoDB running
systemctl status mongod | grep "Active: active"

# ✅ Backend running
pm2 status | grep qoqnuz-backend | grep online

# ✅ Backend responding
curl http://localhost:5000/health

# ✅ Nginx running
systemctl status nginx | grep "Active: active"

# ✅ Nginx config valid
nginx -t

# ✅ Admin panel built
ls /root/Khowar/admin-panel/dist/index.html

# ✅ API accessible
curl http://api.voiceofchitral.com/health

# ✅ Admin accessible
curl -I http://admin.voiceofchitral.com | grep "200 OK"

# ✅ Can login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@voiceofchitral.com","password":"YourPassword123!"}'
```

All should return success! ✅

---

## Quick Reference Commands

```bash
# View backend logs
pm2 logs qoqnuz-backend

# Restart backend
pm2 restart qoqnuz-backend

# Stop backend
pm2 stop qoqnuz-backend

# Rebuild admin panel
cd /root/Khowar/admin-panel && npm run build

# Reload nginx
systemctl reload nginx

# Check nginx logs
tail -50 /var/log/nginx/error.log

# Check MongoDB
systemctl status mongod
mongosh

# View backend status
pm2 status
```

---

## What's Next?

Now that your platform is running, you can:

1. **Upload Music** - Use the admin panel to add songs, artists, albums
2. **Configure Storage** - Setup S3/Wasabi for scalable file storage
3. **Enable OAuth** - Add Google/Facebook login
4. **Setup Email** - Configure SMTP for user emails
5. **Build Frontend** - Create the user-facing music player (play.voiceofchitral.com)
6. **Add Content** - Start building your music library

---

## Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Check logs: `pm2 logs` and `/var/log/nginx/error.log`
3. Verify all steps were completed
4. Check firewall: `ufw status`
5. Check DNS: `nslookup your-domain.com`

---

**Congratulations! Your Qoqnuz music streaming platform is now live! 🎉**

Access your admin panel at: `http://admin.voiceofchitral.com` (or `https://` if SSL configured)
