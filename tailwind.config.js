module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        purple: "#e4c1f9",
        rosePink: "#f15bb5",
      },
      fontFamily: {
        EdGaramond: ["EB Garamond", "serif"],
        DancingScript: ["Dancing Script", "cursive"],
        Anton: ["Anton", "sans-serif"],
        Ubuntu: ["Ubuntu", "sans-serif"],
      },
      padding: {
        410: "410px",
      },
      spacing: {
        '400': '400px',
      },
      animation: {
        lift: "lift .3s ease",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        lift: {
          "0%": {
            transform: "translateY(0)",
          },

          "100%": {
            transform: "translateY(-10px)",
          },
        },
      },
    },
    variants: {
      extend: {},
    },
    plugins: [require("flowbite/plugin")],
  },
};
