import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { playlistsAPI } from '../../api/playlists';
import { toast } from 'react-hot-toast';
import Button from '../common/Button';
import Input from '../common/Input';

export default function EditPlaylistModal({ isOpen, onClose, playlist }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: true,
  });

  useEffect(() => {
    if (playlist) {
      setFormData({
        name: playlist.name || '',
        description: playlist.description || '',
        isPublic: playlist.isPublic !== false,
      });
    }
  }, [playlist]);

  const updateMutation = useMutation({
    mutationFn: (data) => playlistsAPI.update(playlist._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['playlists']);
      queryClient.invalidateQueries(['playlist', playlist._id]);
      toast.success('Playlist updated successfully!');
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update playlist');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => playlistsAPI.delete(playlist._id),
    onSuccess: () => {
      queryClient.invalidateQueries(['playlists']);
      toast.success('Playlist deleted successfully!');
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete playlist');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please enter a playlist name');
      return;
    }
    updateMutation.mutate(formData);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this playlist? This action cannot be undone.')) {
      deleteMutation.mutate();
    }
  };

  if (!isOpen || !playlist) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Edit Playlist</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Name *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="My Awesome Playlist"
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              maxLength={100}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add a description..."
              rows={3}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              maxLength={300}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className="w-4 h-4 text-primary-600 bg-white/10 border-white/20 rounded focus:ring-primary-500"
            />
            <label htmlFor="isPublic" className="ml-2 text-sm text-white">
              Make this playlist public
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>

        {/* Delete Button */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <Button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete Playlist'}
          </Button>
        </div>
      </div>
    </div>
  );
}
