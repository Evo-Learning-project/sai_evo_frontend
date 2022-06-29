const colors = require("tailwindcss/colors");

module.exports = {
  //purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    ripple: (theme) => ({
      colors: theme("colors"),
      darken: 0.1,
    }),
    minWidth: {
      md: "28rem",
    },
    minHeight: {
      "12rem": "12rem",
      "21rem": "21rem",
    },
    outlineWidth: {
      0: "0px",
    },
    extend: {
      spacing: {
        "0.4px": "0.4px",
        "1.25px": "1.25px",
        "4.5px": "4.5px",
        "5px": "5px",
        18: "4.25rem",
        7.5: "1.85rem",
        "2.5px": "2.5px",
        "8.5rem": "8.5rem",
        "15rem": "15.5rem",
        "23rem": "23rem",
        100: "420px",
        4.5: "18px",
        inf: "1000px",
      },
      transitionProperty: {
        width: "width",
        border: "border",
        "max-height": "max-height",
        "max-width": "max-width",
        "shadow-border": "shadow border",
      },
      transformOrigin: {
        0: "0%",
      },
      zIndex: {
        "-1": "-1",
        999: "999",
      },
      fontFamily: {
        sans: ['"Source Sans Pro"'],
      },
      fontSize: {
        "2xs": ".7rem",
        "2.5xl": "28px",
      },
      borderWidth: {
        1.5: "1.5px",
        6: "6px",
        10: "10px",
      },
      transitionDuration: {
        0: "0",
      },
      outline: {
        primary: ["1.5px solid #4338CA", "1.75px"],
        danger: ["1.5px solid #F87171", "1.75px"],
        success: ["1.5px solid #10B981", "0px"],
      },
      colors: {
        lightText: "#FFFFFF",
        darkText: "#111827",
        primary: {
          light: "#666ad1",
          DEFAULT: "#303f9f", // '#0F7490', '#3730A3',
          dark: "#001970", //'#312E81'
        },
        secondary: {
          light: "#a255ff",
          DEFAULT: "#651fff",
          dark: "#4527a0",
        },
        light: "#F3F4F6",
        dark: "#111827",
        danger: {
          light: "#FCA5A5",
          DEFAULT: "#FF9E9E", //'#F87171',
          dark: "#991B1B",
        },
        success: {
          light: "#34D399",
          DEFAULT: "#10B981", // #007800
          dark: "#064E3B",
        },
      },
    },
  },
  variants: {
    extend: {
      cursor: ["disabled", "hover"],
      opacity: ["disabled"],
      outline: ["active"],
      transitionProperty: ["hover"],
      ringWidth: ["hover", "active"],
      ringOpacity: ["active"],
      borderColor: ["responsive", "hover", "focus", "focus-within"],
      backgroundColor: ["hover"],
      backgroundOpacity: ["hover"],
      borderWidth: ["hover"],
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  plugins: [require("tailwindcss-ripple")()],
};
