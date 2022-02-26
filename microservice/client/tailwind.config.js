module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'header': "url('/black-g0ec09ab00_1920.jpg')"
      },
      zIndex: {
        'drawer': '20',
      },
      spacing: {
        header: '20%'
      },
      colors: {
        'header-text': 'white', 
      }
    },
  },
  plugins: [],
}
