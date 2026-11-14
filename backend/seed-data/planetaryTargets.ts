import { PlanetaryTarget } from '../types';

export const PLANETARY_TARGETS: PlanetaryTarget[] = [
  // -------------------------------------------------------------------------
  // 1. LUNA: South Pole & Permanently Shadowed Regions (PSRs)
  // -------------------------------------------------------------------------
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
    surfaceType: 'Anorthositic highland regolith, micro-impact comminuted powder, cryogenic volatile traps',
    geologicalContext: 'Ancient highland crust heavily battered by impact bombardment. South Pole-Aitken (SPA) basin rim material provides deep mantle-crust excavation samples.',
    primaryFeatures: [
      'Cryogenic cold traps harbouring water ice deposits (10-100 ppm H equivalent)',
      'Extreme low solar elevation angles generating dramatic dynamic terrain shadows',
      'Highland anorthosite blocks intermixed with impact melt breccias',
      'Electrostatic dust levitation along the moving lunar terminator'
    ],
    keyObjectives: [
      'Validate cryogenic regolith drill mechanisms down to 1.5m depth',
      'Calibrate LiDAR and optical terrain-relative navigation in high-contrast shadow conditions',
      'Test solar array tracking on rotating elevated mast structures',
      'Characterize wheel-slip traction in ultra-fine highland simulant (NU-LHT-2M)'
    ],
    recommendedAnalogs: ['antarctica-dry-valleys', 'devon-island', 'svalbard-spitsbergen', 'egypt-white-desert'],
    
    // REAL NASA PDS & LRO DATA IDENTIFIERS
    pdsProductUrn: 'urn:nasa:pds:lro_lola:data_gdr:polar_dem_20m',
    pdsArchiveUrl: 'https://pds-geosciences.wustl.edu/missions/lro/lola.htm',
    lolaElevationDatum: {
      minMeters: -3850,
      maxMeters: 1200,
      meanSlopeDeg: 14.8,
      rmsRoughnessMeters: 2.1
    },
    divinerThermalProfile: {
      minKelvin: 38,
      maxKelvin: 220,
      psrColdTrapTemp: '38.4 K (-234.8°C)',
      christiansenFeatureUm: 8.05,
      rockAbundancePercent: 0.8
    },
    radarScattering: {
      instrument: 'Mini-RF Bistatic Radar SAR (S-band)',
      cprRatio: 1.25,
      subsurfacePenetrationMeters: 2.5
    },
    hyperspectralBands: {
      instrument: 'LRO LAMP / M3 Moon Mineralogy Mapper',
      absorptionFeatures: ['165 nm (H2O frost albedo)', '1.5 µm (ice absorption)', '2.0 µm (H2O ice band)'],
      keyMinerals: ['Ferroan Anorthosite', 'Water Ice (Cryogenic)', 'Ilmenite', 'Pyroxene']
    },
    realAgencyGranules: [
      {
        name: 'LOLA Polar Digital Elevation Model 20m',
        agency: 'NASA LRO',
        instrument: 'Lunar Orbiter Laser Altimeter (LOLA)',
        granuleId: 'LDEM_80S_20M_FLOAT',
        portalUrl: 'https://pds-geosciences.wustl.edu/missions/lro/lola.htm'
      },
      {
        name: 'Diviner Polar Minimum Surface Temperature Map',
        agency: 'NASA LRO',
        instrument: 'Diviner Lunar Radiometer (DLRE)',
        granuleId: 'DLRE_TMIN_POLAR_SOUTH_240M',
        portalUrl: 'https://pds-geosciences.wustl.edu/missions/lro/diviner.htm'
      },
      {
        name: 'LROC NAC South Pole Controlled Orthomosaic',
        agency: 'NASA PDS',
        instrument: 'LROC Narrow Angle Camera (0.5m/px)',
        granuleId: 'NAC_POLE_SOUTH_MOSAIC_V2',
        portalUrl: 'https://quickmap.lroc.asu.edu/'
      }
    ],
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
        instrument: 'Diviner Infrared Experiment (DLRE)',
        resolution: '240 m/pixel',
        linkTitle: 'LRO Diviner Polar Cold-Trap Catalog'
      },
      {
        name: 'Mini-RF Bistatic Radar Polar Mosaic',
        mission: 'LRO / Chandrayaan-1',
        instrument: 'Synthetic Aperture Radar (SAR)',
        resolution: '15 m/pixel',
        linkTitle: 'PDS Cartography Node'
      }
    ],
    imagery: {
      overview: 'https://images-assets.nasa.gov/image/PIA12953/PIA12953~orig.jpg',
      elevationMap: 'https://images-assets.nasa.gov/image/PIA13523/PIA13523~orig.jpg',
      spectralOverlay: 'https://images-assets.nasa.gov/image/PIA13517/PIA13517~orig.jpg'
    },
    metrics: {
      morphologyScore: 94,
      roughnessIndex: 89,
      slopeVariance: 81,
      thermalInertia: 67,
      mineralMatchIndex: 86,
      volatilePotential: 98
    }
  },

  // -------------------------------------------------------------------------
  // 2. LUNA: Shackleton Crater Rim
  // -------------------------------------------------------------------------
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
      'Deploy microwave sintering regolith landing pad anchors',
      'Evaluate cryogenic lubricant degradation at 40 Kelvin',
      'Map sub-surface volatile stratification with active neutron sounding'
    ],
    recommendedAnalogs: ['devon-island', 'antarctica-dry-valleys', 'iceland-askja', 'svalbard-spitsbergen'],

    pdsProductUrn: 'urn:nasa:pds:lro_diviner:data_rdr:shackleton_tbol_cycle',
    pdsArchiveUrl: 'https://pds-geosciences.wustl.edu/missions/lro/diviner.htm',
    lolaElevationDatum: {
      minMeters: -4200,
      maxMeters: 1180,
      meanSlopeDeg: 31.8,
      rmsRoughnessMeters: 4.8
    },
    divinerThermalProfile: {
      minKelvin: 40,
      maxKelvin: 215,
      psrColdTrapTemp: '41.2 K (-232.0°C)',
      christiansenFeatureUm: 7.95,
      rockAbundancePercent: 1.4
    },
    radarScattering: {
      instrument: 'LRO Mini-RF SAR',
      cprRatio: 1.38,
      subsurfacePenetrationMeters: 1.8
    },
    hyperspectralBands: {
      instrument: 'Diviner Band 7/8 Radiometer',
      absorptionFeatures: ['7.8 µm (CF Anorthosite)', '100 µm (Thermal emission)'],
      keyMinerals: ['Pure Anorthosite (PAN)', 'Shocked Plagioclase', 'Agglutinates']
    },
    realAgencyGranules: [
      {
        name: 'LOLA 5m/px Shackleton DEM Tile',
        agency: 'NASA LRO',
        instrument: 'LOLA Laser Altimeter',
        granuleId: 'LOLA_SHACKLETON_DTM_5M',
        portalUrl: 'https://pds-geosciences.wustl.edu/missions/lro/lola.htm'
      },
      {
        name: 'LRO Diviner Rock Abundance & Channel 8 Radiance',
        agency: 'NASA LRO',
        instrument: 'Diviner DLRE',
        granuleId: 'DLRE_RA_SHACKLETON_001',
        portalUrl: 'https://pds-geosciences.wustl.edu/missions/lro/diviner.htm'
      }
    ],
    primaryDatasets: [
      {
        name: 'LROC NAC DEM 5m',
        mission: 'Lunar Reconnaissance Orbiter',
        instrument: 'Narrow Angle Camera',
        resolution: '5 m/pixel',
        linkTitle: 'LROC Science Operations Center'
      },
      {
        name: 'LOLA DTM Polar Mosaic',
        mission: 'Lunar Reconnaissance Orbiter',
        instrument: 'LOLA',
        resolution: '20 m/pixel',
        linkTitle: 'PDS Geosciences Node'
      }
    ],
    imagery: {
      overview: 'https://images-assets.nasa.gov/image/PIA12953/PIA12953~orig.jpg',
      elevationMap: 'https://images-assets.nasa.gov/image/PIA13523/PIA13523~orig.jpg',
      spectralOverlay: 'https://images-assets.nasa.gov/image/PIA13517/PIA13517~orig.jpg'
    },
    metrics: {
      morphologyScore: 96,
      roughnessIndex: 94,
      slopeVariance: 92,
      thermalInertia: 73,
      mineralMatchIndex: 88,
      volatilePotential: 97
    }
  },

  // -------------------------------------------------------------------------
  // 3. LUNA: Oceanus Procellarum - Marius Hills
  // -------------------------------------------------------------------------
  {
    id: 'luna-marius-hills',
    planet: 'moon',
    name: 'Marius Hills Lava Tubes & Skylights',
    designation: 'LUNA-MAR-003',
    coordinates: '14.08°N, 56.77°W',
    latitude: 14.08,
    longitude: -56.77,
    elevation: '-2,450 m to -1,980 m',
    temperatureRange: {
      min: 102,
      max: 395,
      unit: 'K',
    },
    illumination: 'Equatorial diurnally cycling illumination (~14 Earth days sun, ~14 Earth days night)',
    pressure: '3 × 10⁻¹⁵ bar',
    gravity: '1.62 m/s²',
    surfaceType: 'Mare basalt sheets, volcanic cones, collapse pit skylight, subterranean void',
    geologicalContext: 'The largest volcanic dome field on the Moon. Characterized by sinuous rilles, low shield volcanoes, and a 65m diameter skylight leading into a subterranean lava tube cavity.',
    primaryFeatures: [
      'Marius Hills Pit: 65m wide, 80m deep vertical collapse skylight',
      'Subterranean lava tube cavern protected from cosmic radiation and micrometeorites',
      'Thermal stability inside tube cavity (~290 K constant)',
      'Titanium-rich mare basalt (high-Ti) regolith composition'
    ],
    keyObjectives: [
      'Validate vertical descent and autonomous ingress robotics into unmapped voids',
      'Test subterranean LiDAR SLAM mapping in pitch-black cavern environments',
      'Characterize radio communication relay through basaltic overburden',
      'Assess cavern roof structural load capacity for human habitat construction'
    ],
    recommendedAnalogs: ['hawaii-mauna-kea', 'iceland-askja', 'egypt-sinai', 'spain-tabernas'],

    pdsProductUrn: 'urn:nasa:pds:lro_lroc:data_nac:marius_pit_skylight',
    pdsArchiveUrl: 'https://pds-geosciences.wustl.edu/missions/lro/',
    lolaElevationDatum: {
      minMeters: -2450,
      maxMeters: -1980,
      meanSlopeDeg: 6.2,
      rmsRoughnessMeters: 1.2
    },
    divinerThermalProfile: {
      minKelvin: 102,
      maxKelvin: 395,
      psrColdTrapTemp: 'Sub-surface pit: 290 K (17°C) constant',
      christiansenFeatureUm: 8.25,
      rockAbundancePercent: 4.6
    },
    radarScattering: {
      instrument: 'SELENE (Kaguya) Lunar Radar Sounder',
      cprRatio: 0.52,
      subsurfacePenetrationMeters: 75.0
    },
    hyperspectralBands: {
      instrument: 'M3 Moon Mineralogy Mapper',
      absorptionFeatures: ['1.0 µm (Olivine-Pyroxene)', '2.0 µm (Clinopyroxene)', 'TiO2 absorption'],
      keyMinerals: ['High-Ti Ilmenite Basalt', 'Augite', 'Pigeonite', 'Spinel']
    },
    realAgencyGranules: [
      {
        name: 'LROC NAC Stereo Pit Observation M114328462R',
        agency: 'NASA LRO',
        instrument: 'LROC NAC (0.5m/px)',
        granuleId: 'M114328462R',
        portalUrl: 'https://quickmap.lroc.asu.edu/?extent=14.08,-56.77'
      },
      {
        name: 'LRO Diviner Equator Diurnal Thermal Cycle',
        agency: 'NASA LRO',
        instrument: 'Diviner Radiometer',
        granuleId: 'DLRE_MARIUS_TBOL_L3',
        portalUrl: 'https://pds-geosciences.wustl.edu/missions/lro/diviner.htm'
      }
    ],
    primaryDatasets: [
      {
        name: 'LROC NAC High-Sun Angle Image Mosaic',
        mission: 'Lunar Reconnaissance Orbiter',
        instrument: 'LROC NAC',
        resolution: '0.5 m/pixel',
        linkTitle: 'LROC ASU Archive'
      },
      {
        name: 'LOLA Regional DTM Mosaic',
        mission: 'Lunar Reconnaissance Orbiter',
        instrument: 'LOLA',
        resolution: '30 m/pixel',
        linkTitle: 'PDS Geosciences Node'
      }
    ],
    imagery: {
      overview: 'https://images-assets.nasa.gov/image/PIA12954/PIA12954~orig.jpg',
      elevationMap: 'https://images-assets.nasa.gov/image/PIA13179/PIA13179~orig.jpg',
      spectralOverlay: 'https://images-assets.nasa.gov/image/art002e012028/art002e012028~large.jpg'
    },
    metrics: {
      morphologyScore: 88,
      roughnessIndex: 79,
      slopeVariance: 71,
      thermalInertia: 84,
      mineralMatchIndex: 91,
      volatilePotential: 42
    }
  },

  // -------------------------------------------------------------------------
  // 4. MARS: Jezero Crater - Western Fan Delta
  // -------------------------------------------------------------------------
  {
    id: 'mars-jezero-crater',
    planet: 'mars',
    name: 'Jezero Crater - Western Fan Delta',
    designation: 'MARS-JEZ-001',
    coordinates: '18.38°N, 77.58°E',
    latitude: 18.38,
    longitude: 77.58,
    elevation: '-2,500 m to -2,350 m (MOLA datum)',
    temperatureRange: {
      min: 185, // -88°C
      max: 259, // -14°C
      unit: 'K',
    },
    illumination: 'Diurnal solar cycle with severe atmospheric dust attenuation (tau = 0.4–1.8, peak during dust storm season)',
    pressure: '6.1 hPa to 7.8 hPa (CO₂ dominant atmosphere)',
    gravity: '3.72 m/s² (0.379 g)',
    surfaceType: 'Fluvial-lacustrine deltaic clays, carbonates, olivine-rich cumulate floor unit, aeolian mega-yardangs',
    geologicalContext: 'Ancient Noachian-Hesperian lake basin (~3.8 Ga) that breached its western rim, forming a preserved river delta rich in smectite clays and precipitated carbonates ideal for preserving biosignatures.',
    primaryFeatures: [
      'Stratified delta scarp exhibiting cross-bedding and ancient fluvial channel bars',
      'Carbonate-bearing margin units indicating long-lived alkaline lacustrine conditions',
      'Séítah geological unit: crystalline olivine-cumulate igneous basement rock',
      'Wind-sculpted yardangs and abrasive deflation trenches with basaltic sand ripples'
    ],
    keyObjectives: [
      'Collect and seal hermetic sample tubes for Mars Sample Return (MSR)',
      'Characterize fine-grained clay/carbonate matrix with proximity X-ray/Raman spectroscopy',
      'Test autonomous navigation across sharp boulder-strewn deltaic terrain',
      'Benchmark drill abrasion bit wear on silicified carbonate-bearing target rocks'
    ],
    recommendedAnalogs: ['egypt-white-desert', 'chile-atacama', 'australia-pilbara', 'spain-tabernas'],

    pdsProductUrn: 'urn:nasa:pds:mars2020:perseverance:pixl_rdr_delta',
    pdsArchiveUrl: 'https://pds-geosciences.wustl.edu/missions/mars2020/',
    radarScattering: {
      instrument: 'RIMFAX Ground-Penetrating Radar (150-1200 MHz)',
      cprRatio: 0.42,
      subsurfacePenetrationMeters: 9.8
    },
    hyperspectralBands: {
      instrument: 'MRO CRISM FRT00003E12 Targeted Cube',
      absorptionFeatures: [
        '1.41 µm (OH vibrational overtone)',
        '1.92 µm (H2O bound in clay lattices)',
        '2.31 µm (Fe/Mg-smectite octahedron band)',
        '2.52 µm (Mg-carbonate vibrational combination)'
      ],
      keyMinerals: ['Magnesite (MgCO3)', 'Nontronite (Fe-smectite)', 'Saponite', 'Olivine Fo60']
    },
    realAgencyGranules: [
      {
        name: 'MRO CRISM Hyperspectral Cube FRT00003E12',
        agency: 'NASA PDS',
        instrument: 'CRISM Targeted Spectrometer',
        granuleId: 'FRT00003E12_07_IF166L_TRR3',
        portalUrl: 'https://pds-geosciences.wustl.edu/missions/mro/crism.htm'
      },
      {
        name: 'HiRISE Digital Terrain Model PSP_001414_1750',
        agency: 'NASA PDS',
        instrument: 'HiRISE Stereo DTM (1m/px)',
        granuleId: 'DTEEC_001414_1750_001335_1750_A01',
        portalUrl: 'https://www.uahirise.org/dtm/dtm.php?ID=PSP_001414_1750'
      },
      {
        name: 'Perseverance Rover PIXL Micro-XRF Delta Scarp Scan',
        agency: 'NASA PDS',
        instrument: 'Mars 2020 PIXL Spectrometer',
        granuleId: 'PIX_0241_0692738410_000ECM_N0010052',
        portalUrl: 'https://pds-geosciences.wustl.edu/missions/mars2020/'
      }
    ],
    primaryDatasets: [
      {
        name: 'HiRISE DTM 1m (Jezero Delta Front)',
        mission: 'Mars Reconnaissance Orbiter',
        instrument: 'HiRISE Camera',
        resolution: '1.0 m/pixel',
        linkTitle: 'HiRISE Operations Center / PDS'
      },
      {
        name: 'CRISM Hyperspectral Mineral Map (FRT00003E12)',
        mission: 'Mars Reconnaissance Orbiter',
        instrument: 'CRISM',
        resolution: '18 m/pixel',
        linkTitle: 'PDS Geosciences Node'
      },
      {
        name: 'RIMFAX Radar Sounding Profile (Sol 100–350)',
        mission: 'Mars 2020 Perseverance',
        instrument: 'RIMFAX GPR',
        resolution: '15 cm vertical',
        linkTitle: 'NASA PDS Imaging Node'
      }
    ],
    imagery: {
      overview: 'https://images-assets.nasa.gov/image/PIA26252/PIA26252~orig.jpg',
      elevationMap: 'https://images-assets.nasa.gov/image/PIA25350/PIA25350~orig.jpg',
      spectralOverlay: 'https://images-assets.nasa.gov/image/PIA23380/PIA23380~orig.jpg'
    },
    metrics: {
      morphologyScore: 97,
      roughnessIndex: 86,
      slopeVariance: 79,
      thermalInertia: 89,
      mineralMatchIndex: 96,
      volatilePotential: 82
    }
  },

  // -------------------------------------------------------------------------
  // 5. MARS: Gale Crater & Mount Sharp
  // -------------------------------------------------------------------------
  {
    id: 'mars-gale-crater',
    planet: 'mars',
    name: 'Gale Crater & Mount Sharp',
    designation: 'MARS-GAL-002',
    coordinates: '4.59°S, 137.44°E',
    latitude: -4.59,
    longitude: 137.44,
    elevation: 'Floor: -4,450 m; Mount Sharp Peak: +1,050 m (Relief: 5.5 km)',
    temperatureRange: {
      min: 180, // -93°C
      max: 275, // +2°C
      unit: 'K',
    },
    illumination: 'Equatorial diurnal cycle; high solar irradiance moderated by seasonal dust storms',
    pressure: '7.3 hPa to 9.2 hPa (Deep topographic basin depression)',
    gravity: '3.72 m/s²',
    surfaceType: 'Mudstone lacustrine strata (Murray formation), hematite ridges, sulfate-bearing layered mounds, mega-yardang corridors',
    geologicalContext: 'Impact crater of late Noachian/early Hesperian age (~3.7 Ga) with a central sedimentary mound (Aeolis Mons) preserving a continuous rock record spanning billions of years.',
    primaryFeatures: [
      'Mount Sharp (Aeolis Mons): 5.5 km high mound showing dramatic transition from clays to magnesium sulfates',
      'Extensive mega-yardang fields sculpted by strong katabatic and trade winds',
      'Active barchan and longitudinal basalt sand dunes (Bagnold Dune Field)',
      'Veins of pure calcium sulfate (gypsum/bassanite) cutting through ancient mudstones'
    ],
    keyObjectives: [
      'Navigate steep bedrock slopes and slippery active sand ripples without getting stuck',
      'Conduct pyrolysis gas chromatography analysis on organic-bearing mudstones',
      'Model aeolian sand transport and wheel abrasion rates over long traverses',
      'Test autonomous laser-induced breakdown spectroscopy targeting (ChemCam/SuperCam)'
    ],
    recommendedAnalogs: ['egypt-white-desert', 'chile-atacama', 'usa-mojave-jpl', 'egypt-qattara'],

    pdsProductUrn: 'urn:nasa:pds:msl_curiosity:chemcam:ccam01842_spec',
    pdsArchiveUrl: 'https://pds-geosciences.wustl.edu/missions/msl/',
    radarScattering: {
      instrument: 'MRO SHARAD Radar Sounder',
      cprRatio: 0.38,
      subsurfacePenetrationMeters: 24.5
    },
    hyperspectralBands: {
      instrument: 'MRO CRISM HRL000040FF Targeted Cube',
      absorptionFeatures: [
        '1.94 µm (hydrated sulfate absorption)',
        '2.40 µm (polyhydrated sulfate combination)',
        '2.28 µm (nontronite Fe-OH stretch)',
        '0.86 µm (crystalline hematite inflection)'
      ],
      keyMinerals: ['Kieserite (MgSO4·H2O)', 'Bassanite (CaSO4·0.5H2O)', 'Specular Hematite', 'Nontronite']
    },
    realAgencyGranules: [
      {
        name: 'MRO CRISM Hyperspectral Targeted Cube HRL000040FF',
        agency: 'NASA PDS',
        instrument: 'CRISM Hyperspectral Sensor',
        granuleId: 'HRL000040FF_07_IF172L_TRR3',
        portalUrl: 'https://pds-geosciences.wustl.edu/missions/mro/crism.htm'
      },
      {
        name: 'HiRISE DTM Gale Crater Central Mound',
        agency: 'NASA PDS',
        instrument: 'HiRISE Camera',
        granuleId: 'DTEEC_009149_1750_009215_1750_A01',
        portalUrl: 'https://www.uahirise.org/dtm/'
      },
      {
        name: 'MSL Curiosity ChemCam Spectra Sulfate Unit',
        agency: 'NASA PDS',
        instrument: 'ChemCam LIBS',
        granuleId: 'CR0_489284912EDR_F0640000CCAM01842M1',
        portalUrl: 'https://pds-geosciences.wustl.edu/missions/msl/'
      }
    ],
    primaryDatasets: [
      {
        name: 'HiRISE DTM 1m (Mount Sharp Lower Strata)',
        mission: 'Mars Reconnaissance Orbiter',
        instrument: 'HiRISE Camera',
        resolution: '1.0 m/pixel',
        linkTitle: 'HiRISE PDS Archive'
      },
      {
        name: 'CRISM Mineral Composite (HRL000040FF)',
        mission: 'Mars Reconnaissance Orbiter',
        instrument: 'CRISM',
        resolution: '18 m/pixel',
        linkTitle: 'PDS Geosciences Node'
      }
    ],
    imagery: {
      overview: 'https://images-assets.nasa.gov/image/PIA16099/PIA16099~orig.jpg',
      elevationMap: 'https://images-assets.nasa.gov/image/PIA21196/PIA21196~orig.jpg',
      spectralOverlay: 'https://images-assets.nasa.gov/image/PIA21530/PIA21530~orig.jpg'
    },
    metrics: {
      morphologyScore: 95,
      roughnessIndex: 91,
      slopeVariance: 87,
      thermalInertia: 86,
      mineralMatchIndex: 94,
      volatilePotential: 78
    }
  },

  // -------------------------------------------------------------------------
  // 6. MARS: Olympus Mons Aureole & Basalt Plains
  // -------------------------------------------------------------------------
  {
    id: 'mars-olympus-mons',
    planet: 'mars',
    name: 'Olympus Mons Aureole & Basalt Plains',
    designation: 'MARS-OLY-003',
    coordinates: '18.65°N, 226.20°E',
    latitude: 18.65,
    longitude: -133.80,
    elevation: 'Plains: -2,000 m; Basal Escarpment: +6,000 m; Peak: +21,287 m',
    temperatureRange: {
      min: 165, // -108°C at summit
      max: 250, // -23°C at base
      unit: 'K',
    },
    illumination: 'High-altitude attenuated sunlight; extreme diurnal thermal variations',
    pressure: '0.72 hPa (summit) to 4.5 hPa (base plain)',
    gravity: '3.72 m/s²',
    surfaceType: 'Tholeiitic flood basalts, lava tube collapse pits, colossal landslide aureole deposits, pahoehoe flow lobes',
    geologicalContext: 'The largest known shield volcano in the Solar System. The basal escarpment rises up to 8 km above the surrounding plains, surrounded by corrugated landslide aureole lobes spanning over 1,000 km.',
    primaryFeatures: [
      'Massive basaltic lava flows with inflated pahoehoe toes and pressure ridges',
      'Giant lava tube collapse troughs (rilles) exceeding 500m in width',
      'Colossal basal escarpment with sheer 6 km vertical rock cliffs',
      'Minimal regolith cover over recent lava flows (< 100 Ma), exposing pristine basaltic rock'
    ],
    keyObjectives: [
      'Test robotic traversing over rugged vesicular basalt and aa lava terrain',
      'Evaluate deep lava tube structural stability for pressurized planetary habitats',
      'Characterize low-pressure atmospheric aerodynamic braking for entry vehicles',
      'Analyze unaltered mafic rock chemistry without terrestrial weathering overprints'
    ],
    recommendedAnalogs: ['hawaii-mauna-kea', 'iceland-askja', 'egypt-sinai', 'chile-atacama'],

    pdsProductUrn: 'urn:nasa:pds:mgs_mola:data_pedr:olympus_caldera_elev',
    pdsArchiveUrl: 'https://pds-geosciences.wustl.edu/missions/mgs/mola.htm',
    radarScattering: {
      instrument: 'ESA Mars Express MARSIS Subsurface Sounder',
      cprRatio: 0.15,
      subsurfacePenetrationMeters: 65.0
    },
    hyperspectralBands: {
      instrument: 'MRO CRISM Targeted Cube MSP00005C82',
      absorptionFeatures: [
        '0.95 µm (Pyroxene band I absorption)',
        '2.05 µm (Pyroxene band II absorption)',
        '1.05 µm (Olivine doublet feature)'
      ],
      keyMinerals: ['High-Ca Clinopyroxene (Augite)', 'Forsteritic Olivine', 'Titanomagnetite', 'Plagioclase']
    },
    realAgencyGranules: [
      {
        name: 'MGS MOLA Megascience Precision Elevation Profile',
        agency: 'NASA PDS',
        instrument: 'Mars Orbiter Laser Altimeter (MOLA)',
        granuleId: 'MOLA_PEDR_AP12948N_01',
        portalUrl: 'https://pds-geosciences.wustl.edu/missions/mgs/mola.htm'
      },
      {
        name: 'Mars Express HRSC Stereo Color Mosaic Olympus Mons',
        agency: 'ESA PSA',
        instrument: 'High Resolution Stereo Camera (HRSC)',
        granuleId: 'H0037_0000_ND3',
        portalUrl: 'https://archives.esac.esa.int/psa/'
      }
    ],
    primaryDatasets: [
      {
        name: 'HRSC DTM 50m (Olympus Mons Basal Scarp)',
        mission: 'Mars Express (ESA)',
        instrument: 'HRSC',
        resolution: '50 m/pixel',
        linkTitle: 'ESA Planetary Science Archive'
      },
      {
        name: 'MOLA Global Topography 128px/deg',
        mission: 'Mars Global Surveyor',
        instrument: 'MOLA',
        resolution: '463 m/pixel',
        linkTitle: 'PDS Geosciences Node'
      }
    ],
    imagery: {
      overview: 'https://images-assets.nasa.gov/image/PIA10063/PIA10063~orig.jpg',
      elevationMap: 'https://images-assets.nasa.gov/image/PIA10020/PIA10020~orig.jpg',
      spectralOverlay: 'https://images-assets.nasa.gov/image/PIA10871/PIA10871~orig.jpg'
    },
    metrics: {
      morphologyScore: 92,
      roughnessIndex: 96,
      slopeVariance: 94,
      thermalInertia: 78,
      mineralMatchIndex: 89,
      volatilePotential: 22
    }
  }
];
