import client from './client';

export const youtubeImportAPI = {
  // Check if dependencies are installed
  checkDependencies: async () => {
    const response = await client.get('/youtube-import/check-dependencies');
    return response.data;
  },

  // Validate YouTube URL
  validateUrl: async (url) => {
    const response = await client.post('/youtube-import/validate', { url });
    return response.data;
  },

  // Fetch metadata from YouTube
  fetchMetadata: async (url) => {
    const response = await client.post('/youtube-import/metadata', { url });
    return response.data;
  },

  // Get playlist/channel videos
  getPlaylistVideos: async (url) => {
    const response = await client.post('/youtube-import/playlist-videos', { url });
    return response.data;
  },

  // Import single video
  importVideo: async (url, settings) => {
    const response = await client.post('/youtube-import/import', {
      url,
      ...settings
    });
    return response.data;
  },

  // Get all import jobs
  getAllJobs: async (page = 1, limit = 20) => {
    const response = await client.get(`/youtube-import/jobs?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get job status
  getJobStatus: async (jobId) => {
    const response = await client.get(`/youtube-import/status/${jobId}`);
    return response.data;
  },

  // Cancel import job
  cancelJob: async (jobId) => {
    const response = await client.delete(`/youtube-import/cancel/${jobId}`);
    return response.data;
  },
};
