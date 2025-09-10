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
      'wizard': ['Cinzel', 'serif'], // Ancient, magical serif font
      'spellbook': ['Uncial Antiqua', 'serif'], // Medieval manuscript font
      'rune': ['Old English Text MT', 'serif'], // Runes and ancient text
      'mystic': ['MedievalSharp', 'serif'], // Gothic medieval font
      'ancient': ['EB Garamond', 'serif'], // Classical magical font
      'arcane': ['Merriweather', 'serif'], // Dark academic font
    },
      animation: {
        'glow-subtle': 'glow-subtle 3s ease-in-out infinite alternate',
        'pulse-gentle': 'pulse-gentle 2s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'slide-in': 'slide-in 0.5s ease-out',
        'bounce-slow': 'bounce 3s infinite',
        'fade-in': 'fade-in 0.8s ease-out',
        'lightning': 'lightning 0.1s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'magic-circle': 'magic-circle 3s linear infinite',
        'float-up': 'float-up 2s ease-out forwards',
        'rain-drop': 'rain-drop 1s linear infinite',
        'snow-fall': 'snow-fall 3s linear infinite',
        'grow-plant': 'grow-plant 2s ease-out forwards',
        'creature-appear': 'creature-appear 0.8s ease-out forwards',
        'wizard-wiggle': 'wizard-wiggle 2s ease-in-out infinite',
        'spell-cast': 'spell-cast 1.5s ease-out forwards',
      },
      keyframes: {
        'glow-subtle': {
          '0%': { boxShadow: '0 0 3px rgba(139, 92, 246, 0.3)' },
          '100%': { boxShadow: '0 0 8px rgba(139, 92, 246, 0.5)' },
        },
        'pulse-gentle': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'lightning': {
          '0%': { opacity: 0, transform: 'scaleY(0)' },
          '10%': { opacity: 1, transform: 'scaleY(1)' },
          '90%': { opacity: 1, transform: 'scaleY(1)' },
          '100%': { opacity: 0, transform: 'scaleY(0)' },
        },
        'sparkle': {
          '0%, 100%': { transform: 'scale(0)', opacity: 0 },
          '50%': { transform: 'scale(1)', opacity: 1 },
        },
        'magic-circle': {
          '0%': { transform: 'rotate(0deg) scale(0)', opacity: 0 },
          '50%': { transform: 'rotate(180deg) scale(1)', opacity: 1 },
          '100%': { transform: 'rotate(360deg) scale(0)', opacity: 0 },
        },
        'float-up': {
          '0%': { transform: 'translateY(100%)', opacity: 0 },
          '100%': { transform: 'translateY(-100%)', opacity: 1 },
        },
        'rain-drop': {
          '0%': { transform: 'translateY(-100%)', opacity: 0 },
          '10%': { opacity: 1 },
          '90%': { opacity: 1 },
          '100%': { transform: 'translateY(100vh)', opacity: 0 },
        },
        'snow-fall': {
          '0%': { transform: 'translateY(-100%) rotate(0deg)', opacity: 0 },
          '10%': { opacity: 1 },
          '90%': { opacity: 1 },
          '100%': { transform: 'translateY(100vh) rotate(360deg)', opacity: 0 },
        },
        'grow-plant': {
          '0%': { transform: 'scaleY(0)', opacity: 0 },
          '100%': { transform: 'scaleY(1)', opacity: 1 },
        },
        'creature-appear': {
          '0%': { transform: 'scale(0) rotate(180deg)', opacity: 0 },
          '50%': { transform: 'scale(1.2) rotate(-10deg)', opacity: 0.8 },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: 1 },
        },
        'wizard-wiggle': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(2deg)' },
          '75%': { transform: 'rotate(-2deg)' },
        },
        'spell-cast': {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(1.2)', opacity: 0.8 },
          '100%': { transform: 'scale(0.8)', opacity: 0 },
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
