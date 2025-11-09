# Voice of Chitral - ServerAvatar Deployment Guide

Complete guide to deploy Voice of Chitral on ServerAvatar with Node.js and MongoDB.

**ServerAvatar Features:**
- ✅ Node.js already configured
- ✅ MongoDB installed with authentication
- ✅ GitHub integration
- ✅ Nginx automatic configuration
- ✅ SSL certificate management
- ✅ Easy application management

---

## Prerequisites

✅ **ServerAvatar account and server setup**
✅ **MongoDB installed with credentials:**
- Database: `voiceofchitral`
- Username: `voiceofchitral`
- Password: `Digital12!!!`
- Connection: `mongodb://voiceofchitral:Digital12!!!@localhost:27017/?authSource=voiceofchitral`

✅ **Domain pointed to server:**
- `api.voiceofchitral.com` (for backend API)
- `admin.voiceofchitral.com` (for admin panel)
- `play.voiceofchitral.com` (for frontend player)

---

## Part 1: Deploy Backend API

### Step 1: Create Node.js Application in ServerAvatar

1. **Login to ServerAvatar dashboard**
2. **Go to:** Applications → Create Application
3. **Select:** Node.js Application
4. **Fill in details:**
   - **Application Name:** `voice-of-chitral-backend`
   - **Domain:** `api.voiceofchitral.com`
   - **Method:** GitHub
   - **Repository:** `https://github.com/waqarahm3d/Khowar.git`
   - **Branch:** `claude/qoqnuz-spotify-admin-panel-011CUsPJ4xJhagYCUWzngUeb`
   - **Root Directory:** `backend`
   - **Start Command:** `node server.js`
   - **Port:** `5000`

5. **Click:** Create Application

### Step 2: Configure Environment Variables

After application is created:

1. **Go to:** Application → Environment Variables
2. **Add these variables:**

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database - IMPORTANT: Use your MongoDB credentials!
MONGODB_URI=mongodb://voiceofchitral:Digital12!!!@localhost:27017/voiceofchitral?authSource=voiceofchitral

# JWT Secrets (CHANGE THESE!)
JWT_SECRET=your_super_secret_jwt_key_production_98765432109876543210
JWT_EXPIRE=7d
SESSION_SECRET=your_super_secret_session_key_production_12345678901234567890

# Storage Provider
STORAGE_PROVIDER=local

# URLs (Update with your actual domains)
CLIENT_URL=https://play.voiceofchitral.com
ADMIN_URL=https://admin.voiceofchitral.com

# Email Configuration (Optional - add later)
EMAIL_HOST=
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=noreply@voiceofchitral.com

# OAuth (Optional - add later)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=https://api.voiceofchitral.com/api/auth/google/callback

FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
FACEBOOK_CALLBACK_URL=https://api.voiceofchitral.com/api/auth/facebook/callback

# Analytics (Optional)
GA_TRACKING_ID=
```

3. **Click:** Save Environment Variables

### Step 3: Install Dependencies and Start

ServerAvatar will automatically:
1. Clone the repository
2. Run `npm install` in the backend folder
3. Create uploads directories (you may need to do this manually - see below)
4. Start the application with `node server.js`

**Manual step - Create uploads directories:**

1. **Go to:** Application → File Manager
2. **Navigate to:** `backend/`
3. **Create folders:**
   - `uploads/audio`
   - `uploads/images`
4. **Set permissions:** 755

Or via SSH:
```bash
cd /path/to/application/backend
mkdir -p uploads/audio uploads/images
chmod 755 uploads uploads/audio uploads/images
```

### Step 4: Configure Nginx (ServerAvatar does this automatically)

ServerAvatar will create nginx configuration. Verify it has:

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
    }
}
```

### Step 5: Enable SSL

1. **Go to:** Application → SSL
2. **Select:** Let's Encrypt
3. **Click:** Install SSL Certificate
4. ServerAvatar will automatically configure HTTPS

### Step 6: Test Backend API

```bash
# Test health endpoint
curl https://api.voiceofchitral.com/health

# Should return:
# {"status":"ok","message":"Qoqnuz API is running"}
```

---

## Part 2: Create Admin User in MongoDB

### Option A: Using ServerAvatar SSH Terminal

1. **Go to:** Server → Terminal (or SSH)
2. **Connect to MongoDB:**

```bash
mongosh "mongodb://voiceofchitral:Digital12!!!@localhost:27017/voiceofchitral?authSource=voiceofchitral"
```

3. **Generate password hash:**

```bash
# First, navigate to backend directory
cd /path/to/application/backend

# Generate hash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YourAdminPassword123!', 10, (err, hash) => console.log(hash));"
```

Copy the hash output.

4. **Create admin user:**

```bash
# Connect to MongoDB again
mongosh "mongodb://voiceofchitral:Digital12!!!@localhost:27017/voiceofchitral?authSource=voiceofchitral"
```

```javascript
// Create admin user (paste your hash!)
db.users.insertOne({
  username: "admin",
  email: "admin@voiceofchitral.com",
  password: "$2a$10$YOUR_HASH_HERE",
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

// Exit
exit
```

