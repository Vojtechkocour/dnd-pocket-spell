import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#fdf8f0',
          100: '#f9edd8',
          200: '#f2d9a8',
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
          800: '#1a1030',
          900: '#0f0a1e',
          950: '#070512',
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
