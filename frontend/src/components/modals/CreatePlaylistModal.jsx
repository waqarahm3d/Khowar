import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { playlistsAPI } from '../../api/playlists';
import { toast } from 'react-hot-toast';
import Button from '../common/Button';
import Input from '../common/Input';

export default function CreatePlaylistModal({ isOpen, onClose }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: true,
  });

  const createMutation = useMutation({
    mutationFn: playlistsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['playlists']);
      toast.success('Playlist created successfully!');
      onClose();
      setFormData({ name: '', description: '', isPublic: true });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create playlist');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please enter a playlist name');
      return;
    }
    createMutation.mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-spotify-elevated rounded-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-spotify-text">Create Playlist</h2>
          <button
            onClick={onClose}
            className="text-spotify-text-subdued hover:text-spotify-text transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-spotify-text mb-2">
              Name *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="My Awesome Playlist"
              className="bg-spotify-highlight border-spotify-text-gray text-spotify-text placeholder-spotify-text-subdued"
              maxLength={100}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-spotify-text mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add a description..."
              rows={3}
              className="w-full px-4 py-2 bg-spotify-highlight border border-spotify-text-gray rounded-lg text-spotify-text placeholder-spotify-text-subdued focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={300}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className="w-4 h-4 text-primary bg-spotify-highlight border-spotify-text-gray rounded focus:ring-primary"
            />
            <label htmlFor="isPublic" className="ml-2 text-sm text-spotify-text">
              Make this playlist public
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-spotify-hover hover:bg-spotify-text-gray text-spotify-text font-semibold py-3 rounded-lg transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 bg-primary hover:bg-primary-light text-black font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {createMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
