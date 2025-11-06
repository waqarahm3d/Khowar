import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth
export const login = (credentials) => api.post('/auth/login', credentials)
export const getMe = () => api.get('/auth/me')

// Admin Stats
export const getStats = () => api.get('/admin/stats')
export const getAllUsers = (params) => api.get('/admin/users', { params })
export const updateUser = (id, data) => api.put(`/admin/users/${id}`, data)
export const deleteUser = (id) => api.delete(`/admin/users/${id}`)

// Songs
export const getSongs = (params) => api.get('/songs', { params })
export const getSong = (id) => api.get(`/songs/${id}`)
export const createSong = (data) => api.post('/songs', data)
export const updateSong = (id, data) => api.put(`/songs/${id}`, data)
export const deleteSong = (id) => api.delete(`/songs/${id}`)

// Artists
export const getArtists = (params) => api.get('/artists', { params })
export const getArtist = (id) => api.get(`/artists/${id}`)
export const createArtist = (data) => api.post('/artists', data)
export const updateArtist = (id, data) => api.put(`/artists/${id}`, data)
export const deleteArtist = (id) => api.delete(`/artists/${id}`)

// Albums
export const getAlbums = (params) => api.get('/albums', { params })
export const getAlbum = (id) => api.get(`/albums/${id}`)
export const createAlbum = (data) => api.post('/albums', data)
export const updateAlbum = (id, data) => api.put(`/albums/${id}`, data)
export const deleteAlbum = (id) => api.delete(`/albums/${id}`)

// Upload
export const uploadAudio = (file) => {
  const formData = new FormData()
  formData.append('audio', file)
  return api.post('/admin/upload/audio', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const uploadImage = (file) => {
  const formData = new FormData()
  formData.append('image', file)
  return api.post('/admin/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export default api
