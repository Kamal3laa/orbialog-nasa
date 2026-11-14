import { PlanetaryTarget } from '../types';

export const PLANETARY_TARGETS: PlanetaryTarget[] = [
  // --- MOON TARGETS ---
  {
    id: 'luna-south-pole',
    planet: 'moon',
    name: 'Lunar South Pole & PSRs',
    designation: 'LUNA-SP-001',
    coordinates: '89.9°S, 0.0°E',
    latitude: -89.9,
    longitude: 0.0,
    elevation: '-3,850 m to +1,200 m (LOLA datum)',
    temperatureRange: {
      min: 38, // 38K in PSRs
      max: 220, // 220K on peaks
      unit: 'K',
    },
    illumination: 'Quasi-permanent illumination (75-92%) on ridge peaks; 0% in crater interiors (Permanently Shadowed Regions)',
    pressure: '3 × 10⁻¹⁵ bar (Ultra-high vacuum)',
    gravity: '1.62 m/s² (0.166 g)',
    surfaceType: 'Anorthositic highland regolith, micro-impact comminuted powder, cryogenic volatiles',
    geologicalContext: 'Ancient highland crust heavily battered by impact bombardment. South Pole-Aitken (SPA) basin rim material provides deep mantle-crust excavation samples.',
    primaryFeatures: [
      'Cryogenic cold traps harbouring water ice deposits (10-100 ppm H equivalent)',
      'Extreme low solar elevation angles generating dramatic terrain shadows',
      'Highland anorthosite blocks intermixed with impact melt breccias',
      'Electrostatic dust levitation along the moving lunar terminator'
    ],
    keyObjectives: [
      'Validate cryogenic regolith drill mechanisms down to 1.5m depth',
      'Calibrate LiDAR and optical terrain-relative navigation in high-contrast shadow conditions',
      'Test solar array tracking on rotating elevated mast structures',
      'Characterize wheel-slip traction in ultra-fine highland simulant (NU-LHT-2M)'
    ],
    recommendedAnalogs: ['egypt-white-desert', 'antarctica-dry-valleys', 'svalbard-spitsbergen', 'devon-island'],
    primaryDatasets: [
      {
        name: 'LRO LOLA Polar DEM 20m',
        mission: 'Lunar Reconnaissance Orbiter',
        instrument: 'Lunar Orbiter Laser Altimeter',
        resolution: '20 m/pixel',
        linkTitle: 'PDS Geosciences Node / LOLA-GDR'
      },
      {
        name: 'Diviner Thermal Radiometer Polar Map',
        mission: 'Lunar Reconnaissance Orbiter',
        instrument: 'Diviner Infrared Experiment',
        resolution: '240 m/pixel',
        linkTitle: 'LRO Diviner Polar Cold-Trap Catalog'
      },
      {
        name: 'Mini-RF Bistatic Radar Polar Mosaic',
        mission: 'LRO / Chandrayaan-1',
        instrument: 'Synthetic Aperture Radar',
        resolution: '15 m/pixel',
        linkTitle: 'PDS Cartography Node'
      }
    ],
    imagery: {
      overview: 'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?auto=format&fit=crop&w=1200&q=80',
      elevationMap: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80',
      spectralOverlay: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80'
    },
    metrics: {
      morphologyScore: 92,
      roughnessIndex: 88,
      slopeVariance: 79,
      thermalInertia: 65,
      mineralMatchIndex: 84,
      volatilePotential: 96
    }
  },
  {
    id: 'luna-shackleton-crater',
    planet: 'moon',
    name: 'Shackleton Crater Rim',
    designation: 'LUNA-SHK-002',
    coordinates: '89.67°S, 129.78°E',
    latitude: -89.67,
    longitude: 129.78,
    elevation: 'Rim crest: +1,180 m; Floor: -4,200 m (Depth: 4.2 km)',
    temperatureRange: {
      min: 40,
      max: 215,
      unit: 'K',
    },
    illumination: 'Rim crest illuminated ~86% of the lunar year; floor is 100% dark (T < 90 K)',
    pressure: '3 × 10⁻¹⁵ bar',
    gravity: '1.62 m/s²',
    surfaceType: 'Steep impact rim (slopes 28°–32°), impact breccia, coarse ejecta blocks',
    geologicalContext: 'Impact crater of Upper Imbrian age (~3.6 Ga) situated on the edge of the South Pole-Aitken basin. Inner wall preserves undisturbed bedrock stratigraphy.',
    primaryFeatures: [
      '4.2 km sheer inner crater wall with hazardous 30° gravel scree slopes',
      'Sharp crater rim providing optimal continuous solar power and direct line-of-sight to Earth',
      'Volatile cold-traps confirmed by LRO LCROSS and Mini-RF radar CPR measurements',
      'High concentrations of crystalline anorthositic rock fragments'
    ],
    keyObjectives: [
      'Test tethered rappel robotics and extreme-slope mobility systems',
      'Assess regolith thermal blanket performance across 180 K thermal gradients',
      'Simulate habitat foundation construction on sharp topography ridges',
      'Validate dust ingress protection for rotating airlocks and EVA suits'
    ],
    recommendedAnalogs: ['egypt-sinai-granite', 'devon-island', 'hawaii-maunakea'],
    primaryDatasets: [
      {
        name: 'LROC NAC High-Resolution DTM',
        mission: 'Lunar Reconnaissance Orbiter',
        instrument: 'Narrow Angle Camera',
        resolution: '1.5 m/pixel',
        linkTitle: 'LROC Science Operations Center'
      },
      {
        name: 'LOLA 5m Polar Precision Profile',
        mission: 'LRO',
        instrument: 'Laser Altimeter',
        resolution: '5 m spatial',
        linkTitle: 'USGS Astrogeology LOLA Mosaic'
      }
    ],
    imagery: {
      overview: 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?auto=format&fit=crop&w=1200&q=80',
      elevationMap: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80',
      spectralOverlay: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80'
    },
    metrics: {
      morphologyScore: 95,
      roughnessIndex: 94,
      slopeVariance: 92,
      thermalInertia: 71,
      mineralMatchIndex: 80,
      volatilePotential: 98
    }
  },
  {
    id: 'luna-mare-tranquillitatis',
    planet: 'moon',
    name: 'Mare Tranquillitatis & Lava Tubes',
    designation: 'LUNA-MAR-003',
    coordinates: '8.5°N, 31.4°E',
    latitude: 8.5,
    longitude: 31.4,
    elevation: '-1,300 m to -800 m (LOLA datum)',
    temperatureRange: {
      min: 100, // Lunar night
      max: 390, // Lunar noon (117°C)
      unit: 'K',
    },
    illumination: '14 Earth days continuous sunlight followed by 14 Earth days dark',
    pressure: '3 × 10⁻¹⁵ bar',
    gravity: '1.62 m/s²',
    surfaceType: 'Titanium-rich flood basalts (High-Ti mare, ilmenite FeTiO₃), pyroxene regolith',
    geologicalContext: 'Ancient volcanic plain formed by massive basaltic lava outpourings filling the Tranquillitatis impact basin (~3.7 to 3.5 Ga). Contains the famous 100m diameter skylight pit leading into an intact sub-surface lava tube.',
    primaryFeatures: [
      'Sub-surface lava tube cavern offering 100% cosmic radiation shielding',
      'High-titanium basalt regolith with abundant ilmenite suitable for ISRU oxygen extraction',
      'Flat topography ideal for landing pads and early lunar base surface infrastructure',
      'Prominent wrinkle ridges and graben faults indicative of tectonic cooling stress'
    ],
    keyObjectives: [
      'Test subterranean speleological robots and cave wireless mesh relays',
      'Demonstrate hydrogen reduction of ilmenite for continuous oxygen production',
      'Evaluate high-speed rover traversing over basaltic flat plains',
      'Assess landing plume blast ejecta damage on perimeter instruments'
    ],
    recommendedAnalogs: ['egypt-sinai-granite', 'hawaii-maunakea', 'svalbard-spitsbergen'],
    primaryDatasets: [
      {
        name: 'Kaguya TC Stereo DTM & Pit Catalog',
        mission: 'SELENE (Kaguya)',
        instrument: 'Terrain Camera',
        resolution: '10 m/pixel',
        linkTitle: 'JAXA DARTS Lunar Archive'
      },
      {
        name: 'LROC NAC Pit Oblique Imagery',
        mission: 'LRO',
        instrument: 'Narrow Angle Camera',
        resolution: '0.5 m/pixel',
        linkTitle: 'LROC Pit Exploration Database'
      }
    ],
    imagery: {
      overview: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      elevationMap: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80',
      spectralOverlay: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80'
    },
    metrics: {
      morphologyScore: 81,
      roughnessIndex: 62,
      slopeVariance: 48,
      thermalInertia: 86,
      mineralMatchIndex: 91,
      volatilePotential: 42
    }
  },

  // --- MARS TARGETS ---
  {
    id: 'mars-jezero-crater',
    planet: 'mars',
    name: 'Jezero Crater Paleolake Delta',
    designation: 'MARS-JEZ-001',
    coordinates: '18.38°N, 77.58°E',
    latitude: 18.38,
    longitude: 77.58,
    elevation: '-2,500 m to -2,200 m (MOLA datum)',
    temperatureRange: {
      min: -90,
      max: -10,
      unit: '°C',
    },
    illumination: 'Diurnal solar cycle: 24h 39m 35s (1 Sol). High atmospheric dust scattering during storm seasons.',
    pressure: '6.1 mbar (CO₂ rich atmosphere: 95.3%)',
    gravity: '3.72 m/s² (0.379 g)',
    surfaceType: 'Fluvial-lacustrine sedimentary fan, carbonate-rich mudstones, clay minerals (smectite), olivine bedrock',
    geologicalContext: 'Ancient 45 km diameter impact crater that hosted a long-lived open-basin lake system during the Noachian–Hesperian transition (~3.7 Ga). Inflow and outflow river valleys formed preserved fan deltas.',
    primaryFeatures: [
      'Layered deltaic sediment deposits with high biosignature preservation potential',
      'Hydrated magnesium-rich carbonate minerals formed in alkaline lacustrine waters',
      'Diverse aeolian ripples and sand sheets (Séítah formation) causing wheel entrapment hazards',
      'Crater rim scarps showing exposed basement lithology'
    ],
    keyObjectives: [
      'Evaluate autonomous sample collection, hermetic sealing, and depot caching protocols',
      'Test multi-spectral Raman and PIXL spectrometer calibration on fine sediment matrices',
      'Refine autonomous hazard detection in boulder-strewn delta fronts',
      'Model atmospheric CO₂ capture efficiency for MOXIE-class ISRU systems'
    ],
    recommendedAnalogs: ['egypt-white-desert', 'egypt-qattara-depression', 'western-australia-pilbara', 'atacama-yungay'],
    primaryDatasets: [
      {
        name: 'MRO HiRISE Color Mosaic (0.25m)',
        mission: 'Mars Reconnaissance Orbiter',
        instrument: 'HiRISE',
        resolution: '0.25 m/pixel',
        linkTitle: 'HiRISE Operations Center / Jezero Landing Site'
      },
      {
        name: 'MRO CRISM Hyperspectral Mineral Map',
        mission: 'Mars Reconnaissance Orbiter',
        instrument: 'CRISM',
        resolution: '18 m/pixel',
        linkTitle: 'PDS Geosciences CRISM Spectral Library'
      },
      {
        name: 'Mars Express HRSC DTM',
        mission: 'Mars Express (ESA)',
        instrument: 'High Resolution Stereo Camera',
        resolution: '12.5 m/pixel',
        linkTitle: 'ESA Planetary Science Archive'
      }
    ],
    imagery: {
      overview: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80',
      elevationMap: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      spectralOverlay: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80'
    },
    metrics: {
      morphologyScore: 94,
      roughnessIndex: 78,
      slopeVariance: 68,
      thermalInertia: 83,
      mineralMatchIndex: 96,
      volatilePotential: 88
    }
  },
  {
    id: 'mars-gale-crater',
    planet: 'mars',
    name: 'Gale Crater & Mount Sharp (Aeolis Mons)',
    designation: 'MARS-GAL-002',
    coordinates: '5.4°S, 137.8°E',
    latitude: -5.4,
    longitude: 137.8,
    elevation: '-4,400 m at crater floor to +1,100 m on Mt Sharp',
    temperatureRange: {
      min: -100,
      max: 0,
      unit: '°C',
    },
    illumination: 'Equatorial diurnal cycle; moderate opacity variability (Tau 0.3 - 2.5)',
    pressure: '7.5 - 9.0 mbar',
    gravity: '3.72 m/s²',
    surfaceType: 'Stratified sedimentary sequence, hematite ridge, sulfate-bearing strata, active sand dunes (Bagnold)',
    geologicalContext: '154 km impact crater featuring a 5.5 km high central mound (Aeolis Mons) preserving billions of years of Mars climatic history transition from wet clay-rich conditions to arid sulfate-forming environments.',
    primaryFeatures: [
      '5.5 km vertical stratigraphy chronicling Mars drying-out era',
      'Active dark basaltic sand dunes with high grain saltation rates',
      'Hematite ridges and manganese oxide veins indicating fluctuating redox groundwater',
      'Mudstone fractures filled with calcium sulfate veins (gypsum/anhydrite)'
    ],
    keyObjectives: [
      'Calibrate drill bit longevity on resistant sulfate-rich caprocks',
      'Benchmark long-distance autonomous navigation through active sand dunes',
      'Study dust accumulation rates on thermal radiators and optical solar panels',
      'Model atmospheric boundary layer turbulence in deep crater basins'
    ],
    recommendedAnalogs: ['egypt-white-desert', 'egypt-qattara-depression', 'atacama-yungay', 'tabernas-spain'],
    primaryDatasets: [
      {
        name: 'MRO CTX Mosaic Gale Basin',
        mission: 'Mars Reconnaissance Orbiter',
        instrument: 'Context Camera',
        resolution: '6 m/pixel',
        linkTitle: 'USGS Astrogeology Mars CTX Mosaic'
      },
      {
        name: 'MOLA Global Elevation Model (MEGDR)',
        mission: 'Mars Global Surveyor',
        instrument: 'Mars Orbiter Laser Altimeter',
        resolution: '463 m/pixel',
        linkTitle: 'PDS MOLA Gridded Dataset'
      }
    ],
    imagery: {
      overview: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80',
      elevationMap: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80',
      spectralOverlay: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80'
    },
    metrics: {
      morphologyScore: 91,
      roughnessIndex: 82,
      slopeVariance: 85,
      thermalInertia: 80,
      mineralMatchIndex: 93,
      volatilePotential: 75
    }
  },
  {
    id: 'mars-valles-marineris',
    planet: 'mars',
    name: 'Valles Marineris (Melas Chasma)',
    designation: 'MARS-VLM-003',
    coordinates: '9.8°S, 283.6°E',
    latitude: -9.8,
    longitude: 283.6,
    elevation: '-3,000 m to -7,500 m (Extreme depression depths)',
    temperatureRange: {
      min: -85,
      max: +5,
      unit: '°C',
    },
    illumination: 'Deep canyon walls cast prolonged morning and afternoon shadows',
    pressure: '9.5 - 11.5 mbar (highest atmospheric pressure on Mars)',
    gravity: '3.72 m/s²',
    surfaceType: 'Exposed crustal mega-cliffs, massive landslide debris lobes, interior layered deposits (ILDs)',
    geologicalContext: 'The solar system’s largest canyon system (>4,000 km long, up to 7 km deep, 200 km wide). Formed by crustal rifting coupled with glacial and aqueous erosion episodes during the Hesperian.',
    primaryFeatures: [
      'Exposed vertical stratigraphy cutting down into ancient Noachian basement rock',
      'Massive landslide avalanches with hummocky runout deposits extending 60 km',
      'Interior layered deposits rich in polyhydrated and monohydrated sulfates',
      'Highest ambient Martian surface atmospheric pressure, potentially permitting near-triple-point liquid brine stability'
    ],
    keyObjectives: [
      'Test autonomous eVTOL / planetary drone aerodynamics in low-density atmosphere',
      'Assess seismic sensor deployment along active fault scarps',
      'Simulate cliff-face descent exploration and core drilling mechanisms',
      'Investigate recurrent slope lineae (RSL) wet brine flow mechanisms'
    ],
    recommendedAnalogs: ['egypt-sinai-granite', 'egypt-qattara-depression', 'devon-island'],
    primaryDatasets: [
      {
        name: 'THEMIS Daytime IR Thermal Mosaic',
        mission: 'Mars Odyssey',
        instrument: 'Thermal Emission Imaging System',
        resolution: '100 m/pixel',
        linkTitle: 'Arizona State University Mars THEMIS Portal'
      },
      {
        name: 'HRSC Color Orthomosaic Melas Chasma',
        mission: 'Mars Express',
        instrument: 'HRSC High-Resolution Stereo Camera',
        resolution: '12.5 m/pixel',
        linkTitle: 'Freie Universität Berlin HRSC Team'
      }
    ],
    imagery: {
      overview: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      elevationMap: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      spectralOverlay: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80'
    },
    metrics: {
      morphologyScore: 97,
      roughnessIndex: 96,
      slopeVariance: 98,
      thermalInertia: 89,
      mineralMatchIndex: 88,
      volatilePotential: 82
    }
  }
];

