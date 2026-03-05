/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F97316',
          dark: '#EA580C',
          light: '#FDBA74'
        },
        accent: {
          DEFAULT: '#8B5CF6',
          light: '#C4B5FD'
        },
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6'
      }
    }
  },
  plugins: []
}
