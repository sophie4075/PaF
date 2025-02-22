/** @type {import('tailwindcss').Config} */
const { join } = require('path');
module.exports = {
  content: [
    "./src/**/*.{html,ts,css,scss}",
    join(__dirname, 'src/**/*.{html,ts,css,scss}')
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

