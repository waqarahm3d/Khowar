# Voice of Chitral - Environment Variables Setup Guide

Complete guide for configuring all environment variables for Backend, Frontend, and Admin Panel.

---

## 📋 Table of Contents

1. [Backend Environment Variables](#backend-environment-variables)
2. [Frontend Environment Variables](#frontend-environment-variables)
3. [Admin Panel Environment Variables](#admin-panel-environment-variables)
4. [Database Configuration](#database-configuration)
5. [Storage Configuration](#storage-configuration)
6. [Email Configuration](#email-configuration)
7. [OAuth Configuration](#oauth-configuration)
8. [Production Checklist](#production-checklist)

---

## Backend Environment Variables

### Location: `/backend/.env`

### Quick Setup:

```bash
cd backend
cp .env.example .env
nano .env
```

### Required Variables:

#### 1. Server Configuration

```env
# Server port (default: 5000)
PORT=5000

# Environment (development or production)
NODE_ENV=production
```

#### 2. Database Configuration

**Option A: Local MongoDB**
```env
MONGODB_URI=mongodb://localhost:27017/qoqnuz
```

**Option B: MongoDB Atlas (Cloud)**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/qoqnuz?retryWrites=true&w=majority
```

**Option C: MongoDB with Authentication**
```env
MONGODB_URI=mongodb://admin:password@localhost:27017/qoqnuz?authSource=admin
```

**🔍 How to get MongoDB Atlas connection string:**
1. Go to https://mongodb.com/cloud/atlas
2. Create free account and cluster
3. Click "Connect" > "Connect your application"
4. Copy the connection string
5. Replace `<username>`, `<password>`, and database name

#### 3. Security Secrets

**⚠️ CRITICAL: Change these in production!**

```env
# JWT Secret - Used for authentication tokens
# Generate: openssl rand -base64 32
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_123456789
JWT_EXPIRE=7d

# Session Secret - Used for session management
# Generate: openssl rand -base64 32
SESSION_SECRET=your_super_secret_session_key_change_this_also_987654321
```

**Generate secure secrets:**
```bash
# On Linux/Mac:
openssl rand -base64 32

# On Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### 4. File Upload Configuration

```env
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=50000000
```

#### 5. Storage Provider

**Option A: Local Storage (Default)**
```env
STORAGE_PROVIDER=local
```

**Option B: AWS S3**
```env
STORAGE_PROVIDER=aws
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your-bucket-name
AWS_REGION=us-east-1
```

**Option C: Wasabi S3 (Cheaper)**
```env
STORAGE_PROVIDER=wasabi
WASABI_ACCESS_KEY_ID=your_wasabi_key
WASABI_SECRET_ACCESS_KEY=your_wasabi_secret
WASABI_BUCKET_NAME=voiceofchitral-audio
WASABI_REGION=us-east-1
WASABI_ENDPOINT=https://s3.us-east-1.wasabisys.com
```

**Option D: Backblaze B2**
```env
STORAGE_PROVIDER=backblaze
BACKBLAZE_KEY_ID=your_key_id
BACKBLAZE_APPLICATION_KEY=your_app_key
BACKBLAZE_BUCKET_NAME=your-bucket
BACKBLAZE_REGION=us-west-000
BACKBLAZE_ENDPOINT=https://s3.us-west-000.backblazeb2.com
```

**Option E: Cloudflare R2**
```env
STORAGE_PROVIDER=cloudflare
CLOUDFLARE_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_BUCKET_NAME=your-bucket
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com
```

#### 6. CDN Configuration (Optional)

```env
BUNNY_CDN_ENABLED=false
BUNNY_CDN_URL=https://your-cdn.b-cdn.net
BUNNY_CDN_API_KEY=your_api_key
BUNNY_STORAGE_ZONE=your-zone
BUNNY_STORAGE_PASSWORD=your_password
```

#### 7. Email Configuration

**For Gmail:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=noreply@voiceofchitral.com
```

**📝 How to get Gmail App Password:**
1. Go to Google Account > Security
2. Enable 2-Step Verification
3. Search for "App passwords"
4. Create new app password
5. Use generated password in EMAIL_PASSWORD

**For Other SMTP Providers:**

**SendGrid:**
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASSWORD=your_sendgrid_api_key
EMAIL_FROM=noreply@voiceofchitral.com
```

**Mailgun:**
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_mailgun_username
EMAIL_PASSWORD=your_mailgun_password
EMAIL_FROM=noreply@voiceofchitral.com
```

#### 8. OAuth Configuration (Optional)

**Google OAuth:**
```env
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://api.voiceofchitral.com/api/auth/google/callback
```

**🔍 How to get Google OAuth credentials:**
1. Go to https://console.cloud.google.com
2. Create new project or select existing
3. Enable Google+ API
4. Go to Credentials > Create Credentials > OAuth 2.0 Client ID
5. Add authorized redirect URI: `https://api.yourdomain.com/api/auth/google/callback`
6. Copy Client ID and Secret

**Facebook OAuth:**
```env
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=https://api.voiceofchitral.com/api/auth/facebook/callback
```

**🔍 How to get Facebook OAuth credentials:**
1. Go to https://developers.facebook.com
2. Create new app
3. Add Facebook Login product
4. Add Valid OAuth Redirect URIs: `https://api.yourdomain.com/api/auth/facebook/callback`
5. Copy App ID and Secret

#### 9. Client URLs

```env
# Frontend URL (where users access the app)
CLIENT_URL=https://play.voiceofchitral.com

# Admin Panel URL
ADMIN_URL=https://admin.voiceofchitral.com
```

**For Development:**
```env
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
```

#### 10. Analytics (Optional)

```env
GA_TRACKING_ID=G-XXXXXXXXXX
```

---

## Frontend Environment Variables

### Location: `/frontend/.env`

### Setup:

```bash
cd frontend
cp .env.example .env
nano .env
```

### Configuration:

**Development:**
```env
VITE_API_URL=http://localhost:5000/api
```

**Production:**
```env
VITE_API_URL=https://api.voiceofchitral.com/api
```

**⚠️ Important:**
- Must end with `/api`
- Must use `https://` in production
- Must match your backend domain

---

## Admin Panel Environment Variables

### Location: `/admin-panel/.env`

### Setup:

```bash
cd admin-panel
cp .env.example .env
nano .env
```

### Configuration:

**Development:**
```env
VITE_API_URL=http://localhost:5000/api
```

**Production:**
```env
VITE_API_URL=https://api.voiceofchitral.com/api
```

---

## Database Configuration

### MongoDB Setup Options

#### Option 1: Local MongoDB (Recommended for VPS)

**Install MongoDB:**
```bash
# Ubuntu/Debian
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Configure in .env:**
```env
MONGODB_URI=mongodb://localhost:27017/qoqnuz
```

**With Authentication (Production):**
```bash
# Create admin user
mongosh
use admin
db.createUser({
  user: "admin",
  pwd: "strong_password_here",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
})
exit
```

```env
MONGODB_URI=mongodb://admin:strong_password_here@localhost:27017/qoqnuz?authSource=admin
```

#### Option 2: MongoDB Atlas (Cloud - Free Tier Available)

**Setup Steps:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster (M0 Free tier)
4. Create database user
5. Whitelist IP addresses (0.0.0.0/0 for all IPs or your server IP)
6. Get connection string

**Configure in .env:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/qoqnuz?retryWrites=true&w=majority
```

**Pros:**
- ✅ Free tier available (512MB)
- ✅ Automatic backups
- ✅ Managed service
- ✅ No server maintenance

**Cons:**
- ❌ Internet connection required
- ❌ Limited storage on free tier

#### Option 3: MongoDB on ServerAvatar

ServerAvatar should have MongoDB pre-installed. Check with:
```bash
systemctl status mongod
```

If not installed, follow Option 1 steps above.

---

## Storage Configuration

### Comparison Table

| Provider | Cost | Setup | Best For |
|----------|------|-------|----------|
| **Local** | Free | Easy | Development, Small scale |
| **AWS S3** | $$$ | Medium | Enterprise |
| **Wasabi** | $ | Easy | Budget-friendly production |
| **Backblaze B2** | $ | Easy | Budget-friendly, backups |
| **Cloudflare R2** | $ | Medium | High traffic, free egress |

### Local Storage (Default)

**Pros:**
- ✅ Free
- ✅ No external dependencies
- ✅ Fast

**Cons:**
- ❌ Limited by disk space
- ❌ No CDN
- ❌ Lost if server crashes

**Configuration:**
```env
STORAGE_PROVIDER=local
UPLOAD_PATH=./uploads
```

### Wasabi S3 (Recommended for Production)

**Cost:** ~$5.99/TB/month (80% cheaper than AWS S3)

**Setup:**
1. Create account at https://wasabi.com
2. Create bucket (e.g., `voiceofchitral-audio`)
3. Generate access keys
4. Configure in .env

```env
STORAGE_PROVIDER=wasabi
WASABI_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
WASABI_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
WASABI_BUCKET_NAME=voiceofchitral-audio
WASABI_REGION=us-east-1
WASABI_ENDPOINT=https://s3.us-east-1.wasabisys.com
```

---

## Email Configuration

### Gmail Setup (Development/Small Scale)

**Steps:**
1. Enable 2-Step Verification
2. Create App Password:
   - Go to https://myaccount.google.com/security
   - Search "App passwords"
   - Select "Mail" and "Other"
   - Copy generated password

**Configuration:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_FROM=noreply@voiceofchitral.com
```

**Limits:**
- 500 emails/day (free)
- 2000 emails/day (Google Workspace)

### SendGrid (Production Recommended)

**Free Tier:** 100 emails/day

**Setup:**
1. Create account at https://sendgrid.com
2. Verify sender identity
3. Create API key

**Configuration:**
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASSWORD=SG.xxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@voiceofchitral.com
```

---

## OAuth Configuration

### Google OAuth

**Setup Steps:**

1. **Go to Google Cloud Console**
   - https://console.cloud.google.com

2. **Create Project**
   - Click "New Project"
   - Name: "Voice of Chitral"

3. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search "Google+ API"
   - Click "Enable"

4. **Create OAuth Credentials**
   - Go to "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Application type: "Web application"
   - Authorized redirect URIs:
     - Development: `http://localhost:5000/api/auth/google/callback`
     - Production: `https://api.yourdomain.com/api/auth/google/callback`

5. **Copy Credentials**

**Configuration:**
```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxx
GOOGLE_CALLBACK_URL=https://api.voiceofchitral.com/api/auth/google/callback
```

### Facebook OAuth

**Setup Steps:**

1. **Go to Facebook Developers**
   - https://developers.facebook.com

2. **Create App**
   - Click "Create App"
   - Type: "Consumer"
   - Name: "Voice of Chitral"

3. **Add Facebook Login**
   - Click "Add Product"
   - Select "Facebook Login"

4. **Configure OAuth Redirect URIs**
   - Settings > Basic
   - Add Valid OAuth Redirect URIs:
     - Development: `http://localhost:5000/api/auth/facebook/callback`
     - Production: `https://api.yourdomain.com/api/auth/facebook/callback`

5. **Copy App ID and Secret**

**Configuration:**
```env
FACEBOOK_APP_ID=1234567890123456
FACEBOOK_APP_SECRET=abcdef1234567890abcdef1234567890
FACEBOOK_CALLBACK_URL=https://api.voiceofchitral.com/api/auth/facebook/callback
```

---

## Production Checklist

### Security

- [ ] Change `JWT_SECRET` to random secure value
- [ ] Change `SESSION_SECRET` to random secure value
- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS for all URLs
- [ ] Enable MongoDB authentication
- [ ] Set strong database password
- [ ] Don't commit `.env` files to Git

### Database

- [ ] MongoDB installed or Atlas configured
- [ ] Connection string correct in `.env`
- [ ] Test connection: `mongosh`
- [ ] Database backups configured
- [ ] Authentication enabled (production)

### Email

- [ ] SMTP credentials configured
- [ ] Test email sending
- [ ] Sender email verified
- [ ] EMAIL_FROM matches domain (for better deliverability)

### Storage

- [ ] Storage provider selected and configured
- [ ] Test file upload
- [ ] CDN configured (if using)
- [ ] Uploads directory permissions correct (`chmod 755 uploads`)

### OAuth (If Using)

- [ ] Google OAuth credentials configured
- [ ] Facebook OAuth credentials configured
- [ ] Callback URLs match production domain
- [ ] Test social login

### URLs

- [ ] `CLIENT_URL` points to frontend domain
- [ ] `ADMIN_URL` points to admin domain
- [ ] Frontend `VITE_API_URL` points to backend domain
- [ ] Admin `VITE_API_URL` points to backend domain
- [ ] All URLs use HTTPS in production

---

## Testing Configuration

### Test Backend .env

```bash
cd backend

# Check if .env exists
ls -la .env

# Test MongoDB connection
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✅ MongoDB connected')).catch(err => console.log('❌ MongoDB error:', err.message))"

# Start backend
npm start
# Should see: "Server running on port 5000"
# Should see: "MongoDB connected"
```

### Test Frontend .env

```bash
cd frontend

# Check if .env exists
ls -la .env

# View configuration
cat .env

# Test build
npm run build
# Should build without errors
```

### Test Admin Panel .env

```bash
cd admin-panel

# Check if .env exists
ls -la .env

# View configuration
cat .env

# Test build
npm run build
# Should build without errors
```

---

## Environment Variables Summary

### Backend (.env)
- ✅ `PORT=5000`
- ✅ `NODE_ENV=production`
- ✅ `MONGODB_URI=mongodb://...` (REQUIRED)
- ✅ `JWT_SECRET=...` (REQUIRED)
- ✅ `SESSION_SECRET=...` (REQUIRED)
- ✅ `STORAGE_PROVIDER=local` or cloud
- ⚠️ `EMAIL_*` (Optional but recommended)
- ⚠️ `GOOGLE_*` (Optional - for Google login)
- ⚠️ `FACEBOOK_*` (Optional - for Facebook login)
- ✅ `CLIENT_URL=https://...` (REQUIRED)
- ✅ `ADMIN_URL=https://...` (REQUIRED)

### Frontend (.env)
- ✅ `VITE_API_URL=https://api.yourdomain.com/api` (REQUIRED)

### Admin Panel (.env)
- ✅ `VITE_API_URL=https://api.yourdomain.com/api` (REQUIRED)

---

## Quick Setup Commands

### Development Setup

```bash
# Backend
cd backend
cp .env.example .env
nano .env
# Update: MONGODB_URI, JWT_SECRET, SESSION_SECRET
npm install
npm start

# Frontend
cd ../frontend
cp .env.example .env
# Keep default: VITE_API_URL=http://localhost:5000/api
npm install
npm run dev

# Admin Panel
cd ../admin-panel
cp .env.example .env
# Keep default: VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

### Production Setup

```bash
# Backend
cd backend
cp .env.example .env
nano .env
# Update all production values
npm install
pm2 start server.js --name qoqnuz-backend

# Frontend
cd ../frontend
cp .env.example .env
nano .env
# Set: VITE_API_URL=https://api.yourdomain.com/api
npm install
npm run build

# Admin Panel
cd ../admin-panel
cp .env.example .env
nano .env
# Set: VITE_API_URL=https://api.yourdomain.com/api
npm install
npm run build
```

---

## Common Issues

### "Cannot connect to MongoDB"

**Check:**
1. MongoDB is running: `systemctl status mongod`
2. Connection string is correct in `.env`
3. If using Atlas, IP is whitelisted
4. If using auth, credentials are correct

**Fix:**
```bash
# Restart MongoDB
sudo systemctl restart mongod

# Test connection
mongosh "your-connection-string"
```

### "Email not sending"

**Check:**
1. SMTP credentials are correct
2. Gmail App Password is used (not regular password)
3. Port 587 is not blocked by firewall

### "Frontend can't reach backend"

**Check:**
1. `VITE_API_URL` ends with `/api`
2. Backend is running
3. CORS is configured correctly
4. Firewall allows the connection

---

## Need Help?

1. **Check logs:**
   - Backend: `pm2 logs qoqnuz-backend`
   - MongoDB: `sudo tail -f /var/log/mongodb/mongod.log`

2. **Test connections:**
   - MongoDB: `mongosh`
   - Backend API: `curl http://localhost:5000/health`

3. **Verify .env files exist:**
   ```bash
   ls -la backend/.env
   ls -la frontend/.env
   ls -la admin-panel/.env
   ```

---

**🎉 Your environment variables are now configured!**
