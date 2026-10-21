import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#FAF7F2',
        primary: {
          DEFAULT: '#446E53',
          hover: '#375A44',
          light: '#E2EAE3',
          foreground: '#FFFFFF',
        },
        surface: {
          DEFAULT: '#FAF7F2',
          card: '#FFFFFF',
        },
        text: {
          main: '#2F2B28',
          muted: '#6B655F',
        },
        border: {
          DEFAULT: '#2F2B28',
          subtle: '#D9D3C7',
        },
        alert: {
          warning: {
            bg: '#F6EAD2',
            border: '#6E5522',
          },
          danger: {
            bg: '#FDE8E3',
            border: '#A82D24',
          },
        },
      },
      fontFamily: {
        serif: ['"Literata"', 'serif'],
        sans: ['"Nunito"', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        input: '12px',
      },
    },
  },
  plugins: [],
} satisfies Config;