### Option B: Using MongoDB GUI (MongoDB Compass)

If ServerAvatar provides MongoDB GUI access:

1. Connect using: `mongodb://voiceofchitral:Digital12!!!@localhost:27017/voiceofchitral?authSource=voiceofchitral`
2. Create user document manually in `users` collection

---

## Part 3: Deploy Admin Panel

### Step 1: Create Static Site Application

1. **Go to:** Applications → Create Application
2. **Select:** Static Site (or Custom PHP - we'll build static files)
3. **Fill in details:**
   - **Application Name:** `voice-of-chitral-admin`
   - **Domain:** `admin.voiceofchitral.com`
   - **Method:** GitHub
   - **Repository:** `https://github.com/waqarahm3d/Khowar.git`
   - **Branch:** `claude/qoqnuz-spotify-admin-panel-011CUsPJ4xJhagYCUWzngUeb`
   - **Root Directory:** `admin-panel`

4. **Click:** Create Application

### Step 2: Build Admin Panel

**Via SSH/Terminal:**

```bash
# Navigate to admin panel directory
cd /path/to/application/admin-panel

# Create .env file
cat > .env << EOF
VITE_API_URL=https://api.voiceofchitral.com/api
EOF

# Install dependencies
npm install

# Build the application
npm run build

# The built files will be in 'dist' folder
```

### Step 3: Configure Web Root

1. **Go to:** Application → Settings
2. **Set Web Root:** `/path/to/application/admin-panel/dist`
3. **Save**

Or update nginx config to point to `dist` folder:

```nginx
server {
    listen 80;
    server_name admin.voiceofchitral.com;

    root /path/to/application/admin-panel/dist;
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

### Step 4: Enable SSL

1. **Go to:** Application → SSL
2. **Select:** Let's Encrypt
3. **Click:** Install SSL Certificate

### Step 5: Test Admin Panel

Open: `https://admin.voiceofchitral.com`

You should see the login page!

**Login with:**
- Email: `admin@voiceofchitral.com`
- Password: (the password you set when creating admin user)

---

## Part 4: Deploy Frontend Player (Optional - Only 30% Built)

**NOTE:** Frontend player is only 30% complete. You may want to wait until it's finished.

If you want to deploy what exists:

### Step 1: Create Static Site Application

1. **Go to:** Applications → Create Application
2. **Select:** Static Site
3. **Fill in details:**
   - **Application Name:** `voice-of-chitral-frontend`
   - **Domain:** `play.voiceofchitral.com`
   - **Method:** GitHub
   - **Repository:** `https://github.com/waqarahm3d/Khowar.git`
   - **Branch:** `claude/qoqnuz-spotify-admin-panel-011CUsPJ4xJhagYCUWzngUeb`
   - **Root Directory:** `frontend`

### Step 2: Build Frontend

```bash
# Navigate to frontend directory
cd /path/to/application/frontend

# Create .env file
cat > .env << EOF
VITE_API_URL=https://api.voiceofchitral.com/api
EOF

# Install dependencies
npm install

# Build
npm run build

# Files will be in 'dist' folder
```

### Step 3: Configure and Enable SSL

Same process as admin panel.

**NOTE:** Frontend will show blank page as it's incomplete!

---

## Part 5: ServerAvatar Management

### Application Management

**Start Application:**
```
Applications → Your App → Start
```

**Stop Application:**
```
Applications → Your App → Stop
```

**Restart Application:**
```
Applications → Your App → Restart
```

**View Logs:**
```
Applications → Your App → Logs
```

**Update from GitHub:**
```bash
# SSH into server
cd /path/to/application

# Pull latest changes
git pull origin claude/qoqnuz-spotify-admin-panel-011CUsPJ4xJhagYCUWzngUeb

# For backend:
cd backend
npm install
# Restart application via ServerAvatar dashboard

# For admin panel:
cd admin-panel
npm install
npm run build
# No restart needed (static files)
```

### Auto-Deploy on Git Push

ServerAvatar can auto-deploy when you push to GitHub:

1. **Go to:** Application → Deployments
2. **Enable:** Auto Deploy
3. **Configure:** GitHub webhook

Now when you push code, it auto-deploys!

---

## Part 6: Configure File Uploads for Production

### Option A: Local Storage (Current Setup)

Files are stored in `backend/uploads/` folder.

**Pros:**
- Simple
- No extra costs
- Works out of the box

**Cons:**
- Limited by disk space
- No CDN

### Option B: S3/Wasabi/Backblaze (Recommended for Production)

1. **Get S3 credentials** (Wasabi, Backblaze, or AWS)

2. **Update environment variables:**

```env
STORAGE_PROVIDER=wasabi

# Wasabi credentials
WASABI_ACCESS_KEY_ID=your_key
WASABI_SECRET_ACCESS_KEY=your_secret
WASABI_BUCKET_NAME=voiceofchitral-music
WASABI_REGION=us-east-1
WASABI_ENDPOINT=https://s3.us-east-1.wasabisys.com

# Bunny CDN (optional)
BUNNY_CDN_ENABLED=true
BUNNY_CDN_URL=https://voiceofchitral.b-cdn.net
```

3. **Restart application**

---

## Part 7: Testing Everything

### Test Checklist

```bash
# 1. Backend API
curl https://api.voiceofchitral.com/health

# 2. Test login via API
curl -X POST https://api.voiceofchitral.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@voiceofchitral.com",
    "password": "YourPassword123!"
  }'

# 3. Get songs (should be empty array initially)
curl https://api.voiceofchitral.com/api/songs
```

**Browser Tests:**

1. ✅ Admin Panel: https://admin.voiceofchitral.com
   - Can see login page
   - Can login successfully
   - Can upload songs

2. ✅ Backend API: https://api.voiceofchitral.com/health
   - Returns OK status

3. ⚠️ Frontend: https://play.voiceofchitral.com
   - Shows blank page (expected - not built yet)

---

## Common ServerAvatar Issues

### Issue 1: Application won't start

**Check logs:**
```
Applications → Your App → Logs
```

**Common causes:**
- Missing environment variables
- MongoDB connection string wrong
- Missing dependencies
- Port already in use

### Issue 2: MongoDB connection fails

**Test connection:**
```bash
mongosh "mongodb://voiceofchitral:Digital12!!!@localhost:27017/voiceofchitral?authSource=voiceofchitral"
```

**If fails:**
- Check MongoDB is running
- Verify credentials are correct
- Check if MongoDB is configured for authentication

### Issue 3: File uploads fail

**Fix:**
```bash
# Create uploads directories
cd /path/to/application/backend
mkdir -p uploads/audio uploads/images
chmod 755 uploads uploads/audio uploads/images

# Verify nginx allows large uploads
# In ServerAvatar nginx config, ensure:
client_max_body_size 100M;
```

### Issue 4: Can't login to admin panel

**Solutions:**
1. Verify admin user exists in MongoDB
2. Check password hash is correct
3. Test login via API (curl command above)
4. Check browser console for errors
5. Verify backend API is accessible

---

## MongoDB Connection String Reference

Your MongoDB connection string:
```
mongodb://voiceofchitral:Digital12!!!@localhost:27017/voiceofchitral?authSource=voiceofchitral
```

**Breakdown:**
- **Username:** `voiceofchitral`
- **Password:** `Digital12!!!`
- **Host:** `localhost:27017`
- **Database:** `voiceofchitral`
- **Auth Database:** `voiceofchitral`

**Note:** The `!!!` characters in the password are properly escaped in the connection string.

---

## Quick Start Checklist

- [ ] Backend application created in ServerAvatar
- [ ] Environment variables configured (especially MongoDB URI)
- [ ] Application started successfully
- [ ] Backend API responds to health check
- [ ] Admin user created in MongoDB
- [ ] Admin panel application created
- [ ] Admin panel built and deployed
- [ ] Can login to admin panel
- [ ] SSL certificates installed for both
- [ ] DNS records pointing to server
- [ ] Uploads directories created
- [ ] Test song upload

---

## Next Steps After Deployment

1. **Upload sample music** via admin panel
2. **Test all features** (songs, artists, albums, playlists)
3. **Configure S3 storage** for production (optional)
4. **Setup email SMTP** (optional)
5. **Configure OAuth** (Google, Facebook) (optional)
6. **Complete frontend player** (currently 30% built)
7. **Build mobile apps** (future phase)

---

## Updating Your Application

When you make changes to code:

### Via GitHub (Recommended)

```bash
# On your local machine
git add .
git commit -m "Your changes"
git push origin claude/qoqnuz-spotify-admin-panel-011CUsPJ4xJhagYCUWzngUeb

# On server (via SSH or ServerAvatar terminal)
cd /path/to/application
git pull

# For backend:
cd backend
npm install
# Restart via ServerAvatar dashboard

# For admin panel:
cd admin-panel
npm install
npm run build
# Refresh browser
```

### Via ServerAvatar Auto-Deploy

If you enabled webhooks, pushing to GitHub automatically triggers deployment!

---

## Getting Help

**Check logs:**
```
ServerAvatar Dashboard → Applications → Your App → Logs
```

**SSH Access:**
```
ServerAvatar Dashboard → Server → Terminal
```

**Common log locations:**
- Application logs: ServerAvatar dashboard
- Nginx logs: `/var/log/nginx/error.log`
- MongoDB logs: `/var/log/mongodb/mongod.log`

---

## Summary

**You now have:**
- ✅ Backend API running at `api.voiceofchitral.com`
- ✅ Admin panel at `admin.voiceofchitral.com`
- ✅ MongoDB with authentication configured
- ✅ SSL certificates installed
- ✅ GitHub integration for easy updates

**You can:**
- ✅ Upload and manage music
- ✅ Create artists, albums, playlists
- ✅ Manage users
- ⚠️ Frontend player needs completion (30% built)

**Your MongoDB credentials:**
```
Database: voiceofchitral
Username: voiceofchitral
Password: Digital12!!!
Connection: mongodb://voiceofchitral:Digital12!!!@localhost:27017/voiceofchitral?authSource=voiceofchitral
```

**Congratulations! Your Voice of Chitral platform is deployed on ServerAvatar! 🎉**
