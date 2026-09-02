/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#3B30C8',
          darkPurple: '#2E24A7',
          lightPurple: '#ECEBFF',
          accentOrange: '#FF6B00',
          hoverOrange: '#E05E00',
          peachBg: '#FFFBEB',
          softBg: '#F8FAFC',
        }
      },
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'soft': '0 10px 30px -5px rgba(59, 48, 200, 0.05)',
        'orange-glow': '0 8px 20px -3px rgba(255, 107, 0, 0.35)',
        'card': '0 4px 20px 0 rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
