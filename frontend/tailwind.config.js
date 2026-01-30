/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: '#12adbf',
        green: '#25e377',
        navy: '#00343f',
        'card-bg': '#f4fdfc',
        'input-section-bg': '#e8f8f6',
        'input-border': '#5fc4d4',
      },
      borderRadius: {
        'DEFAULT': '12px',
      },
    },
  },
  plugins: [],
}

