# YouTube Music Import System
## Voice of Chitral - Admin Feature Documentation

This document describes the YouTube music import feature that allows administrators to quickly import music from YouTube to the Voice of Chitral platform.

---

## 🎯 Feature Overview

### **What It Does:**
Administrators can provide a YouTube URL (single video, playlist, or channel) and the system will:

1. ✅ Download audio from YouTube
2. ✅ Convert to MP3 format (high quality)
3. ✅ Extract metadata (title, artist, thumbnail, description, tags)
4. ✅ Auto-populate song/album creation form
5. ✅ Allow editing before final upload
6. ✅ Support batch import for playlists/channels

### **Use Cases:**
- Import traditional Khowar music from YouTube
- Quick catalog building for local artists
- Migrate existing music collections
- Batch import music albums

---

## 🏗️ System Architecture

### **Technology Stack:**

#### **Backend:**
- `yt-dlp` - YouTube downloader (better than youtube-dl)
- `fluent-ffmpeg` - Audio conversion and processing
- `music-metadata` - Extract audio metadata
- `sharp` - Image processing for thumbnails
- `bull` or `bee-queue` - Background job queue (optional)

#### **Frontend:**
- React form with URL input
- Real-time progress tracking
- Metadata preview and editing
- Batch import management

---

## 📋 Implementation Plan

### **Phase 1: Backend API** (4-6 hours)

#### **Step 1.1: Install Dependencies**
```bash
# Backend dependencies
npm install yt-dlp-wrap fluent-ffmpeg music-metadata sharp

# System dependencies (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install -y ffmpeg python3

# Install yt-dlp
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

#### **Step 1.2: Create YouTube Service**
**File:** `backend/services/youtubeImportService.js`

**Features:**
- Download single video
- Download playlist/channel
- Extract metadata
- Convert to MP3
- Generate thumbnails
- Clean up temporary files

#### **Step 1.3: Create API Routes**
**File:** `backend/routes/youtubeImport.js`

**Endpoints:**
```
POST   /api/youtube-import/validate      # Validate YouTube URL
POST   /api/youtube-import/metadata      # Get metadata without downloading
POST   /api/youtube-import/download      # Download and import single video
POST   /api/youtube-import/batch         # Batch import playlist/channel
GET    /api/youtube-import/status/:jobId # Check import status
DELETE /api/youtube-import/cancel/:jobId # Cancel import job
```

#### **Step 1.4: Create Controller**
**File:** `backend/controllers/youtubeImportController.js`

---

### **Phase 2: Admin Frontend** (3-4 hours)

#### **Step 2.1: Create Import Page**
**File:** `admin-panel/src/pages/YouTubeImport.jsx`

**Features:**
- URL input with validation
- Import type selection (single/playlist/channel)
- Real-time progress tracking
- Metadata preview
- Edit metadata before final upload
- Batch import queue management

#### **Step 2.2: Create Components**
- `YouTubeUrlInput` - URL input with validation
- `MetadataPreview` - Show extracted metadata
- `ImportProgress` - Progress bar and status
- `BatchImportList` - Manage multiple imports

---

### **Phase 3: Testing & Documentation** (2 hours)

---

## 🔧 Technical Details

### **Metadata Extraction**

#### **From YouTube:**
```javascript
{
  title: "Song Title - Artist Name",
  description: "Song description...",
  uploader: "Channel Name",
  thumbnail: "https://i.ytimg.com/...",
  duration: 180,
  tags: ["khowar", "music", "traditional"],
  upload_date: "20240101"
}
```

#### **Parsing Logic:**
```javascript
// Auto-detect artist and title from video title
// Common patterns:
// "Artist - Title"
// "Title by Artist"
// "Artist: Title"
// "Title (Official Audio)"
```

#### **Final Song Object:**
```javascript
{
  title: "Extracted Song Title",
  artist: "Artist ID or name",
  album: "Album ID or null",
  genre: "Traditional", // Default or from tags
  releaseYear: 2024,
  duration: 180,
  audioUrl: "/uploads/songs/abc123.mp3",
  coverImage: "/uploads/thumbnails/abc123.jpg",
  tags: ["khowar", "music", "traditional"],
  youtubeUrl: "https://youtube.com/watch?v=...", // Original source
  imported: true,
  importDate: "2024-11-08T..."
}
```

---

## 🛡️ Security & Access Control

### **Restrictions:**
- ✅ Admin/Super Admin only
- ✅ Rate limiting (max 10 imports per hour)
- ✅ File size limits (max 100MB per song)
- ✅ Virus scanning (optional)
- ✅ Copyright notice/disclaimer

### **Rate Limits:**
```javascript
const importLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 imports per hour
  message: 'Too many imports, please try again later.'
});
```

---

## 📁 File Structure

### **Backend Files:**
```
backend/
├── services/
│   ├── youtubeImportService.js      # Core import logic
│   └── metadataExtractor.js         # Metadata parsing
├── controllers/
│   └── youtubeImportController.js   # Request handlers
├── routes/
│   └── youtubeImport.js             # API routes
├── models/
│   └── ImportJob.js                 # Track import jobs
└── uploads/
    └── temp/                         # Temporary downloads
