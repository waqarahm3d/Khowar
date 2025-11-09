import client from './client';

export const commentsAPI = {
  // Get comments for a song
  getComments: async (songId) => {
    const response = await client.get(`/songs/${songId}/comments`);
    return response.data;
  },

  // Create a comment
  createComment: async (songId, data) => {
    const response = await client.post(`/songs/${songId}/comments`, data);
    return response.data;
  },

  // Get replies for a comment
  getReplies: async (commentId) => {
    const response = await client.get(`/comments/${commentId}/replies`);
    return response.data;
  },

  // Update a comment
  updateComment: async (commentId, data) => {
    const response = await client.put(`/comments/${commentId}`, data);
    return response.data;
  },

  // Delete a comment
  deleteComment: async (commentId) => {
    const response = await client.delete(`/comments/${commentId}`);
    return response.data;
  },

  // Like a comment
  likeComment: async (commentId) => {
    const response = await client.post(`/comments/${commentId}/like`);
    return response.data;
  },

  // Unlike a comment
  unlikeComment: async (commentId) => {
    const response = await client.delete(`/comments/${commentId}/like`);
    return response.data;
  },
};
