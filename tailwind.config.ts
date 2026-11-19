import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#f0f7f4",
          100: "#dbeef5",
          200: "#b9decb",
          300: "#8ac5a8",
          400: "#5ba683",
          500: "#3a8a64",
          600: "#296e4e",
          700: "#225840",
          800: "#1d4734",
          900: "#163a2c",
          950: "#0c2119",
        },
        tealbrand: {
          50: "#effaf9",
          100: "#c7f0ec",
          200: "#98e3dc",
          300: "#60cec5",
          400: "#32b3aa",
          500: "#1b978f",
          600: "#147873",
          700: "#14605d",
          800: "#144d4b",
          900: "#14413f",
        },
        aqi: {
          good: "#059669",
          goodBg: "#ecfdf5",
          moderate: "#d97706",
          moderateBg: "#fffbeb",
          poor: "#ea580c",
          poorBg: "#fff7ed",
          veryPoor: "#dc2626",
          veryPoorBg: "#fef2f2",
          severe: "#7e22ce",
          severeBg: "#faf5ff",
          hazardous: "#881337",
          hazardousBg: "#fff1f2",
        },
      },
    },
  },
  plugins: [],
};
export default config;
