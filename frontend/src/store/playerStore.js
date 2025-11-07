import { create } from 'zustand';
import { REPEAT_MODES, PLAYER_VOLUME_KEY } from '../utils/constants';
import { songsAPI } from '../api/songs';

const usePlayerStore = create((set, get) => ({
  // State
  currentSong: null,
  isPlaying: false,
  volume: parseFloat(localStorage.getItem(PLAYER_VOLUME_KEY)) || 0.7,
  currentTime: 0,
  duration: 0,
  repeat: REPEAT_MODES.OFF,
  shuffle: false,
  isMuted: false,
  audioElement: null,

  // Set audio element
  setAudioElement: (element) => set({ audioElement: element }),

  // Play song
  playSong: (song) => {
    const { currentSong } = get();

    // Track play count
    if (song._id || song.id) {
      const songId = song._id || song.id;
      songsAPI.trackPlay(songId).catch(console.error);
    }

    set({
      currentSong: song,
      isPlaying: true,
      currentTime: 0,
    });
  },

  // Toggle play/pause
  togglePlay: () => {
    const { isPlaying, currentSong } = get();

    if (!currentSong) return;

    set({ isPlaying: !isPlaying });
  },

  // Pause
  pause: () => set({ isPlaying: false }),

  // Resume
  resume: () => set({ isPlaying: true }),

  // Set volume
  setVolume: (volume) => {
    const newVolume = Math.max(0, Math.min(1, volume));
    localStorage.setItem(PLAYER_VOLUME_KEY, newVolume);
    set({ volume: newVolume, isMuted: false });
  },

  // Toggle mute
  toggleMute: () => {
    const { isMuted } = get();
    set({ isMuted: !isMuted });
  },

  // Set current time
  setCurrentTime: (time) => set({ currentTime: time }),

  // Set duration
  setDuration: (duration) => set({ duration }),

  // Seek to time
  seekTo: (time) => {
    const { audioElement, duration } = get();
    const newTime = Math.max(0, Math.min(duration, time));

    if (audioElement) {
      audioElement.currentTime = newTime;
    }

    set({ currentTime: newTime });
  },

  // Toggle repeat mode
  toggleRepeat: () => {
    const { repeat } = get();
    let newMode;

    if (repeat === REPEAT_MODES.OFF) {
      newMode = REPEAT_MODES.ALL;
    } else if (repeat === REPEAT_MODES.ALL) {
      newMode = REPEAT_MODES.ONE;
    } else {
      newMode = REPEAT_MODES.OFF;
    }

    set({ repeat: newMode });
  },

  // Toggle shuffle
  toggleShuffle: () => {
    const { shuffle } = get();
    set({ shuffle: !shuffle });
  },

  // Next song
  nextSong: () => {
    // This will be handled by queue store
    window.dispatchEvent(new CustomEvent('player:next'));
  },

  // Previous song
  previousSong: () => {
    const { currentTime } = get();

    // If more than 3 seconds played, restart current song
    if (currentTime > 3) {
      get().seekTo(0);
    } else {
      // Otherwise go to previous song
      window.dispatchEvent(new CustomEvent('player:previous'));
    }
  },

  // Reset player
  reset: () => set({
    currentSong: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
  }),
}));

export default usePlayerStore;
