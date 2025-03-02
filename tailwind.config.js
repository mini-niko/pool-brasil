/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Vice City Sans", "sans-serif"],
      },
    },
    colors: {
      "pool-white": "#FFFFFF",
      "pool-black": "#2D3133",
      "pool-light": "#70C9DE",
      "pool-dark": "#01456B",
    },
  },
  plugins: [],
};
