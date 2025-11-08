import { useQuery } from '@tanstack/react-query';
import { HeartIcon, ClockIcon, RectangleStackIcon } from '@heroicons/react/24/solid';
import { authAPI } from '../api/auth';
import { playlistsAPI } from '../api/playlists';
import SongList from '../components/library/SongList';
import PlaylistCard from '../components/library/PlaylistCard';
import Loading from '../components/common/Loading';
import useAuthStore from '../store/authStore';
import usePlayerStore from '../store/playerStore';
import useQueueStore from '../store/queueStore';

export default function Library() {
  const { isAuthenticated, user } = useAuthStore();
  const { playSong } = usePlayerStore();
  const { setQueue } = useQueueStore();

  // Fetch user's playlists
  const { data: playlists, isLoading: loadingPlaylists } = useQuery({
    queryKey: ['playlists', 'user'],
    queryFn: playlistsAPI.getMyPlaylists,
    enabled: isAuthenticated,
  });

  const handlePlaySong = (song, songs) => {
    const songList = songs || [song];
    setQueue(songList, songList.findIndex(s => s._id === song._id));
    playSong(song);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Your Library</h2>
          <p className="text-gray-400 mb-6">Log in to see your saved songs, playlists, and more</p>
          <a
            href="/login"
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-full inline-block transition-colors"
          >
            Log in
          </a>
        </div>
      </div>
    );
  }

  if (loadingPlaylists) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  const likedSongs = user?.likedSongs || [];

  return (
    <div className="px-4 md:px-8 py-6 pb-32 md:pb-24">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Your Library</h1>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <a
          href="/library/liked"
          className="bg-gradient-to-br from-purple-800 to-purple-600 rounded-lg p-6 hover:scale-105 transition-transform"
        >
          <HeartIcon className="w-12 h-12 text-white mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Liked Songs</h2>
          <p className="text-purple-100">{likedSongs.length} songs</p>
        </a>

        <a
          href="/library/recent"
          className="bg-gradient-to-br from-green-800 to-green-600 rounded-lg p-6 hover:scale-105 transition-transform"
        >
          <ClockIcon className="w-12 h-12 text-white mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Recently Played</h2>
          <p className="text-green-100">Your listening history</p>
        </a>

        <a
          href="/library/playlists"
          className="bg-gradient-to-br from-blue-800 to-blue-600 rounded-lg p-6 hover:scale-105 transition-transform"
        >
          <RectangleStackIcon className="w-12 h-12 text-white mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Playlists</h2>
          <p className="text-blue-100">{playlists?.data?.length || 0} playlists</p>
        </a>
      </div>

      {/* Playlists */}
      {playlists?.data && playlists.data.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Your Playlists</h2>
            <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-4 py-2 rounded-full transition-colors">
              Create Playlist
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {playlists.data.map((playlist) => (
              <PlaylistCard key={playlist._id} playlist={playlist} />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {(!playlists?.data || playlists.data.length === 0) && (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-6">You don't have any playlists yet</p>
          <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-full transition-colors">
            Create Your First Playlist
          </button>
        </div>
      )}
    </div>
  );
}
