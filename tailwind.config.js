const colors = require("tailwindcss/colors");

module.exports = {
	//purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	darkMode: false, // or 'media' or 'class'
	theme: {
		ripple: theme => ({
			colors: theme("colors"),
			darken: 0.1,
		}),
		minWidth: {
			md: "28rem",
		},
		minHeight: {
			"12rem": "12rem",
			"13rem": "13rem",
			"21rem": "21rem",
		},
		outlineWidth: {
			0: "0px",
		},
		extend: {
			screens: {
				"3xl": "2000px",
			},
			spacing: {
				"0.4px": "0.4px",
				"1.25px": "1.25px",
				"4.5px": "4.5px",
				"5px": "5px",
				"6.3px": "6.3px",
				18: "4.25rem",
				7.5: "1.85rem",
				"2.5px": "2.5px",
				"8.5rem": "8.5rem",
				"15rem": "15.5rem",
				"23rem": "23rem",
				70: "16.5rem",
				97: "26rem",
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
				sans: ['"Source Sans 3"'],
			},
			fontSize: {
				"2xs": ".7rem",
				"2.5xl": "28px",
			},
			backgroundOpacity: {
				15: "0.15",
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
				onPrimary: "#FFFFFF",
				onSecondary: "#111827",
				darkTextInput: "#e0e0e0",
				primary: {
					// #6200ee
					// TODO try #0057C9
					light: "#a450ff",
					DEFAULT: "#6a16f0", // '#0F7490', '#3730A3',
					dark: "#5611c4", //'#312E81'
				},
				secondary: {
					// TODO try color used at try.evo-learning.com for button
					// #018786
					light: "#f9fafb",
					DEFAULT: "#e5e7eb",
					dark: "#d1d5db",
				},
				light: "#F8F8F9",
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
	//plugins: [require("tailwindcss-ripple")()],
};
