/**
 * Format seconds to mm:ss or hh:mm:ss
 */
export const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format duration in seconds to readable format
 */
export const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0 sec';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (hours > 0) parts.push(`${hours} hr`);
  if (minutes > 0) parts.push(`${minutes} min`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs} sec`);

  return parts.join(' ');
};

/**
 * Get file URL (handles both local and S3)
 */
export const getFileUrl = (path) => {
  if (!path) return null;

  // If it's already a full URL (S3), return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Local file - construct URL
  const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
  // Remove leading slash from path if it exists to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${baseUrl}/${cleanPath}`;
};

/**
 * Get audio stream URL
 */
export const getAudioUrl = (songId) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  // Ensure the URL is properly formatted (no trailing slash)
  const cleanApiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
  return `${cleanApiUrl}/songs/${songId}/stream`;
};
