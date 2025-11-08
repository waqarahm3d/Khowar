# YouTube Import Feature - Quick Setup Guide

## ⚡ Quick Install (Ubuntu/Debian)

### Step 1: Install System Dependencies

```bash
# Update package list
sudo apt-get update

# Install FFmpeg
sudo apt-get install -y ffmpeg python3

# Install yt-dlp
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp

# Verify installations
yt-dlp --version
ffmpeg -version
```

### Step 2: Create Required Directories

```bash
# From your backend directory
cd /home/user/Khowar/backend

# Create temp directory for YouTube downloads
mkdir -p uploads/temp/youtube-imports
chmod 755 uploads/temp/youtube-imports

# Create songs directory if not exists
mkdir -p uploads/songs
mkdir -p uploads/thumbnails
```

### Step 3: Update Environment Variables

Add these to your `backend/.env` file:

```bash
# YouTube Import Settings
YOUTUBE_IMPORT_ENABLED=true
YOUTUBE_IMPORT_MAX_SIZE=100
YOUTUBE_IMPORT_AUDIO_QUALITY=320
YOUTUBE_IMPORT_TEMP_DIR=./uploads/temp/youtube-imports
```

### Step 4: Test the Feature

```bash
# Start your backend server
npm run dev

# In another terminal, test the dependencies endpoint
curl http://localhost:5000/api/youtube-import/check-dependencies \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Expected response:
# {
#   "success": true,
#   "data": {
#     "ytdlp": true,
#     "ffmpeg": true,
#     "ready": true
#   }
# }
```

---

## 🚀 Usage

### From Admin Panel:

1. **Login** to admin panel
2. **Navigate** to `/youtube-import`
3. **Enter** YouTube URL
4. **Click** "Fetch Metadata"
5. **Review** and edit song details
6. **Click** "Start Import"
7. **Wait** for completion (progress shown in real-time)

### Supported URLs:

- Single video: `https://youtube.com/watch?v=VIDEO_ID`
- Playlist: `https://youtube.com/playlist?list=PLAYLIST_ID`
- Channel: `https://youtube.com/@ChannelName`

---

## 🔧 Troubleshooting

### Issue: "yt-dlp not found"

```bash
# Check if yt-dlp is installed
which yt-dlp

# If not found, install it:
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

### Issue: "ffmpeg not found"

```bash
# Install ffmpeg
sudo apt-get install -y ffmpeg

# Or on CentOS/RHEL:
sudo yum install -y ffmpeg
```

### Issue: "Permission denied" when creating directories

```bash
# Fix permissions
sudo chown -R $USER:$USER uploads/
chmod -R 755 uploads/
```

### Issue: "Download failed"

- Check internet connection
- Verify YouTube URL is valid and public
- Check if video is available in your region
- Try updating yt-dlp: `sudo yt-dlp -U`

### Issue: "Audio conversion failed"

- Verify ffmpeg is installed: `ffmpeg -version`
- Check disk space: `df -h`
- Check temp directory permissions

---

## 📊 Monitoring

### Check Import Jobs:

```bash
# View all import jobs
curl http://localhost:5000/api/youtube-import/jobs \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Check specific job status
curl http://localhost:5000/api/youtube-import/status/JOB_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Clean Up Old Temp Files:

```bash
# Create a cron job to clean temp files older than 24 hours
echo "0 2 * * * find /path/to/backend/uploads/temp/youtube-imports -type f -mtime +1 -delete" | crontab -
```

---

## ⚠️ Important Notes

### Legal:
- Only import music you have rights to distribute
- Respect YouTube's Terms of Service
- Obtain necessary permissions from copyright holders

### Performance:
- Each import takes 15-60 seconds depending on song length
- Monitor disk space regularly
- Consider using CDN for final audio files

### Rate Limiting:
- Default: 10 imports per hour per admin
- Can be adjusted in routes file

---

## 📈 Next Steps

After successful setup:

1. ✅ Test with a single video
2. ✅ Test metadata accuracy
3. ✅ Verify audio quality
4. ✅ Configure CDN for audio delivery (optional)
5. ✅ Set up monitoring/logging
6. ✅ Document your import workflow

---

## 🆘 Support

For issues:
1. Check backend logs: `tail -f backend/logs/error.log`
2. Check yt-dlp logs
3. Verify system dependencies
4. Review troubleshooting section above

---

**Last Updated:** 2025-11-08
**Version:** 1.0
