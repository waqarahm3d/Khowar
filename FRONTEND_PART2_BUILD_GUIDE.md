# Voice of Chitral - Frontend Part 2 Build Guide

## What's Been Completed (Part 1 - 30%)

✅ **Core Infrastructure:**
1. Project setup with Vite + React + TailwindCSS
2. Complete API services layer (auth, songs, artists, albums, playlists, search)
3. Zustand stores (auth, player, queue, UI)
4. Utility functions (formatTime, getFileUrl, constants)
5. Main Player component with audio element

**Files Created:** 14 files
**Lines of Code:** ~1,000

---

## What Needs to Be Built (Part 2 - 70%)

### Priority 1: Player Sub-Components (Required for music to play)

These components are needed to complete the player UI:

#### 1. `/frontend/src/components/player/Controls.jsx`
Play, pause, next, previous, shuffle, repeat buttons

**Template:**
```jsx
import { PlayIcon, PauseIcon, BackwardIcon, ForwardIcon, ArrowPathIcon, ArrowPathRoundedSquareIcon } from '@heroicons/react/24/solid';
import usePlayerStore from '../../store/playerStore';
import { REPEAT_MODES } from '../../utils/constants';

const Controls = ({ compact = false }) => {
  const {
    isPlaying,
    repeat,
    shuffle,
    togglePlay,
    previousSong,
    nextSong,
    toggleRepeat,
    toggleShuffle,
  } = usePlayerStore();

  return (
    <div className="flex items-center gap-4">
      {/* Shuffle */}
      <button
        onClick={toggleShuffle}
        className={`p-2 rounded-full hover:bg-gray-100 transition ${
          shuffle ? 'text-primary' : 'text-gray-600'
        }`}
        title="Shuffle"
      >
        <ArrowPathRoundedSquareIcon className="w-5 h-5" />
      </button>

      {/* Previous */}
      <button
        onClick={previousSong}
        className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition"
        title="Previous"
      >
        <BackwardIcon className="w-6 h-6" />
      </button>

      {/* Play/Pause */}
      <button
        onClick={togglePlay}
        className="p-3 rounded-full bg-primary hover:bg-primary-dark text-white transition shadow-lg"
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <PauseIcon className="w-7 h-7" />
        ) : (
          <PlayIcon className="w-7 h-7 ml-0.5" />
        )}
      </button>

      {/* Next */}
      <button
        onClick={nextSong}
        className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition"
        title="Next"
      >
        <ForwardIcon className="w-6 h-6" />
      </button>

      {/* Repeat */}
      <button
        onClick={toggleRepeat}
        className={`p-2 rounded-full hover:bg-gray-100 transition relative ${
          repeat !== REPEAT_MODES.OFF ? 'text-primary' : 'text-gray-600'
        }`}
        title={`Repeat: ${repeat}`}
      >
        <ArrowPathIcon className="w-5 h-5" />
        {repeat === REPEAT_MODES.ONE && (
          <span className="absolute top-0 right-0 text-xs font-bold">1</span>
        )}
      </button>
    </div>
  );
};

export default Controls;
```

#### 2. `/frontend/src/components/player/ProgressBar.jsx`
Seekable progress bar showing current time and duration

#### 3. `/frontend/src/components/player/VolumeControl.jsx`
Volume slider and mute button

#### 4. `/frontend/src/components/player/NowPlaying.jsx`
Current song info (title, artist, album art)

#### 5. `/frontend/src/components/player/Queue.jsx`
Queue panel showing upcoming songs

---

### Priority 2: Navigation Components

#### 6. `/frontend/src/components/navigation/Sidebar.jsx`
Left sidebar with navigation links (Home, Browse, Search, Library)

#### 7. `/frontend/src/components/navigation/Header.jsx`
Top header with search and user menu

#### 8. `/frontend/src/components/navigation/MobileNav.jsx`
Mobile bottom navigation

---

### Priority 3: Common UI Components

#### 9. `/frontend/src/components/common/Button.jsx`
Reusable button component

