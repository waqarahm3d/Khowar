import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PencilIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { playlistsAPI } from '../api/playlists';
import SongList from '../components/library/SongList';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import EditPlaylistModal from '../components/modals/EditPlaylistModal';
import useAuthStore from '../store/authStore';
import usePlayerStore from '../store/playerStore';
import useQueueStore from '../store/queueStore';

export default function Playlist() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
  const { playSong } = usePlayerStore();
  const { setQueue } = useQueueStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: playlist, isLoading } = useQuery({
    queryKey: ['playlist', id],
    queryFn: () => playlistsAPI.getById(id),
  });

  const followMutation = useMutation({
    mutationFn: () => playlistsAPI.follow(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['playlist', id]);
      toast.success('Following playlist');
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => playlistsAPI.unfollow(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['playlist', id]);
      toast.success('Unfollowed playlist');
    },
  });

  const handlePlaySong = (song, songs) => {
    const songList = songs || [song];
    setQueue(songList, songList.findIndex(s => s._id === song._id));
    playSong(song);
  };

  const handlePlayAll = () => {
    if (playlist?.data?.songs && playlist.data.songs.length > 0) {
      setQueue(playlist.data.songs, 0);
      playSong(playlist.data.songs[0]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  const playlistData = playlist?.data;
  const isOwner = user?._id === playlistData?.creator?._id;
  const isFollowing = user?.followedPlaylists?.includes(id);

  return (
    <div className="pb-32 md:pb-24">
      <div className="bg-gradient-to-b from-blue-800 to-black px-4 md:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 max-w-7xl">
          <div className="w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg shadow-2xl flex items-center justify-center">
            <span className="text-8xl">🎵</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white mb-2">PLAYLIST</p>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {playlistData?.name}
            </h1>
            <p className="text-gray-300 mb-2">{playlistData?.description}</p>
            <div className="flex items-center gap-2 text-white">
              <span className="font-semibold">{playlistData?.creator?.displayName}</span>
              <span>•</span>
              <span>{playlistData?.songs?.length} songs</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 py-6 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Button
            onClick={handlePlayAll}
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-full"
          >
            Play
          </Button>
          {isAuthenticated && !isOwner && (
            <Button
              onClick={() => isFollowing ? unfollowMutation.mutate() : followMutation.mutate()}
              className="border-2 border-white/20 hover:border-white/40 text-white font-semibold px-8 py-3 rounded-full"
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          )}
          {isAuthenticated && isOwner && (
            <Button
              onClick={() => setIsEditModalOpen(true)}
              className="border-2 border-white/20 hover:border-white/40 text-white font-semibold px-4 py-3 rounded-full flex items-center gap-2"
            >
              <PencilIcon className="w-5 h-5" />
              Edit
            </Button>
          )}
        </div>
      </div>

      <div className="px-4 md:px-8 py-6">
        {playlistData?.songs && playlistData.songs.length > 0 ? (
          <SongList songs={playlistData.songs} onPlay={handlePlaySong} />
        ) : (
          <p className="text-gray-400 text-center py-12">No songs in this playlist</p>
        )}
      </div>

      {/* Edit Playlist Modal */}
      {isOwner && (
        <EditPlaylistModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          playlist={playlistData}
        />
      )}
    </div>
  );
}
