import { useQuery } from '@tanstack/react-query';
import { artistsAPI } from '../api/artists';
import ArtistCard from '../components/library/ArtistCard';
import Loading from '../components/common/Loading';

export default function Artists() {
  const { data: artistsData, isLoading } = useQuery({
    queryKey: ['artists', 'all'],
    queryFn: () => artistsAPI.getAll({ limit: 100 }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  const artists = artistsData?.data || [];

  return (
    <div className="px-4 md:px-8 py-6 pb-32 md:pb-24">
      <h1 className="text-3xl md:text-4xl font-bold text-spotify-text mb-8">All Artists</h1>

      {artists.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {artists.map((artist) => (
            <ArtistCard key={artist._id} artist={artist} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-spotify-text-subdued text-lg">No artists found</p>
        </div>
      )}
    </div>
  );
}
