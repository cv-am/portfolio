/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sketch: ['"Architects Daughter"', 'cursive'],
        hand: ['"Caveat"', 'cursive'],
        notes: ['"Patrick Hand"', 'cursive'],
        mono: ['"Space Mono"', 'monospace'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(1.5deg)' }
        },
        scratch: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.98) rotate(-0.5deg)' },
          '100%': { transform: 'scale(1)' }
        }
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        scratch: 'scratch 0.2s ease-in-out'
      }
    },
  },
  plugins: [],
}
