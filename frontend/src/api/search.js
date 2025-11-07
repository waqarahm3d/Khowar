import client from './client';

export const searchAPI = {
  // Search everything
  search: async (query) => {
    const response = await client.get('/search', { params: { q: query } });
    return response.data;
  },

  // Search songs only
  searchSongs: async (query) => {
    const response = await client.get('/search/songs', { params: { q: query } });
    return response.data;
  },

  // Search artists only
  searchArtists: async (query) => {
    const response = await client.get('/search/artists', { params: { q: query } });
    return response.data;
  },

  // Search albums only
  searchAlbums: async (query) => {
    const response = await client.get('/search/albums', { params: { q: query } });
    return response.data;
  },

  // Search playlists only
  searchPlaylists: async (query) => {
    const response = await client.get('/search/playlists', { params: { q: query } });
    return response.data;
  },
};
