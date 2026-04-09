/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-darker': '#050811',
        'cyber-dark': '#0a0e27',
        'cyber-purple': '#7c3aed',
        'cyber-blue': '#0ea5e9',
        'cyber-pink': '#ec4899',
        'cyber-gold': '#f59e0b',
        'cyber-green': '#10b981',
        'text-primary': '#e0e0e0',
        'text-secondary': '#a0a0a0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #7c3aed, 0 0 10px #7c3aed' },
          '100%': { boxShadow: '0 0 20px #7c3aed, 0 0 30px #7c3aed, 0 0 40px #7c3aed' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #050811 0%, #0a0e27 50%, #050811 100%)',
        'purple-gradient': 'linear-gradient(135deg, #7c3aed 0%, #0ea5e9 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)',
      },
    },
  },
  plugins: [],
}
