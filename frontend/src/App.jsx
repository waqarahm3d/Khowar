import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';

// Layout
import MainLayout from './components/layout/MainLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Search from './pages/Search';
import Browse from './pages/Browse';
import Library from './pages/Library';
import Artist from './pages/Artist';
import Album from './pages/Album';
import Song from './pages/Song';
import Playlist from './pages/Playlist';
import Profile from './pages/Profile';
import RecentlyPlayed from './pages/RecentlyPlayed';
import Artists from './pages/Artists';
import Albums from './pages/Albums';
import LikedSongs from './pages/LikedSongs';
import Playlists from './pages/Playlists';
import Settings from './pages/Settings';
import VerifyEmail from './pages/VerifyEmail';
import AuthCallback from './pages/AuthCallback';

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Public Route Component (redirect to home if authenticated)
function PublicRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? children : <Navigate to="/" replace />;
}

function App() {
  const { isAuthenticated, fetchUser } = useAuthStore();

  // Load user data on app mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated, fetchUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            {/* Auth Routes (redirect if already logged in) */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Public Routes - Accessible to everyone (guests and logged in users) */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="search" element={<Search />} />
              <Route path="browse" element={<Browse />} />
              <Route path="artists" element={<Artists />} />
              <Route path="albums" element={<Albums />} />
              <Route path="artist/:id" element={<Artist />} />
              <Route path="album/:id" element={<Album />} />
              <Route path="song/:id" element={<Song />} />

              {/* Protected Routes - Require authentication */}
              <Route
                path="library"
                element={
                  <ProtectedRoute>
                    <Library />
                  </ProtectedRoute>
                }
              />
              <Route
                path="recently-played"
                element={
                  <ProtectedRoute>
                    <RecentlyPlayed />
                  </ProtectedRoute>
                }
              />
              <Route
                path="playlist/:id"
                element={
                  <ProtectedRoute>
                    <Playlist />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="library/liked"
                element={
                  <ProtectedRoute>
                    <LikedSongs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="library/playlists"
                element={
                  <ProtectedRoute>
                    <Playlists />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Toast Notifications */}
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#181818',
                color: '#FFFFFF',
                borderRadius: '8px',
              },
              success: {
                iconTheme: {
                  primary: '#1DB954',
                  secondary: '#000',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
