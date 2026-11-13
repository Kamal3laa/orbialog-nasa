/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#111311',
          light: '#151815',
          deep: '#0D0E0D'
        },
        obsidian: {
          DEFAULT: '#191B19',
          surface: '#1E211E',
          card: '#222521',
          border: '#2A2E29',
          borderLight: '#383D36'
        },
        mineral: {
          white: '#E8E5DC',
          muted: '#C4C2B8',
          dim: '#A2A096'
        },
        stone: {
          gray: '#88877F',
          dark: '#5C5B55',
          subtle: '#3E3E3A'
        },
        mars: {
          DEFAULT: '#B75B3D',
          glow: '#D46A47',
          dark: '#7A3822',
          tint: '#3A1E14'
        },
        lunar: {
          DEFAULT: '#A8AAA6',
          bright: '#C8CAC6',
          dark: '#585A56',
          tint: '#222422'
        },
        earth: {
          DEFAULT: '#64735D',
          bright: '#829479',
          dark: '#3F4A3B',
          tint: '#1C231A'
        },
        telemetry: {
          cyan: '#38BDF8',
          amber: '#EAB308',
          emerald: '#10B981',
          rose: '#F43F5E'
        }
      },
      fontFamily: {
        grotesk: ['"Space Grotesk"', 'sans-serif'],
        inter: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(circle, rgba(136, 135, 127, 0.15) 1px, transparent 1px)",
        'dot-matrix': "radial-gradient(rgba(232, 229, 220, 0.08) 1px, transparent 0)",
      }
    },
  },
  plugins: [],
}

