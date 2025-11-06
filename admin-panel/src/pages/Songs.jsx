import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getSongs, deleteSong } from '../services/api'
import { Plus, Trash2, Edit } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Songs() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['songs'],
    queryFn: () => getSongs({ limit: 100 }),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteSong,
    onSuccess: () => {
      queryClient.invalidateQueries(['songs'])
      toast.success('Song deleted successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete song')
    },
  })

  const songs = data?.data?.data || []

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Songs</h1>
        <Link
          to="/songs/upload"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Upload Song
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Song
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Artist
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Album
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Plays
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {songs.map((song) => (
                <tr key={song._id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={song.coverImage}
                        alt={song.title}
                        className="w-12 h-12 rounded object-cover mr-3"
                      />
                      <span className="font-medium">{song.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{song.artist?.name}</td>
                  <td className="px-6 py-4">{song.album?.title || 'Single'}</td>
                  <td className="px-6 py-4">
                    {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                  </td>
                  <td className="px-6 py-4">{song.playCount}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => deleteMutation.mutate(song._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
