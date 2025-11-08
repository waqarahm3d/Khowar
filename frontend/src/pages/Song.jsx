import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeftIcon, PlayIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { songsAPI } from '../api/songs';
import Comments from '../components/comments/Comments';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import usePlayerStore from '../store/playerStore';
import useQueueStore from '../store/queueStore';
import useAuthStore from '../store/authStore';

export default function Song() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playSong } = usePlayerStore();
  const { setQueue } = useQueueStore();
  const { user } = useAuthStore();

  const { data: songData, isLoading } = useQuery({
    queryKey: ['song', id],
    queryFn: () => songsAPI.getById(id),
  });

  const handlePlay = () => {
    if (song) {
      setQueue([song], 0);
      playSong(song);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  const song = songData?.data;
  const isLiked = user?.likedSongs?.includes(id);

  if (!song) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-400 text-lg mb-4">Song not found</p>
        <Button onClick={() => navigate(-1)} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="pb-32 md:pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-blue-900 to-black px-4 md:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white hover:text-gray-300 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back
        </button>

        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 max-w-7xl">
          {/* Album Art */}
          <div className="w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg shadow-2xl flex items-center justify-center flex-shrink-0">
            <span className="text-6xl md:text-8xl">🎵</span>
          </div>

          {/* Song Info */}
          <div className="flex-1">
            <p className="text-sm font-semibold text-white mb-2">SONG</p>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {song.title}
            </h1>
            <div className="flex flex-col gap-2 text-white">
              <button
                onClick={() => navigate(`/artist/${song.artist._id}`)}
                className="text-lg font-semibold hover:underline text-left"
              >
                {song.artist.name}
              </button>
              {song.album && (
                <button
                  onClick={() => navigate(`/album/${song.album._id}`)}
                  className="text-gray-300 hover:underline text-left"
                >
                  {song.album.title}
                </button>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-300 mt-2">
                <span>{song.genre}</span>
                <span>•</span>
                <span>{song.releaseYear}</span>
                <span>•</span>
                <span>{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</span>
                <span>•</span>
                <span>{song.plays?.toLocaleString() || 0} plays</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 md:px-8 py-6 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Button
            onClick={handlePlay}
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-full flex items-center gap-2"
          >
            <PlayIcon className="w-5 h-5" />
            Play
          </Button>
          <button
            className="p-3 rounded-full hover:bg-white/10 transition-colors"
            title={isLiked ? 'Unlike' : 'Like'}
          >
            {isLiked ? (
              <HeartSolidIcon className="w-7 h-7 text-primary-600" />
            ) : (
              <HeartIcon className="w-7 h-7 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="px-4 md:px-8 py-8 max-w-4xl">
        <Comments songId={id} />
      </div>
    </div>
  );
}
