import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
      },
      colors: {
        villa: '#670E36',
        arsenal: '#EF0107',
        united: '#DA291C',
        chelsea: '#034694',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
