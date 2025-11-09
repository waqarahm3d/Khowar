import client from './client';

export const albumsAPI = {
  // Get all albums
  getAll: async (params) => {
    const response = await client.get('/albums', { params });
    return response.data;
  },

  // Get album by ID
  getById: async (id) => {
    const response = await client.get(`/albums/${id}`);
    return response.data;
  },

  // Get album songs
  getSongs: async (id) => {
    const response = await client.get(`/albums/${id}/songs`);
    return response.data;
  },
};
