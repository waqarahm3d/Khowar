# Voice of Chitral - Local MacBook Setup Guide

Complete guide to run the Voice of Chitral music streaming platform on your MacBook.

**Time Required:** 30-45 minutes
**Difficulty:** Beginner-friendly

---

## Table of Contents

1. [Prerequisites Installation](#step-1-install-prerequisites)
2. [Clone Repository](#step-2-clone-repository)
3. [Setup Backend](#step-3-setup-backend)
4. [Setup Admin Panel](#step-4-setup-admin-panel)
5. [Setup Frontend Player](#step-5-setup-frontend-player)
6. [Create Admin User](#step-6-create-admin-user)
7. [Testing Everything](#step-7-testing)
8. [Upload Sample Music](#step-8-upload-sample-music)
9. [Troubleshooting](#troubleshooting)

---

## Step 1: Install Prerequisites

### 1.1: Install Homebrew (if not already installed)

Homebrew is macOS package manager.

```bash
# Check if Homebrew is installed
brew --version

# If not installed, install it:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Follow the instructions to add Homebrew to your PATH
```

### 1.2: Install Node.js

```bash
# Install Node.js version 18
brew install node@18

# Add to PATH (if needed)
echo 'export PATH="/opt/homebrew/opt/node@18/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x or higher
```

### 1.3: Install MongoDB

```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB service
brew services start mongodb-community@7.0

# Verify MongoDB is running
brew services list | grep mongodb
# Should show "started"

# Test connection
mongosh --eval "db.version()"
# Should show MongoDB version
```

### 1.4: Install Git (usually pre-installed)

```bash
# Check if Git is installed
git --version

# If not installed:
brew install git
```

### 1.5: Verify Everything is Installed

```bash
# Check all installations
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "MongoDB: $(mongosh --eval "db.version()" --quiet)"
echo "Git version: $(git --version)"
```

You should see versions for all four tools.

---

## Step 2: Clone Repository

### 2.1: Choose a Location

```bash
# Navigate to where you want to store the project
# For example, your Documents folder:
cd ~/Documents

# Or create a dedicated projects folder:
mkdir -p ~/Projects
cd ~/Projects
```

### 2.2: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/waqarahm3d/Khowar.git

# Navigate to the project
cd Khowar

# Checkout the correct branch
git checkout claude/qoqnuz-spotify-admin-panel-011CUsPJ4xJhagYCUWzngUeb

# Verify you're on the right branch
git branch
# Should show: * claude/qoqnuz-spotify-admin-panel-011CUsPJ4xJhagYCUWzngUeb

# List project contents
ls -la
# You should see: backend/, admin-panel/, frontend/, and documentation files
```

---

## Step 3: Setup Backend

### 3.1: Install Backend Dependencies

```bash
# Navigate to backend folder
cd backend

# Install all dependencies (takes 2-3 minutes)
npm install

# You should see "added XXX packages"
```

### 3.2: Create Upload Directories

```bash
# Create directories for uploaded files
mkdir -p uploads/audio uploads/images

# Verify they were created
ls -la uploads/
```

### 3.3: Create Environment File

```bash
# Copy example environment file
cp .env.example .env

# Open in your default text editor
# For VS Code:
code .env

# For nano:
nano .env

# For TextEdit:
open -a TextEdit .env
```

**Edit the `.env` file with these settings:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database - Local MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/voiceofchitral

# JWT Secrets (IMPORTANT: Change these!)
JWT_SECRET=your_local_dev_secret_key_12345
JWT_EXPIRE=7d
SESSION_SECRET=your_local_session_secret_67890

# Storage (local for development)
STORAGE_PROVIDER=local

# URLs (local development)
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:5173

# Email (Optional - leave empty for local dev)
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=noreply@voiceofchitral.com

# OAuth (Optional - can add later)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback

# Analytics (Optional)
GA_TRACKING_ID=
```

**Save the file:**
- VS Code: `Cmd + S`
- Nano: `Ctrl + X`, then `Y`, then `Enter`
- TextEdit: `Cmd + S`

### 3.4: Start the Backend

```bash
# Make sure you're in the backend folder
pwd
# Should show: /path/to/Khowar/backend

# Start the backend server
node server.js
```

**You should see:**
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
📍 Environment: development
```

**✅ Backend is now running!**

**Keep this terminal open.** Open a new terminal tab (Cmd + T) for next steps.

### 3.5: Test Backend (in new terminal)

```bash
# Test health endpoint
curl http://localhost:5000/health

# Should return:
# {"status":"ok","message":"Qoqnuz API is running"}
```

If you see this, backend is working! 🎉

---

## Step 4: Setup Admin Panel

**Open a new terminal tab** (Cmd + T)

### 4.1: Navigate to Admin Panel

```bash
# From project root
cd ~/Documents/Khowar/admin-panel
# Or wherever you cloned the project
```

### 4.2: Install Dependencies

```bash
# Install dependencies (takes 3-5 minutes)
npm install
```

### 4.3: Create Environment File

```bash
# Create .env file for admin panel
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Verify it was created
cat .env
# Should show: VITE_API_URL=http://localhost:5000/api
```

### 4.4: Start Admin Panel

```bash
# Start development server
npm run dev
```

**You should see:**
```
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**✅ Admin panel is now running at http://localhost:5173**

### 4.5: Open Admin Panel in Browser

```bash
# Open in default browser
open http://localhost:5173
```

You should see a login page!

**Keep this terminal open.** Open another new tab (Cmd + T) for frontend.

---

## Step 5: Setup Frontend Player

**Open a new terminal tab** (Cmd + T)

### 5.1: Navigate to Frontend

```bash
# From project root
cd ~/Documents/Khowar/frontend
# Or wherever you cloned the project
```

### 5.2: Install Dependencies

```bash
# Install dependencies (takes 2-3 minutes)
npm install
```

### 5.3: Create Environment File

```bash
# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Verify
cat .env
```

### 5.4: Start Frontend Player

```bash
# Start development server
npm run dev
```

**You should see:**
```
  ➜  Local:   http://localhost:5174/
  ➜  Network: use --host to expose
```

**Note:** Frontend might run on port 5174 (since 5173 is used by admin panel)

**✅ Frontend player is now running at http://localhost:5174**

---

## Current Running Services

At this point, you should have **3 terminal tabs** running:

1. **Tab 1 - Backend:** Port 5000 (`node server.js`)
2. **Tab 2 - Admin Panel:** Port 5173 (`npm run dev`)
3. **Tab 3 - Frontend Player:** Port 5174 (`npm run dev`)

```
┌─────────────────────────────────────────┐
│  Tab 1: Backend API                     │
│  http://localhost:5000                  │
│  Status: ✅ Running                     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Tab 2: Admin Panel                     │
│  http://localhost:5173                  │
│  Status: ✅ Running                     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Tab 3: Frontend Player (incomplete)    │
│  http://localhost:5174                  │
│  Status: ⚠️ Partially built (30%)      │
└─────────────────────────────────────────┘
```

---

## Step 6: Create Admin User

**Open a new terminal tab** (Cmd + T)

### 6.1: Connect to MongoDB

```bash
# Connect to MongoDB shell
mongosh
```

You should see:
```
Current Mongosh Log ID: ...
Connecting to: mongodb://127.0.0.1:27017
Using MongoDB: 7.0.x
```

### 6.2: Create Database and Admin User

```javascript
// Switch to voiceofchitral database
use voiceofchitral

// Generate a password hash first
// Exit mongosh temporarily
exit
```

### 6.3: Generate Password Hash

```bash
# Go to backend directory
cd ~/Documents/Khowar/backend

# Generate password hash for "Admin123!"
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('Admin123!', 10, (err, hash) => console.log(hash));"
```

**Copy the output** (starts with `$2a$10$...`)

Example output:
```
$2a$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGH
```

### 6.4: Create Admin User in MongoDB

```bash
# Connect to MongoDB again
mongosh

# Switch to database
use voiceofchitral

// Create admin user (PASTE YOUR HASH!)
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

// You should see:
// {
//   acknowledged: true,
//   insertedId: ObjectId("...")
// }

// Verify user was created
db.users.findOne({ email: "admin@voiceofchitral.com" }, { email: 1, username: 1, role: 1 })

// Should show your admin user

// Exit MongoDB
exit
```

---

## Step 7: Testing

### 7.1: Test Backend API

```bash
# Test health endpoint
curl http://localhost:5000/health

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@voiceofchitral.com",
    "password": "Admin123!"
  }'
```

**You should get a response with a token!**

### 7.2: Test Admin Panel

1. **Open browser:** http://localhost:5173
2. **You should see:** Login page
3. **Login with:**
   - Email: `admin@voiceofchitral.com`
   - Password: `Admin123!`
4. **You should see:** Admin dashboard

**✅ If you can login, admin panel is working!**

### 7.3: Test Frontend Player (Partial)

1. **Open browser:** http://localhost:5174
2. **You should see:** Blank page (not built yet)
3. **Open browser console:** `Cmd + Option + J`
4. **Check for errors:** Should see no errors (just empty page)

---

## Step 8: Upload Sample Music

### 8.1: Prepare Sample MP3 Files

Find some MP3 files on your Mac (or download free music from Free Music Archive or YouTube Audio Library).

### 8.2: Upload via Admin Panel

1. **Go to:** http://localhost:5173
2. **Login** as admin
3. **Navigate to:** Songs section
4. **Click:** Add New Song
5. **Fill in:**
   - Title
   - Artist name
   - Album (optional)
   - Genre
   - Upload audio file (MP3)
   - Upload cover art (optional)
6. **Click:** Save

### 8.3: Verify Upload

1. **Check backend logs** (Terminal Tab 1)
   - Should see upload progress
2. **Check uploads folder:**
   ```bash
   ls -la ~/Documents/Khowar/backend/uploads/audio/
   ```
   - Should see your uploaded MP3 file

### 8.4: Test via API

```bash
# Get all songs
curl http://localhost:5000/api/songs

# Should return JSON with your uploaded songs
```

---

## Step 9: Access Everything

### Quick Access Commands

Create aliases for easy access (optional):

```bash
# Add to ~/.zshrc
echo '
# Voice of Chitral shortcuts
alias voc-backend="cd ~/Documents/Khowar/backend && node server.js"
alias voc-admin="cd ~/Documents/Khowar/admin-panel && npm run dev"
alias voc-frontend="cd ~/Documents/Khowar/frontend && npm run dev"
' >> ~/.zshrc

# Reload
source ~/.zshrc

# Now you can start services with:
voc-backend    # Starts backend
voc-admin      # Starts admin panel
voc-frontend   # Starts frontend player
```

### URLs Reference

```
Backend API:      http://localhost:5000
Backend Health:   http://localhost:5000/health
Admin Panel:      http://localhost:5173
Frontend Player:  http://localhost:5174
MongoDB:          mongodb://127.0.0.1:27017
```

---

## Troubleshooting

### Issue: MongoDB not starting

**Error:** `Cannot connect to MongoDB`

**Solution:**
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# If not started, start it:
brew services start mongodb-community@7.0

# Check status
brew services info mongodb-community@7.0

# If still issues, restart:
brew services restart mongodb-community@7.0
```

### Issue: Port already in use

**Error:** `Port 5000 already in use`

**Solution:**
```bash
# Find what's using port 5000
lsof -i :5000

# Kill the process (replace PID with actual number)
kill -9 PID

# Or change port in backend/.env:
PORT=5001
```

### Issue: Node modules not found

**Error:** `Cannot find module 'express'`

**Solution:**
```bash
# Delete node_modules and reinstall
cd backend  # or admin-panel or frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: Permission denied on uploads folder

**Error:** `EACCES: permission denied, mkdir 'uploads'`

**Solution:**
```bash
cd ~/Documents/Khowar/backend
mkdir -p uploads/audio uploads/images
chmod 755 uploads uploads/audio uploads/images
```

### Issue: "Invalid credentials" when logging in

**Solution: Reset admin password**
```bash
# Generate new hash
cd ~/Documents/Khowar/backend
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('NewPassword123', 10, (err, hash) => console.log(hash));"

# Copy hash, then in mongosh:
mongosh
use voiceofchitral
db.users.updateOne(
  { email: "admin@voiceofchitral.com" },
  { $set: { password: "PASTE_HASH_HERE" } }
)
exit
```

### Issue: Can't access admin panel or frontend

**Solution:**
```bash
# Make sure all services are running
# Check terminal tabs:

# Tab 1: Backend should show
# 🚀 Server running on port 5000

# Tab 2: Admin panel should show
# ➜  Local:   http://localhost:5173/

# Tab 3: Frontend should show
# ➜  Local:   http://localhost:5174/

# If any stopped, restart with Ctrl+C and run again
```

### Issue: MongoDB compass won't connect

**Solution:**
```bash
# Install MongoDB Compass (GUI)
brew install --cask mongodb-compass

# Open and connect to:
# mongodb://127.0.0.1:27017

# Or use mongosh (command line)
mongosh
```

---

## Daily Development Workflow

### Starting Everything

**Terminal Tab 1 - Backend:**
```bash
cd ~/Documents/Khowar/backend
node server.js
```

**Terminal Tab 2 - Admin Panel:**
```bash
cd ~/Documents/Khowar/admin-panel
npm run dev
```

**Terminal Tab 3 - Frontend Player:**
```bash
cd ~/Documents/Khowar/frontend
npm run dev
```

### Stopping Everything

In each terminal tab, press: **Ctrl + C**

Then to stop MongoDB:
```bash
brew services stop mongodb-community@7.0
```

---

## Project Structure on Your Mac

```
~/Documents/Khowar/                    # Project root
├── backend/                           # Backend API
│   ├── server.js                      # Main server file
│   ├── .env                          # Your local config
│   ├── package.json                   # Dependencies
│   ├── models/                        # Database models
│   ├── controllers/                   # API logic
│   ├── routes/                        # API routes
│   └── uploads/                       # Uploaded music files
│       ├── audio/                     # MP3 files
│       └── images/                    # Album arts
│
├── admin-panel/                       # Admin interface
│   ├── src/                          # React source code
│   ├── .env                          # Admin config
│   ├── package.json                   # Dependencies
│   └── dist/                         # Built files (after npm run build)
│
├── frontend/                          # Music player (30% built)
│   ├── src/                          # React source code
│   │   ├── api/                      # ✅ API services
│   │   ├── store/                    # ✅ State management
│   │   ├── components/               # ⚠️ Partially built
│   │   ├── pages/                    # ❌ Not built yet
│   │   └── utils/                    # ✅ Utilities
│   ├── .env                          # Frontend config
│   └── package.json                   # Dependencies
│
└── Documentation files (.md)          # Guides and documentation
```

---

## Next Steps

### Now that everything is running locally:

1. **✅ Test admin panel** - Upload some songs
2. **✅ Test backend API** - Make API calls
3. **⚠️ Frontend player needs completion** - Only 30% built
4. **🚀 Continue building frontend** - Complete the music player
5. **🎵 Test playing music** - Once frontend is done
6. **📱 Eventually deploy to VPS** - When everything works locally

---

## Summary Checklist

- [ ] Homebrew installed
- [ ] Node.js v18 installed
- [ ] MongoDB installed and running
- [ ] Git installed
- [ ] Repository cloned
- [ ] Backend running on port 5000
- [ ] Admin panel running on port 5173
- [ ] Frontend player running on port 5174
- [ ] Admin user created
- [ ] Can login to admin panel
- [ ] Uploaded at least one test song
- [ ] Backend API responding correctly

**If all checked, you're ready for development! 🎉**

---

## Useful Commands

```bash
# Check what's running on ports
lsof -i :5000  # Backend
lsof -i :5173  # Admin
lsof -i :5174  # Frontend

# View MongoDB databases
mongosh --eval "show dbs"

# View users in database
mongosh voiceofchitral --eval "db.users.find().pretty()"

# View songs in database
mongosh voiceofchitral --eval "db.songs.find().pretty()"

# Clear MongoDB database (CAREFUL!)
mongosh voiceofchitral --eval "db.dropDatabase()"

# Check backend logs (if using PM2)
pm2 logs

# Watch backend for changes (nodemon)
npm install -g nodemon
nodemon server.js  # Instead of node server.js
```

---

## Getting Help

If you run into issues:

1. **Check the terminal output** - Error messages are helpful
2. **Check browser console** - Press `Cmd + Option + J`
3. **Check MongoDB logs:**
   ```bash
   tail -f /opt/homebrew/var/log/mongodb/mongo.log
   ```
4. **Verify environment variables:**
   ```bash
   cat backend/.env
   cat admin-panel/.env
   cat frontend/.env
   ```

---

**Congratulations! Your Voice of Chitral platform is now running locally on your MacBook! 🎉**

You can now:
- Upload music via admin panel
- Test all features locally
- Develop and test changes
- When ready, deploy to VPS using the VPS deployment guides
