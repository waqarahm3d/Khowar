import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Songs from './pages/Songs'
import Artists from './pages/Artists'
import Albums from './pages/Albums'
import Users from './pages/Users'
import UploadSong from './pages/UploadSong'
import CreateArtist from './pages/CreateArtist'
import CreateAlbum from './pages/CreateAlbum'
import Settings from './pages/Settings'

function PrivateRoute({ children }) {
  const { token } = useAuthStore()
  return token ? children : <Navigate to="/login" />
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="songs" element={<Songs />} />
        <Route path="songs/upload" element={<UploadSong />} />
        <Route path="artists" element={<Artists />} />
        <Route path="artists/create" element={<CreateArtist />} />
        <Route path="albums" element={<Albums />} />
        <Route path="albums/create" element={<CreateAlbum />} />
        <Route path="users" element={<Users />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
