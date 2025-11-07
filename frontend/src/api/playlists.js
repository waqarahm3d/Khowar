import client from './client';

export const playlistsAPI = {
  // Get all playlists
  getAll: async (params) => {
    const response = await client.get('/playlists', { params });
    return response.data;
  },

  // Get my playlists
  getMy: async () => {
    const response = await client.get('/playlists/my');
    return response.data;
  },

  // Get playlist by ID
  getById: async (id) => {
    const response = await client.get(`/playlists/${id}`);
    return response.data;
  },

  // Create playlist
  create: async (data) => {
    const response = await client.post('/playlists', data);
    return response.data;
  },

  // Update playlist
  update: async (id, data) => {
    const response = await client.put(`/playlists/${id}`, data);
    return response.data;
  },

  // Delete playlist
  delete: async (id) => {
    const response = await client.delete(`/playlists/${id}`);
    return response.data;
  },

  // Add song to playlist
  addSong: async (id, songId) => {
    const response = await client.post(`/playlists/${id}/songs`, { songId });
    return response.data;
  },

  // Remove song from playlist
  removeSong: async (id, songId) => {
    const response = await client.delete(`/playlists/${id}/songs/${songId}`);
    return response.data;
  },

  // Follow playlist
  follow: async (id) => {
    const response = await client.post(`/playlists/${id}/follow`);
    return response.data;
  },

  // Unfollow playlist
  unfollow: async (id) => {
    const response = await client.delete(`/playlists/${id}/follow`);
    return response.data;
  },
};
