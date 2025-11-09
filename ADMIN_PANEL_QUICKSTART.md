# Admin Panel Quick Start Guide

## For Local Development (Testing on Your Computer)

### Step 1: Install Dependencies

```bash
cd admin-panel
npm install
```

### Step 2: Configure API URL

Create a `.env` file in the `admin-panel` directory:

```bash
# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

Or manually create `admin-panel/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Start Backend First

**In one terminal:**
```bash
cd backend

# Make sure .env is configured (see LOCAL_TESTING_GUIDE.md)
# Start the backend
node server.js
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

### Step 4: Start Admin Panel Dev Server

**In another terminal:**
```bash
cd admin-panel

# Start development server
npm run dev
```

You should see:
```
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 5: Access Admin Panel

Open your browser to: **http://localhost:5173**

You should see the login page (NOT the nginx welcome page).

---

## For VPS Deployment (Production Server)

If you're on a VPS and seeing the nginx welcome page, follow these steps:

### Check 1: Is the Backend Running?

```bash
# Check if backend is running
pm2 status

# If not running, start it
cd ~/Khowar/backend
pm2 start server.js --name qoqnuz-backend
pm2 save
```

### Check 2: Is Admin Panel Built?

```bash
# Navigate to admin panel
cd ~/Khowar/admin-panel

# Create .env file with production API URL
echo "VITE_API_URL=https://api.qoqnuz.com/api" > .env

# Build the admin panel
npm install
npm run build

# Verify dist folder exists
ls -la dist/
```

### Check 3: Configure Nginx for Admin Panel

```bash
# Create nginx configuration
sudo nano /etc/nginx/sites-available/qoqnuz-admin
```

Add this configuration:

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

**Important:** Change `/home/qoqnuz/` to match your actual username if different!

Save and exit: `CTRL + X`, `Y`, `ENTER`

### Check 4: Enable the Site

```bash
# Enable the admin site
sudo ln -s /etc/nginx/sites-available/qoqnuz-admin /etc/nginx/sites-enabled/

# Remove default nginx site (this is showing the welcome page)
sudo rm /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# If test passes, reload nginx
sudo systemctl reload nginx
```

### Check 5: Configure DNS

Make sure your domain DNS is pointing to your VPS:

Go to your domain registrar and add:
```
Type: A
Name: admin
Value: YOUR_VPS_IP_ADDRESS
TTL: 300
```

Wait 5-10 minutes for DNS to propagate.

### Check 6: Test Access

```bash
# Test from command line
curl http://admin.qoqnuz.com

# Should return HTML, not nginx welcome page
```

Open browser to: `http://admin.qoqnuz.com`

### Check 7: Setup SSL (HTTPS)

```bash
# Install certbot if not already installed
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d admin.qoqnuz.com

# Follow prompts - choose to redirect HTTP to HTTPS
```

Now access: `https://admin.qoqnuz.com`

---

## Common Issues

### Issue: Still seeing nginx welcome page after configuration

**Solution 1: Check which site is enabled**
```bash
# List enabled sites
ls -la /etc/nginx/sites-enabled/

# You should see 'qoqnuz-admin' (and possibly 'qoqnuz-api')
# You should NOT see 'default'

# If 'default' exists, remove it:
sudo rm /etc/nginx/sites-enabled/default
sudo systemctl reload nginx
```

**Solution 2: Check nginx error logs**
```bash
sudo tail -f /var/log/nginx/error.log
```

**Solution 3: Verify the dist folder exists**
```bash
ls -la ~/Khowar/admin-panel/dist/

# Should show index.html and assets folder
# If not, rebuild:
cd ~/Khowar/admin-panel
npm run build
```

**Solution 4: Check file permissions**
```bash
# Make sure nginx can read the files
chmod 755 ~/Khowar
chmod 755 ~/Khowar/admin-panel
chmod 755 ~/Khowar/admin-panel/dist
chmod -R 644 ~/Khowar/admin-panel/dist/*
chmod 755 ~/Khowar/admin-panel/dist/assets
```

### Issue: "Connection refused" or "502 Bad Gateway"

This means the backend API isn't running.

**Solution:**
```bash
# Check backend status
pm2 status

# Start backend if not running
cd ~/Khowar/backend
pm2 start server.js --name qoqnuz-backend

# Check logs
pm2 logs qoqnuz-backend
```

### Issue: Can't login to admin panel

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

# Exit
exit

# Set password via API
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@qoqnuz.com",
    "password": "Admin123!",
    "displayName": "Admin User"
  }'

# Or set password directly in MongoDB
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('Admin123!', 10, (err, hash) => console.log(hash));"

# Copy the hash, then in mongosh:
mongosh
use qoqnuz
db.users.updateOne(
  { email: "admin@qoqnuz.com" },
  { $set: { password: "PASTE_HASH_HERE" } }
)
exit
```

---

## Quick Decision Tree

**Where are you testing?**

### On Local Computer (Development)
1. Don't use nginx
2. Run: `npm run dev` in admin-panel folder
3. Access: `http://localhost:5173`

### On VPS (Production)
1. Build admin panel: `npm run build`
2. Configure nginx (see above)
3. Remove default nginx site
4. Access: `http://admin.yourdomain.com`

---

## Verification Steps

### For Local Development:

```bash
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Admin Panel
cd admin-panel
npm run dev

# Browser
# Open: http://localhost:5173
```

### For VPS Production:

```bash
# Check backend
pm2 status
pm2 logs qoqnuz-backend

# Check admin build
ls -la ~/Khowar/admin-panel/dist/

# Check nginx config
sudo nginx -t
ls -la /etc/nginx/sites-enabled/

# Check nginx logs
sudo tail -f /var/log/nginx/error.log

# Browser
# Open: https://admin.yourdomain.com
```

---

## Need More Help?

1. **For local testing**: See `LOCAL_TESTING_GUIDE.md`
2. **For VPS deployment**: See `DEPLOYMENT_GUIDE.md`
3. **For troubleshooting**: Check logs in `/var/log/nginx/error.log`
