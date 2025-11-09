import { PlayIcon, PauseIcon, MusicalNoteIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { getFileUrl, formatTime } from '../../utils/formatTime';
import usePlayerStore from '../../store/playerStore';
import useAuthStore from '../../store/authStore';
import { songsAPI } from '../../api/songs';

const SongCard = ({ song, onPlay }) => {
  const { currentSong, isPlaying, playSong, pause } = usePlayerStore();
  const { isAuthenticated, user } = useAuthStore();

  const [isLiked, setIsLiked] = useState(
    song?.likes?.includes(user?._id || user?.id) || false
  );
  const [showMenu, setShowMenu] = useState(false);

  const isCurrentSong = currentSong?._id === song._id || currentSong?.id === song.id;
  const isCurrentlyPlaying = isCurrentSong && isPlaying;

  const albumArtUrl = song.albumArt ? getFileUrl(song.albumArt) : null;
  const artistName = song.artist?.name || song.artistName || 'Unknown Artist';

  const handlePlayPause = (e) => {
    e.stopPropagation();

    if (isCurrentSong) {
      if (isPlaying) {
        pause();
      } else {
        playSong(song);
      }
    } else {
      playSong(song);
      if (onPlay) onPlay(song);
    }
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) return;

    try {
      if (isLiked) {
        await songsAPI.unlike(song._id || song.id);
        setIsLiked(false);
      } else {
        await songsAPI.like(song._id || song.id);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <div className="group bg-spotify-elevated rounded-lg p-4 hover:bg-spotify-hover transition cursor-pointer">
      <div className="relative mb-3">
        {/* Album Art */}
        <div className="aspect-square bg-spotify-bg rounded-lg overflow-hidden shadow-lg">
          {albumArtUrl ? (
            <img
              src={albumArtUrl}
              alt={song.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-spotify-hover">
              <MusicalNoteIcon className="w-12 h-12 text-spotify-text-subdued" />
            </div>
          )}
        </div>

        {/* Play button overlay */}
        <button
          onClick={handlePlayPause}
          className={`absolute bottom-2 right-2 w-12 h-12 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg flex items-center justify-center transition transform ${
            isCurrentlyPlaying
              ? 'scale-100 opacity-100'
              : 'scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100'
          }`}
        >
          {isCurrentlyPlaying ? (
            <PauseIcon className="w-6 h-6" />
          ) : (
            <PlayIcon className="w-6 h-6 ml-0.5" />
          )}
        </button>
      </div>

      {/* Song Info */}
      <div className="space-y-1">
        <h3 className="font-semibold text-spotify-text truncate text-sm">
          {song.title}
        </h3>
        <p className="text-sm text-spotify-text-subdued truncate">{artistName}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          {/* Like button */}
          {isAuthenticated && (
            <button
              onClick={handleLike}
              className="p-1.5 rounded-full hover:bg-spotify-black hover:bg-opacity-50 transition"
              title={isLiked ? 'Unlike' : 'Like'}
            >
              {isLiked ? (
                <HeartSolid className="w-4 h-4 text-primary" />
              ) : (
                <HeartOutline className="w-4 h-4 text-spotify-text-subdued" />
              )}
            </button>
          )}

          {/* Duration */}
          <span className="text-xs text-spotify-text-gray">
            {formatTime(song.duration)}
          </span>
        </div>

        {/* Menu button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="p-1.5 rounded-full hover:bg-spotify-black hover:bg-opacity-50 transition opacity-0 group-hover:opacity-100"
        >
          <EllipsisHorizontalIcon className="w-4 h-4 text-spotify-text-subdued" />
        </button>
      </div>
    </div>
  );
};

export default SongCard;
