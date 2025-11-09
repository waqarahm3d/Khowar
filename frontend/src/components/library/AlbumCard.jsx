import { Link } from 'react-router-dom';
import { PlayIcon, MusicalNoteIcon } from '@heroicons/react/24/solid';
import { getFileUrl } from '../../utils/formatTime';
import usePlayerStore from '../../store/playerStore';
import useQueueStore from '../../store/queueStore';

const AlbumCard = ({ album }) => {
  const { playSong } = usePlayerStore();
  const { setQueue } = useQueueStore();

  const coverUrl = album.coverArt ? getFileUrl(album.coverArt) : null;
  const artistName = album.artist?.name || album.artistName || 'Unknown Artist';

  const handlePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (album.songs && album.songs.length > 0) {
      setQueue(album.songs, 0);
      playSong(album.songs[0]);
    }
  };

  return (
    <Link
      to={`/albums/${album._id || album.id}`}
      className="group bg-spotify-elevated rounded-lg p-4 hover:bg-spotify-hover transition cursor-pointer block"
    >
      <div className="relative mb-3">
        {/* Album Cover */}
        <div className="aspect-square bg-spotify-bg rounded-lg overflow-hidden shadow-lg">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={album.title}
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
          onClick={handlePlay}
          className="absolute bottom-2 right-2 w-12 h-12 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg flex items-center justify-center transition transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100"
        >
          <PlayIcon className="w-6 h-6 ml-0.5" />
        </button>
      </div>

      {/* Album Info */}
      <div className="space-y-1">
        <h3 className="font-semibold text-spotify-text truncate text-sm">
          {album.title}
        </h3>
        <p className="text-sm text-spotify-text-subdued truncate">{artistName}</p>
        <div className="flex items-center gap-2 text-xs text-spotify-text-gray">
          {album.releaseYear && <span>{album.releaseYear}</span>}
          {album.songs?.length > 0 && (
            <>
              <span>•</span>
              <span>{album.songs.length} songs</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default AlbumCard;
