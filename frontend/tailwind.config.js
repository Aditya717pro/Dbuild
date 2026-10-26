/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        college: {
          primary: '#0b3d91',
          primaryHover: '#092f73',
          accent: '#1f7a8c',
          surface: '#f8fafc',
        },
      },
    },
  },
  plugins: [],
};
