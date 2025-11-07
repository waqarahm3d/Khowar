import client from './client';

export const songsAPI = {
  // Get all songs
  getAll: async (params) => {
    const response = await client.get('/songs', { params });
    return response.data;
  },

  // Get song by ID
  getById: async (id) => {
    const response = await client.get(`/songs/${id}`);
    return response.data;
  },

  // Like song
  like: async (id) => {
    const response = await client.post(`/songs/${id}/like`);
    return response.data;
  },

  // Unlike song
  unlike: async (id) => {
    const response = await client.delete(`/songs/${id}/like`);
    return response.data;
  },

  // Get song comments
  getComments: async (id) => {
    const response = await client.get(`/songs/${id}/comments`);
    return response.data;
  },

  // Add comment
  addComment: async (id, content) => {
    const response = await client.post(`/songs/${id}/comments`, { content });
    return response.data;
  },

  // Get trending songs
  getTrending: async () => {
    const response = await client.get('/songs/trending');
    return response.data;
  },

  // Get new releases
  getNewReleases: async () => {
    const response = await client.get('/songs/new-releases');
    return response.data;
  },

  // Get recommended songs
  getRecommended: async () => {
    const response = await client.get('/songs/recommended');
    return response.data;
  },

  // Track play
  trackPlay: async (id) => {
    const response = await client.post(`/songs/${id}/play`);
    return response.data;
  },
};
