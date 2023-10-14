/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryCyan: 'hsl(180, 70%, 50%)',
        lightCyan: 'hsl(180, 70%, 75%)',
        softViolet: 'hsl(257, 15%, 60%)',
        deepViolet: 'hsl(260, 15%, 16%)',

        softBlue: 'hsl(231, 69%, 60%)',
        softRed: 'hsl(0, 94%, 66%)',
        grayishBlue: 'hsl(229, 8%, 60%)',
        veryDarkBlue: 'hsl(229, 31%, 21%)',
      },
      fontFamily: {
      },
    },
  },
  plugins: [],
}