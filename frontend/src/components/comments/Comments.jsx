import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { commentsAPI } from '../../api/comments';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import Loading from '../common/Loading';
import useAuthStore from '../../store/authStore';

export default function Comments({ songId }) {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const [showCommentForm, setShowCommentForm] = useState(false);

  // Fetch comments
  const { data: commentsData, isLoading } = useQuery({
    queryKey: ['comments', songId],
    queryFn: () => commentsAPI.getComments(songId),
    enabled: !!songId,
  });

  // Create comment mutation
  const createMutation = useMutation({
    mutationFn: (data) => commentsAPI.createComment(songId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', songId]);
      setShowCommentForm(false);
    },
  });

  const comments = commentsData?.data || [];

  if (isLoading) {
    return (
      <div className="py-4 flex justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <ChatBubbleLeftIcon className="w-6 h-6" />
          Comments ({comments.length})
        </h3>
        {isAuthenticated && !showCommentForm && (
          <button
            onClick={() => setShowCommentForm(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            Add Comment
          </button>
        )}
      </div>

      {/* Comment Form */}
      {showCommentForm && (
        <CommentForm
          onSubmit={(text) => createMutation.mutate({ text })}
          onCancel={() => setShowCommentForm(false)}
          isSubmitting={createMutation.isPending}
        />
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} songId={songId} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-white/5 rounded-lg">
          <ChatBubbleLeftIcon className="w-12 h-12 text-gray-600 mx-auto mb-2" />
          <p className="text-gray-400">No comments yet</p>
          <p className="text-gray-500 text-sm mt-1">Be the first to comment!</p>
        </div>
      )}
    </div>
  );
}
