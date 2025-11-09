import { HeartIcon } from '@heroicons/react/24/solid';
import useAuthStore from '../store/authStore';
import usePlayerStore from '../store/playerStore';
import useQueueStore from '../store/queueStore';
import SongList from '../components/library/SongList';
import Button from '../components/common/Button';
import { Navigate } from 'react-router-dom';

export default function LikedSongs() {
  const { isAuthenticated, user } = useAuthStore();
  const { playSong } = usePlayerStore();
  const { setQueue } = useQueueStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const likedSongs = user?.likedSongs || [];

  const handlePlaySong = (song, songs) => {
    const songList = songs || [song];
    setQueue(songList, songList.findIndex(s => s._id === song._id));
    playSong(song);
  };

  const handlePlayAll = () => {
    if (likedSongs.length > 0) {
      setQueue(likedSongs, 0);
      playSong(likedSongs[0]);
    }
  };

  return (
    <div className="pb-32 md:pb-24">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary to-spotify-bg px-4 md:px-8 py-12">
        <div className="flex items-end gap-6 max-w-7xl">
          <div className="w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-primary to-primary-dark rounded-lg shadow-2xl flex items-center justify-center">
            <HeartIcon className="w-24 h-24 md:w-32 md:h-32 text-black" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-spotify-text mb-2">PLAYLIST</p>
            <h1 className="text-4xl md:text-6xl font-bold text-spotify-text mb-4">
              Liked Songs
            </h1>
            <p className="text-spotify-text">
              <span className="font-semibold">{user?.displayName || user?.username}</span>
              <span className="text-spotify-text-subdued"> • </span>
              <span className="text-spotify-text-subdued">{likedSongs.length} songs</span>
            </p>
          </div>
        </div>
      </div>

      {/* Play Button */}
      <div className="px-4 md:px-8 py-6 bg-spotify-bg/60 backdrop-blur-sm">
        <Button
          onClick={handlePlayAll}
          disabled={likedSongs.length === 0}
          className="bg-primary hover:bg-primary-light hover:scale-105 text-black font-bold px-8 py-3 rounded-full transform transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Play
        </Button>
      </div>

      {/* Songs List */}
      <div className="px-4 md:px-8 py-6">
        {likedSongs.length > 0 ? (
          <SongList songs={likedSongs} onPlay={handlePlaySong} />
        ) : (
          <div className="text-center py-12">
            <HeartIcon className="w-16 h-16 text-spotify-text-subdued mx-auto mb-4" />
            <p className="text-spotify-text-subdued text-lg">No liked songs yet</p>
            <p className="text-spotify-text-subdued text-sm mt-2">
              Songs you like will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
