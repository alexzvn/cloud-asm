/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.html',
    './src/**/*.js',
    './src/**/*.hbs',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
}
