# Fix Nginx Welcome Page - VPS Deployment

Follow these steps **on your VPS** to fix the nginx welcome page and serve your admin panel.

---

## Step-by-Step Fix

### Step 1: Connect to Your VPS

```bash
ssh root@YOUR_VPS_IP
# Or if you created a user:
ssh qoqnuz@YOUR_VPS_IP
```

---

### Step 2: Navigate to Project and Pull Latest Code

```bash
cd ~/Khowar

# Pull latest changes
git pull origin claude/qoqnuz-spotify-admin-panel-011CUsPJ4xJhagYCUWzngUeb
```

---

### Step 3: Build the Admin Panel

```bash
# Navigate to admin panel directory
cd ~/Khowar/admin-panel

# Install dependencies (if not already done)
npm install

# Create .env file with production API URL
# IMPORTANT: Replace api.qoqnuz.com with your actual API domain
echo "VITE_API_URL=https://api.qoqnuz.com/api" > .env

# If you don't have SSL yet, use HTTP:
# echo "VITE_API_URL=http://api.qoqnuz.com/api" > .env

# Build the admin panel
npm run build

# Verify the build succeeded
ls -la dist/
# You should see index.html and an assets/ folder
```

---

### Step 4: Check Your Username

Before configuring nginx, check your actual username:

```bash
whoami
pwd
# Note the path - it will be something like /home/USERNAME/Khowar
```

**IMPORTANT:** Remember this username for the next step!

---

### Step 5: Create Nginx Configuration for Admin Panel

```bash
# Create nginx config file
sudo nano /etc/nginx/sites-available/qoqnuz-admin
```

**Paste this configuration** (replace `qoqnuz` with YOUR username if different):

```nginx
server {
    listen 80;
    server_name admin.qoqnuz.com;

    # IMPORTANT: Change 'qoqnuz' to your actual username!
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

**Save the file:**
- Press `CTRL + X`
- Press `Y`
- Press `ENTER`

---

### Step 6: Create Nginx Configuration for API (Backend)

```bash
# Create nginx config for API
sudo nano /etc/nginx/sites-available/qoqnuz-api
```

**Paste this configuration:**

```nginx
server {
    listen 80;
    server_name api.qoqnuz.com;

    # Increase upload size limit for music files
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

**Save the file:**
- Press `CTRL + X`
- Press `Y`
- Press `ENTER`

---

### Step 7: Enable the New Sites

```bash
# Enable admin site
sudo ln -s /etc/nginx/sites-available/qoqnuz-admin /etc/nginx/sites-enabled/

# Enable API site
sudo ln -s /etc/nginx/sites-available/qoqnuz-api /etc/nginx/sites-enabled/

# Remove the default nginx site (this is showing the welcome page!)
sudo rm /etc/nginx/sites-enabled/default

# List enabled sites to verify
ls -la /etc/nginx/sites-enabled/
# You should see: qoqnuz-admin and qoqnuz-api
```

---

### Step 8: Test Nginx Configuration

```bash
# Test the configuration
sudo nginx -t

# You should see:
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

**If you see errors:**
- Check that the path in the config matches your actual path
- Verify the dist folder exists: `ls -la ~/Khowar/admin-panel/dist/`

---

### Step 9: Reload Nginx

```bash
# Reload nginx to apply changes
sudo systemctl reload nginx

# Check nginx status
sudo systemctl status nginx
```

---

### Step 10: Start the Backend (If Not Already Running)

```bash
# Navigate to backend
cd ~/Khowar/backend

# Install dependencies if needed
npm install

# Create .env file if not exists
cp .env.example .env

# Edit .env file
nano .env
```

**Minimal production .env configuration:**

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/qoqnuz
JWT_SECRET=change_this_to_a_long_random_string_123456789
JWT_EXPIRE=7d
SESSION_SECRET=change_this_to_another_long_random_string_987654321
STORAGE_PROVIDER=local
CLIENT_URL=https://play.qoqnuz.com
ADMIN_URL=https://admin.qoqnuz.com
```

Save: `CTRL + X`, `Y`, `ENTER`

```bash
# Create uploads directories
mkdir -p uploads/audio uploads/images

# Install PM2 if not already installed
sudo npm install -g pm2

# Start backend with PM2
pm2 start server.js --name qoqnuz-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the command it outputs (copy and paste it)

# Check backend status
pm2 status
pm2 logs qoqnuz-backend
```

---

### Step 11: Verify DNS Configuration

Make sure your domains point to your VPS IP address.

In your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.), add these DNS records:

```
Type    Name      Value                TTL
----    ----      -----                ---
A       api       YOUR_VPS_IP_HERE     300
A       admin     YOUR_VPS_IP_HERE     300
```

**Example:**
```
A       api       165.227.123.45       300
A       admin     165.227.123.45       300
```

**Wait 5-10 minutes** for DNS to propagate.

---

### Step 12: Test Your Setup

