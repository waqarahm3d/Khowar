import { useState } from 'react';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';
import usePlayerStore from '../../store/playerStore';

const VolumeControl = () => {
  const { volume, isMuted, setVolume, toggleMute } = usePlayerStore();
  const [isHovering, setIsHovering] = useState(false);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const displayVolume = isMuted ? 0 : volume;

  return (
    <div
      className="flex items-center gap-2 group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        className="p-2 rounded-full hover:bg-spotify-hover text-spotify-text-subdued hover:text-spotify-text transition"
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {displayVolume === 0 ? (
          <SpeakerXMarkIcon className="w-5 h-5" />
        ) : (
          <SpeakerWaveIcon className="w-5 h-5" />
        )}
      </button>

      {/* Volume Slider */}
      <div className={`w-0 overflow-hidden transition-all duration-300 ${isHovering ? 'w-24' : ''}`}>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={displayVolume}
          onChange={handleVolumeChange}
          className="w-full h-1 bg-spotify-text-gray rounded-full appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #FFFFFF 0%, #FFFFFF ${displayVolume * 100}%, #6A6A6A ${displayVolume * 100}%, #6A6A6A 100%)`
          }}
        />
      </div>

      {/* Volume Percentage */}
      <span className={`text-xs text-spotify-text-subdued min-w-[30px] transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
        {Math.round(displayVolume * 100)}%
      </span>
    </div>
  );
};

export default VolumeControl;
