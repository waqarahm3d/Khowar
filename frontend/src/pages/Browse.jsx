import { useQuery } from '@tanstack/react-query';
import { songsAPI } from '../api/songs';
import { artistsAPI } from '../api/artists';
import { albumsAPI } from '../api/albums';
import SongCard from '../components/library/SongCard';
import ArtistCard from '../components/library/ArtistCard';
import AlbumCard from '../components/library/AlbumCard';
import Loading from '../components/common/Loading';
import usePlayerStore from '../store/playerStore';
import useQueueStore from '../store/queueStore';

export default function Browse() {
  const { playSong } = usePlayerStore();
  const { setQueue } = useQueueStore();

  const { data: songs, isLoading: loadingSongs } = useQuery({
    queryKey: ['songs', 'all'],
    queryFn: () => songsAPI.getAll({ limit: 20 }),
  });

  const { data: artists, isLoading: loadingArtists } = useQuery({
    queryKey: ['artists', 'all'],
    queryFn: () => artistsAPI.getAll({ limit: 12 }),
  });

  const { data: albums, isLoading: loadingAlbums } = useQuery({
    queryKey: ['albums', 'all'],
    queryFn: () => albumsAPI.getAll({ limit: 12 }),
  });

  const handlePlaySong = (song, songs) => {
    const songList = songs || [song];
    setQueue(songList, songList.findIndex(s => s._id === song._id));
    playSong(song);
  };

  if (loadingSongs && loadingArtists && loadingAlbums) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-6 pb-32 md:pb-24">
      <h1 className="text-3xl md:text-4xl font-bold text-spotify-text mb-8">Browse</h1>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-spotify-text mb-6">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { name: 'Folk Music', color: 'bg-green-600' },
            { name: 'Traditional', color: 'bg-blue-600' },
            { name: 'Modern', color: 'bg-purple-600' },
            { name: 'Instrumental', color: 'bg-orange-600' },
            { name: 'Vocals', color: 'bg-pink-600' },
            { name: 'Fusion', color: 'bg-yellow-600' },
            { name: 'Classical', color: 'bg-red-600' },
            { name: 'Contemporary', color: 'bg-indigo-600' },
          ].map((category) => (
            <div
              key={category.name}
              className={`${category.color} rounded-lg p-6 cursor-pointer hover:opacity-90 transition-opacity`}
            >
              <h3 className="text-white font-bold text-lg">{category.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* All Songs */}
      {songs?.data && songs.data.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-spotify-text mb-6">All Songs</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {songs.data.map((song) => (
              <SongCard
                key={song._id}
                song={song}
                onPlay={() => handlePlaySong(song, songs.data)}
              />
            ))}
          </div>
        </section>
      )}

      {/* All Artists */}
      {artists?.data && artists.data.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-spotify-text mb-6">All Artists</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {artists.data.map((artist) => (
              <ArtistCard key={artist._id} artist={artist} />
            ))}
          </div>
        </section>
      )}

      {/* All Albums */}
      {albums?.data && albums.data.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-spotify-text mb-6">All Albums</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {albums.data.map((album) => (
              <AlbumCard key={album._id} album={album} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
