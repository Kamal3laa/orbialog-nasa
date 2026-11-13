import { AnalogLocation } from './types';

export const ANALOG_LOCATIONS: AnalogLocation[] = [
  // --- EGYPT ANALOG CANDIDATES (Featured in Prompt) ---
  {
    id: 'egypt-white-desert',
    name: 'White Desert (Sahara el Beyda)',
    region: 'Farafra Depression, New Valley',
    country: 'Egypt',
    flagCode: 'EG',
    featuredEgypt: true,
    coordinates: {
      lat: 27.2883,
      lng: 28.1633,
      display: '27°17\'18" N, 28°09\'48" E'
    },
    elevationMeters: 172,
    category: 'hyper-arid',
    primaryTargetAnalog: 'mars',
    matchedTargets: ['mars-jezero-crater', 'mars-gale-crater', 'luna-south-pole'],
    overallSimilarity: 91.4,
    confidenceScore: 94.0,
    climateType: 'BWh (Hyper-Arid Hot Desert)',
    summary: 'A world-class planetary analog dominated by blinding white chalk karst monoliths, inselbergs, and mega-yardangs sculpted by unidirectional hyper-arid aeolian abrasion. Ideal for Mars wind-erosion modeling and lunar high-albedo regolith optical calibration.',
    geology: {
      rockType: 'Upper Cretaceous Chalk (Khoman Formation) & Pliocene lacustrine deposits',
      mineralogy: ['Microcrystalline Calcite (CaCO₃)', 'Smectite clays', 'Anhydrite', 'Iron-manganese oxide concretions'],
      regolithAnalogy: 'Fine comminuted chalk powder creates micro-dust with cohesive electrostatic properties closely mimicking fine Lunar highland dust and Martian airfall silt.',
      aeolianFeatures: 'Streamlined mega-yardangs, wind-fluted pedestal rocks, and deflation lag gravel corridors.',
      stratigraphy: 'Horizontal bedding of soft white chalk capped by resistant silicified chalk-limestone units.'
    },
    environment: {
      meanAnnualTemp: '22.8 °C',
      diurnalRange: '4 °C (night) to 48 °C (summer daytime)',
      annualPrecipitation: '< 4 mm / year (Extreme hyper-aridity)',
      uvIrradiance: 'Index 11+ (Peak UV-A and UV-B exposure)',
      aridityIndex: '0.01 (Extreme hyper-arid)',
      dustStormFrequency: '18 - 25 days/year (Khamasin dust events)'
    },
    scientificSignificance: [
      'Top-tier terrestrial field site for yardang morphology genesis, matching Mars Medusae Fossae and Gale crater yardang fields.',
      'Exceptional high-contrast optical environment for testing autonomous rover stereoscopic vision under harsh albedo glare.',
      'Astrobiological baseline for endolithic cyanobacteria surviving inside porous chalk sheltered from extreme solar UV radiation.'
    ],
    similaritiesToTarget: [
      'Identical wind-sculpted aerodynamic erosion geometries to Martian Gale Crater yardangs.',
      'Ultra-fine powdered surface regolith causing comparable wheel sinkage and traction slips to Martian sand traps.',
      'Near-total absence of organic vegetative cover, providing pristine spectral and LiDAR reflectance.'
    ],
    limitations: [
      'Atmospheric pressure is 1,013 mbar compared to Mars ~6.1 mbar and Lunar vacuum.',
      'Earth gravity (9.81 m/s²) limits direct physical suspension testing without gravity-offload gantries.',
      'Terrestrial rainfall, though historically infinitesimal, prevents absolute anhydrous soil conditions.'
    ],
    fieldTestingCapabilities: [
      { name: 'Rover Aeolian Mobility & Slip Testing', suitability: 'exceptional', notes: 'Perfect fine-powder and yardang obstacle negotiation courses.' },
      { name: 'Autonomous Vision & Stereo Disparity Navigation', suitability: 'exceptional', notes: 'Blinding white albedo stresses dynamic range cameras.' },
      { name: 'Drilling & Core Sample Retention', suitability: 'high', notes: 'Chalk provides soft matrix testing with occasional hard chert nodules.' },
      { name: 'Spacesuit Joint Dust Ingress Testing', suitability: 'high', notes: 'Fine chalk grains (<20 µm) emulate abrasive lunar dust behavior.' }
    ],
    notableMissionsOrExpeditions: [
      {
        campaign: 'Sahara Planetary Yardang Morphometry Survey',
        organization: 'Cairo Univ / NASA JPL Collab Team',
        year: '2023',
        scope: 'Ground-truth photogrammetry comparison with HiRISE DTMs'
      },
      {
        campaign: 'Desert Autonomous Rover Navigation Trials',
        organization: 'Space Apps Exploration Group',
        year: '2025',
        scope: 'LiDAR point-cloud SLAM validation in feature-sparse terrains'
      }
    ],
    dataSources: [
      { title: 'USGS Landsat 9 OLI-2 Multispectral Surface Reflectance', agency: 'USGS / NASA', datasetId: 'LC09_L2SP_178040_20240212', type: 'Orbital Multispectral' },
      { title: 'Copernicus Sentinel-2 MSI L2A BOA Reflectance', agency: 'ESA', datasetId: 'S2B_MSIL2A_20240410', type: 'Orbital Multispectral' },
      { title: 'SRTM 1 Arc-Second Global Digital Elevation Model', agency: 'NASA / USGS', datasetId: 'SRTMGL1_003', type: 'DEM Radar' },
      { title: 'Geomorphology of Yardangs in the White Desert, Egypt', agency: 'Geomorphology Journal', datasetId: 'DOI:10.1016/j.geomorph.2019.04.015', type: 'Peer Reviewed Paper' }
    ],
    metrics: {
      geologicalSimilarity: 88,
      terrainRoughness: 92,
      slopeDistribution: 84,
      thermalDeltaMatch: 89,
      granulometryMatch: 95,
      spectralCorrespondence: 86,
      volatilesAnalogy: 72
    },
    imagery: {
      hero: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
      satellite: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80',
      terrain: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80'
    }
  },
  {
    id: 'egypt-qattara-depression',
    name: 'Qattara Depression (Munkhafad al-Qattarah)',
    region: 'Matrouh Governorate, Western Desert',
    country: 'Egypt',
    flagCode: 'EG',
    featuredEgypt: true,
    coordinates: {
      lat: 29.5000,
      lng: 27.5000,
      display: '29°30\'00" N, 27°30\'00" E'
    },
    elevationMeters: -133,
    category: 'sub-sea-level',
    primaryTargetAnalog: 'mars',
    matchedTargets: ['mars-jezero-crater', 'mars-gale-crater', 'mars-valles-marineris'],
    overallSimilarity: 93.8,
    confidenceScore: 91.5,
    climateType: 'BWh (Hyper-Arid Depression Basin)',
    summary: 'The second deepest natural point in Africa (-133 m bsl). Spanning ~19,605 km², this immense tectonic-aeolian depression features extensive salt flats (sabkhas), clay pans, and evaporite mineral crusts representing the closest terrestrial geomorphic analogue to desiccated Martian paleolake basins like Jezero and Gale.',
    geology: {
      rockType: 'Miocene Moghra Formation (fluvial-deltaic sandstones) & Holocene Halite Sabkhas',
      mineralogy: ['Halite (NaCl)', 'Gypsum (CaSO₄·2H₂O)', 'Anhydrite', 'Montmorillonite smectite clays', 'Hexahydrite sulfates'],
      regolithAnalogy: 'Salt-crusted duricrust overlying semi-viscous water-saturated saline muds, replicating Martian chloride/sulfate deposits and treacherous crust break-through risks.',
      aeolianFeatures: 'Giant barchan dune chains, deflation escarpments (200m vertical drop on northern scarp), and salt karst sinkholes.',
      stratigraphy: 'Tertiary fossiliferous shallow-marine marls unconformably overlain by evaporite sequences.'
    },
    environment: {
      meanAnnualTemp: '24.2 °C',
      diurnalRange: '3 °C to 50 °C (Intense thermal swings inside basin)',
      annualPrecipitation: '1.2 - 5 mm / year',
      uvIrradiance: 'Peak Index 12 (Very high surface insolation)',
      aridityIndex: '0.008 (Extreme Hyper-arid)',
      dustStormFrequency: 'Frequent localized thermal vortexes and haboobs'
    },
    scientificSignificance: [
      'Unmatched terrestrial testbed for ancient planetary evaporitic lake desiccations (analogous to Jezero crater paleolake dry-down).',
      'Hydrated sulfate and halide mineralogy matches CRISM detections in Martian inter-crater basins.',
      'Extreme halophilic microbial community ecology thriving in hypersaline brines provides key biosignature preservation models.'
    ],
    similaritiesToTarget: [
      'Basin morphology with inverted channel landforms and steep northern boundary fault scarps mirroring Martian crater walls.',
      'Sulfate-rich mineral crusts chemically and spectrally aligned with Gale Crater sulfate unit.',
      'Dense subsurface hypersaline groundwaters simulating ancient Martian groundwater upwelling.'
    ],
    limitations: [
      'Higher barometric pressure at -133m elevation (~1,028 mbar) enhances convective cooling.',
      'Active brine seepages present corrosive chloride effects on aluminum wheels exceeding Martian dry salts.',
      'Limited road infrastructure requires dedicated self-contained expedition logistics.'
    ],
    fieldTestingCapabilities: [
      { name: 'Duricrust Break-Through & Wheel Sinkage Mechanics', suitability: 'exceptional', notes: 'Simulates Spirit rover hazardous soil trap scenarios.' },
      { name: 'Spectroscopic Sulfate/Chloride Mineral Identification', suitability: 'exceptional', notes: 'Calibration for VNIR and Raman spectrometers.' },
      { name: 'Subsurface Ground Penetrating Radar (GPR) Imaging', suitability: 'high', notes: 'Deep brine table provides high dielectric contrast.' },
      { name: 'Autonomous Long-Range Traversal Planning', suitability: 'high', notes: '100+ km unobstructed basin floor navigation runs.' }
    ],
    notableMissionsOrExpeditions: [
      {
        campaign: 'Egyptian Hyper-Arid Basin Geochemical Project',
        organization: 'Geological Survey of Egypt & International Consortia',
        year: '2022',
        scope: 'Evaporite sequence sampling for planetary biomarker preservation'
      },
      {
        campaign: 'RIMFAX Equivalent GPR Calibration Experiment',
        organization: 'Desert Radar Science Team',
        year: '2024',
        scope: 'Mapping subsurface brine boundaries using ultra-wideband radar'
      }
    ],
    dataSources: [
      { title: 'NASA Earthdata SRTM 30m Digital Elevation Basin Model', agency: 'NASA JPL', datasetId: 'SRTMGL1_Qattara', type: 'DEM Radar' },
      { title: 'ASTER GDEM v3 Thermal Infrared Emissivity Grid', agency: 'NASA / METI', datasetId: 'ASTGTMV003_N29E027', type: 'Orbital Multispectral' },
      { title: 'Copernicus Sentinel-1 SAR C-Band Surface Soil Roughness', agency: 'ESA', datasetId: 'S1A_IW_GRDH_1SDV', type: 'DEM Radar' },
      { title: 'Hydrogeology and Evaporite Mineralogy of Qattara Basin', agency: 'Journal of Arid Environments', datasetId: 'DOI:10.1016/j.jaridenv.2021.104592', type: 'Peer Reviewed Paper' }
    ],
    metrics: {
      geologicalSimilarity: 96,
      terrainRoughness: 88,
      slopeDistribution: 76,
      thermalDeltaMatch: 92,
      granulometryMatch: 90,
      spectralCorrespondence: 94,
      volatilesAnalogy: 88
    },
    imagery: {
      hero: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
      satellite: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      terrain: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80'
    }
  },
  {
    id: 'egypt-sinai-granite',
    name: 'Sinai Peninsula Highland Basement Complex',
    region: 'South Sinai Governorate (St. Catherine / Wadi Feiran)',
    country: 'Egypt',
    flagCode: 'EG',
    featuredEgypt: true,
    coordinates: {
      lat: 28.5394,
      lng: 33.9750,
      display: '28°32\'22" N, 33°58\'30" E'
    },
    elevationMeters: 2629, // Mt Catherine peak
    category: 'volcanic-basalt',
    primaryTargetAnalog: 'moon',
    matchedTargets: ['luna-shackleton-crater', 'mars-valles-marineris', 'luna-mare-tranquillitatis'],
    overallSimilarity: 89.2,
    confidenceScore: 92.8,
    climateType: 'BWk (Cold Arid Mountain Desert)',
    summary: 'A dramatic Precambrian crystalline shield massif dissected by sharp tectonic fault gorges, dry wadi boulder beds, and intrusive basaltic dike swarms. Provides exceptional terrestrial topographic analogs for lunar crater rims (Shackleton) and deep Martian canyon scarps (Valles Marineris).',
    geology: {
      rockType: 'Precambrian Crystalline Basement: Alkaline Granites, Diorites, Basaltic Dikes, & Pyroclastic Rhyolites',
      mineralogy: ['Plagioclase feldspar (Anorthite-rich)', 'Pyroxene', 'Biotite', 'Amphibole', 'Magnetite/Ilmenite'],
      regolithAnalogy: 'Coarse angular talus breccia, blocky rock fields, and mechanically fragmented granite scree matching lunar highland boulder distributions.',
      aeolianFeatures: 'High-altitude freeze-thaw mechanical shattering, steep talus scree chutes, and hyper-arid bedrock exposure.',
      stratigraphy: 'Intrusive plutonic ring complexes cross-cut by vertical basaltic and doleritic sheet dikes.'
    },
    environment: {
      meanAnnualTemp: '14.5 °C (High elevation cooler alpine desert)',
      diurnalRange: '-6 °C (winter frosts) to 36 °C (summer sun)',
      annualPrecipitation: '40 - 60 mm / year (Sporadic flash runoff events)',
      uvIrradiance: 'Extreme UV Index 12+ (Altitude enhanced thin air)',
      aridityIndex: '0.04 (Hyper-arid alpine)',
      dustStormFrequency: 'Moderate; frequent Katabatic ridge wind gusts (>80 km/h)'
    },
    scientificSignificance: [
      'Topographic and rock-mechanics proxy for steep lunar crater walls (up to 35° incline) and boulder hazard fields.',
      'Plagioclase-rich granite/diorite lithology provides terrestrial chemical proxy for lunar highland anorthosite crust.',
      'Basaltic intrusive dikes replicate lunar mare volcanism feeder conduits and Martian basalt plains.'
    ],
    similaritiesToTarget: [
      'Extreme vertical relief and boulder distribution mimic Shackleton Crater rim and ejecta blankets.',
      'Serrated knife-edge ridgelines produce deep shadow casting comparable to low-sun-angle polar lunar lighting.',
      'Fractured crystalline bedrock allows testing of rock coring drills on high-compressive-strength lithologies (>150 MPa).'
    ],
    limitations: [
      'Subject to rare winter snowfall and orographic cloud cover at peaks above 2,000m.',
      'Vegetation, though sparse, exists in protected wadi alcoves.',
      'Active tectonic rift margin induces seismic stresses different from passive lunar interior.'
    ],
    fieldTestingCapabilities: [
      { name: 'Extreme Slope Rappelling & Tethered Robotics', suitability: 'exceptional', notes: '30°+ granite faces identical to Shackleton interior slopes.' },
      { name: 'Rock Coring Drill Testing on High-Hardness Bedrock', suitability: 'exceptional', notes: 'Tests diamond coring bits against tough igneous matrix.' },
      { name: 'Shadowed Optical Navigation & High Dynamic Range LiDAR', suitability: 'high', notes: 'Canyon shadows recreate polar illumination challenges.' },
      { name: 'Lunar Base Foundation Anchoring Systems', suitability: 'high', notes: 'Validates micro-pile and rock-bolt anchoring in fractured rock.' }
    ],
    notableMissionsOrExpeditions: [
      {
        campaign: 'Sinai Geological Shield Astro-Mapping Field Expedition',
        organization: 'Sinai Geoscience Research Consortium',
        year: '2023',
        scope: '3D photogrammetric mapping of fracture swarms for analog crater comparison'
      },
      {
        campaign: 'High-Altitude Extreme Terrain Rover Mobility Trial',
        organization: 'Aerospace Robotics Laboratory',
        year: '2025',
        scope: 'Testing omnidirectional suspension over steep scree talus'
      }
    ],
    dataSources: [
      { title: 'ALOS PALSAR 12.5m Hi-Res Terrain Elevation Dataset', agency: 'JAXA / ASF', datasetId: 'AP_05200_FBD_F6780', type: 'DEM Radar' },
      { title: 'Landsat 8 OLI Band Ratio Geology Map of South Sinai', agency: 'USGS / NASA', datasetId: 'LC08_L1TP_174039_20230501', type: 'Orbital Multispectral' },
      { title: 'Tectonic Evolution of the Precambrian Shield of Sinai', agency: 'Precambrian Research', datasetId: 'DOI:10.1016/j.precamres.2020.105820', type: 'Peer Reviewed Paper' }
    ],
    metrics: {
      geologicalSimilarity: 89,
      terrainRoughness: 96,
      slopeDistribution: 97,
      thermalDeltaMatch: 82,
      granulometryMatch: 88,
      spectralCorrespondence: 84,
      volatilesAnalogy: 65
    },
    imagery: {
      hero: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      satellite: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      terrain: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
    }
  },

  // --- GLOBAL ANALOG CANDIDATES ---
  {
    id: 'atacama-yungay',
    name: 'Atacama Desert (Yungay Hyper-Arid Core)',
    region: 'Antofagasta Region',
    country: 'Chile',
    flagCode: 'CL',
    coordinates: {
      lat: -24.0667,
      lng: -70.0167,
      display: '24°04\'00" S, 70°01\'00" W'
    },
    elevationMeters: 960,
    category: 'hyper-arid',
    primaryTargetAnalog: 'mars',
    matchedTargets: ['mars-jezero-crater', 'mars-gale-crater'],
    overallSimilarity: 95.2,
    confidenceScore: 97.0,
    climateType: 'BWk (Cold Hyper-Arid Desert)',
    summary: 'The driest non-polar desert on Earth, hyper-arid for over 15 million years. Soil contains high concentrations of perchlorates, nitrates, and oxidized sulfates with virtually undetectable organic carbon, directly analogous to Viking and Curiosity soil discoveries.',
    geology: {
      rockType: 'Miocene alluvial gravels, nitrate-halite duricrusts, weathered andesitic rock',
      mineralogy: ['Perchlorates (ClO₄⁻)', 'Nitratine', 'Anhydrite', 'Gypsum', 'Palygorskite clay'],
      regolithAnalogy: 'Oxidized, desiccated soil matrix with strong oxidizing chemistry mimicking Martian regolith reactivity.',
      aeolianFeatures: 'Deflation stone pavements (reg), desert varnish coatings, and granule ripples.',
      stratigraphy: 'Stacked paleosol sequences with ancient caliche horizons.'
    },
    environment: {
      meanAnnualTemp: '16.5 °C',
      diurnalRange: '0 °C to 38 °C',
      annualPrecipitation: '< 1 mm / decade (Years pass with zero measurable moisture)',
      uvIrradiance: 'Maximum Earth UV flux (> 14 UV Index)',
      aridityIndex: '0.002 (Hyper-arid benchmark)',
      dustStormFrequency: 'Frequent afternoon wind gust saltation'
    },
    scientificSignificance: [
      'Standard scientific benchmark for Mars life-detection instrument limits (Viking, Phoenix, Mars 2020).',
      'Demonstrates endolithic microbial threshold at the absolute lower dry limit of life on Earth.',
      'Site for testing drill sample integrity without atmospheric humidity contamination.'
    ],
    similaritiesToTarget: [
      'Natural soil perchlorate concentrations (0.03–0.5 wt%) matching Phoenix Lander wet chemistry results.',
      'Total organic carbon (TOC) levels < 10 ppm, testing sensitivity of organic matter spectrometers.',
      'Surface oxidation states that rapidly degrade unprotected biological macromolecules.'
    ],
    limitations: [
      'Earth sea-level atmospheric pressure (910 mbar at 960m elevation).',
      'Atmospheric oxygen presence (21%) precludes pure CO₂ chemistry experiments.',
      'Occasional coastal fog advection (camanchaca) along outer ranges, though Yungay core remains dry.'
    ],
    fieldTestingCapabilities: [
      { name: 'Life Detection Protocol & Instrument Calibration', suitability: 'exceptional', notes: 'Tests sensitivity limits of Raman/fluorescence sensors.' },
      { name: 'Perchlorate Extraction & Soil Remediation', suitability: 'exceptional', notes: 'Critical for astronaut toxic dust mitigation.' },
      { name: 'Autonomous Rover Traverse Over Salt Crusts', suitability: 'high', notes: 'Tests wheel life over sharp salt-cemented gravels.' }
    ],
    notableMissionsOrExpeditions: [
      { campaign: 'NASA ASTEP Life in the Atacama (LITA)', organization: 'NASA Ames / Carnegie Mellon', year: '2019', scope: 'Subsurface drill and autonomous rover survey' },
      { campaign: 'ESA ExoMars Field Trial Expedition', organization: 'ESA / CNES', year: '2021', scope: 'Blind sample analysis mimicking Rosalind Franklin rover' }
    ],
    dataSources: [
      { title: 'NASA Earthdata MODIS Surface Temperature & Emissivity Daily L3', agency: 'NASA LP DAAC', datasetId: 'MOD11A1', type: 'Orbital Multispectral' },
      { title: 'Hyper-aridity and Perchlorate Geochemistry of Yungay', agency: 'Science', datasetId: 'DOI:10.1126/science.1089143', type: 'Peer Reviewed Paper' }
    ],
    metrics: {
      geologicalSimilarity: 97,
      terrainRoughness: 86,
      slopeDistribution: 74,
      thermalDeltaMatch: 95,
      granulometryMatch: 92,
      spectralCorrespondence: 98,
      volatilesAnalogy: 91
    },
    imagery: {
      hero: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
      satellite: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80',
      terrain: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80'
    }
  },
  {
    id: 'devon-island',
    name: 'Devon Island (Haughton Impact Crater)',
    region: 'Qikiqtaaluk Region, Nunavut',
    country: 'Canada',
    flagCode: 'CA',
    coordinates: {
      lat: 75.3667,
      lng: -89.6833,
      display: '75°22\'00" N, 89°41\'00" W'
    },
    elevationMeters: 310,
    category: 'impact-crater',
    primaryTargetAnalog: 'mars',
    matchedTargets: ['mars-jezero-crater', 'mars-gale-crater', 'luna-south-pole'],
    overallSimilarity: 92.6,
    confidenceScore: 96.0,
    climateType: 'ET (Polar Tundra / Polar Desert)',
    summary: 'The largest uninhabited island on Earth. Features the 23 km diameter Haughton impact crater (~39 Ma) formed in a cold polar desert permafrost environment. Home to the legendary NASA Haughton-Mars Project (HMP).',
    geology: {
      rockType: 'Impact crater breccia, shattered dolomite/limestone, paleolake crater sediments, permafrost ground ice',
      mineralogy: ['Dolomite (CaMg(CO₃)₂)', 'Calcite', 'Hydrothermal quartz', 'Marcasite/Pyrite', 'Clay alteration phases'],
      regolithAnalogy: 'Impact-shattered polymict breccia clasts set in a comminuted carbonate rock-flour matrix.',
      aeolianFeatures: 'Cryoturbation polygons, patterned ground, solifluction lobes, and spring gullies.',
      stratigraphy: 'Ordovician-Silurian sedimentary sequence overlain by 100m of allochthonous impact melt breccia.'
    },
    environment: {
      meanAnnualTemp: '-16.8 °C',
      diurnalRange: '-45 °C (polar winter) to +8 °C (brief summer thaw)',
      annualPrecipitation: '80 - 120 mm / year (mostly snow/rime ice)',
      uvIrradiance: 'Low to moderate; continuous 24h sunlight in summer',
      aridityIndex: '0.05 (Polar desert)',
      dustStormFrequency: 'Low; high ground-frost adhesion'
    },
    scientificSignificance: [
      'Premier terrestrial analog for complex impact craters forming in volatile-rich targets (ice-rich crust).',
      'Hydrothermal crater mineralogy analog for early Mars warm-spring habitable environments.',
      'Active testbed for spacesuit ergonomics, pressurized rover mobility, and field EVA operations.'
    ],
    similaritiesToTarget: [
      'Gullies and fluvial channels incised into crater walls strikingly mirror Martian gullies seen by MRO.',
      'Continuous permafrost ground with patterned ice-wedge polygons identical to Phoenix landing site terrain.',
      'Central uplift structure and shattered impact breccias match lunar and Martian complex craters.'
    ],
    limitations: [
      'Summer seasonal thawing produces mud and runoff absent on modern Mars and Moon.',
      'Presence of atmospheric oxygen and lichen cryptoendoliths.',
      'Logistically accessible only 6 weeks per year during Arctic summer.'
    ],
    fieldTestingCapabilities: [
      { name: 'Impact Crater Geologic Mapping & Traversal', suitability: 'exceptional', notes: '23 km rim offers authentic expedition scale.' },
      { name: 'Drilling into Permafrost & Subsurface Ice', suitability: 'exceptional', notes: 'Tests cryogenic drills in hard ground ice.' },
      { name: 'Astronaut EVA Suit Ergonomics & Mobility', suitability: 'exceptional', notes: 'Host of NASA HMP long-duration EVA tests.' }
    ],
    notableMissionsOrExpeditions: [
      { campaign: 'NASA Haughton-Mars Project (HMP)', organization: 'NASA Ames / Mars Institute', year: '1997 - Present', scope: 'Over 27 field seasons of rover, EVA, and science trials' }
    ],
    dataSources: [
      { title: 'Canadian RADARSAT Constellation Mission Synthetic Aperture Radar', agency: 'CSA', datasetId: 'RCM_1_GEO', type: 'DEM Radar' },
      { title: 'Haughton Impact Structure: Terrestrial Analogue for Mars', agency: 'Meteoritics & Planetary Science', datasetId: 'DOI:10.1111/j.1945-5100.2005.tb00175.x', type: 'Peer Reviewed Paper' }
    ],
    metrics: {
      geologicalSimilarity: 94,
      terrainRoughness: 90,
      slopeDistribution: 88,
      thermalDeltaMatch: 86,
      granulometryMatch: 91,
      spectralCorrespondence: 87,
      volatilesAnalogy: 95
    },
    imagery: {
      hero: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80',
      satellite: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      terrain: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'
    }
  },
  {
    id: 'antarctica-dry-valleys',
    name: 'McMurdo Dry Valleys (Taylor & Wright Valleys)',
    region: 'Victoria Land',
    country: 'Antarctica',
    flagCode: 'AQ',
    coordinates: {
      lat: -77.4667,
      lng: 162.5333,
      display: '77°28\'00" S, 162°32\'00" E'
    },
    elevationMeters: 400,
    category: 'polar-desert',
    primaryTargetAnalog: 'moon',
    matchedTargets: ['luna-south-pole', 'mars-jezero-crater', 'mars-gale-crater'],
    overallSimilarity: 94.8,
    confidenceScore: 98.2,
    climateType: 'EF (Polar Frost / Hyper-Arid Cold Desert)',
    summary: 'The coldest and driest hyper-arid region on Earth, kept ice-free by surrounding mountains and ferocious katabatic winds (>300 km/h). Extreme cold-desert analog for Lunar South Pole cryogenic terrain and Martian regolith.',
    geology: {
      rockType: 'Beacon Supergroup Sandstones, Ferrar Dolerite sills, and glacial tills',
      mineralogy: ['Quartz', 'Pyroxene', 'Smectite', 'Thenardite/Gypsum salts', 'Hematite coatings'],
      regolithAnalogy: 'Dry permafrost regolith with zero liquid water films, replicating cryogenic lunar/Martian polar soil physics.',
      aeolianFeatures: 'Polished ventifacts, sand wedges, desiccated soil polygons, and hyper-arid salt encrustations.',
      stratigraphy: 'Basement granites cut by Jurassic dolerite sheets and glacial drift sequences.'
    },
    environment: {
      meanAnnualTemp: '-19.5 °C',
      diurnalRange: '-55 °C (winter) to -2 °C (summer peak)',
      annualPrecipitation: '< 10 mm water equivalent (Virtually all sublimates immediately)',
      uvIrradiance: 'High seasonal UV; 24h polar day in summer',
      aridityIndex: '0.005 (Hyper-arid polar core)',
      dustStormFrequency: 'Extreme katabatic wind events descending from polar ice sheet'
    },
    scientificSignificance: [
      'The primary terrestrial analog for the cryogenic soil mechanics of the Lunar South Pole permanently shadowed regions (PSRs).',
      'Cryptoendolithic communities colonizing sandstone interiors at the very edge of physical biological viability.',
      'Tests low-temperature lubrication, battery thermal management, and cold-soak electronics survivability.'
    ],
    similaritiesToTarget: [
      'Extreme persistent low temperatures and hyper-arid sublimation regimes mirror lunar polar traps.',
      'Serrated ventifacts and angular rock fields present identical wheel wear factors as lunar block fields.',
      'Absence of surface liquid water produces authentic anhydrous mineral chemistry.'
    ],
    limitations: [
      'Requires strict Antarctic Treaty Environmental Protection protocols prohibiting robotic soil disturbance.',
      'Atmospheric pressure (~980 mbar) provides convection that does not exist on the Moon.',
      'Logistically restricted to sanctioned national science programs (NSF / USAP).'
    ],
    fieldTestingCapabilities: [
      { name: 'Cryogenic Mechanism & Thermal Vacuum Survivability', suitability: 'exceptional', notes: 'Validates rover actuators at -50°C ambient.' },
      { name: 'Sublimation & Volatiles Trapping Modeling', suitability: 'exceptional', notes: 'Direct analog for PSR ice stability models.' },
      { name: 'Extreme Cold Power System Validation', suitability: 'high', notes: 'Tests regenerative fuel cells and RTG heat loops.' }
    ],
    notableMissionsOrExpeditions: [
      { campaign: 'NASA Astrobiology Dry Valleys Expedition', organization: 'NASA Ames / NSF', year: '2020', scope: 'Deep ice-cemented regolith core drilling' }
    ],
    dataSources: [
      { title: 'USGS / BAS Landsat Image Mosaic of Antarctica (LIMA)', agency: 'USGS / NASA / BAS', datasetId: 'LIMA_Mosaic_V1', type: 'Orbital Multispectral' },
      { title: 'Antarctic Dry Valleys as an Analog for Mars Polar Terrains', agency: 'Icarus', datasetId: 'DOI:10.1016/j.icarus.2018.06.012', type: 'Peer Reviewed Paper' }
    ],
    metrics: {
      geologicalSimilarity: 93,
      terrainRoughness: 94,
      slopeDistribution: 89,
      thermalDeltaMatch: 97,
      granulometryMatch: 90,
      spectralCorrespondence: 89,
      volatilesAnalogy: 98
    },
    imagery: {
      hero: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80',
      satellite: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80',
      terrain: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'
    }
  },
  {
    id: 'svalbard-spitsbergen',
    name: 'Svalbard (Bockfjorden / Spitsbergen)',
    region: 'Spitsbergen Archipelago',
    country: 'Norway',
    flagCode: 'NO',
    coordinates: {
      lat: 79.4500,
      lng: 13.3667,
      display: '79°27\'00" N, 13°22\'00" E'
    },
    elevationMeters: 550,
    category: 'volcanic-basalt',
    primaryTargetAnalog: 'mars',
    matchedTargets: ['mars-jezero-crater', 'luna-mare-tranquillitatis'],
    overallSimilarity: 90.7,
    confidenceScore: 93.4,
    climateType: 'ET (Polar Arctic Tundra)',
    summary: 'The only known terrestrial location where carbonate globules structurally and chemically identical to those found in the iconic Martian meteorite ALH84001 occur within basaltic volcanic structures and mantle xenoliths. Site of the AMASE expeditions.',
    geology: {
      rockType: 'Quaternary Basaltic Volcanism, Mantle Peridotite Xenoliths, & Sub-glacial Carbonate Terraces',
      mineralogy: ['Magnesite (MgCO₃)', 'Aragonite', 'Olivine ((Mg,Fe)₂SiO₄)', 'Pyroxene', 'Magnetite'],
      regolithAnalogy: 'Basaltic tephra, volcanic ash, and cryogenic scree with secondary carbonate precipitation.',
      aeolianFeatures: 'Periglacial patterned stone circles, cryoturbated regolith, and solifluction sheets.',
      stratigraphy: 'Sverrefjell volcano breaching Devonian red sandstones and basement gneiss.'
    },
    environment: {
      meanAnnualTemp: '-5.2 °C',
      diurnalRange: '-25 °C (winter) to +7 °C (summer)',
      annualPrecipitation: '200 - 300 mm / year',
      uvIrradiance: 'Moderate; 24h Arctic summer insolation',
      aridityIndex: '0.12 (Semi-arid Arctic)',
      dustStormFrequency: 'Low; high localized wind turbulence'
    },
    scientificSignificance: [
      'Host to Arctic Mars Analog Svalbard Expeditions (AMASE) led by NASA and ESA.',
      'Critical ground-truthing site for Mars 2020 SuperCam, SHERLOC, and PIXL spectrometer flight models.',
      'Proves non-biological hydrothermal formation of zoned carbonate rosettes in basalt.'
    ],
    similaritiesToTarget: [
      'Carbonate globules in olivine basalt identical to ALH84001 Martian meteorite rosettes.',
      'Active permafrost springs depositing carbonate tufa terraces analogous to Martian spring mounds.',
      'Basaltic volcanism interacting with cryogenic ice sheets.'
    ],
    limitations: [
      'Glacial meltwater streams active during summer months.',
      'Polar bear safety logistics require armed security perimeters during all field trials.',
      'Thicker soil biological crust than hyper-arid Mars sites.'
    ],
    fieldTestingCapabilities: [
      { name: 'Flight Model Spectrometer Field Testing (Raman/UV)', suitability: 'exceptional', notes: 'AMASE primary calibration testbed.' },
      { name: 'Basaltic Volcanic Rock Core Drilling', suitability: 'high', notes: 'Tough olivine-rich basalts test drill durability.' },
      { name: 'Autonomous Rover Traverse on Cryogenic Scree', suitability: 'high', notes: 'Validates track and wheel traction.' }
    ],
    notableMissionsOrExpeditions: [
      { campaign: 'Arctic Mars Analog Svalbard Expedition (AMASE)', organization: 'NASA / ESA / Univ of Oslo', year: '2003 - 2022', scope: 'Testing payload instruments for Curiosity and Perseverance' }
    ],
    dataSources: [
      { title: 'ESA Sentinel-2 Multispectral Arctic Basalt Reflectance', agency: 'ESA', datasetId: 'S2_MSI_Svalbard_AMASE', type: 'Orbital Multispectral' },
      { title: 'Carbonate Globules in Svalbard Basalts as ALH84001 Analogs', agency: 'Geochimica et Cosmochimica Acta', datasetId: 'DOI:10.1016/j.gca.2011.08.021', type: 'Peer Reviewed Paper' }
    ],
    metrics: {
      geologicalSimilarity: 95,
      terrainRoughness: 89,
      slopeDistribution: 85,
      thermalDeltaMatch: 82,
      granulometryMatch: 88,
      spectralCorrespondence: 96,
      volatilesAnalogy: 87
    },
    imagery: {
      hero: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      satellite: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      terrain: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
    }
  },
  {
    id: 'hawaii-maunakea',
    name: 'Mauna Kea & HI-SEAS Habitat Complex',
    region: 'Island of Hawaiʻi',
    country: 'United States',
    flagCode: 'US',
    coordinates: {
      lat: 19.8206,
      lng: -155.4681,
      display: '19°49\'14" N, 155°28\'05" W'
    },
    elevationMeters: 4207,
    category: 'volcanic-basalt',
    primaryTargetAnalog: 'moon',
    matchedTargets: ['luna-mare-tranquillitatis', 'luna-shackleton-crater', 'mars-gale-crater'],
    overallSimilarity: 88.9,
    confidenceScore: 94.0,
    climateType: 'ET / Csb (Alpine Volcanic Desert)',
    summary: 'High-altitude volcanic shield summit composed of fresh tholeiitic and alkalic basalt flows, pyroclastic cinder cones (Puʻu), and weathered tephra. Host to the long-running Hawaii Space Exploration Analog and Simulation (HI-SEAS) habitat.',
    geology: {
      rockType: 'Alkalic & Tholeiitic Basalt, Pyroclastic Tephra, Volcanic Cinders, & Palagonite',
      mineralogy: ['Plagioclase', 'Olivine', 'Pyroxene (Augite)', 'Titanomagnetite', 'Palagonitized volcanic glass'],
      regolithAnalogy: 'JSC-1 and JSC-1A lunar regolith simulants were mined directly from the Puʻu Nēnē cinder cone tephra on this complex.',
      aeolianFeatures: 'Periglacial frost sorting, cinder scree talus, and bare volcanic ash plains.',
      stratigraphy: 'Post-shield Laupāhoehoe volcanic series overlying thick shield-stage shield basalts.'
    },
    environment: {
      meanAnnualTemp: '4.1 °C',
      diurnalRange: '-5 °C (night freezes) to +18 °C (daytime)',
      annualPrecipitation: '200 mm / year (Semi-arid alpine inversion layer)',
      uvIrradiance: 'Extreme UV (> 13 Index due to 4,200m elevation)',
      aridityIndex: '0.15',
      dustStormFrequency: 'Moderate local dust lifting in dry cinder plains'
    },
    scientificSignificance: [
      'The geological source locality for official NASA lunar regolith simulant (JSC-1A).',
      'HI-SEAS isolation habitat conducts 4 to 12-month simulated Mars/Moon astronaut missions.',
      'Pāhoehoe and ʻAʻā lava flows provide physical mechanics analogs for Lunar Mare lava tube exploration.'
    ],
    similaritiesToTarget: [
      'Chemical and physical grain-size distribution closely matches Apollo 11 and 17 mare regolith.',
      'Porous basaltic cinder cones simulate lunar pyroclastic glass deposits.',
      'Intact subterranean lava tube caves permit radiation shelter simulations.'
    ],
    limitations: [
      'Atmospheric humidity exceeds lunar and Martian hyper-aridity.',
      'Cultural sensitivity and sacred land status require strict preservation permits.',
      'Presence of atmospheric oxygen and cloud sea below inversion layer.'
    ],
    fieldTestingCapabilities: [
      { name: 'Regolith Excavation & In-Situ Resource Utilization (ISRU)', suitability: 'exceptional', notes: 'Native tephra is identical to JSC-1A simulant.' },
      { name: 'Subterranean Lava Tube Exploration & Mapping', suitability: 'exceptional', notes: 'Dozens of accessible intact basalt tubes.' },
      { name: 'Crew Isolation & Long-Duration Behavioral Simulation', suitability: 'exceptional', notes: 'HI-SEAS active dome operations.' }
    ],
    notableMissionsOrExpeditions: [
      { campaign: 'NASA HI-SEAS Missions I through VI', organization: 'NASA Human Research Program / Univ of Hawaii', year: '2013 - 2018', scope: 'Long-duration crew isolation and food system testing' },
      { campaign: 'EMMY Lunar Lava Tube Robotic Survey', organization: 'ESA / PISCES', year: '2023', scope: 'Autonomous 3D LiDAR mapping of basaltic lava caverns' }
    ],
    dataSources: [
      { title: 'USGS 3D Elevation Program (3DEP) 1m Lidar DTM', agency: 'USGS', datasetId: 'USGS_LPC_HI_MaunaKea_2020', type: 'DEM Radar' },
      { title: 'JSC-1: A New Lunar Soil Simulant', agency: 'Lunar and Planetary Science Conference', datasetId: 'LPSC_XXIV_1993', type: 'Peer Reviewed Paper' }
    ],
    metrics: {
      geologicalSimilarity: 92,
      terrainRoughness: 84,
      slopeDistribution: 82,
      thermalDeltaMatch: 81,
      granulometryMatch: 96,
      spectralCorrespondence: 89,
      volatilesAnalogy: 70
    },
    imagery: {
      hero: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      satellite: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80',
      terrain: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80'
    }
  },
  {
    id: 'western-australia-pilbara',
    name: 'Pilbara Craton (Dressers Formation & Strelley Pool)',
    region: 'Pilbara Region, Western Australia',
    country: 'Australia',
    flagCode: 'AU',
    coordinates: {
      lat: -21.1667,
      lng: 119.7833,
      display: '21°10\'00" S, 119°47\'00" E'
    },
    elevationMeters: 380,
    category: 'hyper-arid',
    primaryTargetAnalog: 'mars',
    matchedTargets: ['mars-jezero-crater'],
    overallSimilarity: 93.1,
    confidenceScore: 96.5,
    climateType: 'BWh (Hot Semi-Arid / Desert)',
    summary: 'Contains the oldest exceptionally preserved sedimentary and volcanic rocks on Earth (~3.48 Ga), coinciding exactly with the epoch when Mars had standing liquid water in Jezero and Gale craters. Preserves the earliest fossilized biosignatures (stromatolites).',
    geology: {
      rockType: 'Archean Chert, Banded Iron Formations (BIF), Pillow Basalts, & Barite Bedding',
      mineralogy: ['Microcrystalline Chert (SiO₂)', 'Barite (BaSO₄)', 'Hematite', 'Goethite', 'Ankerite'],
      regolithAnalogy: 'Iron-rich oxidized red gibber soil pavements, replicating Martian oxidized ferric iron surface spectra.',
      aeolianFeatures: 'Inverted channel ridges, deeply weathered duricrust mesas, and spinifex grasslands.',
      stratigraphy: 'Warrawoona Group hydrothermal chert horizons interbedded with tholeiitic basalts.'
    },
    environment: {
      meanAnnualTemp: '27.4 °C',
      diurnalRange: '10 °C to 47 °C',
      annualPrecipitation: '250 - 350 mm / year (Monsoonal episodic pulses)',
      uvIrradiance: 'High UV Index 12',
      aridityIndex: '0.18',
      dustStormFrequency: 'Frequent red-dust squall lines'
    },
    scientificSignificance: [
      'The foundational astrobiology test site for NASA Mars 2020 and ESA ExoMars science teams.',
      'Rocks here are the exact same age (3.5 billion years) as the rocks Perseverance is coring in Jezero Crater.',
      'Validates in-situ criteria for distinguishing genuine microscopic biogenic textures from abiotic mineral structures.'
    ],
    similaritiesToTarget: [
      'Coincides with the Martian Noachian-Hesperian transition time window.',
      'Hydrothermal and lacustrine chert facies match proposed Jezero silica-rich deposits.',
      'High ferric iron spectral signatures identical to Martian surface reflectance.'
    ],
    limitations: [
      'Sparse desert grasses (spinifex) introduce modern organic carbon background.',
      'Atmospheric humidity and monsoonal rainfall occur during summer months.',
      'Remote desert location requires 4WD expedition logistics.'
    ],
    fieldTestingCapabilities: [
      { name: 'Astrobiology Biosignature Detection & Verification', suitability: 'exceptional', notes: 'Gold standard for stromatolite morphology and Raman spectra.' },
      { name: 'Hyperspectral Iron & Silica Mineral Mapping', suitability: 'exceptional', notes: 'Matches CRISM and PIXL instrumentation.' },
      { name: 'Sample Coring & Hermetic Tube Sealing Validation', suitability: 'high', notes: 'Drills hard Archean cherts (>200 MPa).' }
    ],
    notableMissionsOrExpeditions: [
      { campaign: 'NASA & ESA Joint Mars 2020 / ExoMars Pilbara Field Workshop', organization: 'NASA HQ / ESA / Australian Space Agency', year: '2023', scope: 'Training flight rover science teams to identify ancient microbial fossils' }
    ],
    dataSources: [
      { title: 'Geoscience Australia ASTER Advanced Mineral Map of the Pilbara', agency: 'Geoscience Australia / NASA', datasetId: 'GA_ASTER_PILBARA_V1', type: 'Orbital Multispectral' },
      { title: 'Evidence for Early Life in Earth’s Oldest Hydrothermal System', agency: 'Nature Geoscience', datasetId: 'DOI:10.1038/s41561-019-0441-z', type: 'Peer Reviewed Paper' }
    ],
    metrics: {
      geologicalSimilarity: 98,
      terrainRoughness: 82,
      slopeDistribution: 78,
      thermalDeltaMatch: 88,
      granulometryMatch: 86,
      spectralCorrespondence: 97,
      volatilesAnalogy: 80
    },
    imagery: {
      hero: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
      satellite: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80',
      terrain: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80'
    }
  },
  {
    id: 'tabernas-spain',
    name: 'Tabernas Desert & Rio Tinto Complex',
    region: 'Almería & Huelva, Andalusia',
    country: 'Spain',
    flagCode: 'ES',
    coordinates: {
      lat: 37.0000,
      lng: -2.4333,
      display: '37°00\'00" N, 02°26\'00" W'
    },
    elevationMeters: 410,
    category: 'hyper-arid',
    primaryTargetAnalog: 'mars',
    matchedTargets: ['mars-jezero-crater', 'mars-gale-crater'],
    overallSimilarity: 88.4,
    confidenceScore: 92.0,
    climateType: 'BWh / BSk (Semi-Arid Badlands)',
    summary: 'Europe’s only true desert badlands, characterized by deeply incised gullies, mudstone badlands, and ephemeral ramified drainage networks. Coupled with nearby Rio Tinto (acidic iron-sulfate river), it provides ESA’s primary Mars rover testing ground.',
    geology: {
      rockType: 'Miocene Mudstones, Siltstones, Gypsiferous Marls, & Gossan Iron Caps',
      mineralogy: ['Gypsum', 'Jarosite (KFe³⁺₃(OH)₆(SO₄)₂)', 'Goethite', 'Hematite', 'Illite clay'],
      regolithAnalogy: 'Fine-grained mudstone scree and friable sedimentary rock simulating Gale and Jezero mudstones.',
      aeolianFeatures: 'Piping sinkholes, badland rills, and alluvial fan aprons.',
      stratigraphy: 'Neogene turbidites and evaporitic gypsum sheets.'
    },
    environment: {
      meanAnnualTemp: '18.1 °C',
      diurnalRange: '6 °C to 42 °C',
      annualPrecipitation: '220 mm / year',
      uvIrradiance: 'High Mediterranean summer UV',
      aridityIndex: '0.22',
      dustStormFrequency: 'Occasional Saharan dust haze (Calima)'
    },
    scientificSignificance: [
      'Primary field test range for European Space Agency (ESA) Rosalind Franklin ExoMars rover autonomous navigation trials.',
      'Rio Tinto acid mine drainage iron-sulfate precipitates mimic Opportunity Meridiani Planum jarosite discoveries.',
      'Accessible European logistics allows iterative robotics software and hardware prototyping.'
    ],
    similaritiesToTarget: [
      'Jarosite sulfate mineralogy matches Martian acidic weathering products.',
      'Friable layered mudstone replicates low-compressive-strength rocks encountered by Curiosity.',
      'Complex 3D gully topography tests autonomous hazard avoidance algorithms.'
    ],
    limitations: [
      'Higher seasonal rainfall than core planetary analogs.',
      'Visible scrub vegetation in valley floors.',
      'Extensive human film-set and agricultural infrastructure on outskirts.'
    ],
    fieldTestingCapabilities: [
      { name: 'Autonomous Rover Traverse in Rough Badlands', suitability: 'exceptional', notes: 'ESA benchmark testing terrain.' },
      { name: 'Jarosite & Iron-Oxide Spectroscopic Targeting', suitability: 'high', notes: 'Spectral matches to Meridiani and Gale.' },
      { name: 'Subsurface 2-Meter Drill Operations', suitability: 'high', notes: 'Tests deep drill deployment in soft marls.' }
    ],
    notableMissionsOrExpeditions: [
      { campaign: 'ESA SAFER / ExoMars Field Trials', organization: 'European Space Agency (ESA)', year: '2019 - 2024', scope: 'Testing autonomous sample acquisition and autonomous route planning' }
    ],
    dataSources: [
      { title: 'IGN Spain PNOA High-Resolution Orthophotography 25cm', agency: 'IGN Spain', datasetId: 'PNOA_2023', type: 'Orbital Multispectral' },
      { title: 'Rio Tinto as an Acidic Mars Terrestrial Analogue', agency: 'Planetary and Space Science', datasetId: 'DOI:10.1016/j.pss.2017.02.008', type: 'Peer Reviewed Paper' }
    ],
    metrics: {
      geologicalSimilarity: 88,
      terrainRoughness: 87,
      slopeDistribution: 86,
      thermalDeltaMatch: 83,
      granulometryMatch: 89,
      spectralCorrespondence: 92,
      volatilesAnalogy: 78
    },
    imagery: {
      hero: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
      satellite: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
      terrain: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80'
    }
  }
];

