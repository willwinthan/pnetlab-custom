/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx",
  ],
  theme: {
    extend: {
      colors: {
        border: "rgba(255, 255, 255, 0.1)",
        input: "rgba(255, 255, 255, 0.15)",
        ring: "var(--secondary-color, #1b4079)",
        background: "var(--bg-color, #0a1128)",
        foreground: "#f8fafc",
        primary: {
          DEFAULT: "var(--primary-color, #0d274d)",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "var(--secondary-color, #1b4079)",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "rgba(255, 255, 255, 0.08)",
          foreground: "#f8fafc",
        },
        card: {
          DEFAULT: "rgba(30, 41, 59, 0.7)",
          foreground: "#f8fafc",
        },
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px",
      },
    },
  },
  plugins: [],
}
