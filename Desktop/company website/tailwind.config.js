/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-dark': '#0a0a0f',
        'cyber-darker': '#050507',
        'cyber-blue': '#00f5ff',
        'cyber-purple': '#8b5cf6',
        'cyber-pink': '#f73c7e',
        'cyber-green': '#00ff85',
        'cyber-orange': '#ff8c00',
        'dark-card': '#1a1a2e',
        'dark-border': '#16213e',
        'text-primary': '#ffffff',
        'text-secondary': '#a0a0a0',
        'text-accent': '#00f5ff',
      },
      fontFamily: {
        'cyber': ['Orbitron', 'monospace'],
        'modern': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'slide-up': 'slide-up 0.6s ease-out',
        'fade-in': 'fade-in 0.8s ease-out',
        'rotate-slow': 'rotate 20s linear infinite',
        'bounce-glow': 'bounce-glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%': { boxShadow: '0 0 5px #00f5ff, 0 0 10px #00f5ff, 0 0 15px #00f5ff' },
          '100%': { boxShadow: '0 0 10px #00f5ff, 0 0 20px #00f5ff, 0 0 30px #00f5ff' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'bounce-glow': {
          '0%, 100%': { 
            transform: 'translateY(0)',
            boxShadow: '0 0 10px #8b5cf6, 0 0 20px #8b5cf6, 0 0 30px #8b5cf6'
          },
          '50%': { 
            transform: 'translateY(-10px)',
            boxShadow: '0 0 15px #8b5cf6, 0 0 30px #8b5cf6, 0 0 45px #8b5cf6'
          },
        },
      },
      backgroundImage: {
        'gradient-cyber': 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)',
        'gradient-card': 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
        'gradient-neon': 'linear-gradient(90deg, #00f5ff, #8b5cf6, #f73c7e)',
      },
      backdropBlur: {
        'cyber': '10px',
      },
    },
  },
  plugins: [],
}
