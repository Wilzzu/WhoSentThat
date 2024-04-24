/*eslint-env node*/
/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
// text shadow help: https://www.hyperui.dev/blog/text-shadow-with-tailwindcss
module.exports = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				lime: "#89F443",
				limeDark: "#64b330",
				white: "#FBFBFB",
				whiteish: "#F8F8F8",
				whiteishLight: "#F6F6F6",
				whiteishDark: "#F0F0F0",
				whiteishDarker: "#E5E5E5",
				redish: "#CA1D21",
				redishDark: "#692626",
				blackish: "#292929",
				blackishDark: "#232323",
				blackishDarkest: "#202020",
				blackishLight: "#333333",
				greenish: "#4BFF5D",
				greenishDark: "#39583C",
				goldXD: "#FFD037",
				gold: "#FFD700",
				whoBG: "#C5F4FF",
				whoGreen: "#53F586",
				whoBlue: "#2E3C76F",
				whoPuple: "#7D3FFF",
				whoRed: "#F45291",
				whoYellow: "#FFC45D",
			},
			fontFamily: {
				poppins: ["Poppins"],
				hanken: ['"Hanken Grotesk"'],
				placeholder: ['"Flow Circular"'],
			},
			keyframes: {
				bar1: {
					"0%": { transform: "translate(1166.223 5892.109)" },
					"100%": { transform: "translate(1166.223 5992.109)" },
				},
				shootUp: {
					"0%": { transform: "scale(0.0)", opacity: "0.0" },
					"100%": { transform: "scale(1.0)", opacity: "1.0" },
				},
				shootUpBounce: {
					"0%": { transform: "scale(0.0)", opacity: "0.0" },
					"55%": { transform: "scale(1.2)" },
					"100%": { transform: "scale(1.0)", opacity: "1.0" },
				},
				shootDown: {
					"0%": { transform: "scale(1.0)", opacity: "1.0" },
					"100%": { transform: "scale(0.0)", opacity: "0.0" },
				},
				fadeIn: {
					"0%": { opacity: "0.8" },
					"100%": { opacity: "1.0" },
				},
				pulseLight: {
					"0%": { opacity: "0.35" },
					"50%": { opacity: "0.20" },
					"100%": { opacity: "0.35" },
				},
				float: {
					"0%": { transform: "translate(0px,  0px)" },
					"20%": { transform: "translate(5px, 10px)" },
					"80%": { transform: "translate(-5px, -10px)" },
					"100%": { transform: "translate(0px, -0px)" },
				},
				float2: {
					"0%": { transform: "translate(-5px, -10px)" },
					"60%": { transform: "translate(5px, 10px)" },
					"80%": { transform: "translate(0px, 0px)" },
					"100%": { transform: "translate(-5px, -10px)" },
				},
				scrolling: {
					"0%": { backgroundPosition: "0px 0px" },
					"100%": { backgroundPosition: "0px -128px" },
				},
				rainbow: {
					"0% ": { color: "red" },
					"14%": { color: "orange" },
					"28%": { color: "yellow" },
					"42%": { color: "green" },
					"57%": { color: "blue" },
					"71%": { color: "indigo" },
					"85%": { color: "pink" },
					"100%": { color: "red" },
				},
				bgRainbow: {
					"0%": { backgroundPosition: "0 0" },
					"100%": { backgroundPosition: "0 -400%" },
				},
			},
			animation: {
				"spin-slow": "spin 1.35s cubic-bezier(.3,.35,.36,.99)",
				bar1Test: "bar1 1.2s cubic-bezier(.3,.35,.36,.99)",
				shootUp: "shootUp 0.25s cubic-bezier(.37,.46,.36,.99)",
				shootUpBounce: "shootUpBounce 0.45s cubic-bezier(.37,.46,.36,.99)",
				shootDown: "shootDown 0.25s linear",
				fadeIn: "fadeIn 0.25s linear",
				pulseLight: "pulseLight 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;",
				float: "float 8s ease-in-out infinite",
				float2: "float 8s ease-in-out infinite",
				scrolling: "scrolling 8s linear infinite",
				rainbow: "rainbow 5s linear infinite",
				bgRainbow: "bgRainbow 5s linear infinite",
			},
			textShadow: {
				sm: "0 1px 2px var(--tw-shadow-color)",
				DEFAULT: "0 2px 4px var(--tw-shadow-color)",
				lg: "0px 2px 16px var(--tw-shadow-color)",
				normal: "0px 2px 8px var(--tw-shadow-color)",
				big: "3px 3px 29px var(--tw-shadow-color)",
				outline:
					"1px 1px 0px var(--tw-shadow-color), -1px -1px 0px var(--tw-shadow-color), -1px 1px 0px var(--tw-shadow-color), 1px -1px 0px var(--tw-shadow-color)",
				outlineSm:
					"0.2px 0.2px 0px var(--tw-shadow-color), -0.2px -0.2px 0px var(--tw-shadow-color), -0.2px 0.2px 0px var(--tw-shadow-color), 0.2px -0.2px 0px var(--tw-shadow-color)",
				softOutline:
					"1px 1px 4px var(--tw-shadow-color), -1px -1px 4px var(--tw-shadow-color), -1px 1px 4px var(--tw-shadow-color), 1px -1px 4px var(--tw-shadow-color)",
			},
			boxShadow: {
				custom: "0 10px 30px -10px rgb(0 0 0 / 0.3)",
				custom2: "0 2px 25px -6px rgb(0 0 0 / 0.3)",
				custom3: "0 2px 25px -10px rgb(0 0 0 / 0.3)",
				custom4: "0 2px 8px -3px rgb(0 0 0 / 0.3)",
				scroll: "inset 0 8px 4px 0 rgb(0 0 0 / 0.05)",
			},
			borderRadius: {
				bigger: "2rem",
			},
		},
	},
	plugins: [
		plugin(function ({ matchUtilities, theme }) {
			matchUtilities(
				{
					"text-shadow": (value) => ({
						textShadow: value,
					}),
				},
				{ values: theme("textShadow") }
			);
		}),
		plugin(({ matchUtilities, theme }) => {
			matchUtilities(
				{
					"animation-delay": (value) => {
						return {
							"animation-delay": value,
						};
					},
				},
				{
					values: theme("transitionDelay"),
				}
			);
		}),
		require("tailwind-scrollbar")({ nocompatible: true, preferredStrategy: "pseudoelements" }),
	],
};
