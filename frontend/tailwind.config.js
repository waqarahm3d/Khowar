/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#fc5421', // Voice of Chitral primary color
        'primary-dark': '#e34819',
        'primary-light': '#fd6f43',
      },
    },
  },
  plugins: [],
}
