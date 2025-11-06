# Qoqnuz Admin Panel

Modern admin panel for managing the Qoqnuz music streaming platform.

## Features

- Dashboard with platform statistics
- User management
- Song upload and management
- Artist management
- Album management
- File upload (audio & images)
- Real-time updates
- Responsive design

## Tech Stack

- React 18
- Vite
- TailwindCSS
- React Query (TanStack Query)
- React Router v6
- Zustand (state management)
- Axios
- Lucide React (icons)
- React Hot Toast (notifications)

## Setup

### Prerequisites

- Node.js (v16 or higher)
- Backend API running

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
VITE_API_URL=http://localhost:5000/api
```

3. Start development server:
```bash
npm run dev
```

The admin panel will be available at `http://localhost:3001`

4. Build for production:
```bash
npm run build
```

## Default Admin Login

To create an admin user, follow these steps:

1. Register a user through the API
2. Update the user's role in MongoDB to 'admin':

```javascript
db.users.updateOne(
  { email: "admin@qoqnuz.com" },
  { $set: { role: "admin" } }
)
```

3. Login with admin credentials

## Features Overview

### Dashboard
- Total users, songs, artists, albums
- Total plays and playlists
- New users in last 30 days
- Top 10 songs by play count
- Top 10 artists by followers

### Songs Management
- View all songs
- Upload new songs (audio + metadata)
- Delete songs
- Track play counts and likes

### Artists Management
- View all artists
- Create new artists
- Upload artist profile images
- Delete artists
- Track followers

### Albums Management
- View all albums
- Create new albums
- Upload album covers
- Delete albums
- Track total tracks

### Users Management
- View all users
- See user roles (admin, artist, user)
- Premium status
- Delete non-admin users

## Project Structure

```
admin-panel/
├── public/
├── src/
│   ├── components/
│   │   └── Layout.jsx        # Main layout with sidebar
│   ├── pages/
│   │   ├── Login.jsx         # Admin login
│   │   ├── Dashboard.jsx     # Statistics dashboard
│   │   ├── Songs.jsx         # Songs list
│   │   ├── UploadSong.jsx    # Upload new song
│   │   ├── Artists.jsx       # Artists list
│   │   ├── CreateArtist.jsx  # Create artist
│   │   ├── Albums.jsx        # Albums list
│   │   ├── CreateAlbum.jsx   # Create album
│   │   └── Users.jsx         # Users list
│   ├── services/
│   │   └── api.js            # API service with axios
│   ├── store/
│   │   └── authStore.js      # Zustand auth store
│   ├── App.jsx               # Main app with routing
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## API Integration

The admin panel communicates with the backend API through axios. The API service automatically:
- Adds JWT token to all requests
- Handles 401 errors by logging out
- Provides typed API methods

## Styling

Uses TailwindCSS with a custom color scheme:
- Primary color: Green (customizable in tailwind.config.js)
- Dark sidebar with white main content
- Responsive grid layouts
- Custom scrollbar styling

## Deployment

### Vercel
```bash
npm run build
# Deploy the dist/ folder
```

### Netlify
```bash
npm run build
# Deploy the dist/ folder with:
# Build command: npm run build
# Publish directory: dist
```

### Manual
```bash
npm run build
# Serve the dist/ folder with any static server
```

## Environment Variables

- `VITE_API_URL`: Backend API URL (default: http://localhost:5000/api)

## License

MIT
