import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import { searchAPI } from '../api/search';
import SongCard from '../components/library/SongCard';
import SongList from '../components/library/SongList';
import ArtistCard from '../components/library/ArtistCard';
import AlbumCard from '../components/library/AlbumCard';
import PlaylistCard from '../components/library/PlaylistCard';
import Loading from '../components/common/Loading';
import usePlayerStore from '../store/playerStore';
import useQueueStore from '../store/queueStore';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [searchInput, setSearchInput] = useState(query);
  const [activeTab, setActiveTab] = useState('all');

  const { playSong } = usePlayerStore();
  const { setQueue } = useQueueStore();

  // Search query
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchAPI.search(query),
    enabled: query.length > 0,
  });

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      setSearchInput(q);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setQuery(searchInput.trim());
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const handlePlaySong = (song, songs) => {
    const songList = songs || [song];
    setQueue(songList, songList.findIndex(s => s._id === song._id));
    playSong(song);
  };

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'songs', label: 'Songs' },
    { id: 'artists', label: 'Artists' },
    { id: 'albums', label: 'Albums' },
    { id: 'playlists', label: 'Playlists' },
  ];

  const songs = searchResults?.data?.songs || [];
  const artists = searchResults?.data?.artists || [];
  const albums = searchResults?.data?.albums || [];
  const playlists = searchResults?.data?.playlists || [];

  return (
    <div className="px-4 md:px-8 py-6 pb-32 md:pb-24">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-spotify-text mb-6">Search</h1>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="max-w-2xl">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-spotify-text-subdued" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for songs, artists, albums..."
              className="w-full pl-14 pr-4 py-4 bg-spotify-elevated border border-spotify-text-gray rounded-full text-spotify-text placeholder-spotify-text-subdued focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </form>
      </div>

      {/* Results */}
      {query && (
        <>
          {/* Tabs */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-spotify-text text-spotify-black'
                    : 'bg-spotify-elevated text-spotify-text hover:bg-spotify-hover'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loading />
            </div>
          ) : (
            <>
              {/* All Results */}
              {activeTab === 'all' && (
                <div className="space-y-12">
                  {/* Top Result */}
                  {(songs[0] || artists[0] || albums[0]) && (
                    <section>
                      <h2 className="text-2xl font-bold text-spotify-text mb-4">Top Result</h2>
                      <div className="bg-spotify-elevated rounded-lg p-6 hover:bg-spotify-hover transition-colors cursor-pointer">
                        {songs[0] && (
                          <div onClick={() => handlePlaySong(songs[0], songs)}>
                            <img
                              src={songs[0].coverImage}
                              alt={songs[0].title}
                              className="w-24 h-24 rounded-lg mb-4"
                            />
                            <h3 className="text-3xl font-bold text-spotify-text mb-2">{songs[0].title}</h3>
                            <p className="text-spotify-text-subdued">Song • {songs[0].artist?.name}</p>
                          </div>
                        )}
                        {!songs[0] && artists[0] && (
                          <a href={`/artist/${artists[0]._id}`}>
                            <img
                              src={artists[0].profileImage}
                              alt={artists[0].name}
                              className="w-24 h-24 rounded-full mb-4"
                            />
                            <h3 className="text-3xl font-bold text-spotify-text mb-2">{artists[0].name}</h3>
                            <p className="text-spotify-text-subdued">Artist</p>
                          </a>
                        )}
                        {!songs[0] && !artists[0] && albums[0] && (
                          <a href={`/album/${albums[0]._id}`}>
                            <img
                              src={albums[0].coverImage}
                              alt={albums[0].title}
                              className="w-24 h-24 rounded-lg mb-4"
                            />
                            <h3 className="text-3xl font-bold text-spotify-text mb-2">{albums[0].title}</h3>
                            <p className="text-spotify-text-subdued">Album • {albums[0].artist?.name}</p>
                          </a>
                        )}
                      </div>
                    </section>
                  )}

                  {/* Songs */}
                  {songs.length > 0 && (
                    <section>
                      <h2 className="text-2xl font-bold text-spotify-text mb-4">Songs</h2>
                      <SongList songs={songs.slice(0, 5)} onPlay={handlePlaySong} />
                    </section>
                  )}

                  {/* Artists */}
                  {artists.length > 0 && (
                    <section>
                      <h2 className="text-2xl font-bold text-spotify-text mb-4">Artists</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {artists.slice(0, 6).map((artist) => (
                          <ArtistCard key={artist._id} artist={artist} />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Albums */}
                  {albums.length > 0 && (
                    <section>
                      <h2 className="text-2xl font-bold text-spotify-text mb-4">Albums</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {albums.slice(0, 6).map((album) => (
                          <AlbumCard key={album._id} album={album} />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Playlists */}
                  {playlists.length > 0 && (
                    <section>
                      <h2 className="text-2xl font-bold text-spotify-text mb-4">Playlists</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {playlists.slice(0, 6).map((playlist) => (
                          <PlaylistCard key={playlist._id} playlist={playlist} />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* No Results */}
                  {songs.length === 0 && artists.length === 0 && albums.length === 0 && playlists.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-spotify-text-subdued text-lg">No results found for "{query}"</p>
                    </div>
                  )}
                </div>
              )}

              {/* Songs Only */}
              {activeTab === 'songs' && (
                <section>
                  {songs.length > 0 ? (
                    <SongList songs={songs} onPlay={handlePlaySong} />
                  ) : (
                    <p className="text-spotify-text-subdued text-center py-12">No songs found</p>
                  )}
                </section>
              )}

              {/* Artists Only */}
              {activeTab === 'artists' && (
                <section>
                  {artists.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                      {artists.map((artist) => (
                        <ArtistCard key={artist._id} artist={artist} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-spotify-text-subdued text-center py-12">No artists found</p>
                  )}
                </section>
              )}

              {/* Albums Only */}
              {activeTab === 'albums' && (
                <section>
                  {albums.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                      {albums.map((album) => (
                        <AlbumCard key={album._id} album={album} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-spotify-text-subdued text-center py-12">No albums found</p>
                  )}
                </section>
              )}

              {/* Playlists Only */}
              {activeTab === 'playlists' && (
                <section>
                  {playlists.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                      {playlists.map((playlist) => (
                        <PlaylistCard key={playlist._id} playlist={playlist} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-spotify-text-subdued text-center py-12">No playlists found</p>
                  )}
                </section>
              )}
            </>
          )}
        </>
      )}

      {/* Browse Categories (when no search) */}
      {!query && (
        <div>
          <h2 className="text-2xl font-bold text-spotify-text mb-6">Browse Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: 'Folk Music', color: 'bg-green-600', href: '/browse/folk' },
              { name: 'Traditional', color: 'bg-blue-600', href: '/browse/traditional' },
              { name: 'Modern', color: 'bg-purple-600', href: '/browse/modern' },
              { name: 'Instrumental', color: 'bg-orange-600', href: '/browse/instrumental' },
              { name: 'Vocals', color: 'bg-pink-600', href: '/browse/vocals' },
              { name: 'Fusion', color: 'bg-yellow-600', href: '/browse/fusion' },
            ].map((category) => (
              <a
                key={category.name}
                href={category.href}
                className={`${category.color} rounded-lg p-6 hover:opacity-90 transition-opacity`}
              >
                <h3 className="text-white font-bold text-lg">{category.name}</h3>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
