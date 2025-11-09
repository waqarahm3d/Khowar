# Voice of Chitral - Frontend Build Continuation Guide

## Current Status

### ✅ Completed (Session 1)

1. **Project Setup**
   - ✅ Created Vite + React project in `/frontend` directory
   - ✅ Installed all required dependencies
   - ✅ Configured Tailwind CSS with Apple Music style
   - ✅ Set primary color to #fc5421 (orange)
   - ✅ Set up base styling with Apple system fonts

2. **Dependencies Installed**
   ```json
   {
     "tailwindcss": "Latest",
     "@headlessui/react": "Latest",
     "@heroicons/react": "Latest",
     "react-router-dom": "Latest",
     "zustand": "Latest",
     "axios": "Latest",
     "@tanstack/react-query": "Latest",
     "framer-motion": "Latest",
     "react-hot-toast": "Latest",
     "js-cookie": "Latest"
   }
   ```

3. **Configuration Files Created**
   - ✅ `tailwind.config.js` - With Voice of Chitral branding colors
   - ✅ `postcss.config.js` - PostCSS configuration
   - ✅ `src/index.css` - Tailwind directives + Apple Music styling

### ❌ Next Steps - To Be Built

This is a multi-session project. Here's what needs to be built:

---

## Phase 1: Core Structure (Session 2)

### 1. Project Structure
Create this folder structure in `/frontend/src`:

```
src/
├── api/                  # API client and endpoints
│   ├── client.js         # Axios instance with interceptors
│   ├── auth.js           # Authentication endpoints
│   ├── songs.js          # Songs endpoints
│   ├── artists.js        # Artists endpoints
│   ├── albums.js         # Albums endpoints
│   ├── playlists.js      # Playlists endpoints
│   └── search.js         # Search endpoints
├── components/           # Reusable components
│   ├── common/          # Common UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── Dropdown.jsx
│   │   └── Loading.jsx
│   ├── player/          # Music player components
│   │   ├── Player.jsx        # Main player component
│   │   ├── Controls.jsx      # Play/pause/next/prev
│   │   ├── ProgressBar.jsx   # Seek bar
│   │   ├── VolumeControl.jsx # Volume slider
│   │   ├── Queue.jsx         # Queue list
│   │   └── NowPlaying.jsx    # Current song info
│   ├── library/         # Library components
│   │   ├── SongCard.jsx
│   │   ├── AlbumCard.jsx
│   │   ├── ArtistCard.jsx
│   │   ├── PlaylistCard.jsx
│   │   └── SongList.jsx
│   ├── navigation/      # Navigation components
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   └── MobileNav.jsx
│   └── forms/           # Form components
│       ├── LoginForm.jsx
│       ├── RegisterForm.jsx
│       └── PlaylistForm.jsx
├── pages/                # Page components
│   ├── Home.jsx
│   ├── Browse.jsx
│   ├── Search.jsx
│   ├── Library.jsx
│   ├── Artist.jsx
│   ├── Album.jsx
│   ├── Playlist.jsx
│   ├── Login.jsx
│   └── Register.jsx
├── hooks/                # Custom React hooks
│   ├── useAuth.js
│   ├── usePlayer.js
│   ├── useQueue.js
│   ├── useSearch.js
│   └── usePlaylist.js
├── store/                # Zustand stores
│   ├── authStore.js      # User authentication state
│   ├── playerStore.js    # Player state (current song, playing, etc.)
│   ├── queueStore.js     # Queue management
│   └── uiStore.js        # UI state (sidebar, modals, etc.)
├── utils/                # Utility functions
│   ├── formatTime.js     # Format seconds to mm:ss
│   ├── api.js            # API helpers
│   └── constants.js      # Constants
├── App.jsx               # Main app component with routing
├── main.jsx              # Entry point
└── index.css             # ✅ Already configured
```

### 2. Environment Variables
Create `.env` file in `/frontend`:

```env
VITE_API_URL=http://localhost:5000/api
# For production:
# VITE_API_URL=https://api.voiceofchitral.com/api
```

### 3. API Client Setup
Create `/frontend/src/api/client.js`:

```javascript
import axios from 'axios';
import Cookies from 'js-cookie';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
client.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;
```

---

## Phase 2: Core Components (Session 3)

### 1. Player Store (Zustand)
Most important - manages player state:

```javascript
// src/store/playerStore.js
import { create } from 'zustand';

const usePlayerStore = create((set, get) => ({
  // State
  currentSong: null,
  isPlaying: false,
  volume: 0.7,
  currentTime: 0,
  duration: 0,
  repeat: 'off', // 'off', 'one', 'all'
  shuffle: false,

  // Audio element (set when component mounts)
  audioElement: null,

  // Actions
  setAudioElement: (element) => set({ audioElement: element }),
  playSong: (song) => set({ currentSong: song, isPlaying: true }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setVolume: (volume) => set({ volume }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  toggleRepeat: () => set((state) => ({
    repeat: state.repeat === 'off' ? 'all' : state.repeat === 'all' ? 'one' : 'off'
  })),
  toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
  nextSong: () => {
    // TODO: Get next song from queue
  },
  previousSong: () => {
    // TODO: Get previous song from queue
  },
}));

export default usePlayerStore;
```

### 2. Queue Store
Manages play queue:

