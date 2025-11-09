import client from './client';

export const artistsAPI = {
  // Get all artists
  getAll: async (params) => {
    const response = await client.get('/artists', { params });
    return response.data;
  },

  // Get artist by ID
  getById: async (id) => {
    const response = await client.get(`/artists/${id}`);
    return response.data;
  },

  // Get artist songs
  getSongs: async (id) => {
    const response = await client.get(`/artists/${id}/songs`);
    return response.data;
  },

  // Get artist albums
  getAlbums: async (id) => {
    const response = await client.get(`/artists/${id}/albums`);
    return response.data;
  },

  // Follow artist
  follow: async (id) => {
    const response = await client.post(`/artists/${id}/follow`);
    return response.data;
  },

  // Unfollow artist
  unfollow: async (id) => {
    const response = await client.delete(`/artists/${id}/follow`);
    return response.data;
  },
};
