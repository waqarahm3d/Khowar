import { useEffect, useRef } from 'react';
import { QueueListIcon } from '@heroicons/react/24/outline';
import usePlayerStore from '../../store/playerStore';
import useQueueStore from '../../store/queueStore';
import useUIStore from '../../store/uiStore';
import { getAudioUrl } from '../../utils/formatTime';
import Controls from './Controls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import NowPlaying from './NowPlaying';

const Player = () => {
  const audioRef = useRef(null);

  const {
    currentSong,
    isPlaying,
    volume,
    isMuted,
    repeat,
    shuffle,
    setAudioElement,
    setCurrentTime,
    setDuration,
    pause,
  } = usePlayerStore();

  const { getNextSong } = useQueueStore();
  const { toggleQueue, isQueueOpen } = useUIStore();

  // Set audio element on mount
  useEffect(() => {
    if (audioRef.current) {
      setAudioElement(audioRef.current);
    }
  }, [setAudioElement]);

  // Load new song when currentSong changes
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    // Load the new audio source
    audioRef.current.load();
  }, [currentSong]);

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('Error playing audio:', error);
          pause();
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong, pause]);

  // Handle volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle time update
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Handle loaded metadata
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Handle audio error
  const handleError = (e) => {
    console.error('Audio error:', e);
    console.error('Failed to load audio URL:', audioRef.current?.src);
    pause();
  };

  // Handle song end
  const handleEnded = () => {
    const nextSong = getNextSong(shuffle, repeat);

    if (nextSong) {
      usePlayerStore.getState().playSong(nextSong);
    } else {
      pause();
    }
  };

  // Handle next/previous from other components
  useEffect(() => {
    const handleNext = () => {
      const nextSong = getNextSong(shuffle, repeat);
      if (nextSong) {
        usePlayerStore.getState().playSong(nextSong);
      }
    };

    const handlePrevious = () => {
      const previousSong = useQueueStore.getState().getPreviousSong();
      if (previousSong) {
        usePlayerStore.getState().playSong(previousSong);
      }
    };

    window.addEventListener('player:next', handleNext);
    window.addEventListener('player:previous', handlePrevious);

    return () => {
      window.removeEventListener('player:next', handleNext);
      window.removeEventListener('player:previous', handlePrevious);
    };
  }, [shuffle, repeat, getNextSong]);

  // Don't render if no song
  if (!currentSong) {
    return null;
  }

  const audioUrl = getAudioUrl(currentSong._id || currentSong.id);

  return (
    <>
      {/* Hidden audio element */}
      <audio
        key={currentSong._id || currentSong.id}
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleError}
        preload="metadata"
      />

      {/* Player UI - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-spotify-elevated border-t border-spotify-hover shadow-lg z-50">
        <div className="px-4 py-3">
          <div className="max-w-screen-2xl mx-auto">
            {/* Mobile layout */}
            <div className="flex flex-col gap-2 md:hidden">
              <div className="flex items-center justify-between">
                <NowPlaying song={currentSong} compact />
                <div className="flex items-center gap-2">
                  <Controls compact />
                  <button
                    onClick={toggleQueue}
                    className={`p-2 rounded-full hover:bg-spotify-hover transition ${
                      isQueueOpen ? 'text-primary' : 'text-spotify-text'
                    }`}
                    title="Queue"
                  >
                    <QueueListIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <ProgressBar />
            </div>

            {/* Desktop layout */}
            <div className="hidden md:flex items-center justify-between gap-4">
              {/* Left: Now playing */}
              <div className="flex-1 min-w-0">
                <NowPlaying song={currentSong} />
              </div>

              {/* Center: Controls and progress */}
              <div className="flex-1 flex flex-col items-center gap-2 max-w-2xl">
                <Controls />
                <ProgressBar />
              </div>

              {/* Right: Volume and Queue */}
              <div className="flex-1 flex justify-end items-center gap-2">
                <VolumeControl />
                <button
                  onClick={toggleQueue}
                  className={`p-2 rounded-full hover:bg-spotify-hover transition ${
                    isQueueOpen ? 'text-primary' : 'text-spotify-text'
                  }`}
                  title="Queue"
                >
                  <QueueListIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Player;
