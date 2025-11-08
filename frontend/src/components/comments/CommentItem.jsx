import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HeartIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';
import { commentsAPI } from '../../api/comments';
import useAuthStore from '../../store/authStore';

export default function CommentItem({ comment, songId }) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const isLiked = user && comment.likes?.includes(user._id);
  const isOwner = user && comment.user?._id === user._id;

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: () => isLiked ? commentsAPI.unlikeComment(comment._id) : commentsAPI.likeComment(comment._id),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', songId]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update like');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => commentsAPI.deleteComment(comment._id),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', songId]);
      toast.success('Comment deleted');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    },
  });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      setIsDeleting(true);
      deleteMutation.mutate();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
      <div className="flex items-start gap-3">
        {/* User Avatar */}
        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-semibold text-sm">
            {comment.user?.displayName?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-sm">
                {comment.user?.displayName || 'Unknown User'}
              </span>
              <span className="text-gray-500 text-xs">
                {formatDate(comment.createdAt)}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Like Button */}
              <button
                onClick={() => likeMutation.mutate()}
                disabled={likeMutation.isPending}
                className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                {isLiked ? (
                  <HeartSolidIcon className="w-4 h-4 text-red-500" />
                ) : (
                  <HeartIcon className="w-4 h-4" />
                )}
                <span className="text-xs">{comment.likes?.length || 0}</span>
              </button>

              {/* Delete Button (only for owner) */}
              {isOwner && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting || deleteMutation.isPending}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Delete comment"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Comment Text */}
          <p className="text-gray-300 text-sm break-words">{comment.text}</p>

          {/* Edited indicator */}
          {comment.updatedAt && new Date(comment.updatedAt) > new Date(comment.createdAt) && (
            <span className="text-gray-500 text-xs italic mt-1 inline-block">(edited)</span>
          )}
        </div>
      </div>
    </div>
  );
}
