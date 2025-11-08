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

export default function Home() {
  const { playSong } = usePlayerStore();
  const { setQueue } = useQueueStore();

  // Fetch trending songs
  const { data: trendingSongs, isLoading: loadingTrending } = useQuery({
    queryKey: ['songs', 'trending'],
    queryFn: songsAPI.getTrending,
  });

  // Fetch recent songs
  const { data: recentSongs, isLoading: loadingRecent } = useQuery({
    queryKey: ['songs', 'recent'],
    queryFn: () => songsAPI.getAll({ limit: 10, sort: '-createdAt' }),
  });

  // Fetch popular artists
  const { data: popularArtists, isLoading: loadingArtists } = useQuery({
    queryKey: ['artists', 'popular'],
    queryFn: () => artistsAPI.getAll({ limit: 8, sort: '-followers' }),
  });

  // Fetch recent albums
  const { data: recentAlbums, isLoading: loadingAlbums } = useQuery({
    queryKey: ['albums', 'recent'],
    queryFn: () => albumsAPI.getAll({ limit: 8, sort: '-createdAt' }),
  });

  const handlePlaySong = (song, songs) => {
    const songList = songs || [song];
    setQueue(songList, songList.findIndex(s => s._id === song._id));
    playSong(song);
  };

  const isLoading = loadingTrending || loadingRecent || loadingArtists || loadingAlbums;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-6 pb-32 md:pb-24">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Welcome to Voice of Chitral
        </h1>
        <p className="text-xl text-gray-300">
          Discover the rich musical heritage of Chitral
        </p>
      </div>

      {/* Trending Songs */}
      {trendingSongs?.data && trendingSongs.data.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Trending Now</h2>
            <a
              href="/browse/trending"
              className="text-primary-400 hover:text-primary-300 font-semibold"
            >
              See all
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {trendingSongs.data.slice(0, 10).map((song) => (
              <SongCard
                key={song._id}
                song={song}
                onPlay={() => handlePlaySong(song, trendingSongs.data)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Popular Artists */}
      {popularArtists?.data && popularArtists.data.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Popular Artists</h2>
            <a
              href="/artists"
              className="text-primary-400 hover:text-primary-300 font-semibold"
            >
              See all
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {popularArtists.data.slice(0, 6).map((artist) => (
              <ArtistCard key={artist._id} artist={artist} />
            ))}
          </div>
        </section>
      )}

      {/* New Releases */}
      {recentSongs?.data && recentSongs.data.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">New Releases</h2>
            <a
              href="/browse/new-releases"
              className="text-primary-400 hover:text-primary-300 font-semibold"
            >
              See all
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {recentSongs.data.slice(0, 10).map((song) => (
              <SongCard
                key={song._id}
                song={song}
                onPlay={() => handlePlaySong(song, recentSongs.data)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recent Albums */}
      {recentAlbums?.data && recentAlbums.data.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Recent Albums</h2>
            <a
              href="/albums"
              className="text-primary-400 hover:text-primary-300 font-semibold"
            >
              See all
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {recentAlbums.data.slice(0, 6).map((album) => (
              <AlbumCard key={album._id} album={album} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
