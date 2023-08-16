/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      listStyleType: {
        none: "none",
        disc: "disc",
        decimal: "decimal",
        square: "square",
        roman: "upper-roman",
        check: '"\\2713\\a0"',
        cross: '"\\2717\\a0"',
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