```javascript
// src/store/queueStore.js
import { create } from 'zustand';

const useQueueStore = create((set, get) => ({
  queue: [],
  currentIndex: 0,
  history: [],

  addToQueue: (song) => set((state) => ({
    queue: [...state.queue, song]
  })),

  playNext: (song) => set((state) => ({
    queue: [
      ...state.queue.slice(0, state.currentIndex + 1),
      song,
      ...state.queue.slice(state.currentIndex + 1)
    ]
  })),

  removeFromQueue: (index) => set((state) => ({
    queue: state.queue.filter((_, i) => i !== index)
  })),

  setQueue: (songs, startIndex = 0) => set({
    queue: songs,
    currentIndex: startIndex
  }),

  clearQueue: () => set({ queue: [], currentIndex: 0 }),
}));

export default useQueueStore;
```

### 3. Main Player Component
The heart of the app:

```javascript
// src/components/player/Player.jsx
import { useEffect, useRef } from 'react';
import usePlayerStore from '../../store/playerStore';
import useQueueStore from '../../store/queueStore';
import Controls from './Controls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import NowPlaying from './NowPlaying';

const Player = () => {
  const audioRef = useRef(null);
  const {
    currentSong,
    isPlaying,
    volume,
    setAudioElement,
    setCurrentTime,
    setDuration,
    nextSong,
  } = usePlayerStore();

  useEffect(() => {
    if (audioRef.current) {
      setAudioElement(audioRef.current);
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleEnded = () => {
    nextSong();
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50">
      <audio
        ref={audioRef}
        src={currentSong.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
        <NowPlaying song={currentSong} />

        <div className="flex-1 flex flex-col items-center gap-2">
          <Controls />
          <ProgressBar />
        </div>

        <VolumeControl />
      </div>
    </div>
  );
};

export default Player;
```

---

## Phase 3: Routing & Pages (Session 4)

### App.jsx with React Router

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Pages
import Home from './pages/Home';
import Browse from './pages/Browse';
import Search from './pages/Search';
import Library from './pages/Library';
import Login from './pages/Login';
import Register from './pages/Register';

// Components
import Sidebar from './components/navigation/Sidebar';
import Player from './components/player/Player';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" />

        <Routes>
          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Main routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/search" element={<Search />} />
            <Route path="/library" element={<Library />} />
            <Route path="/artist/:id" element={<Artist />} />
            <Route path="/album/:id" element={<Album />} />
            <Route path="/playlist/:id" element={<Playlist />} />
          </Route>
        </Routes>

        <Player />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
```

---

## Development Workflow

### Running the Frontend

```bash
# In /frontend directory
npm run dev

# Opens at http://localhost:5173
```

### Running Backend (for API)

```bash
# In /backend directory
pm2 start server.js --name qoqnuz-backend
# Or: node server.js
```

### Testing Together

1. Start backend on port 5000
2. Start frontend on port 5173
3. Frontend makes API calls to http://localhost:5000/api

---

## Design Guidelines

### Colors (Already in tailwind.config.js)

```javascript
colors: {
  primary: '#fc5421',        // Main orange
  'primary-dark': '#e34819',  // Darker orange
  'primary-light': '#fd6f43', // Lighter orange
}
```

### Component Style

**Apple Music aesthetic:**
- Light background (white, gray-50)
- Subtle shadows
- Rounded corners (rounded-lg, rounded-xl)
- Clean typography
- Generous spacing
- Smooth transitions

**Example Button:**
```jsx
<button className="bg-primary hover:bg-primary-dark text-white rounded-full px-6 py-2 transition-colors">
  Play
</button>
```

---

## Features Priority

### Week 1 (Core MVP)
1. ✅ Project setup
2. Music player component
3. Browse pages
4. Search
5. Authentication
6. Basic playlists

### Week 2 (Enhanced)
7. Recommendations
8. Stations
9. Lyrics
10. Charts
11. Playlist folders

### Week 3 (Social)
12. Follow friends
13. Sharing
14. Activity feed

### Week 4 (Advanced)
15. Offline mode
16. Casting
17. Exclusive content

---

## API Integration

### Backend API Endpoints (Already Built)

**Authentication:**
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`

**Songs:**
- GET `/api/songs` - Get all songs
- GET `/api/songs/:id` - Get song details
- GET `/api/songs/:id/stream` - Stream audio

**Artists:**
- GET `/api/artists`
- GET `/api/artists/:id`
- GET `/api/artists/:id/songs`

**Albums:**
- GET `/api/albums`
- GET `/api/albums/:id`
- GET `/api/albums/:id/songs`

**Playlists:**
- GET `/api/playlists`
- POST `/api/playlists`
- PUT `/api/playlists/:id`
- DELETE `/api/playlists/:id`
- POST `/api/playlists/:id/songs`
- DELETE `/api/playlists/:id/songs/:songId`

**Search:**
- GET `/api/search?q=query`

---

## Next Session Checklist

When continuing this build:

1. ✅ Frontend project is in `/frontend` directory
2. ✅ Dependencies are installed
3. ✅ Tailwind CSS is configured
4. ❌ Create project structure (folders listed above)
5. ❌ Set up API client and auth
6. ❌ Build player store and queue store
7. ❌ Create Player component
8. ❌ Build navigation and routing
9. ❌ Create page components
10. ❌ Implement features progressively

---

## Questions to Clarify

Before building more, confirm:

1. **API URL:** Is backend at `http://localhost:5000` or different?
2. **Audio Streaming:** Confirm endpoint format (e.g., `/api/songs/:id/stream`)
3. **Authentication:** Using JWT? Stored in cookies or localStorage?
4. **File URLs:** Are audio files served from `/uploads/audio/` or S3?

---

## Important Notes

- This is a **multi-session project** (40-50 hours total)
- Frontend will be built incrementally
- Each session adds more features
- Test frequently with backend API
- Focus on MVP first, then enhance

---

**Status:** Ready to continue building in next session!
**Next Step:** Create folder structure and build player components
