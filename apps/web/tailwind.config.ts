import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    screens: {
      xs: '420px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    extend: {
      colors: {
        brand: {
          50: 'var(--brand-50)',
          100: 'var(--brand-100)',
          200: 'var(--brand-200)',
          300: 'var(--brand-300)',
          400: 'var(--brand-400)',
          500: 'var(--brand-500)',
          600: 'var(--brand-600)',
          700: 'var(--brand-700)',
          800: 'var(--brand-800)',
          900: 'var(--brand-900)',
          DEFAULT: 'var(--brand-500)'
        },
        secondary: { DEFAULT: 'var(--secondary)', 600: 'var(--secondary-600)' },
        accent: 'var(--accent)',
        'accent-2': 'var(--accent-2)',
        success: 'var(--success)',
        error: 'var(--error)',
        warning: 'var(--warning)',
        info: 'var(--info)',
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        text: 'var(--text)',
        'text-muted': 'var(--text-muted)',
        'text-soft': 'var(--text-soft)',
        'on-brand': 'var(--on-brand)'
      },
      backgroundImage: {
        'brand-grad':
          'linear-gradient(var(--grad-angle), var(--grad-from), var(--grad-to))',
        'pop-grad': 'linear-gradient(135deg, var(--secondary), var(--accent))',
        'night-grad': 'linear-gradient(135deg, var(--accent-2), #00BFFF)'
      },
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace']
      },
      fontSize: {
        display: [
          '72px',
          { lineHeight: '0.95', letterSpacing: '-0.04em', fontWeight: '700' }
        ],
        h1: [
          '48px',
          { lineHeight: '1.05', letterSpacing: '-0.035em', fontWeight: '700' }
        ],
        h2: [
          '36px',
          { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '700' }
        ],
        h3: [
          '28px',
          { lineHeight: '1.2', letterSpacing: '-0.025em', fontWeight: '600' }
        ],
        h4: [
          '22px',
          { lineHeight: '1.25', letterSpacing: '-0.02em', fontWeight: '600' }
        ],
        lead: ['20px', { lineHeight: '1.5' }],
        body: ['16px', { lineHeight: '1.55' }],
        'body-sm': ['14px', { lineHeight: '1.5' }],
        caption: ['12px', { lineHeight: '1.4', fontWeight: '500' }],
        overline: [
          '11px',
          { lineHeight: '1.3', letterSpacing: '0.08em', fontWeight: '500' }
        ]
      },
      spacing: {
        'page-x': '1.5rem',
        section: '6rem'
      },
      maxWidth: {
        '7xl': '80rem'
      },
      borderRadius: {
        xs: 'var(--r-xs)',
        sm: 'var(--r-sm)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
        xl: 'var(--r-xl)',
        '2xl': 'var(--r-2xl)',
        pill: 'var(--r-pill)'
      },
      boxShadow: {
        xs: 'var(--sh-xs)',
        sm: 'var(--sh-sm)',
        md: 'var(--sh-md)',
        lg: 'var(--sh-lg)',
        brand: 'var(--sh-brand)',
        secondary: 'var(--sh-secondary)'
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(.22, 1, .36, 1)'
      },
      transitionDuration: {
        fast: '120ms',
        base: '220ms',
        slow: '380ms'
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' }
        },
        wiggle: {
          '0%,100%': { transform: 'rotate(-6deg)' },
          '50%': { transform: 'rotate(6deg)' }
        },
        spin: { to: { transform: 'rotate(360deg)' } }
      },
      animation: {
        shimmer: 'shimmer 1.6s linear infinite',
        wiggle: 'wiggle 4s ease-in-out infinite',
        spin: 'spin 0.8s linear infinite'
      }
    }
  },
  plugins: [
    function ({ addVariant }: { addVariant: (n: string, d: string) => void }) {
      addVariant('coarse', '@media (hover: none), (pointer: coarse)');
    }
  ]
};

export default config;
