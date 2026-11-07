export interface PdsDatasetSpec {
  id: string;
  agency: 'NASA' | 'USGS' | 'ESA';
  name: string;
  instrument: string;
  spacecraft: string;
  targetBody: 'Earth' | 'Moon' | 'Mars';
  description: string;
  spectralBands: string;
  spatialResolution: string;
  endpointUrl: string;
  status: 'ONLINE_VERIFIED' | 'PDS_REST_READY' | 'SYNTHETIC_BENCHMARK';
  citation: string;
  sampleRecord: Record<string, any>;
}

export const NASA_PDS_DATASETS: PdsDatasetSpec[] = [
  {
    id: 'MRO_CRISM_MTR3',
    agency: 'NASA',
    name: 'MRO Compact Reconnaissance Imaging Spectrometer for Mars (CRISM)',
    instrument: 'CRISM VNIR/IR Hyperspectral Radiometer',
    spacecraft: 'Mars Reconnaissance Orbiter (MRO)',
    targetBody: 'Mars',
    description: 'High-resolution hyperspectral imagery measuring reflected sunlight in 544 color channels from 0.36 to 3.92 micrometers, revealing sulfate, carbonate, and clay minerals in Jezero and Gale craters.',
    spectralBands: '362 nm – 3920 nm (544 bands)',
    spatialResolution: '18 meters/pixel (targeted mode)',
    endpointUrl: 'https://pds-geosciences.wustl.edu/mro/mro-m-crism-3-rdr-targeted-v1/mrocr_2001/',
    status: 'ONLINE_VERIFIED',
    citation: 'Murchie, S. et al. (2007). Compact Reconnaissance Imaging Spectrometer for Mars (CRISM) on Mars Reconnaissance Orbiter. J. Geophys. Res., 112, E05S03.',
    sampleRecord: {
      DATA_SET_ID: 'MRO-M-CRISM-3-RDR-TARGETED-V1.0',
      TARGET_NAME: 'MARS',
      OBSERVATION_ID: 'FRT0000B615_07_IF166L_TRR3',
      CENTER_LATITUDE: 18.382,
      CENTER_LONGITUDE: 77.581,
      SOLAR_DISTANCE_AU: 1.524,
      MINERAL_DETECTION: ['Fe/Mg Smectite', 'Magnesium Carbonate', 'Olivine', 'Hydrated Silica'],
    },
  },
  {
    id: 'LRO_LOLA_GDR',
    agency: 'NASA',
    name: 'LRO Lunar Orbiter Laser Altimeter (LOLA) Global DEM',
    instrument: 'LOLA Laser Pulse Altimeter',
    spacecraft: 'Lunar Reconnaissance Orbiter (LRO)',
    targetBody: 'Moon',
    description: 'Topographic elevation model and surface roughness generated from billions of precision laser altimeter pulses, detailing slope gradients and cold-trap topography in the Lunar South Pole.',
    spectralBands: '1064 nm Laser Pulse',
    spatialResolution: '5 meters/pixel (Polar Regions)',
    endpointUrl: 'https://pds-geosciences.wustl.edu/lro/lro-l-lola-3-rdr-v1/lrolol_1xxx/',
    status: 'ONLINE_VERIFIED',
    citation: 'Smith, D. E. et al. (2010). Initial observations from the Lunar Orbiter Laser Altimeter (LOLA). Geophys. Res. Lett., 37, L18204.',
    sampleRecord: {
      DATA_SET_ID: 'LRO-L-LOLA-4-GDR-V1.0',
      TARGET_NAME: 'MOON',
      PRODUCT_ID: 'LOLA_SHACKLETON_POLAR_GRID_5M',
      LATITUDE_BOUNDS: [-90.0, -85.0],
      ELEVATION_MIN_M: -4380,
      ELEVATION_MAX_M: 4120,
      PERMANENT_SHADOW_FRACTION: 0.94,
    },
  },
  {
    id: 'NASA_EARTHDATA_ASTER_GDEM',
    agency: 'NASA',
    name: 'NASA Earthdata ASTER Global Digital Elevation Model (GDEM v3)',
    instrument: 'Advanced Spaceborne Thermal Emission and Reflection Radiometer',
    spacecraft: 'Terra Satellite',
    targetBody: 'Earth',
    description: 'High-accuracy near-global stereo digital elevation model used as the terrestrial geodetic benchmark for White Desert yardang profiles and Sinai Peninsula rift topography.',
    spectralBands: 'VNIR Bands 3N and 3B (Stereo Nadir/Backward)',
    spatialResolution: '30 meters (1 arc-second)',
    endpointUrl: 'https://cmr.earthdata.nasa.gov/search/granules.json?short_name=ASTGTM_NC',
    status: 'ONLINE_VERIFIED',
    citation: 'NASA/METI/AIST/Japan Spacesystems (2019). ASTER Global Digital Elevation Model V003. DOI: 10.5067/ASTER/ASTGTM.003.',
    sampleRecord: {
      DATA_SET_ID: 'ASTGTM.v003',
      COLLECTION: 'NASA EOSDIS Land Processes DAAC',
      BOUNDING_BOX: [27.0, 27.5, 28.5, 29.5],
      VERTICAL_ACCURACY_M: 10.8,
      HORIZONTAL_DATUM: 'WGS84',
    },
  },
  {
    id: 'USGS_ASTRO_UNIFIED_GEOL',
    agency: 'USGS',
    name: 'USGS Astrogeology Unified Global Geologic Map of Mars',
    instrument: 'Orbital Multi-Mission Synthesis (MGS, Odyssey, MRO, Mex)',
    spacecraft: 'Synthesis Compilation',
    targetBody: 'Mars',
    description: 'Definitive digital geological map of the entire Martian crust compiled from thermal inertia, albedo, crater count stratigraphy, and orbital spectroscopy.',
    spectralBands: 'Multi-Sensor Stratigraphic Synthesis',
    spatialResolution: '1:5,000,000 scale digital vector',
    endpointUrl: 'https://astrogeology.usgs.gov/search/map/Mars/Geology/Unified_Geologic_Map_of_Mars',
    status: 'ONLINE_VERIFIED',
    citation: 'Tanaka, K. L. et al. (2014). Geologic map of Mars: U.S. Geological Survey Scientific Investigations Map 3292.',
    sampleRecord: {
      MAP_ID: 'USGS_SIM_3292',
      CHRONOSTRATIGRAPHY: ['Noachian Basal Units', 'Hesperian Volcanics', 'Amazonian Aeolian Mantle'],
      GLOBAL_COVERAGE: '100%',
    },
  },
];

