/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0f0c07',
        surface: '#1a1308',
        border: '#3a2510',
        gold: '#c8a84b',
        'gold-dim': '#8a6a35',
        parchment: '#e8d5a3',
        'red-stick': '#c0321a',
        'yellow-stick': '#c8980a',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
