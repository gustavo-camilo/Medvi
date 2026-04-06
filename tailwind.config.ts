import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        // Brand palette — modernized, BR-friendly
        cream: '#FAF8F5',
        ink: '#1A1A1A',
        forest: {
          DEFAULT: '#1F4D3A',
          50: '#EEF5F1',
          100: '#D8E8DE',
          200: '#A9CDB6',
          300: '#7AB28E',
          400: '#4B9766',
          500: '#1F4D3A',
          600: '#173A2C',
          700: '#0F271D',
          800: '#08140F',
          900: '#040A07',
        },
        gold: {
          DEFAULT: '#D4A24C',
          50: '#FBF5E8',
          100: '#F6E9C9',
          200: '#EDD391',
          300: '#E3BC59',
          400: '#D4A24C',
          500: '#B0832F',
          600: '#83621F',
        },
        muted: {
          DEFAULT: '#F1EEE8',
          foreground: '#5A5A57',
        },
        border: '#E5E1D8',
        ring: '#1F4D3A',
        background: '#FAF8F5',
        foreground: '#1A1A1A',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
      borderRadius: {
        lg: '1rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out forwards',
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
