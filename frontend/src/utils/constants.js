export const APP_NAME = 'Voice of Chitral';

export const REPEAT_MODES = {
  OFF: 'off',
  ALL: 'all',
  ONE: 'one',
};

export const PLAYER_VOLUME_KEY = 'voc_player_volume';
export const AUTH_TOKEN_KEY = 'voc_auth_token';

export const DEFAULT_ALBUM_ART = '/placeholder-album.png';
export const DEFAULT_ARTIST_IMAGE = '/placeholder-artist.png';

export const GENRES = [
  'Pop',
  'Rock',
  'Hip Hop',
  'R&B',
  'Country',
  'Electronic',
  'Jazz',
  'Classical',
  'Folk',
  'Blues',
  'Reggae',
  'Metal',
  'Indie',
  'Soul',
  'Funk',
];

export const ROUTES = {
  HOME: '/',
  BROWSE: '/browse',
  SEARCH: '/search',
  LIBRARY: '/library',
  LOGIN: '/login',
  REGISTER: '/register',
  ARTIST: (id) => `/artist/${id}`,
  ALBUM: (id) => `/album/${id}`,
  PLAYLIST: (id) => `/playlist/${id}`,
};
