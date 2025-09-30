/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}", // include root App file
    "./app/**/*.{js,jsx,ts,tsx}", // screens, routes
    "./components/**/*.{js,jsx,ts,tsx}", // shared components
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      textColor: {
        DEFAULT: "#374151",
      },
    },
  },
  plugins: [],
};
