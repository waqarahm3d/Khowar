import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Songs from './pages/Songs'
import Artists from './pages/Artists'
import Albums from './pages/Albums'
import Users from './pages/Users'
import CreateUser from './pages/CreateUser'
import EditUser from './pages/EditUser'
import UploadSong from './pages/UploadSong'
import EditSong from './pages/EditSong'
import CreateArtist from './pages/CreateArtist'
import EditArtist from './pages/EditArtist'
import CreateAlbum from './pages/CreateAlbum'
import EditAlbum from './pages/EditAlbum'
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
        <Route path="songs/edit/:id" element={<EditSong />} />
        <Route path="artists" element={<Artists />} />
        <Route path="artists/create" element={<CreateArtist />} />
        <Route path="artists/edit/:id" element={<EditArtist />} />
        <Route path="albums" element={<Albums />} />
        <Route path="albums/create" element={<CreateAlbum />} />
        <Route path="albums/edit/:id" element={<EditAlbum />} />
        <Route path="users" element={<Users />} />
        <Route path="users/create" element={<CreateUser />} />
        <Route path="users/edit/:id" element={<EditUser />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
