import { useQuery } from '@tanstack/react-query';
import { ClockIcon } from '@heroicons/react/24/outline';
import { authAPI } from '../api/auth';
import SongList from '../components/library/SongList';
import Loading from '../components/common/Loading';
import usePlayerStore from '../store/playerStore';
import useQueueStore from '../store/queueStore';

export default function RecentlyPlayed() {
  const { playSong } = usePlayerStore();
  const { setQueue } = useQueueStore();

  const { data: historyData, isLoading } = useQuery({
    queryKey: ['playHistory'],
    queryFn: () => authAPI.getPlayHistory(100),
  });

  const handlePlaySong = (song, songs) => {
    const songList = songs || [song];
    setQueue(songList, songList.findIndex(s => s._id === song._id));
    playSong(song);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  // Extract unique songs from history (remove duplicates)
  const songs = historyData?.data?.map(h => h.song).filter(Boolean) || [];
  const uniqueSongs = [];
  const seenIds = new Set();

  songs.forEach(song => {
    if (song && !seenIds.has(song._id)) {
      seenIds.add(song._id);
      uniqueSongs.push(song);
    }
  });

  return (
    <div className="pb-32 md:pb-24">
      <div className="bg-gradient-to-b from-purple-800 to-black px-4 md:px-8 py-12">
        <div className="flex items-end gap-6 max-w-7xl">
          <div className="w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg shadow-2xl flex items-center justify-center">
            <ClockIcon className="w-24 h-24 md:w-32 md:h-32 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white mb-2">YOUR LIBRARY</p>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Recently Played
            </h1>
            <p className="text-gray-300 mb-2">
              Your listening history from most recent to oldest
            </p>
            <div className="flex items-center gap-2 text-white">
              <span>{uniqueSongs.length} songs</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 py-6">
        {uniqueSongs.length > 0 ? (
          <SongList songs={uniqueSongs} onPlay={handlePlaySong} />
        ) : (
          <div className="text-center py-12">
            <ClockIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No listening history yet</p>
            <p className="text-gray-500 text-sm mt-2">
              Songs you play will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
