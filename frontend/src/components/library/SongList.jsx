import { PlayIcon, PauseIcon, MusicalNoteIcon, ClockIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { getFileUrl, formatTime } from '../../utils/formatTime';
import usePlayerStore from '../../store/playerStore';
import useAuthStore from '../../store/authStore';
import { songsAPI } from '../../api/songs';

const SongList = ({ songs, showAlbum = true, showArtist = true, onSongPlay }) => {
  if (!songs || songs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <MusicalNoteIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium">No songs found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 text-sm text-gray-500 uppercase">
            <th className="text-left py-3 px-4 w-12">#</th>
            <th className="text-left py-3 px-4">Title</th>
            {showArtist && <th className="text-left py-3 px-4">Artist</th>}
            {showAlbum && <th className="text-left py-3 px-4">Album</th>}
            <th className="text-right py-3 px-4 w-20">
              <ClockIcon className="w-5 h-5 ml-auto" />
            </th>
            <th className="w-12"></th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, index) => (
            <SongRow
              key={song._id || song.id}
              song={song}
              index={index}
              showAlbum={showAlbum}
              showArtist={showArtist}
              onPlay={onSongPlay}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SongRow = ({ song, index, showAlbum, showArtist, onPlay }) => {
  const { currentSong, isPlaying, playSong, pause } = usePlayerStore();
  const { isAuthenticated, user } = useAuthStore();

  const [isLiked, setIsLiked] = useState(
    song?.likes?.includes(user?._id || user?.id) || false
  );
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isCurrentSong = currentSong?._id === song._id || currentSong?.id === song.id;
  const isCurrentlyPlaying = isCurrentSong && isPlaying;

  const albumArtUrl = song.albumArt ? getFileUrl(song.albumArt) : null;
  const artistName = song.artist?.name || song.artistName || 'Unknown Artist';
  const albumName = song.album?.title || song.albumName || '';

  const handlePlayPause = () => {
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
    <tr
      className={`group hover:bg-gray-50 transition cursor-pointer ${
        isCurrentSong ? 'bg-primary bg-opacity-5' : ''
      }`}
      onClick={handlePlayPause}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Index / Play button */}
      <td className="py-3 px-4 text-sm text-gray-500">
        {isHovered || isCurrentlyPlaying ? (
          <button onClick={handlePlayPause} className="w-6 h-6 flex items-center justify-center">
            {isCurrentlyPlaying ? (
              <PauseIcon className="w-5 h-5 text-primary" />
            ) : (
              <PlayIcon className="w-5 h-5 text-gray-700" />
            )}
          </button>
        ) : (
          <span className={isCurrentSong ? 'text-primary font-medium' : ''}>
            {index + 1}
          </span>
        )}
      </td>

      {/* Title with album art */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
            {albumArtUrl ? (
              <img src={albumArtUrl} alt={song.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <MusicalNoteIcon className="w-5 h-5 text-gray-400" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className={`font-medium truncate ${isCurrentSong ? 'text-primary' : 'text-gray-900'}`}>
              {song.title}
            </div>
            {!showArtist && (
              <div className="text-sm text-gray-600 truncate">{artistName}</div>
            )}
          </div>
        </div>
      </td>

      {/* Artist */}
      {showArtist && (
        <td className="py-3 px-4 text-sm text-gray-600 truncate max-w-[200px]">
          {artistName}
        </td>
      )}

      {/* Album */}
      {showAlbum && (
        <td className="py-3 px-4 text-sm text-gray-600 truncate max-w-[200px]">
          {albumName || '-'}
        </td>
      )}

      {/* Duration */}
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-2">
          {isAuthenticated && (
            <button
              onClick={handleLike}
              className="p-1 rounded hover:bg-gray-200 transition opacity-0 group-hover:opacity-100"
              title={isLiked ? 'Unlike' : 'Like'}
            >
              {isLiked ? (
                <HeartSolid className="w-4 h-4 text-primary" />
              ) : (
                <HeartOutline className="w-4 h-4 text-gray-600" />
              )}
            </button>
          )}
          <span className="text-sm text-gray-600">{formatTime(song.duration)}</span>
        </div>
      </td>

      {/* Menu */}
      <td className="py-3 px-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="p-1 rounded hover:bg-gray-200 transition opacity-0 group-hover:opacity-100"
        >
          <EllipsisHorizontalIcon className="w-5 h-5 text-gray-600" />
        </button>
      </td>
    </tr>
  );
};

export default SongList;
