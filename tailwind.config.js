const colors = require("tailwindcss/colors");
const allColors = {
  ...colors,
  ...{
    background: "#021622",
    backgroundActive: "#334155",
    canvasBackground: "#063857",
    accent: "#D25E2F",
    textAccent: "#46A0A0",
    offWhite: "#fce2ce",
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