```

### **Frontend Files:**
```
admin-panel/src/
├── pages/
│   └── YouTubeImport.jsx            # Main import page
├── components/
│   ├── import/
│   │   ├── YouTubeUrlInput.jsx
│   │   ├── MetadataPreview.jsx
│   │   ├── ImportProgress.jsx
│   │   └── BatchImportList.jsx
└── api/
    └── youtubeImport.js             # API client
```

---

## 🎨 User Flow

### **Single Video Import:**

1. **Admin enters YouTube URL**
   - System validates URL
   - Shows video thumbnail and basic info

2. **Fetch Metadata**
   - Click "Fetch Metadata" button
   - System extracts all available metadata
   - Shows preview of song details

3. **Edit Metadata (Optional)**
   - Admin can edit title, artist, genre, etc.
   - Select or create artist
   - Select or create album
   - Add tags

4. **Import**
   - Click "Import Song" button
   - System downloads audio
   - Converts to MP3
   - Uploads to storage
   - Creates song record in database
   - Shows success message

### **Playlist/Channel Import:**

1. **Admin enters playlist/channel URL**
   - System fetches all videos in playlist
   - Shows list with thumbnails

2. **Select Videos**
   - Admin can select which videos to import
   - Can select all or individual videos

3. **Configure Import Settings**
   - Set default artist
   - Set default album (optional)
   - Set default genre
   - Set tags

4. **Batch Import**
   - System processes videos one by one
   - Shows progress for each video
   - Can pause/cancel batch import
   - Shows completion summary

---

## ⚙️ Configuration

### **Environment Variables:**

```bash
# YouTube Import Settings
YOUTUBE_IMPORT_ENABLED=true
YOUTUBE_IMPORT_MAX_SIZE=100 # MB
YOUTUBE_IMPORT_AUDIO_FORMAT=mp3
YOUTUBE_IMPORT_AUDIO_QUALITY=320 # kbps
YOUTUBE_IMPORT_TEMP_DIR=/tmp/youtube-imports
YOUTUBE_IMPORT_MAX_CONCURRENT=3
```

### **Server Requirements:**

- **Disk Space:** 10GB minimum (for temporary files)
- **FFmpeg:** Required for audio conversion
- **Python 3:** Required for yt-dlp
- **RAM:** 2GB minimum (4GB recommended)
- **CPU:** 2 cores minimum (for parallel processing)

---

## 🚨 Error Handling

### **Common Errors:**

1. **Invalid URL**
   - Error: "Invalid YouTube URL"
   - Solution: Check URL format

2. **Video Not Available**
   - Error: "Video is private or deleted"
   - Solution: Use public videos only

3. **Download Failed**
   - Error: "Failed to download audio"
   - Solution: Check internet connection, retry

4. **Conversion Failed**
   - Error: "Audio conversion failed"
   - Solution: Check FFmpeg installation

5. **Storage Full**
   - Error: "Not enough disk space"
   - Solution: Free up space or increase storage

---

## ⚖️ Legal Considerations

### **Copyright Notice:**

> **Important:** This feature is intended for importing music that you have the rights to distribute, such as:
> - Original compositions
> - Music from local artists with permission
> - Public domain music
> - Creative Commons licensed music
>
> **Do not import copyrighted music without proper licensing.**

### **Terms of Use:**

Add to admin panel:
```
By using this feature, you confirm that:
☐ You have the right to distribute this music
☐ You have obtained necessary permissions from artists/copyright holders
☐ You comply with YouTube's Terms of Service
☐ You comply with local copyright laws
```

---

## 🔄 Workflow Examples

### **Example 1: Import Single Khowar Song**

```
1. YouTube URL: https://youtube.com/watch?v=abc123
2. Fetched Metadata:
   - Title: "Khowar Traditional Song - Ali Ahmed"
   - Artist: "Ali Ahmed" (auto-detected)
   - Thumbnail: Extracted
   - Duration: 4:32
   - Tags: ["khowar", "traditional", "chitral"]

3. Admin Review:
   - Confirms artist name
   - Creates new Artist "Ali Ahmed" if not exists
   - Sets genre: "Traditional"
   - Adds to album: "Khowar Classics Vol. 1"

4. Import:
   - Download: ✓
   - Convert to MP3: ✓
   - Upload: ✓
   - Create Song Record: ✓
   - Success! Song added to catalog
