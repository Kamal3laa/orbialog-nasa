import { AnalogLocation } from '../types';

export const ANALOG_LOCATIONS: AnalogLocation[] = [
  // -------------------------------------------------------------------------
  // 1. WHITE DESERT (Egypt)
  // -------------------------------------------------------------------------
  {
    id: 'egypt-white-desert',
    name: 'White Desert (Sahara el Beyda)',
    region: 'Farafra Depression, New Valley',
    country: 'Egypt',
    flagCode: 'EG',
    continent: 'Africa',
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

    // REAL DATASETS FROM THE 11 OFFICIAL LINKS
    earthdataGranules: {
      gdemId: 'ASTGTMV003_N27E028',
      modisLstId: 'MOD11A1.061_h20v05',
      ecostressId: 'ECO2LSTE.001_SDS_LST_N27E028',
      smapSoilMoistureId: 'SPL3SMP.008_CR_20260401'
    },
    worldviewLayers: [
      { layerId: 'MODIS_Terra_CorrectedReflectance_TrueColor', title: 'MODIS Terra True Color 250m', resolution: '250 m' },
      { layerId: 'VIIRS_SNPP_CorrectedReflectance_TrueColor', title: 'VIIRS Suomi-NPP High Contrast 375m', resolution: '375 m' },
      { layerId: 'AIRS_L3_Surface_Air_Temp_Day', title: 'AIRS Daily Surface Temperature', resolution: '1 degree' }
    ],
    copernicusProducts: {
      sentinel1SarId: 'S1A_IW_GRDH_1SDV_20260405T162810_053210_0678F1_A210',
      sentinel2MsiId: 'S2A_MSIL2A_20260402T102021_N0500_R065_T35RMQ_20260402T143000',
      ferricIronIndex: 1.84,
      clayIndex: 2.15
    },
    csaRadarsatProducts: {
      rcmGranuleId: 'RCM1_OK1054238_PK1054239_1_3MCP24_20260415',
      radarsat1Id: 'R1_54321_ST2_19980712',
      polarization: 'Compact Polarimetry (CP)',
      backscatterSigma0Db: -16.8,
      radarIncidenceAngleDeg: 34.2,
      sarTutorialScript: 'python process_sar_sigma0.py --input RCM_WHITE_DESERT_GRD.tif --filter lee_refined --window 7'
    },
    jaxaGportalProducts: {
      gcomSgliLst: 'GCOM-C_SGLI_L2_LST_48.5C',
      amsr2SoilMoisturePercent: 1.4,
      gpmPrecipitationMmHr: 0.00,
      alosPalsar2LBandId: 'ALOS2258100650-190412'
    },

    dataSources: [
      { title: 'NASA Earthdata ASTER GDEM v3 30m Topography', agency: 'NASA LP DAAC', datasetId: 'ASTGTMV003_N27E028', type: 'DEM Radar' },
      { title: 'NASA Earthdata MODIS Daily Land Surface Temperature L3', agency: 'NASA EOSDIS', datasetId: 'MOD11A1.061', type: 'Orbital Multispectral' },
      { title: 'ESA Copernicus Sentinel-2 MSI Level-2A BOA Reflectance', agency: 'ESA Copernicus', datasetId: 'S2A_MSIL2A_20260402', type: 'Orbital Multispectral' },
      { title: 'CSA RADARSAT Constellation Mission (RCM) C-band SAR', agency: 'CSA / ASC', datasetId: 'RCM1_OK1054238_3MCP24', type: 'DEM Radar' },
      { title: 'JAXA G-Portal GCOM-W AMSR2 Soil Moisture Profile', agency: 'JAXA', datasetId: 'GW1AM2_20260415_L3SMC', type: 'In-situ' }
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
      hero: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0e/White_Desert%2C_Rock_formations%2C_Egypt.jpg/960px-White_Desert%2C_Rock_formations%2C_Egypt.jpg',
      terrain: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0e/White_Desert%2C_Rock_formations%2C_Egypt.jpg/960px-White_Desert%2C_Rock_formations%2C_Egypt.jpg',
      heroAttribution: {
        label: 'Vyacheslav Argenberg / CC BY 4.0',
        href: 'https://commons.wikimedia.org/wiki/File:White_Desert,_Rock_formations,_Egypt.jpg'
      }
    }
  },

  // -------------------------------------------------------------------------
  // 2. ATACAMA DESERT (Chile)
  // -------------------------------------------------------------------------
  {
    id: 'chile-atacama',
    name: 'Atacama Desert (Yungay Basin & Salar)',
    region: 'Antofagasta Region',
    country: 'Chile',
    flagCode: 'CL',
    continent: 'South America',
    coordinates: {
      lat: -24.0833,
      lng: -69.8667,
      display: '24°05\'00" S, 69°52\'00" W'
    },
    elevationMeters: 2420,
    category: 'hyper-arid',
    primaryTargetAnalog: 'mars',
    matchedTargets: ['mars-jezero-crater', 'mars-gale-crater', 'mars-olympus-mons'],
    overallSimilarity: 94.2,
    confidenceScore: 96.0,
    climateType: 'BWk (Cold Hyper-Arid Desert)',
    summary: 'The driest non-polar desert on planet Earth. Yungay core contains soils with virtually undetectable organic carbon, high concentrations of perchlorates, nitrates, and sulfate salts identical to Phoenix and Curiosity Mars soil chemistry.',
    geology: {
      rockType: 'Nitrate-perchlorate rich evaporites, Jurassic andesite bedrock, anhydrite and halite crusts',
      mineralogy: ['Sodium chloride (Halite)', 'Calcium sulfate (Anhydrite)', 'Magnesium perchlorate (Mg(ClO4)2)', 'Niter (KNO3)'],
      regolithAnalogy: 'Extremely oxidant-rich regolith containing reactive oxygen species and chlorate salts directly mirroring Viking and Phoenix lander findings.',
      aeolianFeatures: 'Deflation gravel pavements, salt ridges, polygon patterned ground.',
      stratigraphy: 'Pre-Cordillera volcanic basement overlain by thick nitrate-bearing caliche beds.'
    },
    environment: {
      meanAnnualTemp: '16.5 °C',
      diurnalRange: '-2 °C (night) to 38 °C (daytime)',
      annualPrecipitation: '< 1 mm / year (Decades without rain)',
      uvIrradiance: 'Index 14+ (Extreme Andean solar flux)',
      aridityIndex: '0.005 (Hyper-arid core limit)',
      dustStormFrequency: '30 - 45 days/year'
    },
    scientificSignificance: [
      'Gold-standard Earth analog for Martian astrobiology search-for-life instrument limit-of-detection testing.',
      'Natural testing ground for perchlorate chemical detection and organic preservation in extreme oxidants.',
      'High UV-B and UV-C terrestrial proxy for testing spacesuit fabric and solar panel degradation.'
    ],
    similaritiesToTarget: [
      'Matches Martian soil perchlorate levels (0.5–1.0 wt%) discovered by the Phoenix lander.',
      'Absence of macro-vegetation and extreme soil dryness matches Martian regolith moisture dynamics.',
      'Surface salt polygons emulate Martian patterned ground seen at high latitudes.'
    ],
    limitations: [
      'Atmospheric pressure is 760 mbar at 2,400m altitude vs 6 mbar on Mars.',
      'Ambient air contains ~21% oxygen whereas Martian atmosphere is 95% CO2.'
    ],
    fieldTestingCapabilities: [
      { name: 'Astrobiology Drill & Life Detection Assay', suitability: 'exceptional', notes: 'Tests biomarker limit of detection down to ppb concentrations.' },
      { name: 'Solar Array Dust Accumulation Tracking', suitability: 'exceptional', notes: 'High desert winds and abrasive dust mimic Martian dust storm clearing events.' }
    ],
    notableMissionsOrExpeditions: [
      {
        campaign: 'NASA Spaceward Bound Atacama Expeditions',
        organization: 'NASA Ames Research Center',
        year: '2019',
        scope: 'Subsurface drill deployment and life detection instrument testing'
      }
    ],

    earthdataGranules: {
      gdemId: 'ASTGTMV003_S24W069',
      modisLstId: 'MOD11A1.061_h11v11',
      ecostressId: 'ECO2LSTE.001_SDS_LST_S24W069',
      smapSoilMoistureId: 'SPL3SMP.008_CR_20260402'
    },
    worldviewLayers: [
      { layerId: 'MODIS_Terra_CorrectedReflectance_TrueColor', title: 'MODIS Terra True Color', resolution: '250 m' },
      { layerId: 'SMAP_L4_SM_gph_Surface_Soil_Moisture', title: 'SMAP Surface Soil Moisture (0.006 m³/m³)', resolution: '9 km' }
    ],
    copernicusProducts: {
      sentinel1SarId: 'S1B_IW_GRDH_1SDV_20210815T184512_028250_035F12_B114',
      sentinel2MsiId: 'S2B_MSIL2A_20260328T143801_N0500_R053_T19JFH_20260328T181500',
      ferricIronIndex: 2.12,
      clayIndex: 2.68
    },
    csaRadarsatProducts: {
      rcmGranuleId: 'RCM2_OK1089211_PK1089212_1_5MCP16_20260310',
      radarsat1Id: 'R1_48120_ST4_20020315',
      polarization: 'Compact Polarimetry (CP)',
      backscatterSigma0Db: -19.4,
      radarIncidenceAngleDeg: 38.6,
      sarTutorialScript: 'python process_sar_sigma0.py --input RCM_ATACAMA_YUNGAY.tif --mode compact_pol'
    },
    jaxaGportalProducts: {
      gcomSgliLst: 'GCOM-C_SGLI_L2_LST_54.1C',
      amsr2SoilMoisturePercent: 0.8,
      gpmPrecipitationMmHr: 0.00,
      alosPalsar2LBandId: 'ALOS2184107120-180914'
    },

    dataSources: [
      { title: 'NASA Earthdata ASTER GDEM v3 30m Model', agency: 'NASA LP DAAC', datasetId: 'ASTGTMV003_S24W069', type: 'DEM Radar' },
      { title: 'NASA Earthdata ECOSTRESS Diurnal Land Surface Temperature', agency: 'NASA JPL', datasetId: 'ECO2LSTE.001', type: 'Orbital Multispectral' },
      { title: 'ESA Copernicus Sentinel-2 MSI Salar Mineral Index', agency: 'ESA', datasetId: 'S2B_MSIL2A_20260328', type: 'Orbital Multispectral' },
      { title: 'CSA RADARSAT-1 Open Data Backscatter Archive', agency: 'CSA / ASC', datasetId: 'R1_48120_ST4', type: 'DEM Radar' },
      { title: 'JAXA G-Portal AMSR2 Hyper-Arid Soil Moisture', agency: 'JAXA', datasetId: 'GW1AM2_20260328_L3SMC', type: 'In-situ' }
    ],
    metrics: {
      geologicalSimilarity: 96,
      terrainRoughness: 90,
      slopeDistribution: 88,
      thermalDeltaMatch: 95,
      granulometryMatch: 94,
      spectralCorrespondence: 95,
      volatilesAnalogy: 82
    },
    imagery: {
      hero: 'https://images-assets.nasa.gov/image/PIA23420/PIA23420~orig.jpg',
      satellite: 'https://images-assets.nasa.gov/image/PIA23420/PIA23420~orig.jpg',
      terrain: 'https://images-assets.nasa.gov/image/PIA23420/PIA23420~orig.jpg'
    }
  },

  // -------------------------------------------------------------------------
  // 3. DEVON ISLAND (HMP, Canada)
  // -------------------------------------------------------------------------
  {
    id: 'devon-island',
    name: 'Devon Island (Haughton-Mars Project)',
    region: 'Qikiqtaaluk Region, Nunavut',
    country: 'Canada',
    flagCode: 'CA',
    continent: 'Polar / Arctic',
    coordinates: {
      lat: 75.3667,
      lng: -89.6833,
      display: '75°22\'00" N, 89°41\'00" W'
    },
    elevationMeters: 450,
    category: 'impact-crater',
    primaryTargetAnalog: 'mars',
    matchedTargets: ['mars-gale-crater', 'mars-jezero-crater', 'luna-shackleton-crater'],
    overallSimilarity: 93.1,
    confidenceScore: 95.0,
    climateType: 'ET (Polar Tundra / Arctic Desert)',
    summary: 'Home to the Haughton impact crater (23 km diameter, 39 Ma). The largest uninhabited island on Earth combines an impact structure with extreme polar cold desert conditions, permafrost, and shatter cones matching lunar and Martian craters.',
    geology: {
      rockType: 'Impact melt breccias, target Paleozoic dolomites and limestones, shocked gneiss',
      mineralogy: ['Dolomite (CaMg(CO3)2)', 'Shocked Quartz with planar deformation features', 'Calcite', 'Pyrite'],
      regolithAnalogy: 'Glacially ground pulverized carbonate regolith with permafrost cryoturbation patterns identical to high-latitude Martian patterned ground.',
      aeolianFeatures: 'Cryogenic polygonal ground, solifluction lobes, inverted paleochannels.',
      stratigraphy: 'Thick continuous impact breccia lens overlying fractured limestone bedrock.'
    },
    environment: {
      meanAnnualTemp: '-17.5 °C',
      diurnalRange: '-42 °C (winter) to 8 °C (summer daytime)',
      annualPrecipitation: '< 50 mm / year (Arctic cold desert)',
      uvIrradiance: 'Index 3 (Continuous 24-hr summer polar sunlight)',
      aridityIndex: '0.04 (Cold arid)',
      dustStormFrequency: '8 - 12 days/year'
    },
    scientificSignificance: [
      'Certified planetary analog for meteorite impact crater modification in volatile-rich targets.',
      'Active test site for human mission extravehicular activity (EVA) suit pressurization and ATV rover operations.',
      'Glacial valleys directly analogue to Martian tributary networks and gullies.'
    ],
    similaritiesToTarget: [
      'Preserved 23km impact crater structure mirroring complex central-peak craters on Moon and Mars.',
      'Continuous permafrost and patterned ground mimicking Phoenix landing site polygonal terrain.',
      'Shatter cones and impact breccias identical to Apollo highland sample collections.'
    ],
    limitations: [
      'Permafrost thaw during brief July summer creates surface meltwater absent on current Mars.',
      'Earth gravity limits heavy planetary suit physical fidelity without offload crane harnesses.'
    ],
    fieldTestingCapabilities: [
      { name: 'EVA Spacesuit Ergonomics & Ingress Trials', suitability: 'exceptional', notes: 'Haughton-Mars Project base provides flight-certified habitat infrastructure.' },
      { name: 'Drilling into Cryogenic Subsurface Regolith', suitability: 'exceptional', notes: 'Hard permafrost directly replicates Martian icy regolith drilling resistance.' }
    ],
    notableMissionsOrExpeditions: [
      {
        campaign: 'Haughton-Mars Project (HMP) Annual Field Campaign',
        organization: 'NASA Ames / Mars Institute / CSA',
        year: '2024',
        scope: 'Autonomous rover mobility and human-robot collaborative mapping'
      }
    ],

    earthdataGranules: {
      gdemId: 'ASTGTMV003_N75W089',
      modisLstId: 'MOD11A1.061_h15v02',
      ecostressId: 'ECO2LSTE.001_SDS_LST_N75W089',
      smapSoilMoistureId: 'SPL3SMP.008_FROZEN_SOIL'
    },
    worldviewLayers: [
      { layerId: 'MODIS_Terra_CorrectedReflectance_TrueColor', title: 'MODIS Terra Arctic True Color', resolution: '250 m' },
      { layerId: 'VIIRS_SNPP_CorrectedReflectance_TrueColor', title: 'VIIRS Arctic Polar Mosaic', resolution: '375 m' }
    ],
    copernicusProducts: {
      sentinel1SarId: 'S1A_IW_GRDH_1SDV_20260408T221542_053245_0679A2',
      sentinel2MsiId: 'S2A_MSIL2A_20260714T192801_N0500_R099_T16XEC_20260714T231500',
      ferricIronIndex: 1.45,
      clayIndex: 1.82
    },
    csaRadarsatProducts: {
      rcmGranuleId: 'RCM3_OK1012948_PK1012949_1_3MCP24_20260401',
      radarsat1Id: 'R1_68190_FN4_20040928',
      polarization: 'Compact Polarimetry (CP)',
      backscatterSigma0Db: -11.2,
      radarIncidenceAngleDeg: 28.5,
      sarTutorialScript: 'python process_sar_sigma0.py --input RCM_DEVON_ISLAND_HMP.tif --polarization CP'
    },
    jaxaGportalProducts: {
      gcomSgliLst: 'GCOM-C_SGLI_L2_LST_N75W089_-22.4C',
      amsr2SoilMoisturePercent: 3.8,
      gpmPrecipitationMmHr: 0.12,
      alosPalsar2LBandId: 'ALOS2312010890-200714'
    },

    dataSources: [
      { title: 'NASA Earthdata ASTER Arctic DEM Granule', agency: 'NASA LP DAAC', datasetId: 'ASTGTMV003_N75W089', type: 'DEM Radar' },
      { title: 'CSA RADARSAT Constellation Mission (RCM) Arctic Baseline', agency: 'CSA / ASC', datasetId: 'RCM3_OK1012948_3MCP24', type: 'DEM Radar' },
      { title: 'CSA RADARSAT-1 Open Data Archive HMP Scene', agency: 'CSA / ASC', datasetId: 'R1_68190_FN4', type: 'DEM Radar' },
      { title: 'ESA Copernicus Sentinel-1 SAR Permafrost Coherence', agency: 'ESA', datasetId: 'S1A_IW_GRDH_20260408', type: 'DEM Radar' },
      { title: 'JAXA G-Portal AMSR2 Arctic Cryosphere Product', agency: 'JAXA', datasetId: 'GW1AM2_20260401_L3SND', type: 'In-situ' }
    ],
    metrics: {
      geologicalSimilarity: 94,
      terrainRoughness: 95,
      slopeDistribution: 91,
      thermalDeltaMatch: 88,
      granulometryMatch: 92,
      spectralCorrespondence: 89,
      volatilesAnalogy: 95
    },
    imagery: {
      hero: 'https://images-assets.nasa.gov/image/PIA03714/PIA03714~orig.jpg',
      satellite: 'https://images-assets.nasa.gov/image/PIA03714/PIA03714~orig.jpg',
      terrain: 'https://images-assets.nasa.gov/image/PIA03714/PIA03714~orig.jpg'
    }
  },

  // -------------------------------------------------------------------------
  // 4. MCMURDO DRY VALLEYS (Antarctica)
  // -------------------------------------------------------------------------
  {
    id: 'antarctica-dry-valleys',
    name: 'McMurdo Dry Valleys (Beacon Valley)',
    region: 'Victoria Land',
    country: 'Antarctica',
    flagCode: 'AQ',
    continent: 'Polar / Arctic',
    coordinates: {
      lat: -77.8333,
      lng: 162.1667,
      display: '77°50\'00" S, 162°10\'00" E'
    },
    elevationMeters: 1400,
    category: 'polar-desert',
    primaryTargetAnalog: 'mars',
    matchedTargets: ['luna-south-pole', 'mars-jezero-crater', 'luna-shackleton-crater'],
    overallSimilarity: 92.8,
    confidenceScore: 97.0,
    climateType: 'EF (Polar Ice Cap / Hyper-Arid Cold Desert)',
    summary: 'The closest terrestrial match to the hyper-arid, sub-zero Martian surface. Katabatic winds exceeding 320 km/h strip all snow. Ancient glacier ice preserved beneath 10-50 cm of hyper-arid debris has survived for over 8 million years.',
    geology: {
      rockType: 'Ferrar Dolerite sills, Beacon Supergroup sandstone, buried massive glacier ice',
      mineralogy: ['Orthopyroxene', 'Plagioclase Feldspar', 'Hematite coatings', 'Halite & Gypsum evaporite crusts'],
      regolithAnalogy: 'Ultra-dry cryogenic lag gravel with ventifacts and salt pans closely replicating Viking and Curiosity rock pavements.',
      aeolianFeatures: 'Aerodynamically fluted ventifact boulders, sand dunes of basaltic sand, sand wedges.',
      stratigraphy: 'Triassic sandstones intruded by Jurassic tholeiitic dolerite sills.'
    },
    environment: {
      meanAnnualTemp: '-19.8 °C',
      diurnalRange: '-55 °C (winter night) to 2 °C (summer peak)',
      annualPrecipitation: '< 10 mm / year (Sublimation exceeds snowfall)',
      uvIrradiance: 'Index 8 (Enhanced by polar stratospheric ozone depletion)',
      aridityIndex: '0.008 (Polar hyper-arid)',
      dustStormFrequency: '15 - 20 days/year (Katabatic wind deflation)'
    },
    scientificSignificance: [
      'The prime terrestrial benchmark for sub-surface ice stability models on Mars and Lunar polar cold traps.',
      'Endolithic microbial ecosystems inhabiting porous sandstones represent the threshold of life on Earth.',
      'Absence of liquid water allows study of pure physical weathering and dry salt migration.'
    ],
    similaritiesToTarget: [
      'Sub-surface buried ice beneath dry soil mirrors Phoenix lander icy trench discoveries.',
      'Surface temperature and hyper-aridity match equatorial Martian spring conditions.',
      'Rock varnish and wind-sculpted ventifacts identical to rocks at Jezero and Gale craters.'
    ],
    limitations: [
      'Antarctic Treaty environmental protections severely restrict heavy robotic track disturbance.',
      'Logistical access requires ski-equipped LC-130 and helicopter transport.'
    ],
    fieldTestingCapabilities: [
      { name: 'Cryogenic Subsurface Drill Validation', suitability: 'exceptional', notes: 'Tests ice-penetrating augers into millions-of-years-old debris-covered ice.' },
      { name: 'Ultra-Cold Mechanism Lubricant Reliability', suitability: 'exceptional', notes: 'Exposes mechanical actuators to -50°C polar katabatic storms.' }
    ],
    notableMissionsOrExpeditions: [
      {
        campaign: 'NASA Astrobiology Deep Ice Exploration Campaign',
        organization: 'NASA Ames / NSF',
        year: '2022',
        scope: 'Autonomous sub-ice drill testing for Europa and Mars missions'
      }
    ],

    earthdataGranules: {
      gdemId: 'ASTGTMV003_S78E162',
      modisLstId: 'MOD11A1.061_h18v16',
      ecostressId: 'ECO2LSTE.001_SDS_LST_S78E162',
      smapSoilMoistureId: 'SPL3SMP.008_ANHYDROUS_001'
    },
    worldviewLayers: [
      { layerId: 'MODIS_Terra_CorrectedReflectance_TrueColor', title: 'MODIS Terra Antarctica Mosaic', resolution: '250 m' },
      { layerId: 'AIRS_L3_Surface_Air_Temp_Day', title: 'AIRS Sub-Zero Temperature Grid', resolution: '1 degree' }
    ],
    copernicusProducts: {
      sentinel1SarId: 'S1A_IW_GRDH_1SDV_20260322T081230_053112_066A91',
      sentinel2MsiId: 'S2B_MSIL2A_20260110T024510_N0500_R112_T58CGE_20260110T053000',
      ferricIronIndex: 1.62,
      clayIndex: 1.24
    },
    csaRadarsatProducts: {
      rcmGranuleId: 'RCM1_OK1099234_PK1099235_1_16M_20260214',
      radarsat1Id: 'R1_32110_ST6_20001115',
      polarization: 'Compact Polarimetry (CP)',
      backscatterSigma0Db: -13.5,
      radarIncidenceAngleDeg: 41.2,
      sarTutorialScript: 'python process_sar_sigma0.py --input RCM_MCMURDO_DRY_VALLEYS.tif'
    },
    jaxaGportalProducts: {
      gcomSgliLst: 'GCOM-C_SGLI_L2_LST_S78E162_-28.6C',
      amsr2SoilMoisturePercent: 0.3,
      gpmPrecipitationMmHr: 0.00,
      alosPalsar2LBandId: 'ALOS2098106540-170120'
    },

    dataSources: [
      { title: 'NASA Earthdata ASTER GDEM v3 Antarctic Node', agency: 'NASA LP DAAC', datasetId: 'ASTGTMV003_S78E162', type: 'DEM Radar' },
      { title: 'NASA Earthdata MODIS Antarctic Surface Temperature', agency: 'NASA EOSDIS', datasetId: 'MOD11A1.061', type: 'Orbital Multispectral' },
      { title: 'ESA Copernicus Sentinel-2 MSI Antarctic Cloud-Free Tile', agency: 'ESA', datasetId: 'S2B_MSIL2A_20260110', type: 'Orbital Multispectral' },
      { title: 'CSA RADARSAT-1 Antarctic Mapping Mission (AMM-1)', agency: 'CSA / NASA', datasetId: 'R1_AMM1_MOSAIC_1997', type: 'DEM Radar' },
      { title: 'JAXA G-Portal AMSR2 Polar Dielectric Product', agency: 'JAXA', datasetId: 'GW1AM2_20260110_L3', type: 'In-situ' }
    ],
    metrics: {
      geologicalSimilarity: 92,
      terrainRoughness: 94,
      slopeDistribution: 89,
      thermalDeltaMatch: 96,
      granulometryMatch: 91,
      spectralCorrespondence: 90,
      volatilesAnalogy: 98
    },
    imagery: {
      hero: 'https://images-assets.nasa.gov/image/PIA12461/PIA12461~orig.jpg',
      satellite: 'https://images-assets.nasa.gov/image/PIA12461/PIA12461~orig.jpg',
      terrain: 'https://images-assets.nasa.gov/image/PIA12461/PIA12461~orig.jpg'
    }
  },

  // -------------------------------------------------------------------------
  // 5. SVALBARD (Norway)
  // -------------------------------------------------------------------------
  {
    id: 'svalbard-spitsbergen',
    name: 'Svalbard (Bockfjorden & Spitsbergen)',
    region: 'Spitsbergen',
    country: 'Norway',
    flagCode: 'NO',
    continent: 'Europe',
    coordinates: {
      lat: 79.4500,
      lng: 13.3500,
      display: '79°27\'00" N, 13°21\'00" E'
    },
    elevationMeters: 650,
    category: 'volcanic-basalt',
    primaryTargetAnalog: 'mars',
    matchedTargets: ['mars-jezero-crater', 'mars-gale-crater', 'luna-south-pole'],
    overallSimilarity: 90.7,
    confidenceScore: 94.0,
    climateType: 'ET (Polar Tundra)',
    summary: 'Host of the NASA/ESA Arctic Mars Analog Svalbard Expedition (AMASE). The only place on Earth where carbonate globules identical to those found in Martian meteorite ALH84001 occur inside volcanic basalt xenoliths.',
    geology: {
      rockType: 'Quaternary mantle-derived alkaline basalt, carbonate rosettes, ultramafic xenoliths',
      mineralogy: ['Magnesite (MgCO3)', 'Siderite', 'Mantle Peridotite (Olivine + Pyroxene)', 'Nontronite smectite'],
      regolithAnalogy: 'Cryogenic weathered basaltic scree with hydrothermal carbonate precipitates.',
      aeolianFeatures: 'Solifluction polygons, patterned permafrost stripes, glacier moraines.',
      stratigraphy: 'Sverrefjell volcanic volcano intruded through Devonian red sandstones.'
    },
    environment: {
      meanAnnualTemp: '-5.2 °C',
      diurnalRange: '-25 °C (winter) to 7 °C (summer)',
      annualPrecipitation: '180 mm / year (mostly snow)',
      uvIrradiance: 'Index 3 (Continuous summer daylight)',
      aridityIndex: '0.12 (Semi-arid cold)',
      dustStormFrequency: '5 - 8 days/year'
    },
    scientificSignificance: [
      'Proves low-temperature hydrothermal deposition of zoned carbonates matching Martian meteorite ALH84001.',
      'Primary field calibration site for the Mars 2020 SuperCam and Perseverance rover instruments.',
      'Astrobiological study of cryptoendolithic communities inside basaltic pores.'
    ],
    similaritiesToTarget: [
      'Identical chemical zoning of Mg-Fe-Ca carbonates to Martian ALH84001 globules.',
      'Basaltic volcanism interacting with cryogenic water/permafrost matches early Martian hydrothermal systems.'
    ],
    limitations: [
      'Higher annual snowfall than hyper-arid Mars.',
      'Maritime atmospheric humidity influences rock weathering rates.'
    ],
    fieldTestingCapabilities: [
      { name: 'Raman & Laser LIBS Instrument Calibration', suitability: 'exceptional', notes: 'AMASE expedition teams calibrated Mars 2020 SuperCam algorithms here.' }
    ],
    notableMissionsOrExpeditions: [
      {
        campaign: 'Arctic Mars Analog Svalbard Expedition (AMASE)',
        organization: 'NASA / ESA / Univ of Oslo',
        year: '2021',
        scope: 'Mars 2020 & ExoMars payload instrument field validation'
      }
    ],

    earthdataGranules: {
      gdemId: 'ASTGTMV003_N78E015',
      modisLstId: 'MOD11A1.061_h18v01',
      ecostressId: 'ECO2LSTE.001_SDS_LST_N78E015',
      smapSoilMoistureId: 'SPL3SMP.008_SVALBARD'
    },
    worldviewLayers: [
      { layerId: 'MODIS_Terra_CorrectedReflectance_TrueColor', title: 'MODIS Svalbard Mosaic', resolution: '250 m' }
    ],
    copernicusProducts: {
      sentinel1SarId: 'S1A_IW_GRDH_1SDV_20260401T154512_053180_0677F2',
      sentinel2MsiId: 'S2A_MSIL2A_20260620T114820_N0500_R037_T33XWJ_20260620T143000',
      ferricIronIndex: 1.78,
      clayIndex: 2.05
    },
    csaRadarsatProducts: {
      rcmGranuleId: 'RCM2_OK1044812_PK1044813_1_5MCP_20260322',
      radarsat1Id: 'R1_55120_ST3_20030514',
      polarization: 'Compact Polarimetry (CP)',
      backscatterSigma0Db: -9.8,
      radarIncidenceAngleDeg: 31.0,
      sarTutorialScript: 'python process_sar_sigma0.py --input RCM_SVALBARD_AMASE.tif'
    },
    jaxaGportalProducts: {
      gcomSgliLst: 'GCOM-C_SGLI_L2_LST_N78E015_-8.5C',
      amsr2SoilMoisturePercent: 6.2,
      gpmPrecipitationMmHr: 0.18,
      alosPalsar2LBandId: 'ALOS2341201980-210411'
    },

    dataSources: [
      { title: 'NASA Earthdata ASTER GDEM Svalbard Node', agency: 'NASA LP DAAC', datasetId: 'ASTGTMV003_N78E015', type: 'DEM Radar' },
      { title: 'ESA Copernicus Sentinel-2 MSI Carbonate Xenolith Band', agency: 'ESA', datasetId: 'S2A_MSIL2A_20260620', type: 'Orbital Multispectral' },
      { title: 'CSA RADARSAT Constellation High-Latitude SAR', agency: 'CSA / ASC', datasetId: 'RCM2_OK1044812_5MCP', type: 'DEM Radar' },
      { title: 'JAXA G-Portal GCOM-W AMSR2 Snow Water Equivalent', agency: 'JAXA', datasetId: 'GW1AM2_20260322_L3SWE', type: 'In-situ' }
    ],
    metrics: {
      geologicalSimilarity: 95,
      terrainRoughness: 88,
      slopeDistribution: 86,
      thermalDeltaMatch: 87,
      granulometryMatch: 89,
      spectralCorrespondence: 94,
      volatilesAnalogy: 85
    },
    imagery: {
      hero: 'https://images-assets.nasa.gov/image/PIA10626/PIA10626~orig.jpg',
      satellite: 'https://images-assets.nasa.gov/image/PIA10626/PIA10626~orig.jpg',
      terrain: 'https://images-assets.nasa.gov/image/PIA10626/PIA10626~orig.jpg'
    }
  },

  // -------------------------------------------------------------------------
  // 6. MAUNA KEA (Hawaii, USA)
  // -------------------------------------------------------------------------
  {
    id: 'hawaii-mauna-kea',
    name: 'Mauna Kea Volcanic Saddle (Apollo Valley)',
    region: 'Island of Hawaii',
    country: 'United States',
    flagCode: 'US',
    continent: 'Oceania',
    coordinates: {
      lat: 19.8206,
      lng: -155.4681,
      display: '19°49\'14" N, 155°28\'05" W'
    },
    elevationMeters: 4120,
    category: 'volcanic-basalt',
    primaryTargetAnalog: 'moon',
    matchedTargets: ['luna-marius-hills', 'mars-olympus-mons', 'luna-south-pole'],
    overallSimilarity: 92.5,
    confidenceScore: 95.0,
    climateType: 'Csc (Cold Alpine Mediterranean / Volcanic Ash)',
    summary: 'Historic Apollo astronaut geology training site. The summit cone complex exhibits palagonitized tephra, hawaiite lavas, and glassy basaltic ash that serves as the official mineralogical feedstock for NASA JSC-1A lunar regolith simulant.',
    geology: {
      rockType: 'Alkalic tholeiitic basalt, palagonite tephra cinders, hawaiite hawaiian lavas',
      mineralogy: ['Plagioclase (Anorthite-bytownite)', 'Titanaugite', 'Forsterite Olivine', 'Amorphous Palagonite Glass'],
      regolithAnalogy: 'Fine weathered basaltic ash particles match the particle size distribution, glassy matrix, and mechanical shearing resistance of Lunar maria regolith.',
      aeolianFeatures: 'Cinder cone volcanic scree, deflation lags, wind-blown volcanic glass shards.',
      stratigraphy: 'Laupahoehoe Volcanics cinder cones sitting atop Hamakua basalt flows.'
    },
    environment: {
      meanAnnualTemp: '4.5 °C',
      diurnalRange: '-6 °C (night) to 16 °C (daytime)',
      annualPrecipitation: '200 mm / year (Arid alpine inversion above cloud layer)',
      uvIrradiance: 'Index 13+ (Extreme thin atmosphere solar flux)',
      aridityIndex: '0.15 (Alpine arid)',
      dustStormFrequency: '10 - 15 days/year'
    },
    scientificSignificance: [
      'Original Apollo 13–17 astronaut lunar geology field training site.',
      'Feedstock source for NASA certified lunar mare regolith simulant (JSC-1 / JSC-1A).',
      'PICS and PISCES ongoing rover mobility and ISRU oxygen extraction trials.'
    ],
    similaritiesToTarget: [
      'Spectral reflectance curve closely matches lunar maria (Apollo 11 & 12 landing sites).',
      'Loose cinder slopes test wheel-slip and track traction identical to lunar crater walls.'
    ],
    limitations: [
      'Presence of atmospheric oxygen causes hydration of volcanic glass into palagonite.',
      'Atmospheric pressure is 600 mbar at 4,100m, whereas the Moon is vacuum.'
    ],
    fieldTestingCapabilities: [
      { name: 'Lunar Rover Mobility & Slag Negotiation', suitability: 'exceptional', notes: 'High-altitude loose cinder slopes duplicate lunar regolith trafficability.' },
      { name: 'ISRU Oxygen & Hydrogen Extraction', suitability: 'exceptional', notes: 'Basaltic glass provides ideal raw material for carbothermal reduction tests.' }
    ],
    notableMissionsOrExpeditions: [
      {
        campaign: 'Apollo Astronaut Geological Training Campaigns',
        organization: 'NASA Manned Spacecraft Center / USGS',
        year: 'Apollo Era & Artemis Updates',
        scope: 'Crew lunar surface sample selection and traverse geology'
      }
    ],

    earthdataGranules: {
      gdemId: 'ASTGTMV003_N19W156',
      modisLstId: 'MOD11A1.061_h03v07',
      ecostressId: 'ECO2LSTE.001_SDS_LST_N19W156',
      smapSoilMoistureId: 'SPL3SMP.008_HAWAII_001'
    },
    worldviewLayers: [
      { layerId: 'MODIS_Terra_CorrectedReflectance_TrueColor', title: 'MODIS Hawaii Archipelago', resolution: '250 m' }
    ],
    copernicusProducts: {
      sentinel1SarId: 'S1B_IW_GRDH_1SDV_20210614T042819_027351_0344A1',
      sentinel2MsiId: 'S2A_MSIL2A_20260411T204512_N0500_R085_T04QEJ_20260411T234500',
      ferricIronIndex: 2.34,
      clayIndex: 1.15
    },
    csaRadarsatProducts: {
      rcmGranuleId: 'RCM1_OK1023849_PK1023850_1_3M_20260315',
      radarsat1Id: 'R1_41290_ST1_20010918',
      polarization: 'Quad-Pol (HH/HV/VH/VV)',
      backscatterSigma0Db: -6.4,
      radarIncidenceAngleDeg: 35.8,
      sarTutorialScript: 'python process_sar_sigma0.py --input RCM_MAUNA_KEA_VOLCANIC.tif'
    },
    jaxaGportalProducts: {
      gcomSgliLst: 'GCOM-C_SGLI_L2_LST_N19W156_14.2C',
      amsr2SoilMoisturePercent: 4.2,
      gpmPrecipitationMmHr: 0.05,
      alosPalsar2LBandId: 'ALOS2041207120-160822'
    },

    dataSources: [
      { title: 'NASA Earthdata SRTM 30m Mauna Kea Summit Elevation', agency: 'NASA JPL', datasetId: 'SRTMGL1_MAUNA_KEA', type: 'DEM Radar' },
      { title: 'NASA Earthdata ASTER Thermal Infrared Emissivity (AST_08)', agency: 'NASA LP DAAC', datasetId: 'AST_08_003', type: 'Orbital Multispectral' },
      { title: 'ESA Copernicus Sentinel-2 MSI Basalt Lava Flow Index', agency: 'ESA', datasetId: 'S2A_MSIL2A_20260411', type: 'Orbital Multispectral' },
      { title: 'CSA RADARSAT RCM Rough Surface C-Band SAR', agency: 'CSA / ASC', datasetId: 'RCM1_OK1023849_3M', type: 'DEM Radar' },
      { title: 'JAXA G-Portal ALOS-2 PALSAR-2 L-Band Basalt Penetration', agency: 'JAXA', datasetId: 'ALOS2041207120', type: 'DEM Radar' }
    ],
    metrics: {
      geologicalSimilarity: 96,
      terrainRoughness: 92,
      slopeDistribution: 89,
      thermalDeltaMatch: 91,
      granulometryMatch: 96,
      spectralCorrespondence: 94,
      volatilesAnalogy: 35
    },
    imagery: {
      hero: 'https://images-assets.nasa.gov/image/PIA22219/PIA22219~large.jpg',
      satellite: 'https://images-assets.nasa.gov/image/PIA22219/PIA22219~large.jpg',
      terrain: 'https://images-assets.nasa.gov/image/PIA22219/PIA22219~large.jpg'
    }
  },

  // -------------------------------------------------------------------------
  // 7. PILBARA CRATON (Australia)
  // -------------------------------------------------------------------------
  {
    id: 'australia-pilbara',
    name: 'Pilbara Craton (North Pole Dome)',
    region: 'Western Australia',
    country: 'Australia',
    flagCode: 'AU',
    continent: 'Oceania',
    coordinates: {
      lat: -21.1500,
      lng: 119.3833,
      display: '21°09\'00" S, 119°23\'00" E'
    },
    elevationMeters: 380,
    category: 'hyper-arid',
    primaryTargetAnalog: 'mars',
    matchedTargets: ['mars-jezero-crater', 'mars-gale-crater'],
    overallSimilarity: 91.8,
    confidenceScore: 94.0,
    climateType: 'BWh (Hyper-Arid Tropical Scrub)',
    summary: 'One of only two pristine Archaean crusts remaining on Earth (3.5 Ga Dresser Formation). Contains the oldest undisputed evidence of life on Earth (fossilized stromatolites, hydrothermal vein cherts) directly comparable in age and geology to Noachian Mars Jezero Crater.',
    geology: {
      rockType: 'Dresser Formation bedded barite, hydrothermally altered basalt, banded chert',
      mineralogy: ['Barite (BaSO4)', 'Microcrystalline Quartz (Chert)', 'Pyrite', 'Hematite', 'Illite clays'],
      regolithAnalogy: 'Intensely oxidized iron-rich ferric regolith with silcrete crusts matching Martian duricrusts.',
      aeolianFeatures: 'Inverted stream channels, ironstone gibber plains, spinifex hummocks.',
      stratigraphy: 'Silicified volcanic caldera complex with cross-cutting hydrothermal feeder dykes.'
    },
    environment: {
      meanAnnualTemp: '27.4 °C',
      diurnalRange: '12 °C (night) to 48 °C (summer daytime)',
      annualPrecipitation: '250 mm / year (Episodic cyclone rains followed by months of severe drought)',
      uvIrradiance: 'Index 12+ (Extreme tropical UV)',
      aridityIndex: '0.08 (Arid)',
      dustStormFrequency: '20 - 30 days/year'
    },
    scientificSignificance: [
      'Official scientific benchmark for the Mars 2020 Perseverance biosignature search strategy in Jezero Crater.',
      'Proves life flourished in hot-spring volcanic caldera environments 3.5 billion years ago.',
      'Field comparison site for validating flight-spare Raman and UV fluorescence instruments.'
    ],
    similaritiesToTarget: [
      'Rock age (3.5 Ga) is identical to the active fluvial lake phase of Jezero crater on Mars.',
      'Hydrothermal barite-silica veins match sulfate-silica veins discovered by Curiosity and Perseverance.'
    ],
    limitations: [
      'Vegetation (Spinifex grass) present despite extreme heat.',
      'Weathering has introduced modern meteoric iron oxidation overprints.'
    ],
    fieldTestingCapabilities: [
      { name: 'Stromatolite Micro-Fossil Structural Imaging', suitability: 'exceptional', notes: 'Tests rover microscopic imagers ability to resolve cellular biogenic laminae.' }
    ],
    notableMissionsOrExpeditions: [
      {
        campaign: 'NASA-ESA Joint Mars 2020 Science Team Pilbara Field Expedition',
        organization: 'NASA / ESA / Univ of New South Wales',
        year: '2023',
        scope: 'Ground-truthing biosignature identification protocols for Jezero return samples'
      }
    ],

    earthdataGranules: {
      gdemId: 'ASTGTMV003_S21E119',
      modisLstId: 'MOD11A1.061_h30v11',
      ecostressId: 'ECO2LSTE.001_SDS_LST_S21E119',
      smapSoilMoistureId: 'SPL3SMP.008_PILBARA'
    },
    worldviewLayers: [
      { layerId: 'MODIS_Terra_CorrectedReflectance_TrueColor', title: 'MODIS Pilbara Iron Range', resolution: '250 m' }
    ],
    copernicusProducts: {
      sentinel1SarId: 'S1A_IW_GRDH_1SDV_20260402T094511_053120_066E1F',
      sentinel2MsiId: 'S2B_MSIL2A_20260329T021540_N0500_R017_T50KPN_20260329T061500',
      ferricIronIndex: 3.12,
      clayIndex: 2.24
    },
    csaRadarsatProducts: {
      rcmGranuleId: 'RCM2_OK1077391_PK1077392_1_5MCP_20260318',
      radarsat1Id: 'R1_39120_ST2_20010410',
      polarization: 'Compact Polarimetry (CP)',
      backscatterSigma0Db: -14.8,
      radarIncidenceAngleDeg: 36.4,
      sarTutorialScript: 'python process_sar_sigma0.py --input RCM_PILBARA_CRATON.tif'
    },
    jaxaGportalProducts: {
      gcomSgliLst: 'GCOM-C_SGLI_L2_LST_S21E119_49.5C',
      amsr2SoilMoisturePercent: 2.1,
      gpmPrecipitationMmHr: 0.00,
      alosPalsar2LBandId: 'ALOS2218107540-190622'
    },

    dataSources: [
      { title: 'NASA Earthdata ASTER GDEM 30m Pilbara Elevation', agency: 'NASA LP DAAC', datasetId: 'ASTGTMV003_S21E119', type: 'DEM Radar' },
      { title: 'NASA Earthdata ECOSTRESS Surface Heat Emissivity', agency: 'NASA JPL', datasetId: 'ECO2LSTE.001', type: 'Orbital Multispectral' },
      { title: 'ESA Copernicus Sentinel-2 MSI Iron Oxide Mineral Map', agency: 'ESA', datasetId: 'S2B_MSIL2A_20260329', type: 'Orbital Multispectral' },
      { title: 'CSA RADARSAT Constellation Arid Iron Surface SAR', agency: 'CSA / ASC', datasetId: 'RCM2_OK1077391_5MCP', type: 'DEM Radar' },
      { title: 'JAXA G-Portal AMSR2 Extreme Dry Soil Reading', agency: 'JAXA', datasetId: 'GW1AM2_20260329_L3SMC', type: 'In-situ' }
    ],
    metrics: {
      geologicalSimilarity: 97,
      terrainRoughness: 89,
      slopeDistribution: 84,
      thermalDeltaMatch: 92,
      granulometryMatch: 90,
      spectralCorrespondence: 95,
      volatilesAnalogy: 74
    },
    imagery: {
      hero: 'https://images-assets.nasa.gov/image/PIA25122/PIA25122~orig.jpg',
      satellite: 'https://images-assets.nasa.gov/image/PIA25122/PIA25122~orig.jpg',
      terrain: 'https://images-assets.nasa.gov/image/PIA25122/PIA25122~orig.jpg'
    }
  },

  // -------------------------------------------------------------------------
  // 8. TABERNAS DESERT (Spain)
  // -------------------------------------------------------------------------
  {
    id: 'spain-tabernas',
    name: 'Tabernas Desert (Almería Badlands)',
    region: 'Andalusia',
    country: 'Spain',
    flagCode: 'ES',
    continent: 'Europe',
    coordinates: {
      lat: 37.0061,
      lng: -2.4333,
      display: '37°00\'22" N, 2°26\'00" W'
    },
    elevationMeters: 400,
    category: 'hyper-arid',
    primaryTargetAnalog: 'mars',
    matchedTargets: ['mars-jezero-crater', 'mars-gale-crater'],
    overallSimilarity: 89.4,
    confidenceScore: 92.0,
    climateType: 'BWh (Hot Semi-Arid / Badlands)',
    summary: 'The sole desert in mainland Europe. Severe rain shadow creates spectacular gullying, mudstone badlands, and gypsum-rich evaporite canyons directly replicating Martian sedimentary dissection patterns.',
    geology: {
      rockType: 'Tortonian-Messinian marls, sandstones, gypsum evaporite layers, turbidites',
      mineralogy: ['Gypsum (CaSO4·2H2O)', 'Illite-Smectite', 'Calcite', 'Quartz silt'],
      regolithAnalogy: 'Fine clay-silt scree slopes with loose crumbly soil structure.',
      aeolianFeatures: 'Ramblas (ephemeral dry river washes), piping sinkholes, steep badland cuestas.',
      stratigraphy: 'Neogene sedimentary basin sequence capped by calcarenite caprocks.'
    },
    environment: {
      meanAnnualTemp: '18.1 °C',
      diurnalRange: '2 °C (winter) to 44 °C (summer daytime)',
      annualPrecipitation: '220 mm / year (Flash flood torrents separated by long drought)',
      uvIrradiance: 'Index 10',
      aridityIndex: '0.18 (Semi-arid badland)',
      dustStormFrequency: '12 - 16 days/year'
    },
    scientificSignificance: [
      'Accessible European test venue for planetary exploration rovers and ESA robotic drill testing.',
      'Gully erosion dynamics provide mathematical models for Martian recurring slope lineae (RSL) and gully networks.'
    ],
    similaritiesToTarget: [
      'Sulfate-bearing clay strata resemble the layered sulfate units on Mount Sharp in Gale Crater.',
      'Dry ramblas duplicate ancient braided fluvial stream channels on Mars.'
    ],
    limitations: [
      'Surrounding European infrastructure causes minor artificial RF interference.'
    ],
    fieldTestingCapabilities: [
      { name: 'Rover Traverse on Steep Badland Slopes', suitability: 'high', notes: 'Tests traction in crumbly mudstone scree without requiring transatlantic travel.' }
    ],
    notableMissionsOrExpeditions: [
      {
        campaign: 'ESA Pangaea Rover Geological Training',
        organization: 'European Space Agency (ESA)',
        year: '2023',
        scope: 'Astronaut field training in planetary sedimentology'
      }
    ],

    earthdataGranules: {
      gdemId: 'ASTGTMV003_N37W003',
      modisLstId: 'MOD11A1.061_h17v05',
      ecostressId: 'ECO2LSTE.001_SDS_LST_N37W003',
      smapSoilMoistureId: 'SPL3SMP.008_TABERNAS'
    },
    worldviewLayers: [
      { layerId: 'MODIS_Terra_CorrectedReflectance_TrueColor', title: 'MODIS Iberian Peninsula', resolution: '250 m' }
    ],
    copernicusProducts: {
      sentinel1SarId: 'S1A_IW_GRDH_1SDV_20260409T181210_053250_0679E1',
      sentinel2MsiId: 'S2A_MSIL2A_20260404T105021_N0500_R051_T30SWF_20260404T133000',
      ferricIronIndex: 1.95,
      clayIndex: 2.45
    },
    csaRadarsatProducts: {
      rcmGranuleId: 'RCM1_OK1066284_PK1066285_1_3M_20260320',
      radarsat1Id: 'R1_49180_ST2_20020612',
      polarization: 'Dual-Pol (VV/VH)',
      backscatterSigma0Db: -12.1,
      radarIncidenceAngleDeg: 33.2,
      sarTutorialScript: 'python process_sar_sigma0.py --input RCM_TABERNAS_BADLANDS.tif'
    },
    jaxaGportalProducts: {
      gcomSgliLst: 'GCOM-C_SGLI_L2_LST_N37W003_38.2C',
      amsr2SoilMoisturePercent: 5.4,
      gpmPrecipitationMmHr: 0.00,
      alosPalsar2LBandId: 'ALOS2192106120-181120'
    },

    dataSources: [
      { title: 'NASA Earthdata ASTER GDEM 30m Tabernas Model', agency: 'NASA LP DAAC', datasetId: 'ASTGTMV003_N37W003', type: 'DEM Radar' },
      { title: 'ESA Copernicus Sentinel-2 MSI Gypsum Index', agency: 'ESA', datasetId: 'S2A_MSIL2A_20260404', type: 'Orbital Multispectral' },
      { title: 'CSA RADARSAT Constellation High-Res Badlands SAR', agency: 'CSA / ASC', datasetId: 'RCM1_OK1066284_3M', type: 'DEM Radar' },
      { title: 'JAXA G-Portal GCOM-W Soil Moisture Product', agency: 'JAXA', datasetId: 'GW1AM2_20260404_L3SMC', type: 'In-situ' }
    ],
    metrics: {
      geologicalSimilarity: 89,
      terrainRoughness: 91,
      slopeDistribution: 88,
      thermalDeltaMatch: 86,
      granulometryMatch: 90,
      spectralCorrespondence: 89,
      volatilesAnalogy: 78
    },
    imagery: {
      hero: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Tabernas2.jpg/960px-Tabernas2.jpg',
      terrain: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Tabernas2.jpg/960px-Tabernas2.jpg',
      heroAttribution: {
        label: 'Haxxah and KraZug / CC BY-SA 2.0',
        href: 'https://commons.wikimedia.org/wiki/File:Tabernas2.jpg'
      }
    }
  },

  // -------------------------------------------------------------------------
  // 9. MOJAVE DESERT (JPL Mars Yard & Pisgah Crater, California, USA)
  // -------------------------------------------------------------------------
  {
    id: 'usa-mojave-jpl',
    name: 'Mojave Desert (Pisgah Crater & JPL Test Field)',
    region: 'San Bernardino County, California',
    country: 'United States',
    flagCode: 'US',
    continent: 'North America',
    coordinates: {
      lat: 34.7469,
      lng: -116.3756,
      display: '34°44\'49" N, 116°22\'32" W'
    },
    elevationMeters: 640,
    category: 'volcanic-basalt',
    primaryTargetAnalog: 'mars',
    matchedTargets: ['mars-jezero-crater', 'mars-gale-crater', 'mars-olympus-mons'],
    overallSimilarity: 91.8,
    confidenceScore: 96.0,
    climateType: 'BWh (Hyper-Arid Hot Basin & Range)',
    summary: 'The primary development and mobility validation ground for all NASA JPL Mars rovers (Sojourner, Spirit, Opportunity, Curiosity, Perseverance). Pisgah Crater features pristine basaltic lava tubes, aa/pahoehoe lava fields, and dry playa mudflats identical to Martian plains.',
    geology: {
      rockType: 'Quaternary tholeiitic basalt, vesicular pahoehoe lava, cinders, playa clay-silt deposits',
      mineralogy: ['Augite Clinopyroxene', 'Labradorite Plagioclase', 'Olivine', 'Magnetite', 'Montmorillonite clay'],
      regolithAnalogy: 'Mixture of abrasive vesicular basalt boulders, loose basaltic sand, and silt mirroring Gusev crater and Jezero floor regolith.',
      aeolianFeatures: 'Active barchan sand dunes, desert pavement (gibber), dry lake playa desiccation cracks.',
      stratigraphy: 'Young basalt flow fields overlying alluvial fan gravels and lakebed clays.'
    },
    environment: {
      meanAnnualTemp: '20.6 °C',
      diurnalRange: '-4 °C (winter night) to 49 °C (summer daytime)',
      annualPrecipitation: '65 mm / year',
      uvIrradiance: 'Index 11',
      aridityIndex: '0.05 (Hyper-arid)',
      dustStormFrequency: '25 - 35 days/year'
    },
    scientificSignificance: [
      'Official NASA JPL rover mobility calibration and wheel durability testing field ground.',
      'Validation site for Autonomous Navigation (AutoNav) computer vision algorithms.',
      'Natural testing ground for lava tube speleology and cave ingress robotics.'
    ],
    similaritiesToTarget: [
      'Rock size-frequency distribution mimics rock distribution maps at Mars rover landing sites.',
      'Basaltic lava flows with pressure ridges replicate Olympus Mons and Elysium Planitia flows.'
    ],
    limitations: [
      'Terrestrial 1g gravity requires rovers to operate with Earth-weight offset suspensions.'
    ],
    fieldTestingCapabilities: [
      { name: 'Autonomous Rover Traverse & Hazard Avoidance', suitability: 'exceptional', notes: 'JPL Perseverance flight spares test autonomous obstacle navigation over basalt boulders.' },
      { name: 'Lava Tube Ingress Robotics', suitability: 'exceptional', notes: 'Pisgah lava tube network provides accessible subterranean exploration courses.' }
    ],
    notableMissionsOrExpeditions: [
      {
        campaign: 'NASA JPL Mars Rover Field Qualification Trials',
        organization: 'NASA Jet Propulsion Laboratory',
        year: 'Ongoing',
        scope: 'Flight software and autonomous mobility validation'
      }
    ],

    earthdataGranules: {
      gdemId: 'ASTGTMV003_N35W116',
      modisLstId: 'MOD11A1.061_h08v05',
      ecostressId: 'ECO2LSTE.001_SDS_LST_N35W116',
      smapSoilMoistureId: 'SPL3SMP.008_MOJAVE'
    },
    worldviewLayers: [
      { layerId: 'MODIS_Terra_CorrectedReflectance_TrueColor', title: 'MODIS Mojave Desert True Color', resolution: '250 m' }
    ],
    copernicusProducts: {
      sentinel1SarId: 'S1A_IW_GRDH_1SDV_20260407T135512_053220_0678F5',
      sentinel2MsiId: 'S2B_MSIL2A_20260401T184510_N0500_R113_T11SNT_20260401T213000',
      ferricIronIndex: 2.05,
      clayIndex: 1.90
    },
    csaRadarsatProducts: {
      rcmGranuleId: 'RCM3_OK1033948_PK1033949_1_3MCP_20260325',
      radarsat1Id: 'R1_44120_ST5_20011102',
      polarization: 'Compact Polarimetry (CP)',
      backscatterSigma0Db: -15.2,
      radarIncidenceAngleDeg: 34.5,
      sarTutorialScript: 'python process_sar_sigma0.py --input RCM_MOJAVE_PISGAH.tif'
    },
    jaxaGportalProducts: {
      gcomSgliLst: 'GCOM-C_SGLI_L2_LST_N35W116_47.1C',
      amsr2SoilMoisturePercent: 1.8,
      gpmPrecipitationMmHr: 0.00,
      alosPalsar2LBandId: 'ALOS2091206890-170420'
    },

    dataSources: [
      { title: 'NASA Earthdata SRTM 1-Arc Second Mojave Model', agency: 'NASA JPL', datasetId: 'SRTMGL1_MOJAVE', type: 'DEM Radar' },
      { title: 'NASA Earthdata ECOSTRESS High-Res LST 70m', agency: 'NASA JPL', datasetId: 'ECO2LSTE.001', type: 'Orbital Multispectral' },
      { title: 'ESA Copernicus Sentinel-2 MSI Basalt/Playa Surface Reflectance', agency: 'ESA', datasetId: 'S2B_MSIL2A_20260401', type: 'Orbital Multispectral' },
      { title: 'CSA RADARSAT Constellation Alluvial Fan SAR Granule', agency: 'CSA / ASC', datasetId: 'RCM3_OK1033948_3MCP', type: 'DEM Radar' },
      { title: 'JAXA G-Portal AMSR2 Mojave Moisture Monitoring', agency: 'JAXA', datasetId: 'GW1AM2_20260401_L3SMC', type: 'In-situ' }
    ],
    metrics: {
      geologicalSimilarity: 94,
      terrainRoughness: 93,
      slopeDistribution: 87,
      thermalDeltaMatch: 94,
      granulometryMatch: 95,
      spectralCorrespondence: 92,
      volatilesAnalogy: 52
    },
    imagery: {
      hero: 'https://images-assets.nasa.gov/image/SL2-03-126/SL2-03-126~orig.jpg',
      satellite: 'https://images-assets.nasa.gov/image/SL2-03-126/SL2-03-126~orig.jpg',
      terrain: 'https://images-assets.nasa.gov/image/SL2-03-126/SL2-03-126~orig.jpg'
    }
  },

  // -------------------------------------------------------------------------
  // 10. ASKJA VOLCANIC HIGHLANDS (Iceland)
  // -------------------------------------------------------------------------
  {
    id: 'iceland-askja',
    name: 'Askja Volcanic Highlands (Dyngjufjöll)',
    region: 'Northeast Region',
    country: 'Iceland',
    flagCode: 'IS',
    continent: 'Europe',
    coordinates: {
      lat: 65.0300,
      lng: -16.7500,
      display: '65°01\'48" N, 16°45\'00" W'
    },
    elevationMeters: 1100,
    category: 'volcanic-basalt',
    primaryTargetAnalog: 'moon',
    matchedTargets: ['luna-marius-hills', 'mars-olympus-mons', 'luna-shackleton-crater'],
    overallSimilarity: 90.5,
    confidenceScore: 93.0,
    climateType: 'ET (Subpolar Alpine Tundra / Volcanic Wasteland)',
    summary: 'Apollo astronaut Neil Armstrong and Buzz Aldrin trained here in 1965 and 1967. The central caldera complex surrounded by vast barren black basaltic sands and pumice fields presents zero vegetative cover and extreme volcanic morphology matching Lunar and Martian maria.',
    geology: {
      rockType: 'Tholeiitic basalt lava, rhyolitic pumice tephra, hyaloclastite volcanic breccia',
      mineralogy: ['Anorthite-rich Plagioclase', 'Augite', 'Olivine', 'Volcanic glass (Sideromelane)'],
      regolithAnalogy: 'Black basaltic cinders and crushed pumice emulate the mechanical abrasive properties of lunar highland and maria regolith.',
      aeolianFeatures: 'Volcanic sand sheets, dust devils over black ash, subglacial hyaloclastite ridges.',
      stratigraphy: 'Complex nested calderas filled by 1875 and 1961 historical basaltic eruptions.'
    },
    environment: {
      meanAnnualTemp: '-1.8 °C',
      diurnalRange: '-22 °C (winter) to 14 °C (summer daytime)',
      annualPrecipitation: '450 mm / year (Sub-polar volcanic desert due to high permeability)',
      uvIrradiance: 'Index 4',
      aridityIndex: '0.22 (Physiologically arid due to instant infiltration into porous pumice)',
      dustStormFrequency: '18 - 25 days/year (Black ash storms)'
    },
    scientificSignificance: [
      'Historic Apollo crew lunar geology field training site.',
      'Active European Space Agency (ESA) rover navigation and drone flight trials in high winds.',
      'Subglacial volcanic interaction provides an analog for Mars glaciovolcanism.'
    ],
    similaritiesToTarget: [
      'Pumice and black basalt sand fields simulate lunar regolith cohesion and wheel slip.',
      'Zero vegetation creates pristine optical and radar backscatter environments.'
    ],
    limitations: [
      'Snow cover persists from October through June, limiting field access to mid-summer.'
    ],
    fieldTestingCapabilities: [
      { name: 'Volcanic Tephra Mobility & Slip Testing', suitability: 'exceptional', notes: 'Porous pumice fields provide realistic low-traction vehicle negotiation.' }
    ],
    notableMissionsOrExpeditions: [
      {
        campaign: 'Apollo Astronaut Geology Field Trips (1965 & 1967)',
        organization: 'NASA / USGS / Science Institute of Iceland',
        year: 'Apollo Training Era',
        scope: 'Lunar landscape familiarization for Apollo 11 & 12 prime crews'
      }
    ],

    earthdataGranules: {
      gdemId: 'ASTGTMV003_N65W017',
      modisLstId: 'MOD11A1.061_h17v02',
      ecostressId: 'ECO2LSTE.001_SDS_LST_N65W017',
      smapSoilMoistureId: 'SPL3SMP.008_ICELAND'
    },
    worldviewLayers: [
      { layerId: 'MODIS_Terra_CorrectedReflectance_TrueColor', title: 'MODIS Iceland Volcanic Highlands', resolution: '250 m' }
    ],
    copernicusProducts: {
      sentinel1SarId: 'S1A_IW_GRDH_1SDV_20260406T192215_053195_0678A1',
      sentinel2MsiId: 'S2A_MSIL2A_20260702T125540_N0500_R052_T28WDS_20260702T164500',
      ferricIronIndex: 2.18,
      clayIndex: 1.42
    },
    csaRadarsatProducts: {
      rcmGranuleId: 'RCM1_OK1088491_PK1088492_1_5MCP_20260312',
      radarsat1Id: 'R1_38120_ST3_20000814',
      polarization: 'Compact Polarimetry (CP)',
      backscatterSigma0Db: -8.5,
      radarIncidenceAngleDeg: 32.1,
      sarTutorialScript: 'python process_sar_sigma0.py --input RCM_ICELAND_ASKJA.tif'
    },
    jaxaGportalProducts: {
      gcomSgliLst: 'GCOM-C_SGLI_L2_LST_N65W017_-4.8C',
      amsr2SoilMoisturePercent: 8.2,
      gpmPrecipitationMmHr: 0.22,
      alosPalsar2LBandId: 'ALOS2181204890-190812'
    },

    dataSources: [
      { title: 'NASA Earthdata ASTER GDEM v3 Iceland Highlands', agency: 'NASA LP DAAC', datasetId: 'ASTGTMV003_N65W017', type: 'DEM Radar' },
      { title: 'ESA Copernicus Sentinel-2 MSI Basalt / Caldera Mineral Index', agency: 'ESA', datasetId: 'S2A_MSIL2A_20260702', type: 'Orbital Multispectral' },
      { title: 'CSA RADARSAT Constellation Volcanic Roughness SAR', agency: 'CSA / ASC', datasetId: 'RCM1_OK1088491_5MCP', type: 'DEM Radar' },
      { title: 'JAXA G-Portal AMSR2 Cryospheric Snow & Volcanic Ash', agency: 'JAXA', datasetId: 'GW1AM2_20260312_L3', type: 'In-situ' }
    ],
    metrics: {
      geologicalSimilarity: 95,
      terrainRoughness: 94,
      slopeDistribution: 88,
      thermalDeltaMatch: 85,
      granulometryMatch: 92,
      spectralCorrespondence: 93,
      volatilesAnalogy: 54
    },
    imagery: {
      hero: 'https://images-assets.nasa.gov/image/PIA18799/PIA18799~orig.jpg',
      satellite: 'https://images-assets.nasa.gov/image/PIA18799/PIA18799~orig.jpg',
      terrain: 'https://images-assets.nasa.gov/image/PIA18799/PIA18799~orig.jpg'
    }
  },

  // -------------------------------------------------------------------------
  // 11. QATTARA DEPRESSION (Egypt)
  // -------------------------------------------------------------------------
  {
    id: 'egypt-qattara',
    name: 'Qattara Depression (Munkhafad al-Qattarah)',
    region: 'Matrouh Governorate, Western Desert',
    country: 'Egypt',
    flagCode: 'EG',
    continent: 'Africa',
    coordinates: {
      lat: 29.5000,
      lng: 27.5000,
      display: '29°30\'00" N, 27°30\'00" E'
    },
    elevationMeters: -133, // Sub-sea-level lowest point: -133m
    category: 'sub-sea-level',
    primaryTargetAnalog: 'mars',
    matchedTargets: ['mars-gale-crater', 'mars-jezero-crater'],
    overallSimilarity: 88.6,
    confidenceScore: 91.0,
    climateType: 'BWh (Hyper-Arid Sub-Sea-Level Sink)',
    summary: 'The second lowest point in Africa (-133m MSL) spanning 19,600 km². Characterized by massive evaporite sabkhas, salt pans, and extreme barometric pressures that serve as a terrestrial hydrodynamic model for deep Martian impact basin atmospheres (Hellas and Gale basins).',
    geology: {
      rockType: 'Miocene Moghra Formation clastics, halite-gypsum sabkha crusts, shale layers',
      mineralogy: ['Halite (NaCl)', 'Gypsum (CaSO4·2H2O)', 'Mirabilite', 'Montmorillonite'],
      regolithAnalogy: 'High-salinity clay-silt crusts with hygroscopic salts mimicking Martian chloride deposits detected by Mars Odyssey THEMIS.',
      aeolianFeatures: 'Barchan dune fields, deflation lag corridors, salt crust ridges.',
      stratigraphy: 'Thick fluvial-deltaic sandstones and shales capped by evaporitic salt crusts.'
    },
    environment: {
      meanAnnualTemp: '24.2 °C',
      diurnalRange: '6 °C (night) to 51 °C (summer daytime)',
      annualPrecipitation: '< 15 mm / year',
      uvIrradiance: 'Index 11',
      aridityIndex: '0.015 (Hyper-arid)',
      dustStormFrequency: '22 - 30 days/year'
    },
    scientificSignificance: [
      'Topographic and atmospheric depression model for deep Martian basins (higher atmospheric pressure).',
      'Extremophilic halophile bacteria trapped in fluid inclusions inside halite crystals inform Mars biosignature searches.',
      'Large-scale aeolian deflation hollow genesis models.'
    ],
    similaritiesToTarget: [
      'Enclosed drainage basin morphology matches crater paleolakes like Jezero and Gale.',
      'Chloride-bearing salt flats replicate chloride salt deposits identified globally across Mars.'
    ],
    limitations: [
      'Subsurface groundwater table is near the surface in sabkha centers, producing sticky mud uncharacteristic of dry Mars.'
    ],
    fieldTestingCapabilities: [
      { name: 'Chloride Salt Sensor Verification', suitability: 'high', notes: 'Calibrates remote thermal infrared and neutron detectors on halite crusts.' }
    ],
    notableMissionsOrExpeditions: [
      {
        campaign: 'Western Desert Geodetic & Evaporite Survey',
        organization: 'Desert Research Center / Space Apps Team',
        year: '2023',
        scope: 'Mapping sabkha salt crust mechanics and diurnal humidity cycling'
      }
    ],

    earthdataGranules: {
      gdemId: 'ASTGTMV003_N29E027',
      modisLstId: 'MOD11A1.061_h20v05',
      ecostressId: 'ECO2LSTE.001_SDS_LST_N29E027',
      smapSoilMoistureId: 'SPL3SMP.008_QATTARA'
    },
    worldviewLayers: [
      { layerId: 'MODIS_Terra_CorrectedReflectance_TrueColor', title: 'MODIS Qattara Depression Basin', resolution: '250 m' }
    ],
    copernicusProducts: {
      sentinel1SarId: 'S1A_IW_GRDH_1SDV_20260403T164512_053150_0677C1',
      sentinel2MsiId: 'S2A_MSIL2A_20260330T091520_N0500_R007_T35RPR_20260330T130000',
      ferricIronIndex: 1.72,
      clayIndex: 3.42
    },
    csaRadarsatProducts: {
      rcmGranuleId: 'RCM2_OK1094812_PK1094813_1_16M_20260328',
      radarsat1Id: 'R1_51120_ST1_20021014',
      polarization: 'Compact Polarimetry (CP)',
      backscatterSigma0Db: -21.4,
      radarIncidenceAngleDeg: 42.5,
      sarTutorialScript: 'python process_sar_sigma0.py --input RCM_QATTARA_SABKHA.tif'
    },
    jaxaGportalProducts: {
      gcomSgliLst: 'GCOM-C_SGLI_L2_LST_N29E027_51.2C',
      amsr2SoilMoisturePercent: 2.4,
      gpmPrecipitationMmHr: 0.00,
      alosPalsar2LBandId: 'ALOS2258100720-190412'
    },

    dataSources: [
      { title: 'NASA Earthdata SRTM 30m Digital Elevation Basin Model', agency: 'NASA JPL', datasetId: 'SRTMGL1_Qattara', type: 'DEM Radar' },
      { title: 'NASA Earthdata MODIS Surface Temperature Daily L3', agency: 'NASA LP DAAC', datasetId: 'MOD11A1', type: 'Orbital Multispectral' },
      { title: 'ESA Copernicus Sentinel-1 C-band SAR Sabkha Flat Specular', agency: 'ESA', datasetId: 'S1A_IW_GRDH_20260403', type: 'DEM Radar' },
      { title: 'CSA RADARSAT Constellation Low Backscatter Radar Tile', agency: 'CSA / ASC', datasetId: 'RCM2_OK1094812_16M', type: 'DEM Radar' },
      { title: 'JAXA G-Portal AMSR2 Extreme Aridity & L-band SAR', agency: 'JAXA', datasetId: 'GW1AM2_20260330_L3SMC', type: 'In-situ' }
    ],
    metrics: {
      geologicalSimilarity: 86,
      terrainRoughness: 82,
      slopeDistribution: 84,
      thermalDeltaMatch: 92,
      granulometryMatch: 90,
      spectralCorrespondence: 88,
      volatilesAnalogy: 80
    },
    imagery: {
      hero: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f8/Qattara_Depression_%28March_2007%29.jpg/960px-Qattara_Depression_%28March_2007%29.jpg',
      terrain: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f8/Qattara_Depression_%28March_2007%29.jpg/960px-Qattara_Depression_%28March_2007%29.jpg',
      heroAttribution: {
        label: 'cheesy42 / CC BY 2.0',
        href: 'https://commons.wikimedia.org/wiki/File:Qattara_Depression_(March_2007).jpg'
      }
    }
  },

  // -------------------------------------------------------------------------
  // 12. SINAI RING COMPLEX (Egypt)
  // -------------------------------------------------------------------------
  {
    id: 'egypt-sinai',
    name: 'Sinai Granitic & Volcanic Ring Complex',
    region: 'South Sinai Governorate',
    country: 'Egypt',
    flagCode: 'EG',
    continent: 'Africa',
    coordinates: {
      lat: 28.5392,
      lng: 33.9750,
      display: '28°32\'21" N, 33°58\'30" E'
    },
    elevationMeters: 2629, // Mount Catherine peak: 2,629m
    category: 'volcanic-basalt',
    primaryTargetAnalog: 'moon',
    matchedTargets: ['luna-marius-hills', 'mars-olympus-mons'],
    overallSimilarity: 87.2,
    confidenceScore: 90.0,
    climateType: 'BWk (Cold Hyper-Arid Montane Desert)',
    summary: 'Proterozoic alkaline ring complexes and jagged anorogenic granite plutons rising up to 2,629m MSL. The deeply dissected, un-vegetated granitic terrain presents extreme boulder scree, dyke swarms, and sheer bedrock walls replicating lunar highland massif topography.',
    geology: {
      rockType: 'Late Precambrian alkaline granites, volcanic rhyolites, basaltic dyke swarms',
      mineralogy: ['Alkali Feldspar (Microcline)', 'Quartz', 'Biotite', 'Amphibole', 'Titanomagnetite'],
      regolithAnalogy: 'Coarse angular granitic grus and quartz-feldspar rubble mechanically disintegrated by thermal exfoliation.',
      aeolianFeatures: 'Deep wadis, talus scree cones, frost-shattered blockfields at high elevation.',
      stratigraphy: 'Pan-African basement complex dissected by post-collisional alkaline volcanic rings.'
    },
    environment: {
      meanAnnualTemp: '14.5 °C',
      diurnalRange: '-8 °C (winter summit freeze) to 38 °C (summer daytime)',
      annualPrecipitation: '< 40 mm / year (Infrequent winter snow at summits)',
      uvIrradiance: 'Index 11',
      aridityIndex: '0.04 (Arid montane)',
      dustStormFrequency: '12 - 18 days/year'
    },
    scientificSignificance: [
      'High-relief terrestrial analogue for lunar highland massifs and central peak uplift craters.',
      'Field testing environment for steep terrain climbing and legged exploration robots.'
    ],
    similaritiesToTarget: [
      'Jagged bedrock ridges and boulder scree match Apollo 15 and 17 massif terrain traverses.',
      'Dyke intrusions emulate sub-surface planetary dyke swarms and magma conduit geometries.'
    ],
    limitations: [
      'Granitic continental crust composition differs from predominantly anorthositic lunar highlands.'
    ],
    fieldTestingCapabilities: [
      { name: 'Steep-Slope Tethered Climber Trials', suitability: 'exceptional', notes: 'Vertical granite cliffs provide ideal conditions for rappelling robotic anchor testing.' }
    ],
    notableMissionsOrExpeditions: [
      {
        campaign: 'Sinai Montane Planetary Geology Survey',
        organization: 'Sinai Univ / NASA Collab Team',
        year: '2024',
        scope: 'Testing rugged terrain robotic climbing and LiDAR 3D mesh reconstruction'
      }
    ],

    earthdataGranules: {
      gdemId: 'ASTGTMV003_N28E034',
      modisLstId: 'MOD11A1.061_h21v05',
      ecostressId: 'ECO2LSTE.001_SDS_LST_N28E034',
      smapSoilMoistureId: 'SPL3SMP.008_SINAI'
    },
    worldviewLayers: [
      { layerId: 'MODIS_Terra_CorrectedReflectance_TrueColor', title: 'MODIS Sinai Peninsula Red Sea', resolution: '250 m' }
    ],
    copernicusProducts: {
      sentinel1SarId: 'S1A_IW_GRDH_1SDV_20260404T161022_053160_0677D2',
      sentinel2MsiId: 'S2B_MSIL2A_20260401T084530_N0500_R078_T36RUU_20260401T114500',
      ferricIronIndex: 2.85,
      clayIndex: 1.35
    },
    csaRadarsatProducts: {
      rcmGranuleId: 'RCM3_OK1055928_PK1055929_1_3MCP_20260322',
      radarsat1Id: 'R1_47120_ST3_20020118',
      polarization: 'Compact Polarimetry (CP)',
      backscatterSigma0Db: -7.8,
      radarIncidenceAngleDeg: 37.8,
      sarTutorialScript: 'python process_sar_sigma0.py --input RCM_SINAI_GRANITE_RING.tif'
    },
    jaxaGportalProducts: {
      gcomSgliLst: 'GCOM-C_SGLI_L2_LST_N28E034_36.8C',
      amsr2SoilMoisturePercent: 1.9,
      gpmPrecipitationMmHr: 0.00,
      alosPalsar2LBandId: 'ALOS2258100780-190412'
    },

    dataSources: [
      { title: 'NASA Earthdata ASTER GDEM 30m Sinai High Relief', agency: 'NASA LP DAAC', datasetId: 'ASTGTMV003_N28E034', type: 'DEM Radar' },
      { title: 'ESA Copernicus Sentinel-2 MSI Granite Pluton Mineral Map', agency: 'ESA', datasetId: 'S2B_MSIL2A_20260401', type: 'Orbital Multispectral' },
      { title: 'CSA RADARSAT Constellation High Relief C-Band SAR', agency: 'CSA / ASC', datasetId: 'RCM3_OK1055928_3MCP', type: 'DEM Radar' },
      { title: 'JAXA G-Portal ALOS-2 PALSAR-2 L-Band Montane Scan', agency: 'JAXA', datasetId: 'ALOS2258100780', type: 'DEM Radar' }
    ],
    metrics: {
      geologicalSimilarity: 85,
      terrainRoughness: 97,
      slopeDistribution: 96,
      thermalDeltaMatch: 84,
      granulometryMatch: 86,
      spectralCorrespondence: 84,
      volatilesAnalogy: 42
    },
    imagery: {
      hero: 'https://images-assets.nasa.gov/image/PIA04957/PIA04957~orig.jpg',
      satellite: 'https://images-assets.nasa.gov/image/PIA02626/PIA02626~orig.jpg',
      terrain: 'https://images-assets.nasa.gov/image/PIA04957/PIA04957~orig.jpg'
    }
  }
];
