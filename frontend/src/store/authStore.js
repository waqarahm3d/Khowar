import { create } from 'zustand';
import Cookies from 'js-cookie';
import { AUTH_TOKEN_KEY } from '../utils/constants';
import { authAPI } from '../api/auth';

const useAuthStore = create((set, get) => ({
  user: null,
  token: Cookies.get(AUTH_TOKEN_KEY) || null,
  isAuthenticated: !!Cookies.get(AUTH_TOKEN_KEY),
  isLoading: false,
  error: null,

  // Set user
  setUser: (user) => set({ user, isAuthenticated: !!user }),

  // Set token
  setToken: (token) => {
    if (token) {
      Cookies.set(AUTH_TOKEN_KEY, token, { expires: 7 });
      set({ token, isAuthenticated: true });
    } else {
      Cookies.remove(AUTH_TOKEN_KEY);
      set({ token: null, isAuthenticated: false });
    }
  },

  // Login
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authAPI.login(credentials);
      get().setToken(data.token);
      set({ user: data.data, isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Login failed', isLoading: false });
      throw error;
    }
  },

  // Register
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authAPI.register(userData);
      get().setToken(data.token);
      set({ user: data.data, isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Registration failed', isLoading: false });
      throw error;
    }
  },

  // Fetch current user
  fetchUser: async () => {
    if (!get().token) return;

    set({ isLoading: true });
    try {
      const data = await authAPI.getMe();
      set({ user: data.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      // If fetch fails, logout
      get().logout();
    }
  },

  // Logout
  logout: () => {
    get().setToken(null);
    set({ user: null, isAuthenticated: false });
  },

  // Update profile
  updateProfile: async (data) => {
    try {
      const response = await authAPI.updateProfile(data);
      set({ user: response.data });
      return response;
    } catch (error) {
      throw error;
    }
  },
}));

export default useAuthStore;
