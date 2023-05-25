const colors = require("tailwindcss/colors");
const allColors = {
  ...colors,
  ...{
    primary: "#D25E2F",
    secondary: "#fce2ce",
    tertary: "#334155",
    quartery: "#063857",
    background: "#021622",
    accent: "#46A0A0",
    inactive: "#808080",
  },
};

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        p: "2rem",
        ol: "1.25rem",
        li: "0.75rem",
      },
    },
    screens: {
      phone: "576px",
      tablet: "640px",
      laptop: "1024px",
      desktop: "1280px",
      bigDesktop: "1536px",
    },
    colors: allColors,
  },
  plugins: [],
};
