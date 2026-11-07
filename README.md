# ORBiALOG — Terrestrial Planetary Analogs Research Platform
### NASA Space Apps Challenge 2026 Competition Entry

> **"EARTH IS OUR LABORATORY."**  
> *SYS-REF: ORB-TERRA-2026-V1*

ORBiALOG is an advanced planetary science web experience designed to investigate how extreme terrestrial environments on Earth serve as scientific and operational analogs for permanent Moon bases (Artemis program) and future human exploration sites on Mars.

---

## 🛰️ Creative Direction & Visual Architecture

Conceived from the ground up as a serious aerospace research console rather than a generic SaaS website:

- **NASA Mission Control & Laboratory Aesthetic**: High-contrast, restrained color hierarchy utilizing Mars Rust (`#B75B3D`), Warm Mineral White (`#E8E5DC`), Muted Stone Gray (`#88877F`), Obsidian (`#191B19`), and Deep Charcoal (`#111311`).
- **Cartographic & Telemetry Precision**: Micro-graticules, crosshair reticle datum markers, geodetic WGS-84 / IAU-2000 coordinate overlays, and real-time ephemeris metrics.
- **Audio Feedback Subsystem**: Built-in Web Audio API synthesizer producing authentic aerospace telemetry pulses and confirmation chirps without external audio dependencies.

---

## 🔭 Core Functional Modules

### 1. Planetary Explorer (`/explorer`)
- **Interactive 3D Celestial Bodies**: Procedurally textured, physically lit 3D models of Earth, the Moon, and Mars rendered using Three.js and React Three Fiber.
- **Strategic Target Reconnaissance**:
  - **The Moon**: Lunar South Pole (Shackleton Crater rim / cold traps), Mare Tranquillitatis (basaltic plains), Marius Hills Pit (subterranean lava tube).
  - **Mars**: Jezero Crater (river delta & mudstones), Gale Crater (Mount Sharp aeolian yardangs), Valles Marineris (canyon rifting).
  - **Earth**: Terrestrial baseline laboratory (1.0 g, 101.3 kPa control benchmark).

### 2. Earth Analog Discovery (`/discovery`)
- **GIS Cartographic Engine**: Custom equirectangular vector projection map with real-time cursor lat/lng coordinate tracking, zoom/pan navigation, and preset focus on Egyptian testing sites.
- **Egyptian Candidate Analog Sites** *(Clearly labeled as candidate sites under scientific study)*:
  - **White Desert (Sahara el Beyda, Egypt)**: Khoman chalk yardangs and hyper-arid aeolian deflation—analog for Martian yardangs in Gale Crater and Medusae Fossae.
  - **Qattara Depression (Egypt)**: Sub-sea level basin (-133m), hypersaline sabkhas, and evaporite duricrusts—analog for Jezero paleolake evaporites.
  - **Sinai Peninsula (Southern Highlands, Egypt)**: Precambrian granites, basalt dikes, and arid wadi networks—analog for Martian canyon tributaries and rover rock scrambling.
- **Global Validated Analogs**: Atacama Desert (Chile), McMurdo Dry Valleys (Antarctica), Devon Island Haughton Crater (Canada), Mauna Loa HI-SEAS (Hawaii), Lanzarote Geopark (ESA PANGAEA, Spain), Rio Tinto (Spain).

### 3. Quantitative Comparison Engine (`/comparison`)
- **9-Axis Radar & Bar Parity Charts**: Cross-correlates planetary targets against terrestrial analogs across 9 dimensions:
  1. Terrain Roughness & Boulders
  2. Slope & Incline Gradients
  3. Thermal Range & Diurnal Cycling
  4. Aeolian & Wind Mechanics
  5. Mineralogical & Chemical Match
  6. Volatiles & Water Indicators
  7. Optical Dust Obscuration
  8. Geomechanical Regolith Shear
  9. Operational Logistics & Access
- **Interactive Dimension Inspector**: Drill down into scientific rationales, hardware risks, and similarity ratings.

### 4. Mission Suitability & The Planetary Gap (`/suitability`)
- **6 Critical Aerospace Disciplines**: Rover Mobility & Traction, Autonomous Navigation & SLAM, Planetary Field Geology, In-Situ Resource Utilization (ISRU), Extreme Habitat Engineering, and EVA Suit Biomechanics.
- **The "Planetary Gap" Matrix**: Authoritative demarcation between what Earth can replicate versus physical boundary limitations (gravity discrepancies, hard vacuum, cosmic rays, electrostatic dust cling) with aerospace mitigation strategies.

### 5. Scientific Data Integration Sandbox (`/data-sandbox`)
- Interactive REST simulation inspecting real payload schemas from:
  - **NASA MRO CRISM** (Hyperspectral 544-band infrared spectrometry)
  - **NASA LRO LOLA** (Laser altimetry polar topographic DEMs)
  - **NASA Earthdata ASTER GDEM v3** (Stereo digital elevation models)
  - **USGS Astrogeology** (Unified Global Geologic Map of Mars)

---

## 🛠️ Technical Stack

- **Framework**: React 18 with TypeScript
- **Bundler & Tooling**: Vite 6, Tailwind CSS, PostCSS, Autoprefixer
- **3D Engine**: Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`)
- **Scientific Visualization**: Recharts (Radar, Spider, and Horizontal Bar charts)
- **Audio Synthesis**: Native Web Audio API procedural synthesizer

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run TypeScript compilation check
npx tsc --noEmit

# Build production bundle
npm run build
```

Application local development server: `http://127.0.0.1:3000/`

