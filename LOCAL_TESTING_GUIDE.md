# Local Testing Guide for Qoqnuz

This guide explains how to test the Qoqnuz backend on your local machine **before** deploying to VPS.

---

## Prerequisites

Before testing locally, ensure you have:
- ✅ Node.js installed (v18 or higher)
- ✅ MongoDB installed and running OR MongoDB Atlas account
- ✅ Git installed

---

## Quick Start (Local Testing)

### Step 1: Install MongoDB (if not already installed)

**On Ubuntu/Debian:**
```bash
# Import MongoDB public key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update and install
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

**On macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**On Windows:**
Download and install from: https://www.mongodb.com/try/download/community

**Or use MongoDB Atlas (Cloud):**
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Use it in `.env` file

---

### Step 2: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

### Step 3: Configure .env for Local Testing

Edit the `.env` file:

```bash
nano .env
```

**Minimal configuration for local testing:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database - Local MongoDB
MONGODB_URI=mongodb://localhost:27017/qoqnuz

# Or MongoDB Atlas (if using cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/qoqnuz

# JWT Secrets (use any random string for testing)
JWT_SECRET=test_jwt_secret_12345
JWT_EXPIRE=7d
SESSION_SECRET=test_session_secret_67890

# Storage Provider (use local for testing)
STORAGE_PROVIDER=local

# Email (OPTIONAL for testing - leave blank for now)
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=noreply@qoqnuz.com

# URLs (for local testing)
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:5173

# OAuth (OPTIONAL - can add later)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback
```

Save and exit: `CTRL + X`, `Y`, `ENTER`

### Step 4: Create Upload Directories

```bash
mkdir -p uploads/audio uploads/images
```

### Step 5: Start the Backend Server

```bash
# Run the server
node server.js

# You should see:
# ✅ MongoDB connected successfully
# 🚀 Server running on port 5000
```

---

## Testing the API Locally

### Test 1: Health Check

```bash
curl http://localhost:5000/health
```

**Expected response:**
```json
{"status":"ok","message":"Qoqnuz API is running"}
```

### Test 2: Register Admin User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@qoqnuz.com",
    "password": "Admin123!",
    "displayName": "Admin User"
  }'
```

**Expected response:**
```json
{
  "success": true,
  "message": "Registration successful! Please check your email to verify your account.",
  "data": {
    "_id": "...",
    "username": "admin",
    "email": "admin@qoqnuz.com",
    "displayName": "Admin User",
    "role": "user",
    "isPremium": false,
    "emailVerified": false
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Test 3: Make User Admin (via MongoDB)

Since email verification isn't set up for local testing, let's manually make the user an admin:

```bash
# Connect to MongoDB
mongosh

# Switch to qoqnuz database
use qoqnuz

# Update user to admin role and verify email
db.users.updateOne(
  { email: "admin@qoqnuz.com" },
  {
    $set: {
      role: "admin",
      emailVerified: true,
      verifiedAt: new Date()
    }
  }
)

# Verify the update
db.users.findOne({ email: "admin@qoqnuz.com" })

# Exit MongoDB
exit
```

### Test 4: Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@qoqnuz.com",
    "password": "Admin123!"
  }'
```

**Expected response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "username": "admin",
    "email": "admin@qoqnuz.com",
    "role": "admin",
    "emailVerified": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Copy the token** - you'll need it for authenticated requests!

### Test 5: Test Protected Route

```bash
# Replace YOUR_TOKEN with the token from login response
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Running the Admin Panel Locally

### Step 1: Setup Admin Panel

```bash
# Navigate to admin panel directory
cd ../admin-panel

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### Step 2: Start Development Server

```bash
npm run dev
```

The admin panel will open at `http://localhost:5173`

### Step 3: Login to Admin Panel

1. Open browser to `http://localhost:5173`
2. Login with:
   - Email: `admin@qoqnuz.com`
   - Password: `Admin123!`

---

## Common Issues & Solutions

### Issue 1: "MongoDB connection error"

**Solution:**
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB if not running
sudo systemctl start mongod

# Or on Mac:
brew services start mongodb-community
```

### Issue 2: "Port 5000 already in use"

**Solution:**
```bash
# Find process using port 5000
sudo lsof -i :5000

# Kill the process (replace PID with actual process ID)
kill -9 PID

# Or change the port in .env file
PORT=5001
```

### Issue 3: "ENOENT: no such file or directory, open 'uploads/...'"

**Solution:**
```bash
cd backend
mkdir -p uploads/audio uploads/images
chmod 755 uploads uploads/audio uploads/images
```

### Issue 4: Email verification not working

**Solution:**

For local testing, skip email verification:

```bash
mongosh
use qoqnuz
db.users.updateMany({}, { $set: { emailVerified: true } })
exit
```

Or configure a real SMTP service in `.env`:

**Gmail Example:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

To get Gmail App Password:
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to App Passwords
4. Generate new app password
5. Use it in `.env`

---

## Testing Checklist

- [ ] MongoDB is running
- [ ] Backend dependencies installed (`npm install`)
- [ ] `.env` file created and configured
- [ ] Upload directories created
- [ ] Backend server starts without errors
- [ ] Health check returns OK
- [ ] Can register new user
- [ ] Can login and get token
- [ ] Admin panel builds successfully
- [ ] Can access admin panel in browser
- [ ] Can login to admin panel

---

## Next Steps

Once everything works locally:

1. ✅ **Deploy to VPS** - Follow `DEPLOYMENT_GUIDE.md`
2. ✅ **Configure domain** - Point DNS to VPS IP
3. ✅ **Setup SSL** - Use Let's Encrypt (Certbot)
4. ✅ **Configure storage** - Set up S3/Wasabi for production
5. ✅ **Setup email** - Configure SMTP for production
6. ✅ **Configure OAuth** - Add Google/Facebook credentials

---

## Quick Reference

### Start Backend
```bash
cd backend
node server.js
```

### Start Admin Panel
```bash
cd admin-panel
npm run dev
```

### View MongoDB Data
```bash
mongosh
use qoqnuz
db.users.find().pretty()
db.songs.find().pretty()
```

### Check Logs
```bash
# Backend logs (if using PM2)
pm2 logs qoqnuz-backend

# Or just see terminal output
# Backend runs in terminal and shows logs
```

---

## Support

If you encounter issues:

1. Check the error message in terminal
2. Verify MongoDB is running: `sudo systemctl status mongod`
3. Verify Node.js version: `node --version` (should be v18+)
4. Check `.env` configuration
5. Ensure all dependencies are installed: `npm install`

---

**Happy Testing! 🎉**

Once local testing works, you're ready to deploy to production using the `DEPLOYMENT_GUIDE.md`
