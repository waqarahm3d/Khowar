# Qoqnuz Enhanced Features Documentation

This document describes all the enhanced features added to the Qoqnuz music streaming platform.

## Table of Contents
1. [Multi-Cloud Storage](#multi-cloud-storage)
2. [Bunny CDN Integration](#bunny-cdn-integration)
3. [Enhanced Authentication](#enhanced-authentication)
4. [Artist Verification System](#artist-verification-system)
5. [Comments & Engagement](#comments--engagement)
6. [Social Sharing](#social-sharing)
7. [Artist Analytics](#artist-analytics)
8. [Google Analytics Integration](#google-analytics-integration)

---

## Multi-Cloud Storage

Qoqnuz now supports multiple S3-compatible storage providers for maximum flexibility.

### Supported Providers
- **AWS S3** - Industry standard cloud storage
- **Wasabi** - Cost-effective S3-compatible storage
- **Backblaze B2** - Affordable cloud storage
- **Cloudflare R2** - Zero egress fees
- **Local Storage** - For development/testing

### Configuration

Set your storage provider in `.env`:

```env
# Choose provider: local, aws, wasabi, backblaze, cloudflare
STORAGE_PROVIDER=wasabi

# AWS S3
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_BUCKET_NAME=your_bucket
AWS_REGION=us-east-1

# Wasabi
WASABI_ACCESS_KEY_ID=your_key
WASABI_SECRET_ACCESS_KEY=your_secret
WASABI_BUCKET_NAME=your_bucket
WASABI_REGION=us-east-1
WASABI_ENDPOINT=https://s3.us-east-1.wasabisys.com

# Backblaze B2
BACKBLAZE_KEY_ID=your_key
BACKBLAZE_APPLICATION_KEY=your_secret
BACKBLAZE_BUCKET_NAME=your_bucket
BACKBLAZE_REGION=us-west-000
BACKBLAZE_ENDPOINT=https://s3.us-west-000.backblazeb2.com

# Cloudflare R2
CLOUDFLARE_ACCESS_KEY_ID=your_key
CLOUDFLARE_SECRET_ACCESS_KEY=your_secret
CLOUDFLARE_BUCKET_NAME=your_bucket
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
```

### Usage

The storage service is automatically used when uploading files:

```javascript
const storageService = require('./services/storageService');

// Upload file
const url = await storageService.upload(file, 'audio');

// Delete file
await storageService.delete(key);

// Get signed URL (for private files)
const signedUrl = await storageService.getSignedUrl(key, 3600);
```

---

## Bunny CDN Integration

Deliver your content faster with Bunny CDN integration.

### Configuration

```env
BUNNY_CDN_ENABLED=true
BUNNY_CDN_URL=https://your-cdn-url.b-cdn.net
BUNNY_CDN_API_KEY=your_api_key
BUNNY_STORAGE_ZONE=your_storage_zone
BUNNY_STORAGE_PASSWORD=your_storage_password
```

### How It Works

1. **With S3 Storage**: Files are uploaded to your S3 provider, and Bunny CDN pulls from your S3 origin
2. **Direct Upload**: Files can be uploaded directly to Bunny CDN Storage

When enabled, all file URLs automatically use your Bunny CDN URL for optimal delivery speeds.

---

## Enhanced Authentication

Multiple authentication methods for better user experience.

### 1. Email Verification

**New users must verify their email:**

```http
POST /api/auth/register
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "displayName": "John Doe"
}
```

**Response includes `emailVerified: false`**

User receives verification email → Click link → Account verified

**Resend verification email:**
```http
POST /api/auth/resend-verification
Authorization: Bearer <token>
```

**Verify email:**
```http
GET /api/auth/verify-email/:token
```

### 2. Google OAuth

**Login with Google:**

Frontend redirects to:
```
GET /api/auth/google
```

Google OAuth flow → User authenticated → Redirected to:
```
http://localhost:3000/auth/callback?token=<jwt_token>&provider=google
```

### 3. Facebook OAuth

**Login with Facebook:**

Frontend redirects to:
```
GET /api/auth/facebook
```

Facebook OAuth flow → User authenticated → Redirected to:
```
http://localhost:3000/auth/callback?token=<jwt_token>&provider=facebook
```

### 4. Email OTP (One-Time Password)

**Request OTP:**
```http
POST /api/auth/request-otp
{
  "email": "john@example.com"
}
```

User receives 6-digit code via email (valid for 10 minutes)

**Login with OTP:**
```http
POST /api/auth/login-otp
{
  "email": "john@example.com",
  "otp": "123456"
}
```

---

## Artist Verification System

Users can apply to become verified artists with access to analytics.

### Apply for Verification

```http
POST /api/artist-verification/apply
Authorization: Bearer <token>

{
  "artistName": "DJ Artist",
  "realName": "John Smith",
  "bio": "Professional DJ with 10 years experience...",
  "genre": ["Electronic", "House"],
  "socialLinks": {
    "instagram": "https://instagram.com/djartist",
    "spotify": "https://open.spotify.com/artist/...",
    "youtube": "https://youtube.com/@djartist"
  },
  "verificationDocuments": [
    {
      "type": "id",
      "url": "https://...",
      "description": "Government ID"
    }
  ],
  "previousReleases": [
    {
      "title": "Summer Vibes",
      "link": "https://spotify.com/...",
      "platform": "Spotify"
    }
  ]
}
```

### Application Statuses
- **pending** - Under review
- **approved** - User becomes verified artist with analytics access
- **rejected** - Application declined
- **needs_info** - More information required

### Check Application Status

```http
GET /api/artist-verification/my-application
Authorization: Bearer <token>
```

### Admin: Review Applications

```http
GET /api/artist-verification/applications?status=pending
Authorization: Bearer <admin-token>

PUT /api/artist-verification/:id/review
Authorization: Bearer <admin-token>
{
  "status": "approved",
  "reviewNotes": "All documents verified"
}
```

---

## Comments & Engagement

Users can comment on songs with profanity filtering.

### Get Comments

```http
GET /api/songs/:songId/comments?page=1&limit=20
```

**Response includes nested replies:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "user": {
        "username": "john_doe",
        "displayName": "John Doe",
        "profileImage": "..."
      },
      "content": "Amazing track!",
      "likes": 15,
      "createdAt": "...",
      "replies": [
        {
          "_id": "...",
          "user": {...},
          "content": "Agreed!",
          ...
        }
      ],
      "replyCount": 5
    }
  ]
}
```

### Create Comment

```http
POST /api/songs/:songId/comments
Authorization: Bearer <token>

{
  "content": "This is an amazing song!",
  "parentComment": null  // or comment ID for replies
}
```

**Profanity Filter**: Comments with inappropriate language are automatically rejected.

### Comment Actions

```http
# Edit comment
PUT /api/comments/:id
{
  "content": "Updated comment text"
}

# Delete comment
DELETE /api/comments/:id

# Like comment
POST /api/comments/:id/like

# Unlike comment
DELETE /api/comments/:id/like

# Get replies
GET /api/comments/:id/replies
```

---

## Social Sharing

Track when users share songs on social media.

### Record a Share

```http
POST /api/social/share
Authorization: Bearer <token>

{
  "songId": "...",
  "platform": "facebook"  // facebook, twitter, whatsapp, instagram, telegram
}
```

### Share Statistics

```http
# Get shares for a song
GET /api/social/song/:songId/shares

# Response
{
  "success": true,
  "data": {
    "totalShares": 1250,
    "byPlatform": [
      { "_id": "facebook", "count": 450 },
      { "_id": "twitter", "count": 380 },
      { "_id": "whatsapp", "count": 420 }
    ]
  }
}

# User's sharing history
GET /api/social/my-shares
Authorization: Bearer <token>

# Admin: Platform-wide stats
GET /api/social/stats
Authorization: Bearer <admin-token>
```

---

## Artist Analytics

Verified artists get access to detailed analytics.

### Get Artist Analytics

```http
GET /api/artist-verification/analytics
Authorization: Bearer <artist-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalPlays": 125000,
    "totalLikes": 8500,
    "totalComments": 1200,
    "totalShares": 950,
    "monthlyListeners": 45000,
    "topCountries": [
      { "country": "US", "listeners": 15000 },
      { "country": "UK", "listeners": 8000 }
    ],
    "playsByDate": [
      { "date": "2024-01-01", "plays": 1500 },
      ...
    ],
    "demographics": {
      "ageRanges": [
        { "range": "18-24", "percentage": 35 },
        { "range": "25-34", "percentage": 40 }
      ],
      "genderSplit": {
        "male": 60,
        "female": 38,
        "other": 2
      }
    }
  }
}
```

### Get Artist Stats

```http
GET /api/artist-verification/stats
Authorization: Bearer <artist-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalSongs": 25,
      "totalPlays": 125000,
      "totalLikes": 8500,
      "totalComments": 1200,
      "totalShares": 950,
      "recentPlays": 15000,
      "followers": 12500
    },
    "topSongs": [
      {
        "_id": "...",
        "title": "Summer Vibes",
        "playCount": 45000,
        "likeCount": 3200,
        "coverImage": "..."
      },
      ...
    ]
  }
}
```

---

## Google Analytics Integration

Track user behavior with Google Analytics.

### Backend Configuration

```env
GA_TRACKING_ID=G-XXXXXXXXXX
```

### Frontend Integration

Add to your React app (in `index.html` or app entry point):

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Track Custom Events

```javascript
// Track song plays
gtag('event', 'play_song', {
  'song_id': songId,
  'song_title': title,
  'artist': artistName
});

