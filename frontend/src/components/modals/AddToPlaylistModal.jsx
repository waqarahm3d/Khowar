import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { playlistsAPI } from '../../api/playlists';

export default function AddToPlaylistModal({ song, onClose }) {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  // Fetch user's playlists
  const { data: playlistsData, isLoading } = useQuery({
    queryKey: ['playlists', 'my'],
    queryFn: playlistsAPI.getMy,
  });

  // Create playlist mutation
  const createPlaylistMutation = useMutation({
    mutationFn: (name) => playlistsAPI.create({ name, description: '', isPublic: false }),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['playlists', 'my']);
      toast.success('Playlist created!');
      setNewPlaylistName('');
      setShowCreateForm(false);
      // Auto-add song to new playlist
      addToPlaylistMutation.mutate(data.data._id);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create playlist');
    },
  });

  // Add to playlist mutation
  const addToPlaylistMutation = useMutation({
    mutationFn: (playlistId) => playlistsAPI.addSong(playlistId, song._id || song.id),
    onSuccess: () => {
      toast.success('Added to playlist!');
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add to playlist');
    },
  });

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      createPlaylistMutation.mutate(newPlaylistName.trim());
    }
  };

  const handleAddToPlaylist = (playlistId) => {
    addToPlaylistMutation.mutate(playlistId);
  };

  const playlists = playlistsData?.data || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-spotify-elevated rounded-lg w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-spotify-hover">
          <h2 className="text-xl font-bold text-spotify-text">Add to playlist</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-spotify-hover transition"
          >
            <XMarkIcon className="w-5 h-5 text-spotify-text" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Create new playlist button */}
          {!showCreateForm ? (
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-spotify-hover hover:bg-spotify-black hover:bg-opacity-50 transition mb-4"
            >
              <div className="w-12 h-12 bg-spotify-text-gray rounded flex items-center justify-center">
                <PlusIcon className="w-6 h-6 text-spotify-text" />
              </div>
              <span className="text-spotify-text font-medium">Create new playlist</span>
            </button>
          ) : (
            <form onSubmit={handleCreatePlaylist} className="mb-4">
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Playlist name"
                autoFocus
                className="w-full px-4 py-3 bg-spotify-hover border border-spotify-text-gray rounded-lg text-spotify-text placeholder-spotify-text-subdued focus:outline-none focus:ring-2 focus:ring-primary mb-2"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!newPlaylistName.trim() || createPlaylistMutation.isLoading}
                  className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-full font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createPlaylistMutation.isLoading ? 'Creating...' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewPlaylistName('');
                  }}
                  className="px-4 py-2 bg-spotify-hover hover:bg-spotify-black hover:bg-opacity-50 text-spotify-text rounded-full font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Playlists list */}
          {isLoading ? (
            <div className="text-center py-8 text-spotify-text-subdued">
              Loading playlists...
            </div>
          ) : playlists.length === 0 ? (
            <div className="text-center py-8 text-spotify-text-subdued">
              No playlists yet. Create one above!
            </div>
          ) : (
            <div className="space-y-2">
              {playlists.map((playlist) => (
                <button
                  key={playlist._id}
                  onClick={() => handleAddToPlaylist(playlist._id)}
                  disabled={addToPlaylistMutation.isLoading}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-spotify-hover transition text-left disabled:opacity-50"
                >
                  <div className="w-12 h-12 bg-spotify-hover rounded flex items-center justify-center">
                    <span className="text-2xl">🎵</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-spotify-text font-medium truncate">
                      {playlist.name}
                    </div>
                    <div className="text-sm text-spotify-text-subdued">
                      {playlist.songs?.length || 0} songs
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
