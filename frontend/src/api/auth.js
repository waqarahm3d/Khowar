import client from './client';

export const authAPI = {
  // Register new user
  register: async (data) => {
    const response = await client.post('/auth/register', data);
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await client.post('/auth/login', credentials);
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await client.get('/auth/me');
    return response.data;
  },

  // Update profile
  updateProfile: async (data) => {
    const response = await client.put('/auth/update-profile', data);
    return response.data;
  },

  // Update password
  updatePassword: async (data) => {
    const response = await client.put('/auth/update-password', data);
    return response.data;
  },

  // Request OTP
  requestOTP: async (email) => {
    const response = await client.post('/auth/request-otp', { email });
    return response.data;
  },

  // Login with OTP
  loginWithOTP: async (data) => {
    const response = await client.post('/auth/login-otp', data);
    return response.data;
  },

  // Get play history
  getPlayHistory: async (limit = 50) => {
    const response = await client.get(`/users/play-history?limit=${limit}`);
    return response.data;
  },
};
