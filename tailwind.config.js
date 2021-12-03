const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      transformOrigin: {
        '0': '0%'
      },
      zIndex: {
        '-1': '-1'
      },
      fontFamily: {
        sans: ['"Open Sans"']
      },
      borderWidth: {
        '1.5': '1.5px'
      },
      transitionDuration: {
        '0': '0'
      },
      outline: {
        primary: ['1.5px solid #4338CA', '1.75px'],
        danger: ['1.5px solid #F87171', '1.75px'],
        success: ['1.5px solid #047857', '1.75px']
      },
      colors: {
        lightText: '#FFFFFF',
        darkText: '#111827',
        primary: {
          light: '#4338CA',
          DEFAULT: '#485BCA', // '#0F7490', '#3730A3',
          dark: '#3B48A3' //'#312E81'
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
          DEFAULT: '#F87171',
          dark: '#991B1B'
        },
        success: {
          light: '#34D399',
          DEFAULT: '#10B981',
          dark: '#064E3B'
        }
      }
    }
  },
  variants: {
    extend: {
      outline: ['active'],
      transitionProperty: ['hover'],
      ringWidth: ['hover', 'active'],
      ringOpacity: ['active'],
      borderColor: ['responsive', 'hover', 'focus', 'focus-within']
    }
  },
  plugins: []
}
