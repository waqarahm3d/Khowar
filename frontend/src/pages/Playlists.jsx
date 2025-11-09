import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PlusCircleIcon, RectangleStackIcon } from '@heroicons/react/24/outline';
import { playlistsAPI } from '../api/playlists';
import PlaylistCard from '../components/library/PlaylistCard';
import Loading from '../components/common/Loading';
import CreatePlaylistModal from '../components/modals/CreatePlaylistModal';
import useAuthStore from '../store/authStore';
import { Navigate } from 'react-router-dom';

export default function Playlists() {
  const { isAuthenticated } = useAuthStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const { data: playlistsData, isLoading } = useQuery({
    queryKey: ['playlists', 'my'],
    queryFn: playlistsAPI.getMy,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  const playlists = playlistsData?.data || [];

  return (
    <div className="px-4 md:px-8 py-6 pb-32 md:pb-24">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-spotify-text">Your Playlists</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary-light text-black font-semibold px-6 py-3 rounded-full transition transform hover:scale-105"
        >
          <PlusCircleIcon className="w-5 h-5" />
          Create Playlist
        </button>
      </div>

      {playlists.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist._id} playlist={playlist} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <RectangleStackIcon className="w-16 h-16 text-spotify-text-subdued mx-auto mb-4" />
          <p className="text-spotify-text-subdued text-lg mb-4">No playlists yet</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-primary hover:bg-primary-light text-black font-semibold px-8 py-3 rounded-full transition transform hover:scale-105"
          >
            Create Your First Playlist
          </button>
        </div>
      )}

      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
