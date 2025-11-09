# Working MongoDB Configuration for Voice of Chitral

## ✅ Your Working MongoDB URI

This is the **EXACT** MongoDB connection string that was working on your ServerAvatar deployment:

```env
MONGODB_URI=mongodb://voiceofchitral:Digital12!!!@localhost:27017/voiceofchitral?authSource=voiceofchitral
```

---

## 📋 Connection Details

| Parameter | Value |
|-----------|-------|
| **Host** | localhost |
| **Port** | 27017 |
| **Database Name** | voiceofchitral |
| **Username** | voiceofchitral |
| **Password** | Digital12!!! |
| **Auth Source** | voiceofchitral |

---

## 🔧 How to Use This

### For ServerAvatar Deployment:

**1. After running the deployment script, edit the backend .env:**

```bash
cd /home/BlY2b1fmujDEpwrV/voice-of-chitral-backend/public_html/backend
nano .env
```

**2. Copy this EXACT line into your .env file:**

```env
MONGODB_URI=mongodb://voiceofchitral:Digital12!!!@localhost:27017/voiceofchitral?authSource=voiceofchitral
```

**3. Save and exit:**
- Press `CTRL + X`
- Press `Y`
- Press `ENTER`

**4. Restart the backend:**

```bash
pm2 restart qoqnuz-backend
pm2 logs qoqnuz-backend --lines 20
```

You should see: `✅ MongoDB connected successfully`

---

## 📝 Complete Backend .env Template

Use this complete template for your ServerAvatar deployment:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database - WORKING CONFIGURATION
MONGODB_URI=mongodb://voiceofchitral:Digital12!!!@localhost:27017/voiceofchitral?authSource=voiceofchitral

# JWT Secrets - CHANGE THESE!
JWT_SECRET=your_super_secret_jwt_key_production_98765432109876543210
JWT_EXPIRE=7d
SESSION_SECRET=your_super_secret_session_key_production_12345678901234567890

# Storage
STORAGE_PROVIDER=local
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=50000000

# URLs - Update with your actual domains
CLIENT_URL=https://play.voiceofchitral.com
ADMIN_URL=https://admin.voiceofchitral.com

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=noreply@voiceofchitral.com

# OAuth (Optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=https://api.voiceofchitral.com/api/auth/google/callback

FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
FACEBOOK_CALLBACK_URL=https://api.voiceofchitral.com/api/auth/facebook/callback
```

---

## 🔍 Verify MongoDB Connection

### Check if MongoDB is Running:

```bash
systemctl status mongod
```

Should show: `active (running)`

### Test Connection:

```bash
mongosh "mongodb://voiceofchitral:Digital12!!!@localhost:27017/voiceofchitral?authSource=voiceofchitral"
```

If successful, you'll see:
```
Current Mongosh Log ID: ...
Connecting to: mongodb://localhost:27017/voiceofchitral
Using MongoDB: 7.0.x
voiceofchitral>
```

### List Databases:

```bash
mongosh "mongodb://voiceofchitral:Digital12!!!@localhost:27017/voiceofchitral?authSource=voiceofchitral" --eval "show dbs"
```

### Check Collections in Database:

```bash
mongosh "mongodb://voiceofchitral:Digital12!!!@localhost:27017/voiceofchitral?authSource=voiceofchitral" --eval "use voiceofchitral; show collections"
```

You should see collections like:
- users
- songs
- artists
- albums
- playlists
- etc.

---

## 🔐 Security Notes

### Current Setup:

Your MongoDB has authentication enabled with:
- Username: `voiceofchitral`
- Password: `Digital12!!!`
- Database: `voiceofchitral`

### Recommendation:

For production, consider:

1. **Changing the MongoDB password** to something more secure:

```bash
mongosh
use admin
db.changeUserPassword("voiceofchitral", "NewSecurePassword123!")
exit
```

Then update your .env:
```env
MONGODB_URI=mongodb://voiceofchitral:NewSecurePassword123!@localhost:27017/voiceofchitral?authSource=voiceofchitral
```

2. **Using a stronger password** that includes:
   - 16+ characters
   - Uppercase and lowercase letters
   - Numbers
   - Special characters

3. **Never commit .env files** to Git (already in .gitignore)

---

## 🐛 Troubleshooting

### Error: "Authentication failed"

**Check:**
1. Username is correct: `voiceofchitral`
2. Password is correct: `Digital12!!!` (note the three exclamation marks!)
3. Database name is correct: `voiceofchitral`
4. Auth source is set: `?authSource=voiceofchitral`

**Fix:**
```bash
# Test connection directly
mongosh "mongodb://voiceofchitral:Digital12!!!@localhost:27017/voiceofchitral?authSource=voiceofchitral"
```

### Error: "Connection refused"

**Check:**
```bash
# Is MongoDB running?
systemctl status mongod

# Start MongoDB if not running
sudo systemctl start mongod
```

### Error: "Database not found"

**Check:**
```bash
# List all databases
mongosh --eval "show dbs"

# The database should be listed as "voiceofchitral"
```

If database doesn't exist, it will be created automatically when you first insert data.

---

## 📊 Database Backup

### Create Backup:

```bash
mongodump --uri="mongodb://voiceofchitral:Digital12!!!@localhost:27017/voiceofchitral?authSource=voiceofchitral" --out=/home/backups/mongodb-$(date +%Y%m%d)
```

### Restore Backup:

```bash
mongorestore --uri="mongodb://voiceofchitral:Digital12!!!@localhost:27017/voiceofchitral?authSource=voiceofchitral" /home/backups/mongodb-20240101
```

---

## ✅ Quick Checklist

Before starting your application:

- [ ] MongoDB is running: `systemctl status mongod`
- [ ] Can connect to MongoDB with the URI above
- [ ] Database `voiceofchitral` exists and has collections
- [ ] Backend .env has the correct MONGODB_URI
- [ ] PM2 backend process is running
- [ ] Backend logs show "MongoDB connected successfully"

---

## 🎯 One-Line Copy-Paste

For quick deployment, just copy this into your backend .env:

```env
MONGODB_URI=mongodb://voiceofchitral:Digital12!!!@localhost:27017/voiceofchitral?authSource=voiceofchitral
```

That's it! This is your working MongoDB configuration. ✅
