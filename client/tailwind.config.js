module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'header': 'url(\'/black-g0ec09ab00_1920.jpg\')'
      },
      zIndex: {
        'drawer': '20',
        'modal': '30',
        'modal-backdrop': '10',
      },
      spacing: {
        header: '20%',
        page: '80%',
        card_width: '14rem',
        card_height: '18.5rem'
      },
      colors: {
        'header-text': 'white',
        app: '#F8EFEA',
        danger: 'rgb(248 113 113)',
        chenin: '#DED369',
        mandy: '#E0475B',
        deepfir: '#192F01'
      },
      opacity: {
        disabled: '.50'
      }
    },
  },
  plugins: [],
};
