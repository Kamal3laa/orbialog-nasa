/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#111311",
        obsidian: "#191B19",
        "mineral-white": "#E8E5DC",
        "stone-gray": "#88877F",
        "mars-rust": "#B75B3D",
        "mars-light": "#CF6E4E",
        "lunar-silver": "#A8AAA6",
        "earth-green": "#64735D",
        "earth-accent": "#7E9075",
        "telemetry-amber": "#D99B26",
        "telemetry-cyan": "#4E878C",
        "telemetry-red": "#B94A48",
      },
      fontFamily: {
        heading: ["'Space Grotesk'", "sans-serif"],
        sans: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(rgba(232, 229, 220, 0.08) 1px, transparent 1px)",
        'datum-cross': "linear-gradient(to right, rgba(232,229,220,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(232,229,220,0.06) 1px, transparent 1px)",
      },
      boxShadow: {
        'technical': "0 0 0 1px rgba(232, 229, 220, 0.12)",
        'technical-active': "0 0 0 1px #B75B3D, 0 4px 20px -2px rgba(183, 91, 61, 0.25)",
        'technical-subtle': "0 1px 3px 0 rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(232, 229, 220, 0.08)",
      }
    },
  },
  plugins: [],
}

