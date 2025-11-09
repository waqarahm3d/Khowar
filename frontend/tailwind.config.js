/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Spotify color scheme
        primary: '#1DB954', // Spotify green
        'primary-dark': '#1AA34A',
        'primary-light': '#1ED760',
        'spotify-green': '#1DB954',
        'spotify-black': '#000000',
        'spotify-bg': '#121212',
        'spotify-elevated': '#181818',
        'spotify-highlight': '#1F1F1F',
        'spotify-hover': '#282828',
        'spotify-text': '#FFFFFF',
        'spotify-text-subdued': '#B3B3B3',
        'spotify-text-gray': '#6A6A6A',
      },
    },
  },
  plugins: [],
}
