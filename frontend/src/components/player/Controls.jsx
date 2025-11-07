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
    <div className={`flex items-center ${compact ? 'gap-2' : 'gap-4'}`}>
      {/* Shuffle */}
      <button
        onClick={toggleShuffle}
        className={`p-2 rounded-full hover:bg-gray-100 transition ${
          shuffle ? 'text-primary' : 'text-gray-600'
        }`}
        title="Shuffle"
      >
        <ArrowPathRoundedSquareIcon className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
      </button>

      {/* Previous */}
      <button
        onClick={handlePrevious}
        className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition"
        title="Previous"
      >
        <BackwardIcon className={compact ? 'w-5 h-5' : 'w-6 h-6'} />
      </button>

      {/* Play/Pause */}
      <button
        onClick={togglePlay}
        className="p-3 rounded-full bg-primary hover:bg-primary-dark text-white transition shadow-lg"
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <PauseIcon className={compact ? 'w-6 h-6' : 'w-7 h-7'} />
        ) : (
          <PlayIcon className={compact ? 'w-6 h-6 ml-0.5' : 'w-7 h-7 ml-0.5'} />
        )}
      </button>

      {/* Next */}
      <button
        onClick={handleNext}
        className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition"
        title="Next"
      >
        <ForwardIcon className={compact ? 'w-5 h-5' : 'w-6 h-6'} />
      </button>

      {/* Repeat */}
      <button
        onClick={toggleRepeat}
        className={`p-2 rounded-full hover:bg-gray-100 transition relative ${
          repeat !== REPEAT_MODES.OFF ? 'text-primary' : 'text-gray-600'
        }`}
        title={`Repeat: ${repeat}`}
      >
        <ArrowPathIcon className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
        {repeat === REPEAT_MODES.ONE && (
          <span className="absolute top-0 right-0 text-xs font-bold">1</span>
        )}
      </button>
    </div>
  );
};

export default Controls;
