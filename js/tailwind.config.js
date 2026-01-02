module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0B3D91",
        accent: "#FFB100"
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Arial']
      }
    }
  },
  plugins: []
}
