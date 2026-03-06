import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-base':      '#FAF7F2',
        'bg-surface':   '#F3EDE3',
        'bg-elevated':  '#FFFCF8',
        'ink-primary':  '#1C1712',
        'ink-secondary':'#5C4F3A',
        'ink-muted':    '#A0917C',
        'fire-red':     '#E8341A',
        'fire-orange':  '#F57C2B',
        'fire-amber':   '#F5C842',
        'fire-ember':   '#C94A1E',
        'border-warm':  '#DDD3C3',
        'border-hot':   '#F57C2B',
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        serif:   ['Playfair Display', 'serif'],
        mono:    ['JetBrains Mono', 'monospace'],
        sans:    ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
