import axios from 'axios';
import Cookies from 'js-cookie';
import { AUTH_TOKEN_KEY } from '../utils/constants';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
client.interceptors.request.use(
  (config) => {
    const token = Cookies.get(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const token = Cookies.get(AUTH_TOKEN_KEY);
      // Only redirect if user was actually logged in (had a token)
      // Don't redirect guests who get 401 from optional auth endpoints
      if (token) {
        Cookies.remove(AUTH_TOKEN_KEY);
        // Only redirect if not already on auth pages
        const authPages = ['/login', '/register'];
        if (!authPages.includes(window.location.pathname)) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default client;
