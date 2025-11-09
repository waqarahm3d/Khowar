import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create axios instance with auth
const api = axios.create({
  baseURL: `${API_URL}/albums`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const albumsAPI = {
  getAll: async () => {
    const response = await api.get('/');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  create: async (albumData) => {
    const response = await api.post('/', albumData);
    return response.data;
  },

  update: async (id, albumData) => {
    const response = await api.put(`/${id}`, albumData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/${id}`);
    return response.data;
  },

  uploadCover: async (id, coverFile) => {
    const formData = new FormData();
    formData.append('cover', coverFile);

    const response = await api.post(`/${id}/cover`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default albumsAPI;