#### 10. `/frontend/src/components/common/Input.jsx`
Reusable input component

#### 11. `/frontend/src/components/common/Modal.jsx`
Modal dialog component

#### 12. `/frontend/src/components/common/Loading.jsx`
Loading spinner component

---

### Priority 4: Library Components (Cards)

#### 13. `/frontend/src/components/library/SongCard.jsx`
Song card with play button, title, artist

#### 14. `/frontend/src/components/library/AlbumCard.jsx`
Album card with cover, title, artist

#### 15. `/frontend/src/components/library/ArtistCard.jsx`
Artist card with image, name

#### 16. `/frontend/src/components/library/PlaylistCard.jsx`
Playlist card

#### 17. `/frontend/src/components/library/SongList.jsx`
List view of songs (table format)

---

### Priority 5: Auth Components

#### 18. `/frontend/src/components/auth/LoginForm.jsx`
Login form with email/password and OAuth buttons

#### 19. `/frontend/src/components/auth/RegisterForm.jsx`
Registration form

#### 20. `/frontend/src/components/forms/PlaylistForm.jsx`
Create/edit playlist form

---

### Priority 6: Pages

#### 21. `/frontend/src/pages/Home.jsx`
Home page with featured content, trending, recommendations

#### 22. `/frontend/src/pages/Browse.jsx`
Browse songs, albums, artists

#### 23. `/frontend/src/pages/Search.jsx`
Search page with results

#### 24. `/frontend/src/pages/Library.jsx`
User's library (playlists, liked songs)

#### 25. `/frontend/src/pages/Artist.jsx`
Artist detail page

#### 26. `/frontend/src/pages/Album.jsx`
Album detail page

#### 27. `/frontend/src/pages/Playlist.jsx`
Playlist detail page

#### 28. `/frontend/src/pages/Login.jsx`
Login page

#### 29. `/frontend/src/pages/Register.jsx`
Registration page

---

### Priority 7: Layouts

#### 30. `/frontend/src/layouts/MainLayout.jsx`
Main app layout with sidebar and player

#### 31. `/frontend/src/layouts/AuthLayout.jsx`
Auth pages layout (login/register)

---

### Priority 8: App.jsx and Routing

#### 32. `/frontend/src/App.jsx`
Main app with React Router setup

---

## Estimated Time

| Component Category | Files | Time Estimate |
|-------------------|-------|---------------|
| Player Sub-Components | 5 files | 4-6 hours |
| Navigation | 3 files | 3-4 hours |
| Common UI | 4 files | 2-3 hours |
| Library Components | 5 files | 4-5 hours |
| Auth Components | 3 files | 2-3 hours |
| Pages | 9 files | 8-12 hours |
| Layouts | 2 files | 1-2 hours |
| App & Routing | 1 file | 1-2 hours |
| **Total** | **32 files** | **25-37 hours** |

---

## Build Order (Recommended)

### Session 2 (4-6 hours): Complete Player
1. Controls.jsx
2. ProgressBar.jsx
3. VolumeControl.jsx
4. NowPlaying.jsx
5. Queue.jsx

**Result:** Fully functional music player

### Session 3 (4-5 hours): Navigation & UI
6. Sidebar.jsx
7. Header.jsx
8. MobileNav.jsx
9. Button.jsx
10. Input.jsx
11. Modal.jsx
12. Loading.jsx

**Result:** App navigation working

### Session 4 (4-5 hours): Cards & Auth
13-17. All card components
18-20. Auth components

**Result:** Can display content and login

### Session 5 (6-8 hours): Pages Part 1
21. Home.jsx
22. Browse.jsx
23. Library.jsx
24. Search.jsx

**Result:** Core pages working

### Session 6 (4-6 hours): Pages Part 2
25. Artist.jsx
26. Album.jsx
27. Playlist.jsx
28. Login.jsx
29. Register.jsx

**Result:** All pages complete

### Session 7 (2-3 hours): Layouts & Integration
30. MainLayout.jsx
31. AuthLayout.jsx
32. App.jsx with routing

