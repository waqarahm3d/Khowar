import { PlayIcon, PauseIcon, BackwardIcon, ForwardIcon, ArrowPathIcon, ArrowPathRoundedSquareIcon } from '@heroicons/react/24/solid';
import usePlayerStore from '../../store/playerStore';
import useQueueStore from '../../store/queueStore';
import { REPEAT_MODES } from '../../utils/constants';

const Controls = ({ compact = false }) => {
  const {
    isPlaying,
    repeat,
    shuffle,
    togglePlay,
    toggleRepeat,
    toggleShuffle,
  } = usePlayerStore();

  const { getPreviousSong, getNextSong } = useQueueStore();

  const handlePrevious = () => {
    const previousSong = getPreviousSong();
    if (previousSong) {
      usePlayerStore.getState().playSong(previousSong);
    }
  };

  const handleNext = () => {
    const nextSong = getNextSong(shuffle, repeat);
    if (nextSong) {
      usePlayerStore.getState().playSong(nextSong);
    }
  };

  return (
    <div className={`flex items-center justify-center ${compact ? 'gap-2' : 'gap-4'}`}>
      {/* Shuffle */}
      {!compact && (
        <button
          onClick={toggleShuffle}
          className={`p-2 rounded-full hover:bg-spotify-hover transition ${
            shuffle ? 'text-primary' : 'text-spotify-text-subdued'
          }`}
          title="Shuffle"
        >
          <ArrowPathRoundedSquareIcon className="w-4 h-4" />
        </button>
      )}

      {/* Previous */}
      <button
        onClick={handlePrevious}
        className="p-2 rounded-full hover:bg-spotify-hover text-spotify-text transition"
        title="Previous"
      >
        <BackwardIcon className={compact ? 'w-5 h-5' : 'w-5 h-5'} />
      </button>

      {/* Play/Pause */}
      <button
        onClick={togglePlay}
        className="p-2 rounded-full bg-white hover:scale-105 text-black transition shadow-lg transform"
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <PauseIcon className={compact ? 'w-5 h-5' : 'w-5 h-5'} />
        ) : (
          <PlayIcon className={compact ? 'w-5 h-5 ml-0.5' : 'w-5 h-5 ml-0.5'} />
        )}
      </button>

      {/* Next */}
      <button
        onClick={handleNext}
        className="p-2 rounded-full hover:bg-spotify-hover text-spotify-text transition"
        title="Next"
      >
        <ForwardIcon className={compact ? 'w-5 h-5' : 'w-5 h-5'} />
      </button>

      {/* Repeat */}
      {!compact && (
        <button
          onClick={toggleRepeat}
          className={`p-2 rounded-full hover:bg-spotify-hover transition relative ${
            repeat !== REPEAT_MODES.OFF ? 'text-primary' : 'text-spotify-text-subdued'
          }`}
          title={`Repeat: ${repeat}`}
        >
          <ArrowPathIcon className="w-4 h-4" />
          {repeat === REPEAT_MODES.ONE && (
            <span className="absolute top-0 right-0 text-xs font-bold">1</span>
          )}
        </button>
      )}
    </div>
  );
};

export default Controls;
