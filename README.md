# Qoqnuz - Spotify-like Music Streaming Platform

A complete music streaming platform similar to Spotify with an admin panel for content management. Built for play.qoqnuz.com.

## Features

### 🎵 Core Music Features
- Music streaming with range requests (seeking support)
- Play/Pause/Skip controls
- Like songs
- Create and manage playlists
- Follow artists
- Search songs, artists, albums
- Play history tracking
- Trending songs
- New releases

### 👨‍💼 Admin Panel
- Dashboard with analytics
- Upload songs with metadata
- Manage artists, albums, playlists
- User management
- Platform statistics
- File management (audio & images)

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (User, Artist, Admin)
- Secure password hashing
- Protected routes

## Project Structure

```
Khowar/
├── backend/              # Node.js Express API
│   ├── controllers/      # Request handlers
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & upload middleware
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
│
├── admin-panel/         # React admin dashboard
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service
│   │   └── store/       # State management
│   └── package.json
│
└── ARCHITECTURE.md      # Detailed architecture
```

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT for authentication
- Multer for file uploads
- bcryptjs for password hashing

### Admin Panel
- React 18 with Vite
- TailwindCSS
- React Query (TanStack Query)
- React Router v6
- Zustand (state management)
- Axios

## Quick Start

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Setup Backend

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Update .env with your configuration

# Create upload directories
mkdir -p uploads/audio uploads/images

# Start server
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Setup Admin Panel

```bash
cd admin-panel
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev
```

Admin panel will run on `http://localhost:3001`

### 3. Create Admin User

1. Register a user through the API:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@qoqnuz.com",
    "password": "admin123",
    "displayName": "Admin User"
  }'
```

2. Update user role in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@qoqnuz.com" },
  { $set: { role: "admin" } }
)
```

3. Login at `http://localhost:3001/login`

## API Documentation

### Authentication

**Register**
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "displayName": "John Doe"
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Songs

**Get All Songs**
```http
GET /api/songs?page=1&limit=20
```

**Stream Song**
```http
GET /api/songs/:id/stream
Range: bytes=0-
```

**Upload Song** (Admin Only)
```http
POST /api/songs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Song Title",
  "artist": "artist_id",
  "album": "album_id",
  "duration": 240,
  "audioUrl": "/uploads/audio/file.mp3",
  "genre": ["Pop", "Rock"]
}
```

### Artists

**Get All Artists**
```http
GET /api/artists
```

**Create Artist** (Admin Only)
```http
POST /api/artists
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Artist Name",
  "bio": "Biography",
  "profileImage": "/uploads/images/artist.jpg",
  "genres": ["Pop", "Rock"]
}
```

### Admin

**Get Platform Stats**
```http
GET /api/admin/stats
Authorization: Bearer <admin-token>
```

**Upload Audio**
```http
POST /api/admin/upload/audio
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data

audio: <file>
```

## Database Schema

### User
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  displayName: String,
  profileImage: String,
  role: Enum ['user', 'artist', 'admin'],
  isPremium: Boolean,
  likedSongs: [ObjectId],
  playlists: [ObjectId],
  followedArtists: [ObjectId]
}
```

### Song
```javascript
{
  title: String,
  artist: ObjectId (ref: Artist),
  album: ObjectId (ref: Album),
  duration: Number,
  audioUrl: String,
  coverImage: String,
  genre: [String],
  playCount: Number,
  likeCount: Number,
  isExplicit: Boolean
}
```

### Artist
```javascript
{
  name: String (unique),
  bio: String,
  profileImage: String,
  coverImage: String,
  genres: [String],
  verified: Boolean,
  followers: Number
}
```

### Album
```javascript
{
  title: String,
  artist: ObjectId (ref: Artist),
  coverImage: String,
  releaseDate: Date,
  genre: [String],
  type: Enum ['album', 'single', 'ep'],
  totalTracks: Number,
  duration: Number
}
```

### Playlist
```javascript
{
  name: String,
  description: String,
  owner: ObjectId (ref: User),
  songs: [ObjectId],
  coverImage: String,
  isPublic: Boolean,
  followers: Number
}
```

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/qoqnuz
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
```

### Admin Panel (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## Deployment

### Backend Deployment (Heroku/DigitalOcean/AWS)

1. Set environment variables
2. Ensure MongoDB Atlas connection
3. Set up AWS S3 or Cloudinary for file storage
4. Deploy using:
```bash
npm start
```

### Admin Panel Deployment (Vercel/Netlify)

1. Build the project:
```bash
cd admin-panel
npm run build
```

2. Deploy `dist/` folder to Vercel or Netlify

3. Set environment variable:
```
VITE_API_URL=https://your-api-domain.com/api
```

## Features Comparison with Spotify

| Feature | Qoqnuz | Spotify |
|---------|--------|---------|
| Music Streaming | ✅ | ✅ |
| Create Playlists | ✅ | ✅ |
| Like Songs | ✅ | ✅ |
| Follow Artists | ✅ | ✅ |
| Search | ✅ | ✅ |
| Play History | ✅ | ✅ |
| Admin Panel | ✅ | ❌ |
| Content Upload | ✅ | ❌ |
| User Management | ✅ | ❌ |
| Offline Mode | 🔄 (planned) | ✅ |
| Recommendations | 🔄 (planned) | ✅ |
| Social Features | 🔄 (planned) | ✅ |
| Podcasts | ❌ | ✅ |

## Development Roadmap

### Phase 1 ✅ (Completed)
- [x] Backend API with authentication
- [x] Database models
- [x] Music streaming functionality
- [x] Admin panel with CRUD operations
- [x] File upload system

### Phase 2 (Next)
- [ ] User-facing frontend (Spotify-like UI)
- [ ] Music player with queue
- [ ] Browse and discovery pages
- [ ] User profile pages

### Phase 3 (Future)
- [ ] Recommendations algorithm
- [ ] Social features (share, follow friends)
- [ ] Lyrics display
- [ ] Mobile apps (React Native)
- [ ] Offline download capability
- [ ] Payment integration for premium
- [ ] Artist analytics dashboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT

## Support

For issues or questions, please open an issue on GitHub or contact the development team.

---

**Built for Qoqnuz - Your Music, Your Way**