import { XMarkIcon, MusicalNoteIcon, TrashIcon } from '@heroicons/react/24/outline';
import { PlayIcon } from '@heroicons/react/24/solid';
import useQueueStore from '../../store/queueStore';
import usePlayerStore from '../../store/playerStore';
import useUIStore from '../../store/uiStore';
import { getFileUrl, formatTime } from '../../utils/formatTime';

const Queue = () => {
  const { isQueueOpen, closeQueue } = useUIStore();
  const { queue, currentIndex, removeFromQueue, clearQueue } = useQueueStore();
  const { currentSong, playSong } = usePlayerStore();

  if (!isQueueOpen) return null;

  const upcomingSongs = queue.slice(currentIndex + 1);
  const previousSongs = queue.slice(0, currentIndex);

  const handleSongClick = (song, index) => {
    playSong(song);
    useQueueStore.setState({ currentIndex: index });
  };

  const handleRemove = (index) => {
    removeFromQueue(index);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={closeQueue}
      />

      {/* Queue Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-spotify-black shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-spotify-elevated">
          <h2 className="text-lg font-semibold text-spotify-text">Queue</h2>
          <div className="flex items-center gap-2">
            {queue.length > 0 && (
              <button
                onClick={clearQueue}
                className="px-3 py-1 text-sm text-spotify-text-subdued hover:text-spotify-text hover:bg-spotify-hover rounded transition"
              >
                Clear All
              </button>
            )}
            <button
              onClick={closeQueue}
              className="p-2 rounded-full hover:bg-spotify-hover transition"
              title="Close"
            >
              <XMarkIcon className="w-5 h-5 text-spotify-text-subdued" />
            </button>
          </div>
        </div>

        {/* Queue Content */}
        <div className="flex-1 overflow-y-auto">
          {queue.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-spotify-text-subdued">
              <MusicalNoteIcon className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">Queue is empty</p>
              <p className="text-sm">Add songs to start playing</p>
            </div>
          ) : (
            <>
              {/* Now Playing */}
              {currentSong && (
                <div className="p-4 border-b border-spotify-elevated">
                  <h3 className="text-xs font-semibold text-spotify-text-subdued uppercase mb-2">
                    Now Playing
                  </h3>
                  <QueueItem
                    song={currentSong}
                    isPlaying={true}
                    onRemove={null}
                  />
                </div>
              )}

              {/* Next Up */}
              {upcomingSongs.length > 0 && (
                <div className="p-4 border-b border-spotify-elevated">
                  <h3 className="text-xs font-semibold text-spotify-text-subdued uppercase mb-2">
                    Next Up ({upcomingSongs.length})
                  </h3>
                  <div className="space-y-2">
                    {upcomingSongs.map((song, idx) => (
                      <QueueItem
                        key={`upcoming-${idx}`}
                        song={song}
                        index={currentIndex + 1 + idx}
                        onClick={() => handleSongClick(song, currentIndex + 1 + idx)}
                        onRemove={() => handleRemove(currentIndex + 1 + idx)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Previously Played */}
              {previousSongs.length > 0 && (
                <div className="p-4">
                  <h3 className="text-xs font-semibold text-spotify-text-subdued uppercase mb-2">
                    Previously Played ({previousSongs.length})
                  </h3>
                  <div className="space-y-2">
                    {previousSongs.map((song, idx) => (
                      <QueueItem
                        key={`previous-${idx}`}
                        song={song}
                        index={idx}
                        onClick={() => handleSongClick(song, idx)}
                        onRemove={() => handleRemove(idx)}
                        isPrevious={true}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

const QueueItem = ({ song, index, isPlaying, isPrevious, onClick, onRemove }) => {
  const albumArtUrl = song.albumArt ? getFileUrl(song.albumArt) : null;
  const artistName = song.artist?.name || song.artistName || 'Unknown Artist';

  return (
    <div
      className={`group flex items-center gap-3 p-2 rounded-lg transition cursor-pointer ${
        isPlaying
          ? 'bg-primary bg-opacity-10'
          : isPrevious
          ? 'hover:bg-spotify-hover opacity-60'
          : 'hover:bg-spotify-hover'
      }`}
      onClick={onClick}
    >
      {/* Album Art */}
      <div className="relative w-12 h-12 flex-shrink-0 bg-spotify-elevated rounded overflow-hidden">
        {albumArtUrl ? (
          <img src={albumArtUrl} alt={song.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MusicalNoteIcon className="w-6 h-6 text-spotify-text-subdued" />
          </div>
        )}

        {/* Play overlay on hover */}
        {!isPlaying && onClick && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <PlayIcon className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      {/* Song Info */}
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium truncate ${isPlaying ? 'text-primary' : 'text-spotify-text'}`}>
          {song.title}
        </div>
        <div className="text-xs text-spotify-text-subdued truncate">{artistName}</div>
      </div>

      {/* Duration */}
      <div className="text-xs text-spotify-text-subdued">
        {formatTime(song.duration)}
      </div>

      {/* Remove Button */}
      {onRemove && !isPlaying && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-2 rounded-full hover:bg-spotify-elevated opacity-0 group-hover:opacity-100 transition"
          title="Remove from queue"
        >
          <TrashIcon className="w-4 h-4 text-spotify-text-subdued" />
        </button>
      )}
    </div>
  );
};

export default Queue;
