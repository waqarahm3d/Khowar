import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ClockIcon } from '@heroicons/react/24/outline';
import { albumsAPI } from '../api/albums';
import SongList from '../components/library/SongList';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import usePlayerStore from '../store/playerStore';
import useQueueStore from '../store/queueStore';
import { formatTime } from '../utils/formatTime';

export default function Album() {
  const { id } = useParams();
  const { playSong } = usePlayerStore();
  const { setQueue } = useQueueStore();

  // Fetch album data
  const { data: album, isLoading: loadingAlbum } = useQuery({
    queryKey: ['album', id],
    queryFn: () => albumsAPI.getById(id),
  });

  // Fetch album songs
  const { data: songs, isLoading: loadingSongs } = useQuery({
    queryKey: ['album', id, 'songs'],
    queryFn: () => albumsAPI.getSongs(id),
  });

  const handlePlaySong = (song, songs) => {
    const songList = songs || [song];
    setQueue(songList, songList.findIndex(s => s._id === song._id));
    playSong(song);
  };

  const handlePlayAll = () => {
    if (songs?.data && songs.data.length > 0) {
      setQueue(songs.data, 0);
      playSong(songs.data[0]);
    }
  };

  if (loadingAlbum || loadingSongs) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  const albumData = album?.data;
  const totalDuration = songs?.data?.reduce((acc, song) => acc + (song.duration || 0), 0) || 0;

  return (
    <div className="pb-32 md:pb-24">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary-800 to-black px-4 md:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 max-w-7xl">
          <img
            src={albumData?.coverImage}
            alt={albumData?.title}
            className="w-48 h-48 md:w-64 md:h-64 rounded-lg shadow-2xl"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold text-white mb-2">{albumData?.type?.toUpperCase() || 'ALBUM'}</p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
              {albumData?.title}
            </h1>
            <div className="flex items-center gap-2 text-white">
              <a href={`/artist/${albumData?.artist?._id}`} className="font-semibold hover:underline">
                {albumData?.artist?.name}
              </a>
              <span>•</span>
              <span>{new Date(albumData?.releaseDate).getFullYear()}</span>
              <span>•</span>
              <span>{songs?.data?.length} songs</span>
              <span>•</span>
              <span>{formatTime(totalDuration)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 md:px-8 py-6 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Button
            onClick={handlePlayAll}
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-full"
          >
            Play
          </Button>
        </div>
      </div>

      {/* Songs */}
      <div className="px-4 md:px-8 py-6">
        {songs?.data && songs.data.length > 0 ? (
          <SongList songs={songs.data} onPlay={handlePlaySong} showAlbum={false} />
        ) : (
          <p className="text-gray-400 text-center py-12">No songs in this album</p>
        )}
      </div>

      {/* Album Info */}
      <div className="px-4 md:px-8 py-6 text-gray-400">
        <p className="text-sm">
          Released: {new Date(albumData?.releaseDate).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
        {albumData?.genre && albumData.genre.length > 0 && (
          <p className="text-sm mt-2">
            Genres: {albumData.genre.join(', ')}
          </p>
        )}
      </div>
    </div>
  );
}
