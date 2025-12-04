/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yonsei: {
          blue: '#003876',
          gold: '#B39659',
          light: '#F4F7FB'
        }
      }
    },
  },
  plugins: [],
}

