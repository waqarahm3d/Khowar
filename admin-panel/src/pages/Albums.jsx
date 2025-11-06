import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getAlbums, deleteAlbum } from '../services/api'
import { Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Albums() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['albums'],
    queryFn: () => getAlbums({ limit: 100 }),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAlbum,
    onSuccess: () => {
      queryClient.invalidateQueries(['albums'])
      toast.success('Album deleted successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete album')
    },
  })

  const albums = data?.data?.data || []

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Albums</h1>
        <Link
          to="/albums/create"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Album
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {albums.map((album) => (
            <div key={album._id} className="bg-white rounded-lg shadow p-6">
              <img
                src={album.coverImage}
                alt={album.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="font-bold text-lg mb-2">{album.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{album.artist?.name}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {album.totalTracks} tracks
                </span>
                <button
                  onClick={() => deleteMutation.mutate(album._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