**Result:** Complete working app!

### Session 8 (2-4 hours): Polish & Test
- Bug fixes
- Responsive design tweaks
- Performance optimization
- Testing

**Result:** Production-ready!

---

## Quick Start for Next Session

### To continue building:

```bash
cd /home/user/Khowar/frontend

# Start dev server
npm run dev

# In another terminal, start backend
cd /home/user/Khowar/backend
pm2 start server.js --name qoqnuz-backend
# Or: node server.js
```

### Test URLs:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Backend Health: http://localhost:5000/health

---

## Component Templates

I'll provide complete code templates for each component to speed up development.

### Example: ProgressBar.jsx Template

```jsx
import { formatTime } from '../../utils/formatTime';
import usePlayerStore from '../../store/playerStore';

const ProgressBar = () => {
  const { currentTime, duration, seekTo } = usePlayerStore();

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    seekTo(newTime);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full flex items-center gap-2">
      <span className="text-xs text-gray-500 min-w-[40px] text-right">
        {formatTime(currentTime)}
      </span>

      <div
        className="flex-1 h-1 bg-gray-200 rounded-full cursor-pointer group"
        onClick={handleSeek}
      >
        <div
          className="h-full bg-primary rounded-full relative transition-all group-hover:bg-primary-dark"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition" />
        </div>
      </div>

      <span className="text-xs text-gray-500 min-w-[40px]">
        {formatTime(duration)}
      </span>
    </div>
  );
};

export default ProgressBar;
```

---

## API Endpoints Reference

Your backend already has these endpoints ready:

### Songs
- `GET /api/songs` - Get all songs
- `GET /api/songs/:id` - Get song
- `GET /api/songs/:id/stream` - Stream audio
- `POST /api/songs/:id/like` - Like song
- `GET /api/songs/trending` - Trending
- `GET /api/songs/new-releases` - New releases

### Artists
- `GET /api/artists` - All artists
- `GET /api/artists/:id` - Artist details
- `GET /api/artists/:id/songs` - Artist songs
- `POST /api/artists/:id/follow` - Follow

### Albums
- `GET /api/albums` - All albums
- `GET /api/albums/:id` - Album details

### Playlists
- `GET /api/playlists` - All playlists
- `POST /api/playlists` - Create
- `PUT /api/playlists/:id` - Update
- `DELETE /api/playlists/:id` - Delete
- `POST /api/playlists/:id/songs` - Add song
- `DELETE /api/playlists/:id/songs/:songId` - Remove song

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Search
- `GET /api/search?q=query` - Search all

---

## Testing Checklist

After each session, test:

- [ ] Can see player controls
- [ ] Can play/pause music
- [ ] Can skip to next/previous song
- [ ] Can adjust volume
- [ ] Can seek in song
- [ ] Can browse songs/artists/albums
- [ ] Can search
- [ ] Can login/register
- [ ] Can create playlists
- [ ] Can like songs
- [ ] Mobile responsive
- [ ] No console errors

---

## Common Issues & Solutions

### Issue: API calls fail with CORS error
**Solution:**
```javascript
// In backend/server.js
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Issue: Audio won't play
**Solution:**
- Check audio URL in network tab
- Verify backend streaming endpoint works: `curl http://localhost:5000/api/songs/SONG_ID/stream`
- Check browser console for errors

### Issue: Components not rendering
**Solution:**
- Check imports are correct
- Verify stores are properly initialized
- Check React DevTools for component tree

---

## Next Steps

**Immediate Priority:** Build player sub-components (Controls, ProgressBar, VolumeControl, NowPlaying, Queue)

This will give you a fully working music player!

Then progressively add:
1. Navigation
2. Pages
3. Auth
4. Polish

**Status:** 30% complete, 70% remaining
**Estimated Time to Complete:** 25-37 hours over 7-8 sessions

---

## Ready to Continue

When you're ready for the next session, just say:

**"Continue building frontend - Session 2"**

And I'll build all the player sub-components to get music playing!
