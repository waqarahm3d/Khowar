import { useQuery } from '@tanstack/react-query'
import { getStats } from '../services/api'
import { Users, Music, Mic2, Album, Play, TrendingUp } from 'lucide-react'

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-3xl font-bold mt-2">{value?.toLocaleString()}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
  })

  const stats = data?.data?.data

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats?.overview?.totalUsers}
          color="bg-blue-500"
        />
        <StatCard
          icon={Music}
          label="Total Songs"
          value={stats?.overview?.totalSongs}
          color="bg-green-500"
        />
        <StatCard
          icon={Mic2}
          label="Total Artists"
          value={stats?.overview?.totalArtists}
          color="bg-purple-500"
        />
        <StatCard
          icon={Album}
          label="Total Albums"
          value={stats?.overview?.totalAlbums}
          color="bg-pink-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={Play}
          label="Total Plays"
          value={stats?.overview?.totalPlays}
          color="bg-orange-500"
        />
        <StatCard
          icon={Music}
          label="Playlists"
          value={stats?.overview?.totalPlaylists}
          color="bg-cyan-500"
        />
        <StatCard
          icon={TrendingUp}
          label="New Users (30d)"
          value={stats?.overview?.recentUsers}
          color="bg-indigo-500"
        />
      </div>

      {/* Top Songs */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Top Songs</h2>
        </div>
        <div className="overflow-x-auto">
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
                  Plays
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Likes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats?.topSongs?.map((song) => (
                <tr key={song._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={song.coverImage}
                        alt={song.title}
                        className="w-10 h-10 rounded object-cover mr-3"
                      />
                      <span className="font-medium">{song.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {song.artist?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {song.playCount?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {song.likeCount?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Artists */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Top Artists</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Artist
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Followers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Verified
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats?.topArtists?.map((artist) => (
                <tr key={artist._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={artist.profileImage}
                        alt={artist.name}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <span className="font-medium">{artist.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {artist.followers?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {artist.verified ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        Verified
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                        Not Verified
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
