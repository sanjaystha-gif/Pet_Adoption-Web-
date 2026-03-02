/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FEF3F0',
          100: '#FBE8E1',
          200: '#F4A494',
          300: '#EF8B74',
          400: '#EA7862',
          500: '#E8705A',
          600: '#C45A45',
          700: '#A54538',
          800: '#86382D',
          900: '#6D2D23'
        },
        secondary: {
          50: '#FAF8F5',
          100: '#F5F0EB',
          200: '#E8DFD7',
          300: '#DCCEC3',
          400: '#C9B5A3',
          500: '#A89880',
          600: '#8B7B6E',
          700: '#7B3F2E',
          800: '#6B3428',
          900: '#5B2B22'
        },
        accent: '#A8D5BA',
        success: '#A8D5BA',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',
        dark: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827'
        }
      },
      backgroundColor: {
        'primary': '#FFFFFF',
        'secondary': '#FFF8F6',
        'card': '#FFFFFF'
      },
      textColor: {
        'primary': '#2D1B14',
        'secondary': '#7A6A65'
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['DM Sans', 'sans-serif'],
        'mono': ['DM Mono', 'monospace']
      },
      borderColor: {
        'default': '#F0E0DC'
      },
      boxShadow: {
        'branded': 'rgba(232, 112, 90, 0.15) 0px 4px 12px',
        'hover': 'rgba(232, 112, 90, 0.25) 0px 8px 20px'
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s infinite',
        'slide-in': 'slide-in 0.3s ease-out'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        'pulse-ring': {
          '0%': { 'box-shadow': '0 0 0 0 rgba(232, 112, 90, 0.7)' },
          '100%': { 'box-shadow': '0 0 0 10px rgba(232, 112, 90, 0)' }
        },
        'slide-in': {
          'from': { transform: 'translateX(100%)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' }
        }
      }
    }
  },
  plugins: []
}
