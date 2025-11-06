# Qoqnuz Backend API

Backend API for Qoqnuz music streaming platform with admin functionality.

## Features

- JWT Authentication
- Music streaming with range requests
- File upload (audio & images)
- User management
- Artist, Album, Song, and Playlist CRUD
- Admin dashboard with analytics
- Play history tracking
- Search functionality

## Tech Stack

- Node.js & Express
- MongoDB & Mongoose
- JWT for authentication
- Multer for file uploads
- bcryptjs for password hashing

## Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/qoqnuz
JWT_SECRET=your_secret_key
PORT=5000
```

4. Create upload directories:
```bash
mkdir -p uploads/audio uploads/images
```

5. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "displayName": "John Doe"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

### Songs

#### Get All Songs
```http
GET /songs?page=1&limit=20
```

#### Get Single Song
```http
GET /songs/:id
```

#### Stream Song
```http
GET /songs/:id/stream
Range: bytes=0-
```

#### Search Songs
```http
GET /songs/search?q=query
```

#### Like Song (Protected)
```http
POST /songs/:id/like
Authorization: Bearer <token>
```

#### Create Song (Admin Only)
```http
POST /songs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Song Title",
  "artist": "artist_id",
  "album": "album_id",
  "duration": 240,
  "audioUrl": "/uploads/audio/file.mp3",
  "coverImage": "/uploads/images/cover.jpg",
  "genre": ["Pop", "Rock"],
  "releaseDate": "2024-01-01"
}
```

### Artists

#### Get All Artists
```http
GET /artists?page=1&limit=20
```

#### Get Artist
```http
GET /artists/:id
```

#### Get Artist Songs
```http
GET /artists/:id/songs
```

#### Follow Artist (Protected)
```http
POST /artists/:id/follow
Authorization: Bearer <token>
```

#### Create Artist (Admin Only)
```http
POST /artists
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Artist Name",
  "bio": "Artist biography",
  "profileImage": "/uploads/images/profile.jpg",
  "genres": ["Pop", "Rock"]
}
```

### Albums

#### Get All Albums
```http
GET /albums?page=1&limit=20
```

#### Get Album
```http
GET /albums/:id
```

#### Get Album Songs
```http
GET /albums/:id/songs
```

### Playlists

#### Get Public Playlists
```http
GET /playlists/public
```

#### Get My Playlists (Protected)
```http
GET /playlists/my
Authorization: Bearer <token>
```

#### Create Playlist (Protected)
```http
POST /playlists
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Playlist",
  "description": "Playlist description",
  "isPublic": true
}
```

#### Add Song to Playlist (Protected)
```http
POST /playlists/:id/songs
Authorization: Bearer <token>
Content-Type: application/json

{
  "songId": "song_id"
}
```

### Admin

#### Get Platform Stats (Admin Only)
```http
GET /admin/stats
Authorization: Bearer <token>
```

#### Get All Users (Admin Only)
```http
GET /admin/users?page=1&limit=20
Authorization: Bearer <token>
```

#### Upload Audio (Admin Only)
```http
POST /admin/upload/audio
Authorization: Bearer <token>
Content-Type: multipart/form-data

audio: <file>
```

#### Upload Image (Admin Only)
```http
POST /admin/upload/image
Authorization: Bearer <token>
Content-Type: multipart/form-data

image: <file>
```

## Project Structure

```
backend/
├── controllers/        # Request handlers
│   ├── authController.js
│   ├── songController.js
│   ├── artistController.js
│   ├── albumController.js
│   ├── playlistController.js
│   ├── userController.js
│   └── adminController.js
├── models/            # Database models
│   ├── User.js
│   ├── Song.js
│   ├── Artist.js
│   ├── Album.js
│   ├── Playlist.js
│   └── PlayHistory.js
├── routes/            # API routes
│   ├── auth.js
│   ├── songs.js
│   ├── artists.js
│   ├── albums.js
│   ├── playlists.js
│   ├── users.js
│   └── admin.js
├── middleware/        # Custom middleware
│   ├── auth.js
│   └── upload.js
├── utils/            # Utility functions
│   └── generateToken.js
├── uploads/          # Uploaded files
│   ├── audio/
│   └── images/
├── server.js         # Entry point
└── package.json
```

## Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Creating Admin User

To create an admin user, first register a regular user, then update the user's role in MongoDB:

```javascript
db.users.updateOne(
  { email: "admin@qoqnuz.com" },
  { $set: { role: "admin" } }
)
```

Or use MongoDB Compass to update the user's role field to "admin".

## Testing

Test the API using:
- Postman
- Thunder Client (VS Code)
- cURL
- Your frontend application

## Production Considerations

1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Enable HTTPS
4. Use MongoDB Atlas for database
5. Use AWS S3 or Cloudinary for file storage
6. Set up proper CORS configuration
7. Implement rate limiting
8. Add input validation
9. Set up logging
10. Configure backup strategy

## License

MIT
