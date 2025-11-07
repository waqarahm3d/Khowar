import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, MusicalNoteIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { getFileUrl } from '../../utils/formatTime';
import { songsAPI } from '../../api/songs';
import useAuthStore from '../../store/authStore';

const NowPlaying = ({ song, compact = false }) => {
  const { isAuthenticated, user } = useAuthStore();
  const [isLiked, setIsLiked] = useState(
    song?.likes?.includes(user?._id || user?.id) || false
  );
  const [likeCount, setLikeCount] = useState(song?.likesCount || 0);

  const handleLike = async () => {
    if (!isAuthenticated) {
      // Could show login modal here
      return;
    }

    try {
      if (isLiked) {
        await songsAPI.unlike(song._id || song.id);
        setIsLiked(false);
        setLikeCount(prev => prev - 1);
      } else {
        await songsAPI.like(song._id || song.id);
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  if (!song) return null;

  const albumArtUrl = song.albumArt
    ? getFileUrl(song.albumArt)
    : null;

  const artistName = song.artist?.name || song.artistName || 'Unknown Artist';
  const albumName = song.album?.title || song.albumName || '';

  return (
    <div className={`flex items-center gap-3 ${compact ? 'max-w-[200px]' : 'max-w-[300px]'}`}>
      {/* Album Art */}
      <div className={`${compact ? 'w-12 h-12' : 'w-14 h-14'} flex-shrink-0 bg-gray-100 rounded overflow-hidden`}>
        {albumArtUrl ? (
          <img
            src={albumArtUrl}
            alt={song.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MusicalNoteIcon className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </div>

      {/* Song Info */}
      <div className="flex-1 min-w-0">
        <div className={`font-medium text-gray-900 truncate ${compact ? 'text-sm' : 'text-base'}`}>
          {song.title}
        </div>
        <div className={`text-gray-600 truncate ${compact ? 'text-xs' : 'text-sm'}`}>
          {artistName}
          {albumName && ` • ${albumName}`}
        </div>
      </div>

      {/* Like Button */}
      {!compact && (
        <button
          onClick={handleLike}
          className="p-2 rounded-full hover:bg-gray-100 transition"
          title={isLiked ? 'Unlike' : 'Like'}
        >
          {isLiked ? (
            <HeartSolid className="w-5 h-5 text-primary" />
          ) : (
            <HeartOutline className="w-5 h-5 text-gray-600" />
          )}
        </button>
      )}
    </div>
  );
};

export default NowPlaying;
