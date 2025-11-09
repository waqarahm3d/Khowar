# Qoqnuz - Spotify-like Music Streaming Platform Architecture

## Overview
Qoqnuz is a full-featured music streaming platform similar to Spotify, with a comprehensive admin panel for content management.

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: AWS S3 / Cloudinary / Local Storage
- **Audio Processing**: ffmpeg
- **API Documentation**: Swagger/OpenAPI

### Frontend (User App)
- **Framework**: Next.js 14 (React)
- **State Management**: Redux Toolkit / Zustand
- **Styling**: Tailwind CSS
- **Audio Player**: Howler.js / React Player
- **HTTP Client**: Axios
- **UI Components**: Shadcn/ui

### Admin Panel
- **Framework**: React + Vite
- **Admin Framework**: React Admin / Custom Dashboard
- **Charts**: Recharts / Chart.js
- **File Upload**: React Dropzone

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                             │
├──────────────────────────┬──────────────────────────────────┤
│   User Frontend          │       Admin Panel                │
│   (Next.js)              │       (React)                    │
│   - Music Player         │       - Content Management       │
│   - Browse/Search        │       - User Management          │
│   - Playlists            │       - Analytics Dashboard      │
│   - User Profile         │       - Upload Music             │
└──────────┬───────────────┴────────────┬─────────────────────┘
           │                            │
           │         HTTP/REST          │
           │                            │
┌──────────┴────────────────────────────┴─────────────────────┐
│                     API Gateway                              │
│                     (Express.js)                             │
├──────────────────────────────────────────────────────────────┤
│                     Business Logic Layer                     │
├─────────────┬──────────────┬──────────────┬─────────────────┤
│   Auth      │   Music      │   User       │   Admin         │
│   Service   │   Service    │   Service    │   Service       │
└─────────────┴──────────────┴──────────────┴─────────────────┘
           │                            │