// Track shares
gtag('event', 'share', {
  'method': 'Facebook',
  'content_type': 'song',
  'content_id': songId
});

// Track searches
gtag('event', 'search', {
  'search_term': query
});
```

---

## Email Configuration

All email features require SMTP configuration:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password  # Gmail App Password
EMAIL_FROM=noreply@qoqnuz.com
```

### For Gmail:
1. Enable 2FA on your Google account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password in `EMAIL_PASSWORD`

---

## Admin Panel Analytics

Enhanced admin analytics include:

### Dashboard Stats
- Total users, songs, artists, albums
- Comments and shares count
- Pending artist verifications
- Storage provider info
- Recent user growth

### Analytics Endpoint

```http
GET /api/admin/analytics
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "playsOverTime": [
      { "_id": "2024-01-01", "count": 1500 },
      ...
    ],
    "newUsersOverTime": [
      { "_id": "2024-01-01", "count": 50 },
      ...
    ],
    "topGenres": [
      { "_id": "Pop", "count": 150 },
      { "_id": "Rock", "count": 120 }
    ]
  }
}
```

---

## Security Features

### Profanity Filter
- Automatically blocks inappropriate language in comments
- Uses `bad-words` library
- Returns user-friendly error message

### Rate Limiting
- Prevents abuse of OTP system (max 5 attempts)
- Session-based rate limiting for API endpoints

