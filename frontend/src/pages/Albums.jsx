import { useQuery } from '@tanstack/react-query';
import { albumsAPI } from '../api/albums';
import AlbumCard from '../components/library/AlbumCard';
import Loading from '../components/common/Loading';

export default function Albums() {
  const { data: albumsData, isLoading } = useQuery({
    queryKey: ['albums', 'all'],
    queryFn: () => albumsAPI.getAll({ limit: 100 }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  const albums = albumsData?.data || [];

  return (
    <div className="px-4 md:px-8 py-6 pb-32 md:pb-24">
      <h1 className="text-3xl md:text-4xl font-bold text-spotify-text mb-8">All Albums</h1>

      {albums.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {albums.map((album) => (
            <AlbumCard key={album._id} album={album} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-spotify-text-subdued text-lg">No albums found</p>
        </div>
      )}
    </div>
  );
}
