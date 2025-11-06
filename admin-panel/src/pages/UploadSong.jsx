import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getArtists, getAlbums, createSong, uploadAudio, uploadImage } from '../services/api'
import toast from 'react-hot-toast'
import { Upload, ArrowLeft } from 'lucide-react'

export default function UploadSong() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    duration: 0,
    audioUrl: '',
    coverImage: '',
    genre: [],
    trackNumber: 1,
    isExplicit: false,
  })
  const [audioFile, setAudioFile] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const { data: artistsData } = useQuery({
    queryKey: ['artists'],
    queryFn: () => getArtists({ limit: 200 }),
  })

  const { data: albumsData } = useQuery({
    queryKey: ['albums'],
    queryFn: () => getAlbums({ limit: 200 }),
  })

  const createMutation = useMutation({
    mutationFn: createSong,
    onSuccess: () => {
      toast.success('Song uploaded successfully!')
      navigate('/songs')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to upload song')
    },
  })

  const handleAudioUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const response = await uploadAudio(file)
      const audioUrl = response.data.data.audioUrl

      // Get duration using HTML5 Audio
      const audio = new Audio(URL.createObjectURL(file))
      audio.onloadedmetadata = () => {
        setFormData(prev => ({
          ...prev,
          audioUrl,
          duration: Math.floor(audio.duration)
        }))
      }

      setAudioFile(file)
      toast.success('Audio uploaded successfully')
    } catch (error) {
      toast.error('Failed to upload audio')
    } finally {
      setUploading(false)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const response = await uploadImage(file)
      setFormData(prev => ({ ...prev, coverImage: response.data.data.imageUrl }))
      setImageFile(file)
      toast.success('Image uploaded successfully')
    } catch (error) {
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.audioUrl) {
      toast.error('Please upload an audio file')
      return
    }

    const genreArray = formData.genre[0] ? formData.genre[0].split(',').map(g => g.trim()) : []

    createMutation.mutate({
      ...formData,
      genre: genreArray,
      album: formData.album || undefined,
    })
  }

  const artists = artistsData?.data?.data || []
  const albums = albumsData?.data?.data || []

  return (
    <div className="p-8">
      <button
        onClick={() => navigate('/songs')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Songs
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload Song</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Audio Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Audio File *
            </label>
            <input
              type="file"
              accept="audio/*"
              onChange={handleAudioUpload}
              className="w-full"
              required
            />
            {audioFile && (
              <p className="text-sm text-green-600 mt-2">
                ✓ {audioFile.name}
              </p>
            )}
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full"
            />
            {imageFile && (
              <p className="text-sm text-green-600 mt-2">
                ✓ {imageFile.name}
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          {/* Artist */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Artist *
            </label>
            <select
              value={formData.artist}
              onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Select Artist</option>
              {artists.map((artist) => (
                <option key={artist._id} value={artist._id}>
                  {artist.name}
                </option>
              ))}
            </select>
          </div>

          {/* Album */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Album (Optional)
            </label>
            <select
              value={formData.album}
              onChange={(e) => setFormData({ ...formData, album: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">No Album (Single)</option>
              {albums.map((album) => (
                <option key={album._id} value={album._id}>
                  {album.title}
                </option>
              ))}
            </select>
          </div>

          {/* Genre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Genre (comma-separated)
            </label>
            <input
              type="text"
              value={formData.genre[0] || ''}
              onChange={(e) => setFormData({ ...formData, genre: [e.target.value] })}
              placeholder="Pop, Rock, Hip Hop"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Track Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Track Number
            </label>
            <input
              type="number"
              value={formData.trackNumber}
              onChange={(e) => setFormData({ ...formData, trackNumber: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              min="1"
            />
          </div>

          {/* Explicit */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isExplicit}
              onChange={(e) => setFormData({ ...formData, isExplicit: e.target.checked })}
              className="mr-2"
            />
            <label className="text-sm font-medium text-gray-700">
              Explicit Content
            </label>
          </div>

          <button
            type="submit"
            disabled={uploading || createMutation.isPending}
            className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : createMutation.isPending ? 'Creating...' : 'Upload Song'}
          </button>
        </div>
      </form>
    </div>
  )
}
