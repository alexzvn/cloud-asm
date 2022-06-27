/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.html',
    './src/**/*.js',
    './views/**/*.hbs',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
}