```

### **Example 2: Import Music Channel**

```
1. YouTube URL: https://youtube.com/@KhowarMusicOfficial
2. Found 45 videos in channel
3. Admin selects 20 relevant music videos
4. Batch Settings:
   - Default Artist: "Various Artists"
   - Default Album: "Khowar Music Collection"
   - Default Genre: "Traditional"
   - Tags: ["khowar", "chitral", "traditional"]

5. Batch Import:
   - Processing: Video 1/20 (5%) ⏳
   - Processing: Video 2/20 (10%) ⏳
   - ...
   - Complete: 20/20 (100%) ✓

6. Summary:
   - Successfully imported: 18 songs
   - Failed: 2 songs (errors shown)
   - Total duration: 1h 23m
```

---

## 📊 Database Schema

### **ImportJob Model:**

```javascript
const importJobSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  youtubeUrl: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['single', 'playlist', 'channel'],
    default: 'single'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  progress: {
    total: Number,
    current: Number,
    percentage: Number
  },
  metadata: {
    title: String,
    artist: String,
    thumbnail: String,
    duration: Number,
    tags: [String]
  },
  result: {
    songId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song'
    },
    audioUrl: String,
    coverImage: String
  },
  error: {
    message: String,
    code: String,
    timestamp: Date
  },
  settings: {
    audioFormat: { type: String, default: 'mp3' },
    audioQuality: { type: String, default: '320' },
    overrideArtist: String,
    overrideAlbum: String,
    overrideGenre: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ImportJob', importJobSchema);
```

---

## 🎯 Success Metrics

### **Performance Targets:**

- Single video import: < 30 seconds
- Playlist (10 videos): < 5 minutes
- Metadata extraction: < 5 seconds
- Success rate: > 95%

### **Quality Targets:**

- Audio quality: 320kbps MP3
- Metadata accuracy: > 90%
- Artist auto-detection: > 80%

---

## 🔮 Future Enhancements

### **Phase 2 Features:**

1. **AI-Powered Metadata Enhancement**
   - Use AI to improve title/artist parsing
   - Auto-genre detection
   - Language detection (Khowar vs Urdu vs English)

2. **Duplicate Detection**
   - Check if song already exists before import
   - Audio fingerprinting

3. **Scheduled Imports**
   - Monitor YouTube channels for new uploads
   - Auto-import new songs from subscribed channels

4. **Advanced Audio Processing**
   - Noise reduction
   - Normalization
   - Trim silence

5. **Multi-Source Support**
   - SoundCloud
   - Vimeo
   - Direct MP3 URL

---

## 📝 Implementation Checklist

### **Backend:**
- [ ] Install system dependencies (FFmpeg, yt-dlp)
- [ ] Install npm packages
- [ ] Create YouTubeImportService
- [ ] Create MetadataExtractor utility
- [ ] Create ImportJob model
- [ ] Create API routes
- [ ] Create controller
- [ ] Add rate limiting
- [ ] Add admin-only middleware
- [ ] Test with single video
- [ ] Test with playlist
- [ ] Test error handling
- [ ] Add logging

### **Frontend:**
- [ ] Create YouTubeImport page
- [ ] Create URL input component
- [ ] Create metadata preview component
- [ ] Create progress tracker
- [ ] Create batch import manager
- [ ] Add form validation
- [ ] Add API integration
- [ ] Add error handling
- [ ] Add success notifications
- [ ] Test UI/UX
- [ ] Add loading states
- [ ] Mobile responsive design

### **Documentation:**
- [ ] API documentation
- [ ] User guide for admins
- [ ] Copyright compliance guide
- [ ] Troubleshooting guide

### **Deployment:**
- [ ] Add environment variables
- [ ] Configure temp directory
- [ ] Set file size limits
- [ ] Configure rate limits
- [ ] Test on production server
- [ ] Monitor disk space
- [ ] Set up cleanup cron job

---

## 🚀 Getting Started

### **Quick Start:**

```bash
# 1. Install system dependencies
sudo apt-get update
sudo apt-get install -y ffmpeg python3
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp

# 2. Install npm packages
cd backend
npm install yt-dlp-wrap fluent-ffmpeg music-metadata sharp

# 3. Add environment variables
echo "YOUTUBE_IMPORT_ENABLED=true" >> .env
echo "YOUTUBE_IMPORT_MAX_SIZE=100" >> .env

# 4. Create temp directory
mkdir -p uploads/temp/youtube-imports

# 5. Start server
npm run dev
```

### **First Import Test:**

```bash
# Test with curl
curl -X POST http://localhost:5000/api/youtube-import/metadata \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{"url": "https://youtube.com/watch?v=dQw4w9WgXcQ"}'
```

---

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review server logs: `logs/youtube-import.log`
- Contact technical team

---

**Last Updated:** 2024-11-08
**Version:** 1.0
**Status:** Ready for Implementation
