/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light theme colors
        'bg-light': 'var(--bg-light)',
        'surface-light': 'var(--surface-light)',
        'muted-light': 'var(--muted-light)',
        'text-primary-light': 'var(--text-primary-light)',
        'text-secondary-light': 'var(--text-secondary-light)',
        // Dark theme colors
        'bg-dark': 'var(--bg-dark)',
        'surface-dark': 'var(--surface-dark)',
        'muted-dark': 'var(--muted-dark)',
        'text-primary-dark': 'var(--text-primary-dark)',
        'text-secondary-dark': 'var(--text-secondary-dark)',
        // Accent colors
        'accent-1': 'var(--accent-1)',
        'accent-2': 'var(--accent-2)',
        'danger': 'var(--danger)',
        'success': 'var(--success)',
        // Page accent overlays
        'dashboard-accent': 'var(--dashboard-accent)',
        'chatbot-accent': 'var(--chatbot-accent)',
        'settings-accent': 'var(--settings-accent)',
        'profile-accent': 'var(--profile-accent)',
        'auth-accent': 'var(--auth-accent)'
      },
      boxShadow: {
        'elevation-low': 'var(--elevation-low)',
        'elevation-medium': 'var(--elevation-medium)',
        'elevation-high': 'var(--elevation-high)'
      },
      borderRadius: {
        'sm': 'var(--r-sm)',
        'md': 'var(--r-md)',
        'lg': 'var(--r-lg)'
      },
      transitionDuration: {
        'fast': 'var(--motion-fast)',
        'medium': 'var(--motion-medium)',
        'slow': 'var(--motion-slow)'
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'heading': ['Inter', 'system-ui', 'sans-serif']
      },
      fontSize: {
        'h1': ['36px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['28px', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'small': ['13px', { lineHeight: '1.4', fontWeight: '400' }]
      },
      animation: {
        'fade-in': 'fadeIn var(--motion-medium) ease-out',
        'slide-up': 'slideUp var(--motion-medium) cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-down': 'slideDown var(--motion-medium) cubic-bezier(0.22, 1, 0.36, 1)',
        'scale-in': 'scaleIn var(--motion-fast) cubic-bezier(0.22, 1, 0.36, 1)',
        'typing': 'typing 1.5s infinite ease-in-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        typing: {
          '0%, 60%, 100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-10px)' }
        }
      }
    },
  },
  plugins: [],
}