import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { createUser, uploadImage } from '../services/api'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'

export default function CreateUser() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    displayName: '',
    role: 'user',
    isPremium: false,
    profileImage: 'https://via.placeholder.com/150',
  })
  const [uploading, setUploading] = useState(false)

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success('User created successfully!')
      navigate('/users')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create user')
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

    if (!formData.password || formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    createMutation.mutate(formData)
  }

  return (
    <div className="p-8">
      <button
        onClick={() => navigate('/users')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Users
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create User</h1>

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
              Username *
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="johndoe"
              required
              minLength={3}
              maxLength={30}
            />
            <p className="text-sm text-gray-500 mt-1">3-30 characters, no spaces</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Name *
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="At least 6 characters"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="user">User</option>
              <option value="artist">Artist</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isPremium}
              onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
              className="mr-2"
              id="isPremium"
            />
            <label htmlFor="isPremium" className="text-sm font-medium text-gray-700">
              Premium Account
            </label>
          </div>

          <button
            type="submit"
            disabled={uploading || createMutation.isPending}
            className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : createMutation.isPending ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  )
}
