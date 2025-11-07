import { Link } from 'react-router-dom';
import { PlayIcon, MusicalNoteIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { getFileUrl } from '../../utils/formatTime';
import usePlayerStore from '../../store/playerStore';
import useQueueStore from '../../store/queueStore';

const PlaylistCard = ({ playlist }) => {
  const { playSong } = usePlayerStore();
  const { setQueue } = useQueueStore();

  const coverUrl = playlist.coverImage ? getFileUrl(playlist.coverImage) : null;
  const creatorName = playlist.creator?.displayName || playlist.creator?.username || 'Unknown';

  const handlePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (playlist.songs && playlist.songs.length > 0) {
      setQueue(playlist.songs, 0);
      playSong(playlist.songs[0]);
    }
  };

  return (
    <Link
      to={`/playlists/${playlist._id || playlist.id}`}
      className="group bg-white rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer block"
    >
      <div className="relative mb-3">
        {/* Playlist Cover */}
        <div className="aspect-square bg-gradient-to-br from-primary to-primary-dark rounded-lg overflow-hidden">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={playlist.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MusicalNoteIcon className="w-12 h-12 text-white opacity-50" />
            </div>
          )}
        </div>

        {/* Play button overlay */}
        {playlist.songs?.length > 0 && (
          <button
            onClick={handlePlay}
            className="absolute bottom-2 right-2 w-12 h-12 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg flex items-center justify-center transition transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100"
          >
            <PlayIcon className="w-6 h-6 ml-0.5" />
          </button>
        )}
      </div>

      {/* Playlist Info */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 truncate text-sm flex-1">
            {playlist.name}
          </h3>
          {playlist.isPrivate && (
            <LockClosedIcon className="w-4 h-4 text-gray-500 flex-shrink-0" title="Private" />
          )}
        </div>

        {playlist.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {playlist.description}
          </p>
        )}

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>By {creatorName}</span>
          {playlist.songs?.length > 0 && (
            <>
              <span>•</span>
              <span>
                {playlist.songs.length} song{playlist.songs.length !== 1 ? 's' : ''}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PlaylistCard;
