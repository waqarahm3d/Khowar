import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { createArtist, uploadImage } from '../services/api'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'

export default function CreateArtist() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    profileImage: '',
    genres: [],
    verified: false,
  })
  const [uploading, setUploading] = useState(false)

  const createMutation = useMutation({
    mutationFn: createArtist,
    onSuccess: () => {
      toast.success('Artist created successfully!')
      navigate('/artists')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create artist')
    },
  })

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const response = await uploadImage(file)
      setFormData(prev => ({ ...prev, profileImage: response.data.data.imageUrl }))
      toast.success('Image uploaded successfully')
    } catch (error) {
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const genreArray = formData.genres[0] ? formData.genres[0].split(',').map(g => g.trim()) : []

    createMutation.mutate({
      ...formData,
      genres: genreArray,
    })
  }

  return (
    <div className="p-8">
      <button
        onClick={() => navigate('/artists')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Artists
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Artist</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Image
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
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows="4"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Genres (comma-separated)
            </label>
            <input
              type="text"
              value={formData.genres[0] || ''}
              onChange={(e) => setFormData({ ...formData, genres: [e.target.value] })}
              placeholder="Pop, Rock, Jazz"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.verified}
              onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
              className="mr-2"
            />
            <label className="text-sm font-medium text-gray-700">
              Verified Artist
            </label>
          </div>

          <button
            type="submit"
            disabled={uploading || createMutation.isPending}
            className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : createMutation.isPending ? 'Creating...' : 'Create Artist'}
          </button>
        </div>
      </form>
    </div>
  )
}
