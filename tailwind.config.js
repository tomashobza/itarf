/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,html}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        'red-flag': '#FF5C5C',          // Red Flag (negative)
        'green-flag': '#6BD47E',        // Green Flag (positive)
        'neutral-flag': '#FFC857',      // Neutral decisions
        'highlight-pink': '#FF8EAB',    // Accent pink
        'soft-blush': '#FFE2E6',        // Subtle blush background
        'bg-primary': '#FFFFFF',        // Main background
        'bg-secondary': '#F9F7F7',      // Secondary background
        'text-primary': '#2B2B2B',      // Main text
        'text-secondary': '#767676',    // Secondary text
      },
    },
  },
  plugins: [],
}