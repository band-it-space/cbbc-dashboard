import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF", // blue-700
        secondary: "#2563EB", // blue-600
        muted: "#4B5563", // gray-700
        border: "#E5E7EB", // gray-200
        background: "#F3F4F6", // вместо gray-100
        content: "#FFFFFF",

        surface: "#FFFFFF", // бывший white
        heading: "#374151", // бывший gray-600
        hover: "#F9FAFB", // бывший gray-50
        accent: "#1D4ED8", // синий
      },
    },
  },
  plugins: [],
};

export default config;
