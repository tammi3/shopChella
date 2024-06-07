module.exports = {
  purge: [],
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        purple: "#e4c1f9",
        rosePink: "#f15bb5"
      },
      fontFamily: {
        EdGaramond: ['EB Garamond', 'serif'],
        DancingScript: ['Dancing Script', 'cursive'],
        Anton: ['Anton', 'sans-serif'],
        Ubuntu: ['Ubuntu', 'sans-serif'],
      },
      padding: {
        '410': '410px',
      }
    },
    variants: {
      extend: {},
    },
    plugins: [],
  },
};