┌──────────┴────────────────┐  ┌────────┴─────────────────────┐
│   Database (MongoDB)      │  │   Cloud Storage (S3)         │
│   - Users                 │  │   - Audio Files              │
│   - Artists               │  │   - Images                   │
│   - Albums                │  │   - Thumbnails               │
│   - Songs                 │  │                              │
│   - Playlists             │  │                              │
└───────────────────────────┘  └──────────────────────────────┘
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  displayName: String,
  profileImage: String,
  role: Enum ['user', 'artist', 'admin'],
  isPremium: Boolean,
  likedSongs: [ObjectId], // refs to Song
  playlists: [ObjectId], // refs to Playlist
  followedArtists: [ObjectId], // refs to Artist
  createdAt: Date,
  updatedAt: Date
}
```

### Artists Collection
```javascript
{
  _id: ObjectId,
  name: String,
  bio: String,
  profileImage: String,
  coverImage: String,
  genres: [String],
  verified: Boolean,
  followers: Number,
  albums: [ObjectId], // refs to Album
  songs: [ObjectId], // refs to Song
  createdAt: Date,
  updatedAt: Date
}
```

### Albums Collection
```javascript
{
  _id: ObjectId,
  title: String,
  artist: ObjectId, // ref to Artist
  coverImage: String,
  releaseDate: Date,
  genre: [String],
  songs: [ObjectId], // refs to Song
  totalTracks: Number,
  duration: Number, // in seconds
  createdAt: Date,
  updatedAt: Date
}
```

### Songs Collection
```javascript
{
  _id: ObjectId,
  title: String,
  artist: ObjectId, // ref to Artist
  album: ObjectId, // ref to Album
  duration: Number, // in seconds
  audioUrl: String,
  coverImage: String,
  genre: [String],
  releaseDate: Date,
  lyrics: String,
  playCount: Number,
  likeCount: Number,
  isExplicit: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Playlists Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  owner: ObjectId, // ref to User
  songs: [ObjectId], // refs to Song
  coverImage: String,
  isPublic: Boolean,
  followers: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### PlayHistory Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId, // ref to User
  song: ObjectId, // ref to Song
  playedAt: Date,
  duration: Number, // how long they listened
  completedPercentage: Number
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-profile` - Update profile

### Songs
- `GET /api/songs` - Get all songs (with pagination)
- `GET /api/songs/:id` - Get single song
- `POST /api/songs` - Create song (admin)
- `PUT /api/songs/:id` - Update song (admin)
- `DELETE /api/songs/:id` - Delete song (admin)
- `GET /api/songs/stream/:id` - Stream audio file
- `POST /api/songs/:id/like` - Like a song
- `GET /api/songs/search` - Search songs

### Artists
- `GET /api/artists` - Get all artists
- `GET /api/artists/:id` - Get single artist
- `POST /api/artists` - Create artist (admin)
- `PUT /api/artists/:id` - Update artist (admin)
- `DELETE /api/artists/:id` - Delete artist (admin)
- `POST /api/artists/:id/follow` - Follow an artist

### Albums
- `GET /api/albums` - Get all albums
- `GET /api/albums/:id` - Get single album
- `POST /api/albums` - Create album (admin)
- `PUT /api/albums/:id` - Update album (admin)
- `DELETE /api/albums/:id` - Delete album (admin)

### Playlists
- `GET /api/playlists` - Get user playlists
- `GET /api/playlists/:id` - Get single playlist
- `POST /api/playlists` - Create playlist
- `PUT /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist
- `POST /api/playlists/:id/songs` - Add song to playlist
- `DELETE /api/playlists/:id/songs/:songId` - Remove song from playlist

### Admin
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `POST /api/admin/upload` - Upload audio file

## Key Features

### User Features (Spotify-like)
1. **Music Player**
   - Play/Pause
   - Next/Previous track
   - Shuffle
   - Repeat (one/all)
   - Volume control
   - Seek bar
   - Queue management

2. **Browse & Discovery**
   - Home page with recommendations
   - Browse by genre
   - New releases
   - Top charts
   - Artist pages
   - Album pages

3. **Search**
   - Search songs, artists, albums, playlists
   - Filters by type
   - Recent searches

4. **Library**
   - Liked songs
   - Created playlists
   - Followed artists
   - Saved albums

5. **Playlists**
   - Create/edit/delete playlists
   - Add/remove songs
   - Share playlists
   - Collaborative playlists

6. **Social Features**
   - Follow artists
   - Share songs/playlists
   - See what friends are listening to

### Admin Panel Features
1. **Dashboard**
   - Total users
   - Total songs/albums/artists
   - Recent uploads
   - Popular songs
   - User activity graphs
   - Storage usage

2. **Content Management**
   - Upload songs (single/bulk)
   - Create/edit artists
   - Create/edit albums
   - Add metadata (genre, year, etc.)
   - Audio file management
   - Image upload for covers

3. **User Management**
   - View all users
   - User details
   - Ban/unban users
   - Upgrade to premium
   - View user activity

4. **Analytics**
   - Play counts
   - Popular songs/artists
   - User engagement
   - Storage analytics
   - Revenue (if applicable)

5. **Content Moderation**
   - Pending uploads
   - Reported content
   - Content approval workflow

## Security Features
- JWT-based authentication
- Password hashing (bcrypt)
- Role-based access control (RBAC)
- Rate limiting
- Input validation
- XSS protection
- CORS configuration
- Secure file upload

## Performance Optimization
- Audio streaming with range requests
- CDN for static assets
- Redis caching for frequently accessed data
- Database indexing
- Image optimization
- Lazy loading
- Code splitting

## Deployment
- Backend: AWS EC2 / DigitalOcean / Heroku
- Frontend: Vercel / Netlify
- Database: MongoDB Atlas
- Storage: AWS S3 / Cloudinary
- CDN: CloudFront / Cloudflare

## Development Phases

### Phase 1: Backend Foundation
- Database setup
- Authentication system
- Basic CRUD for songs, artists, albums
- File upload handling

### Phase 2: Admin Panel
- Admin dashboard UI
- Content management interface
- User management
- Upload functionality

### Phase 3: User Frontend
- Music player implementation
- Browse/search interface
- User authentication
- Playlist management

### Phase 4: Advanced Features
- Recommendations algorithm
- Social features
- Analytics
- Performance optimization

### Phase 5: Testing & Deployment
- Unit testing
- Integration testing
- Bug fixes
- Production deployment
