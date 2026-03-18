import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#fdf8f0',
          100: '#faf0e0',
          200: '#f5e0b8',
        },
        gold: {
          400: '#f0c040',
          500: '#d4a017',
          600: '#b8860b',
        },
        crimson: {
          500: '#9b2335',
          600: '#7d1c2a',
          700: '#5e1420',
        },
        arcane: {
          700: '#3d2b6b',
          800: '#261850',
          900: '#160d35',
          950: '#08051a',
        },
      },
      fontFamily: {
        display: ['"Cinzel"', 'Georgia', 'serif'],
        body: ['"Crimson Text"', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 12px rgba(212, 160, 23, 0.4)',
        'glow-red': '0 0 12px rgba(155, 35, 53, 0.5)',
      },
    },
  },
  plugins: [],
} satisfies Config
