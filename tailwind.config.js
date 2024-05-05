/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        maroonbg: "#4E0506",
        maroonhover: "#440000",
        darkgray: "#222222",
        grayhover: "#a9a9a9",
        lightgray: "#d3d3d3",
        graybg: "#545454",
      },
      fontFamily: {
        anta: ["Anta", "sans-serif"],
        ubuntu: ["Ubuntu", "sans-serif"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/line-clamp"),
  ],
};