### Email Verification
- Tokens expire after 24 hours
- Auto-deletion of expired tokens via MongoDB TTL indexes
- OTPs expire after 10 minutes

---

## Database Models

### New Models Added:
1. **EmailVerification** - Email verification tokens
2. **OTP** - One-time password codes
3. **ArtistVerification** - Artist verification applications
4. **Comment** - User comments on songs
5. **SocialShare** - Social media share tracking
6. **ArtistAnalytics** - Detailed artist analytics data

### Updated Models:
- **User** - Added OAuth fields, email verification, artist verification status
- **Artist** - Enhanced with verification status

---

## API Endpoints Summary

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/update-profile
PUT    /api/auth/update-password
GET    /api/auth/verify-email/:token
POST   /api/auth/resend-verification
POST   /api/auth/request-otp
POST   /api/auth/login-otp
GET    /api/auth/google
GET    /api/auth/google/callback
GET    /api/auth/facebook
GET    /api/auth/facebook/callback
```

### Comments
```
GET    /api/songs/:songId/comments
POST   /api/songs/:songId/comments
PUT    /api/comments/:id
DELETE /api/comments/:id
POST   /api/comments/:id/like
DELETE /api/comments/:id/like
GET    /api/comments/:id/replies
```

### Artist Verification
```
POST   /api/artist-verification/apply
GET    /api/artist-verification/my-application
GET    /api/artist-verification/analytics
GET    /api/artist-verification/stats
GET    /api/artist-verification/applications (Admin)
PUT    /api/artist-verification/:id/review (Admin)
```

### Social Sharing
```
POST   /api/social/share
GET    /api/social/song/:songId/shares
GET    /api/social/my-shares
GET    /api/social/stats (Admin)
```

### Admin
```
GET    /api/admin/stats
GET    /api/admin/analytics
GET    /api/admin/users
PUT    /api/admin/users/:id
DELETE /api/admin/users/:id
POST   /api/admin/upload/audio
POST   /api/admin/upload/image
```

---

## Testing the Features

### 1. Test OAuth Login
- Set up Google/Facebook OAuth apps
- Configure callback URLs
- Test login flow in frontend

### 2. Test OTP Login
- Configure email SMTP
- Request OTP
- Verify OTP reception
- Login with OTP

### 3. Test Comments
- Create a comment
- Try profanity (should be blocked)
- Reply to comment
- Like/unlike comments

### 4. Test Artist Verification
- Apply as artist
- Admin reviews application
- Check artist analytics access

### 5. Test Storage
- Upload audio file
- Verify file in S3 provider
- Test CDN delivery (if enabled)

---

## Troubleshooting

### OAuth Not Working
- Check CLIENT_URL in .env matches your frontend
- Verify OAuth app credentials
- Check callback URLs match

### Emails Not Sending
- Verify SMTP credentials
- Check Gmail App Password (not regular password)
- Test with a simple email send

### Storage Upload Fails
- Verify S3 credentials
- Check bucket permissions
- Ensure CORS is configured on bucket

### Profanity Filter Too Strict
- Customize the filter in `bad-words` library
- Add custom whitelist/blacklist

---

## Next Steps

1. **Deploy to Production**
   - Update all environment variables
   - Configure production OAuth callbacks
   - Set up production SMTP
   - Configure CDN

2. **Monitor Analytics**
   - Set up Google Analytics dashboard
   - Monitor user engagement
   - Track share metrics

3. **Optimize Performance**
   - Enable CDN for all assets
   - Configure Redis caching
   - Optimize database queries

---

## Support

For issues or questions:
- Check the main README.md
- Review error logs
- Contact development team

---

**Built with ❤️ for Qoqnuz Music Platform**
