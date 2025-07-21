/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom colors using CSS variables
        primary: {
          bg: 'rgb(var(--color-bg-primary) / <alpha-value>)',
          text: 'rgb(var(--color-text-primary) / <alpha-value>)',
        },
        secondary: {
          bg: 'rgb(var(--color-bg-secondary) / <alpha-value>)',
          text: 'rgb(var(--color-text-secondary) / <alpha-value>)',
        },
        tertiary: {
          bg: 'rgb(var(--color-bg-tertiary) / <alpha-value>)',
          text: 'rgb(var(--color-text-tertiary) / <alpha-value>)',
        },
        accent: {
          primary: 'rgb(var(--color-accent-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-accent-secondary) / <alpha-value>)',
        },
        border: {
          primary: 'rgb(var(--color-border-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-border-secondary) / <alpha-value>)',
        },
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
      },
      boxShadow: {
        'custom-sm': 'var(--shadow-sm)',
        'custom-md': 'var(--shadow-md)',
        'custom-lg': 'var(--shadow-lg)',
      },
      transitionProperty: {
        'theme': 'background-color, border-color, color, box-shadow',
      },
    },
  },
  plugins: [],
};
