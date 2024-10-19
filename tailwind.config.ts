import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primaryWhite: "#e5e7eb",
        primaryBlue: "#1e40af",
        primaryDark: "#171717",
        primaryDarkLight: "#1e293b",
      },
      backgroundColor: {
        primaryWhite: "#e5e7eb",
        primaryBlue: "#1e40af",
        primaryDark: "#171717",
        darkLight: "#1e293b",
      },
    },
  },
  plugins: [],
};
export default config;
