/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      container: {
        center: true,
      },
      colors: {
        primary: '#081735',
        secondary: '#6463EB',
      },
    },
  },
  plugins: [],
}

