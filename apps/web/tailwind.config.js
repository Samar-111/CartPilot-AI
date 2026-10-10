/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          main: "#0B0D0C",
          secondary: "#141815",
          elevated: "#1B211C",
          card: "#121613"
        },
        surface: {
          border: "#232B25",
          borderSubtle: "#1A221C",
          borderHighlight: "#2E3B31"
        },
        lime: {
          DEFAULT: "#C6FF4D",
          accent: "#C6FF4D",
          hover: "#B6F53D",
          muted: "rgba(198, 255, 77, 0.15)",
          subtle: "rgba(198, 255, 77, 0.08)"
        },
        ice: {
          DEFAULT: "#8DCBFF",
          accent: "#8DCBFF",
          muted: "rgba(141, 203, 255, 0.15)",
          subtle: "rgba(141, 203, 255, 0.08)"
        },
        content: {
          primary: "#F4F5EF",
          secondary: "#929A91",
          muted: "#667065",
          faint: "#3F473E"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        display: ["var(--font-space-grotesk)", "Space Grotesk", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"]
      },
      boxShadow: {
        "command": "0 20px 40px -15px rgba(0, 0, 0, 0.8)",
        "lime-glow": "0 0 25px -4px rgba(198, 255, 77, 0.28)",
        "ice-glow": "0 0 25px -4px rgba(141, 203, 255, 0.22)",
        "panel": "0 4px 20px -2px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.04)"
      }
    }
  },
  plugins: []
};
