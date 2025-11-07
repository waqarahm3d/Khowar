import { formatTime } from '../../utils/formatTime';
import usePlayerStore from '../../store/playerStore';

const ProgressBar = () => {
  const { currentTime, duration, seekTo } = usePlayerStore();

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    seekTo(newTime);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full flex items-center gap-2">
      <span className="text-xs text-gray-500 min-w-[40px] text-right">
        {formatTime(currentTime)}
      </span>

      <div
        className="flex-1 h-1 bg-gray-200 rounded-full cursor-pointer group"
        onClick={handleSeek}
      >
        <div
          className="h-full bg-primary rounded-full relative transition-all group-hover:bg-primary-dark"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition" />
        </div>
      </div>

      <span className="text-xs text-gray-500 min-w-[40px]">
        {formatTime(duration)}
      </span>
    </div>
  );
};

export default ProgressBar;
