import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#FF69B4',
          50:  '#FFF0F8',
          100: '#FFDDEF',
          200: '#FFB8DD',
          300: '#FF94CA',
          400: '#FF7EBE',
          500: '#FF69B4',
          600: '#E64A99',
          700: '#C72F7D',
          800: '#9E1F61',
          900: '#751547'
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-poppins)', 'system-ui', 'sans-serif']
      },
      maxWidth: {
        '7xl': '80rem'
      }
    }
  },
  plugins: []
};

export default config;
