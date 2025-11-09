import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getArtists, deleteArtist } from '../services/api'
import { Plus, Trash2, Edit } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Artists() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['artists'],
    queryFn: () => getArtists({ limit: 100 }),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteArtist,
    onSuccess: () => {
      queryClient.invalidateQueries(['artists'])
      toast.success('Artist deleted successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete artist')
    },
  })

  const artists = data?.data?.data || []

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Artists</h1>
        <Link
          to="/artists/create"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Artist
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artists.map((artist) => (
            <div key={artist._id} className="bg-white rounded-lg shadow p-6">
              <img
                src={artist.profileImage}
                alt={artist.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="font-bold text-lg mb-2">{artist.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{artist.bio}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {artist.followers} followers
                </span>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/artists/edit/${artist._id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => deleteMutation.mutate(artist._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