**Test API:**
```bash
# From your VPS
curl http://localhost:5000/health
# Should return: {"status":"ok","message":"Qoqnuz API is running"}

# From internet (after DNS propagates)
curl http://api.qoqnuz.com/health
```

**Test Admin Panel:**

Open your browser and go to: `http://admin.qoqnuz.com`

You should now see the **login page** instead of the nginx welcome page!

---

### Step 13: Setup SSL (HTTPS) - Recommended

Once the HTTP version works, add SSL:

```bash
# Install certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate for API
sudo certbot --nginx -d api.qoqnuz.com

# Get SSL certificate for Admin
sudo certbot --nginx -d admin.qoqnuz.com

# Follow the prompts:
# - Enter your email
# - Agree to terms
# - Choose to redirect HTTP to HTTPS (option 2)
```

Certbot will automatically:
- Get SSL certificates
- Update nginx configurations to use HTTPS
- Setup auto-renewal

**Update admin panel .env for HTTPS:**

```bash
cd ~/Khowar/admin-panel
echo "VITE_API_URL=https://api.qoqnuz.com/api" > .env
npm run build
sudo systemctl reload nginx
```

Now access: `https://admin.qoqnuz.com`

---

## Troubleshooting

### Issue: Still seeing nginx welcome page

**Solution 1: Check enabled sites**
```bash
ls -la /etc/nginx/sites-enabled/

# If you see 'default', remove it:
sudo rm /etc/nginx/sites-enabled/default
sudo systemctl reload nginx
```

**Solution 2: Check nginx error logs**
```bash
sudo tail -f /var/log/nginx/error.log
# Look for any errors
```

**Solution 3: Verify dist folder exists**
```bash
ls -la ~/Khowar/admin-panel/dist/

# Should show:
# index.html
# assets/
# (and other files)

# If empty or missing, rebuild:
cd ~/Khowar/admin-panel
npm run build
```

**Solution 4: Check file permissions**
```bash
chmod 755 ~/Khowar
chmod 755 ~/Khowar/admin-panel
chmod 755 ~/Khowar/admin-panel/dist
chmod -R 644 ~/Khowar/admin-panel/dist/*
find ~/Khowar/admin-panel/dist -type d -exec chmod 755 {} \;
sudo systemctl reload nginx
```

---

### Issue: 502 Bad Gateway

This means nginx is configured but the backend isn't running.

**Solution:**
```bash
# Check backend status
pm2 status

# If not running, start it:
cd ~/Khowar/backend
pm2 start server.js --name qoqnuz-backend

# Check logs for errors
pm2 logs qoqnuz-backend

# Common issue: MongoDB not running
sudo systemctl status mongod
sudo systemctl start mongod
```

---

### Issue: 404 on API calls from admin panel

**Solution: Check backend .env**
```bash
cd ~/Khowar/backend
cat .env | grep MONGODB_URI

# Start/restart backend
pm2 restart qoqnuz-backend
pm2 logs qoqnuz-backend
```

---

### Issue: Can't login - "User not found"

**Solution: Create admin user**

```bash
# Connect to MongoDB
mongosh

# Switch to database
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

exit

# Set password using bcrypt
cd ~/Khowar/backend
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('Admin123!', 10, (err, hash) => console.log(hash));"

# Copy the hash output, then:
mongosh
use qoqnuz
db.users.updateOne(
  { email: "admin@qoqnuz.com" },
  { $set: { password: "PASTE_HASH_HERE" } }
)
exit

# Now you can login with:
# Email: admin@qoqnuz.com
# Password: Admin123!
```

---

## Quick Verification Checklist

Run these commands to verify everything:

```bash
# 1. Check nginx is running
sudo systemctl status nginx

# 2. Check enabled sites (should NOT show 'default')
ls -la /etc/nginx/sites-enabled/

# 3. Check dist folder exists
ls -la ~/Khowar/admin-panel/dist/

# 4. Check backend is running
pm2 status

# 5. Test backend locally
curl http://localhost:5000/health

# 6. Check nginx logs for errors
sudo tail -20 /var/log/nginx/error.log

# 7. Test admin panel
curl -I http://admin.qoqnuz.com
# Should return "200 OK", not 404
```

---

## Summary

✅ Built admin panel with `npm run build`
✅ Created nginx config for admin panel
✅ Created nginx config for API
✅ Removed default nginx site (welcome page)
✅ Started backend with PM2
✅ Configured DNS records
✅ Tested access
✅ (Optional) Added SSL certificates

**Your admin panel should now be accessible at:** `http://admin.qoqnuz.com` (or `https://` if SSL is configured)

---

## Next Steps

1. ✅ Create admin user in MongoDB
2. ✅ Login to admin panel
3. ✅ Start uploading music content
4. ✅ Configure S3/Wasabi storage (optional)
5. ✅ Setup OAuth (optional)
6. ✅ Configure email SMTP (optional)

See `DEPLOYMENT_GUIDE.md` for complete production setup.
