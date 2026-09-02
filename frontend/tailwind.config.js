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
          purple:      '#6366f1',
          deepPurple:  '#4f46e5',
          darkBg:      '#0f0c29',
          midBg:       '#302b63',
          card:        '#1e1b4b',
          orange:      '#f97316',
          amber:       '#f59e0b',
          pink:        '#ec4899',
          cyan:        '#06b6d4',
          emerald:     '#10b981',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '32px',
        '5xl': '40px',
      },
      boxShadow: {
        'glow-purple': '0 0 40px rgba(99, 102, 241, 0.35)',
        'glow-orange': '0 0 30px rgba(249, 115, 22, 0.4)',
        'glow-pink':   '0 0 30px rgba(236, 72, 153, 0.35)',
        'card-dark':   '0 8px 32px rgba(0, 0, 0, 0.4)',
        'card-light':  '0 4px 24px rgba(0, 0, 0, 0.06)',
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        'gradient-purple': 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        'gradient-orange': 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
      }
    },
  },
  plugins: [],
}
