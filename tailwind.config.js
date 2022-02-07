const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    ripple: theme => ({
      colors: theme('colors'),
      darken: 0.1
    }),
    minWidth: {
      md: '28rem'
    },
    outlineWidth: {
      0: '0px'
    },
    extend: {
      spacing: {
        '1.25px': '1.25px',
        '4.5': '18px'
      },
      transitionProperty: {
        border: 'border',
        'max-height': 'max-height'
      },
      transformOrigin: {
        '0': '0%'
      },
      zIndex: {
        '-1': '-1'
      },
      fontFamily: {
        sans: ['"Source Sans Pro"']
      },
      fontSize: {
        '2xs': '.7rem'
      },
      borderWidth: {
        '1.5': '1.5px',
        '6': '6px'
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
        light: '#F3F4F6',
        dark: '#111827',
        danger: {
          light: '#FCA5A5',
          DEFAULT: '#FF9E9E', //'#F87171',
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
      cursor: ['disabled'],
      opacity: ['disabled'],
      outline: ['active'],
      transitionProperty: ['hover'],
      ringWidth: ['hover', 'active'],
      ringOpacity: ['active'],
      borderColor: ['responsive', 'hover', 'focus', 'focus-within']
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  plugins: [require('tailwindcss-ripple')()]
}
