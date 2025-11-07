import { create } from 'zustand';

const useQueueStore = create((set, get) => ({
  queue: [],
  currentIndex: -1,
  history: [],
  originalQueue: [], // For shuffle

  // Set queue and play from index
  setQueue: (songs, startIndex = 0) => {
    set({
      queue: songs,
      originalQueue: songs,
      currentIndex: startIndex,
      history: [],
    });
  },

  // Add to queue (end)
  addToQueue: (song) => {
    const { queue } = get();
    set({ queue: [...queue, song] });
  },

  // Add multiple songs to queue
  addMultipleToQueue: (songs) => {
    const { queue } = get();
    set({ queue: [...queue, ...songs] });
  },

  // Play next (after current song)
  playNext: (song) => {
    const { queue, currentIndex } = get();
    const newQueue = [...queue];
    newQueue.splice(currentIndex + 1, 0, song);
    set({ queue: newQueue });
  },

  // Remove from queue
  removeFromQueue: (index) => {
    const { queue, currentIndex } = get();
    const newQueue = queue.filter((_, i) => i !== index);

    let newIndex = currentIndex;
    if (index < currentIndex) {
      newIndex = currentIndex - 1;
    } else if (index === currentIndex) {
      // Don't change index, just update queue
    }

    set({ queue: newQueue, currentIndex: newIndex });
  },

  // Clear queue
  clearQueue: () => {
    set({ queue: [], currentIndex: -1, history: [], originalQueue: [] });
  },

  // Get next song
  getNextSong: (shuffle, repeat) => {
    const { queue, currentIndex } = get();

    if (queue.length === 0) return null;

    // Repeat one
    if (repeat === 'one') {
      return queue[currentIndex];
    }

    // Shuffle
    if (shuffle) {
      const availableIndices = queue
        .map((_, i) => i)
        .filter((i) => i !== currentIndex);

      if (availableIndices.length === 0) {
        return repeat === 'all' ? queue[0] : null;
      }

      const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      set({ currentIndex: randomIndex });
      return queue[randomIndex];
    }

    // Normal next
    const nextIndex = currentIndex + 1;

    if (nextIndex >= queue.length) {
      // End of queue
      if (repeat === 'all') {
        set({ currentIndex: 0 });
        return queue[0];
      }
      return null;
    }

    set({ currentIndex: nextIndex });
    return queue[nextIndex];
  },

  // Get previous song
  getPreviousSong: () => {
    const { queue, currentIndex, history } = get();

    if (queue.length === 0) return null;

    const prevIndex = currentIndex - 1;

    if (prevIndex < 0) {
      return null;
    }

    set({ currentIndex: prevIndex });
    return queue[prevIndex];
  },

  // Move song in queue
  moveSong: (fromIndex, toIndex) => {
    const { queue, currentIndex } = get();
    const newQueue = [...queue];
    const [movedSong] = newQueue.splice(fromIndex, 1);
    newQueue.splice(toIndex, 0, movedSong);

    let newCurrentIndex = currentIndex;
    if (fromIndex === currentIndex) {
      newCurrentIndex = toIndex;
    } else if (fromIndex < currentIndex && toIndex >= currentIndex) {
      newCurrentIndex--;
    } else if (fromIndex > currentIndex && toIndex <= currentIndex) {
      newCurrentIndex++;
    }

    set({ queue: newQueue, currentIndex: newCurrentIndex });
  },

  // Shuffle queue
  shuffleQueue: () => {
    const { queue, currentIndex, originalQueue } = get();
    const currentSong = queue[currentIndex];

    const otherSongs = queue.filter((_, i) => i !== currentIndex);
    const shuffled = [...otherSongs].sort(() => Math.random() - 0.5);

    const newQueue = [currentSong, ...shuffled];

    set({
      queue: newQueue,
      currentIndex: 0,
      originalQueue: originalQueue.length > 0 ? originalQueue : queue,
    });
  },

  // Unshuffle queue
  unshuffleQueue: () => {
    const { originalQueue } = get();
    if (originalQueue.length > 0) {
      set({ queue: originalQueue, currentIndex: 0 });
    }
  },
}));

export default useQueueStore;
