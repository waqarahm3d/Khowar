import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';
import { artistsAPI } from '../api/artists';
import SongList from '../components/library/SongList';
import AlbumCard from '../components/library/AlbumCard';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import useAuthStore from '../store/authStore';
import usePlayerStore from '../store/playerStore';
import useQueueStore from '../store/queueStore';

export default function Artist() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
  const { playSong } = usePlayerStore();
  const { setQueue } = useQueueStore();

  // Fetch artist data
  const { data: artist, isLoading: loadingArtist } = useQuery({
    queryKey: ['artist', id],
    queryFn: () => artistsAPI.getById(id),
  });

  // Fetch artist songs
  const { data: songs, isLoading: loadingSongs } = useQuery({
    queryKey: ['artist', id, 'songs'],
    queryFn: () => artistsAPI.getSongs(id),
  });

  // Fetch artist albums
  const { data: albums, isLoading: loadingAlbums } = useQuery({
    queryKey: ['artist', id, 'albums'],
    queryFn: () => artistsAPI.getAlbums(id),
  });

  // Follow/unfollow mutation
  const followMutation = useMutation({
    mutationFn: () => artistsAPI.follow(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['artist', id]);
      toast.success('Following artist');
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => artistsAPI.unfollow(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['artist', id]);
      toast.success('Unfollowed artist');
    },
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

  const isFollowing = user?.followedArtists?.includes(id);

  if (loadingArtist) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  const artistData = artist?.data;

  return (
    <div className="pb-32 md:pb-24">
      {/* Hero Section */}
      <div
        className="relative h-80 md:h-96 bg-gradient-to-b from-primary to-spotify-bg"
        style={{
          backgroundImage: artistData?.profileImage ? `linear-gradient(to bottom, rgba(18,18,18,0.4), rgba(18,18,18,0.9)), url(${artistData.profileImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 pb-6">
          <div className="flex items-end gap-6">
            {artistData?.profileImage && (
              <img
                src={artistData.profileImage}
                alt={artistData.name}
                className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-spotify-black shadow-2xl"
              />
            )}
            <div className="flex-1">
              <p className="text-sm font-semibold text-spotify-text mb-2">ARTIST</p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-spotify-text mb-4 flex items-center gap-3">
                {artistData?.name}
                {artistData?.verified && (
                  <CheckBadgeIcon className="w-8 h-8 md:w-12 md:h-12 text-primary" />
                )}
              </h1>
              <p className="text-spotify-text text-lg">
                {artistData?.followers?.toLocaleString() || 0} followers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 md:px-8 py-6 bg-spotify-bg/60 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Button
            onClick={handlePlayAll}
            className="bg-primary hover:bg-primary-light hover:scale-105 text-black font-bold px-8 py-3 rounded-full transform transition shadow-lg"
          >
            Play
          </Button>
          {isAuthenticated && (
            <Button
              onClick={() => isFollowing ? unfollowMutation.mutate() : followMutation.mutate()}
              className="border border-spotify-text-gray hover:border-spotify-text text-spotify-text font-semibold px-8 py-3 rounded-full transition"
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          )}
        </div>
      </div>

      <div className="px-4 md:px-8 py-6">
        {/* Bio */}
        {artistData?.bio && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-spotify-text mb-4">About</h2>
            <p className="text-spotify-text-subdued text-lg leading-relaxed max-w-4xl">{artistData.bio}</p>
          </div>
        )}

        {/* Popular Songs */}
        {songs?.data && songs.data.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-spotify-text mb-6">Popular</h2>
            <SongList songs={songs.data.slice(0, 10)} onPlay={handlePlaySong} />
          </section>
        )}

        {/* Albums */}
        {albums?.data && albums.data.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-spotify-text mb-6">Albums</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {albums.data.map((album) => (
                <AlbumCard key={album._id} album={album} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
