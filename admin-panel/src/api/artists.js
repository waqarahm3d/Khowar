import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create axios instance with auth
const api = axios.create({
  baseURL: `${API_URL}/artists`,
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

export const artistsAPI = {
  getAll: async () => {
    const response = await api.get('/');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  create: async (artistData) => {
    const response = await api.post('/', artistData);
    return response.data;
  },

  update: async (id, artistData) => {
    const response = await api.put(`/${id}`, artistData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/${id}`);
    return response.data;
  },

  uploadImage: async (id, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await api.post(`/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default artistsAPI;
