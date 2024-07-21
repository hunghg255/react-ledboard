/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        led: {
          '0%': { fill: 'currentColor', brightness: '1' },
          '50%': { fill: 'var(--led-color)', brightness: '700%' },
          '100%': { fill: 'currentColor', brightness: '1' },
        },
      },
      animation: {
        led: 'led 100ms ease-in-out',
      },
    },
  },
  plugins: [],
};
