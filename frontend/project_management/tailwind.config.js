/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        enterprise: {
          dark: '#273043',    // Gunmetal - Primary Navigation/Text
          muted: '#9197AE',   // Blue-Grey - Secondary Text/Borders
          light: '#EFF6EE',   // Mint Cream - Backgrounds
          accent: '#4A5568',  // Slate - Accents
        }
      }
    },
  },
  plugins: [],
}
