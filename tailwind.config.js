const colors = require("tailwindcss/colors");
const allColors = {
  ...colors,
  ...{
    primary: "#fbceab",
    seconday: "#fce2ce",
    tertary: "#ff8f3e",
    quartery: "#ff772e",
    accent: "#586ba4",
  },
};

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        gradient:
          "linear-gradient(45deg, rgba(239,189,0,1) 0%, rgba(243,90,40,1) 100%)",
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
