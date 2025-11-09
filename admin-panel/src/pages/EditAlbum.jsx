import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getAlbum, getArtists, updateAlbum, uploadImage } from '../services/api'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'

export default function EditAlbum() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    coverImage: '',
    releaseDate: '',
    genre: [],
    type: 'album',
  })
  const [uploading, setUploading] = useState(false)

  // Fetch album data
  const { data: albumData, isLoading } = useQuery({
    queryKey: ['album', id],
    queryFn: () => getAlbum(id),
  })

  const { data: artistsData } = useQuery({
    queryKey: ['artists'],
    queryFn: () => getArtists({ limit: 200 }),
  })

  // Populate form when album data is loaded
  useEffect(() => {
    if (albumData?.data?.data) {
      const album = albumData.data.data
      setFormData({
        title: album.title,
        artist: album.artist?._id || '',
        coverImage: album.coverImage || '',
        releaseDate: album.releaseDate ? new Date(album.releaseDate).toISOString().split('T')[0] : '',
        genre: [album.genre?.join(', ') || ''],
        type: album.type || 'album',
      })
    }
  }, [albumData])

  const updateMutation = useMutation({
    mutationFn: (data) => updateAlbum(id, data),
    onSuccess: () => {
      toast.success('Album updated successfully!')
      navigate('/albums')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update album')
    },
  })

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const response = await uploadImage(file)
      setFormData(prev => ({ ...prev, coverImage: response.data.data.imageUrl }))
      toast.success('Image uploaded successfully')
    } catch (error) {
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const genreArray = formData.genre[0] ? formData.genre[0].split(',').map(g => g.trim()) : []

    updateMutation.mutate({
      ...formData,
      genre: genreArray,
    })
  }

  const artists = artistsData?.data?.data || []

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">Loading album...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <button
        onClick={() => navigate('/albums')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Albums
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Album</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Current Cover Image */}
          {formData.coverImage && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Cover Image
              </label>
              <img
                src={formData.coverImage}
                alt="Cover"
                className="w-32 h-32 rounded object-cover"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image (leave empty to keep current)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full"
            />
          </div>

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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="album">Album</option>
              <option value="single">Single</option>
              <option value="ep">EP</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Release Date
            </label>
            <input
              type="date"
              value={formData.releaseDate}
              onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Genre (comma-separated)
            </label>
            <input
              type="text"
              value={formData.genre[0] || ''}
              onChange={(e) => setFormData({ ...formData, genre: [e.target.value] })}
              placeholder="Pop, Rock, Jazz"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <button
            type="submit"
            disabled={uploading || updateMutation.isPending}
            className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : updateMutation.isPending ? 'Updating...' : 'Update Album'}
          </button>
        </div>
      </form>
    </div>
  )
}
