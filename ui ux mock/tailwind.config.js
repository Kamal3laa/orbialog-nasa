/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep Space Cosmic Obsidian Palette (Award-Winning Space Agency Tone)
        space: {
          void: '#030712',      // Deepest black-navy cosmic void
          deep: '#060A14',      // Primary page background
          surface: '#0B1120',   // Card & viewport background
          card: '#0F172A',      // Raised glassmorphism container
          hover: '#1E293B',     // Active / hover state
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(56, 189, 248, 0.35)',
        },
        // Crisp Titanium & Starlight Typography
        starlight: {
          white: '#FFFFFF',
          bright: '#F8FAFC',
          muted: '#CBD5E1',
          dim: '#94A3B8',
          subtle: '#64748B',
        },
        // Planetary Accent Tones
        mars: {
          DEFAULT: '#F97316',   // High-chroma Mars Ember
          glow: '#FB923C',
          dark: '#9A3412',
          tint: 'rgba(249, 115, 22, 0.12)',
        },
        lunar: {
          DEFAULT: '#E2E8F0',   // Lunar Highland Regolith Silver
          bright: '#FFFFFF',
          dark: '#64748B',
          tint: 'rgba(226, 232, 240, 0.10)',
        },
        earth: {
          DEFAULT: '#38BDF8',   // Blue Marble Atmospheric Cyan
          bright: '#7DD3FC',
          dark: '#0369A1',
          tint: 'rgba(56, 189, 248, 0.12)',
        },
        telemetry: {
          cyan: '#38BDF8',
          amber: '#F59E0B',
          emerald: '#10B981',
          rose: '#F43F5E',
          purple: '#A855F7',
        }
      },
      fontFamily: {
        grotesk: ['"Space Grotesk"', 'sans-serif'],
        inter: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        'cosmic-glow': '0 0 50px -10px rgba(56, 189, 248, 0.25)',
        'mars-glow': '0 0 50px -10px rgba(249, 115, 22, 0.30)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'glass-hover': '0 12px 40px 0 rgba(0, 0, 0, 0.65)',
      },
      backgroundImage: {
        'cosmic-gradient': 'radial-gradient(ellipse at top, rgba(14, 165, 233, 0.12) 0%, rgba(3, 7, 18, 0.95) 70%, #030712 100%)',
        'mars-gradient': 'radial-gradient(ellipse at top right, rgba(249, 115, 22, 0.15) 0%, transparent 60%)',
        'subtle-grid': 'linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
      }
    },
  },
  plugins: [],
}
