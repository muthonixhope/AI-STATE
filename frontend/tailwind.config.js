/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        // Primary product blue
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        // MOMENI company navy (deep accent / sidebar)
        navy: {
          50: "#f1f4f9",
          100: "#dde4ef",
          200: "#bccbe0",
          300: "#8ea6c8",
          400: "#5b7aa8",
          500: "#3a5a8c",
          600: "#284472",
          700: "#1d3460",
          800: "#15264a",
          900: "#0f2240",
          950: "#0a1830",
        },
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(15,34,64,0.04), 0 1px 3px 0 rgba(15,34,64,0.06)",
        soft: "0 4px 16px -4px rgba(15,34,64,0.10), 0 2px 6px -2px rgba(15,34,64,0.06)",
        lift: "0 12px 32px -8px rgba(15,34,64,0.18)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
