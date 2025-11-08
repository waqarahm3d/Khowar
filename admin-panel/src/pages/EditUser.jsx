import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getAllUsers, updateUser, changePassword, uploadImage } from '../services/api'
import toast from 'react-hot-toast'
import { ArrowLeft, Key } from 'lucide-react'

export default function EditUser() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    displayName: '',
    role: 'user',
    isPremium: false,
    profileImage: '',
  })
  const [newPassword, setNewPassword] = useState('')
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Fetch all users and find the one we're editing
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => getAllUsers({ limit: 1000 }),
  })

  // Populate form when user data is loaded
  useEffect(() => {
    if (usersData?.data?.data) {
      const users = usersData.data.data
      const user = users.find(u => u._id === id)
      if (user) {
        setFormData({
          username: user.username,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
          isPremium: user.isPremium || false,
          profileImage: user.profileImage || '',
        })
      }
    }
  }, [usersData, id])

  const updateMutation = useMutation({
    mutationFn: (data) => updateUser(id, data),
    onSuccess: () => {
      toast.success('User updated successfully!')
      navigate('/users')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update user')
    },
  })

  const passwordMutation = useMutation({
    mutationFn: (data) => changePassword(id, data),
    onSuccess: () => {
      toast.success('Password changed successfully!')
      setShowPasswordModal(false)
      setNewPassword('')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to change password')
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
    updateMutation.mutate(formData)
  }

  const handlePasswordChange = (e) => {
    e.preventDefault()
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    passwordMutation.mutate({ newPassword })
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">Loading user...</div>
      </div>
    )
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

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
        <button
          onClick={() => setShowPasswordModal(true)}
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 flex items-center"
        >
          <Key className="w-5 h-5 mr-2" />
          Change Password
        </button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Current Profile Image */}
          {formData.profileImage && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Profile Image
              </label>
              <img
                src={formData.profileImage}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Image (leave empty to keep current)
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
              required
              minLength={3}
              maxLength={30}
            />
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
              required
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
            disabled={uploading || updateMutation.isPending}
            className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : updateMutation.isPending ? 'Updating...' : 'Update User'}
          </button>
        </div>
      </form>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Change Password</h2>
            <form onSubmit={handlePasswordChange}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="At least 6 characters"
                  minLength={6}
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={passwordMutation.isPending}
                  className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {passwordMutation.isPending ? 'Changing...' : 'Change Password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false)
                    setNewPassword('')
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
