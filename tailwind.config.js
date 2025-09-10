/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-purple': '#8B5CF6',
        'neon-pink': '#EC4899',
        'neon-cyan': '#06B6D4',
        'neon-green': '#10B981',
        'neon-yellow': '#F59E0B',
        'neon-orange': '#F97316',
        'neon-red': '#EF4444',
        'arcade-bg': '#0A0A0A',
        'arcade-purple': '#6B21A8',
        'arcade-pink': '#BE185D',
        'arcade-cyan': '#0891B2',
      },
      fontFamily: {
        'arcade': ['Courier New', 'monospace'],
        'pixel': ['Press Start 2P', 'cursive'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-neon': 'pulse-neon 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-in': 'slide-in 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #8B5CF6, 0 0 10px #8B5CF6, 0 0 15px #8B5CF6' },
          '100%': { boxShadow: '0 0 10px #8B5CF6, 0 0 20px #8B5CF6, 0 0 30px #8B5CF6' },
        },
        'pulse-neon': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
      },
      backgroundImage: {
        'gradient-arcade': 'linear-gradient(45deg, #8B5CF6, #EC4899, #06B6D4, #10B981)',
        'gradient-magic': 'radial-gradient(circle, #8B5CF6, #6B21A8, #4C1D95)',
      },
    },
  },
  plugins: [],
}
