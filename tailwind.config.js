const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4338CA',
          DEFAULT: '#3730A3',
          dark: '#312E81'
        },
        secondary: {
          light: '#6D28D9',
          DEFAULT: '#4C1D95'
          //dark: '#4C1D95'
        },
        light: '#D1D5DB',
        dark: '#111827',
        danger: {
          light: '#FCA5A5',
          DEFAULT: '#991B1B'
        },
        success: {
          light: '#34D399',
          DEFAULT: '#047857'
        }
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
