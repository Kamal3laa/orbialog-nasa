// Space Agency Data & Resources Catalog
// NASA Space Apps Challenge 2026
// Official NASA, CSA, ESA, and JAXA Data & API Integrations

export type SpaceAgencyId = 'NASA' | 'CSA' | 'ESA' | 'JAXA';

export interface SpaceAgencyResource {
  id: string;
  agency: SpaceAgencyId;
  agencyName: string;
  agencyFlag: string;
  title: string;
  category: 'Earth' | 'Moon and Mars' | 'SAR Radar' | 'Open Science & Workflows';
  description: string;
  officialUrl: string;
  apiDocsUrl?: string;
  apiEndpoint?: string;
  sampleCurl?: string;
  samplePython?: string;
  keyInstruments?: string[];
  openLicense: boolean;
  highlightNotes?: string;
}

export const NASA_OFFICIAL_DISCLAIMER = 
  "NASA does not endorse any non-U.S. Government entity and is not responsible for information contained on non-U.S. Government websites. For non-U.S. Government websites, participants must comply with any data use parameters of that specific website.";

export const SPACE_AGENCY_RESOURCES: SpaceAgencyResource[] = [
  // ----------------------------------------------------
  // NASA - Earth
  // ----------------------------------------------------
  {
    id: 'nasa-earthdata-search',
    agency: 'NASA',
    agencyName: 'National Aeronautics and Space Administration',
    agencyFlag: '🇺🇸',
    title: 'NASA Earthdata Search',
    category: 'Earth',
    description: "NASA's primary portal for discovering and accessing Earth science observations, hosting petabytes of remote sensing data from EOSDIS, ASTER, MODIS, Landsat, and airborne missions.",
    officialUrl: 'https://search.earthdata.nasa.gov/',
    apiDocsUrl: 'https://cmr.earthdata.nasa.gov/search/site/docs/search/api.html',
    apiEndpoint: 'https://cmr.earthdata.nasa.gov/search/granules.json',
    keyInstruments: ['ASTER GDEM', 'MODIS Terra/Aqua', 'MISR', 'VIIRS', 'ECOSTRESS'],
    openLicense: true,
    highlightNotes: 'Search across billions of granules using spatial bounding boxes, temporal windows, and instrument tags.',
    sampleCurl: 'curl "https://cmr.earthdata.nasa.gov/search/granules.json?short_name=ASTGTM&bounding_box=-70,-25,-68,-23&page_size=5"',
    samplePython: `import requests

# Query NASA Earthdata CMR API for Digital Elevation Granules
url = "https://cmr.earthdata.nasa.gov/search/granules.json"
params = {
    "short_name": "ASTGTM", # ASTER Global DEM
    "bounding_box": "-70.0,-25.0,-68.0,-23.0", # Atacama bounding box
    "page_size": 5
}
response = requests.get(url, params=params)
data = response.json()
print(f"Found {len(data['feed']['entry'])} elevation granules")`,
  },
  {
    id: 'nasa-worldview',
    agency: 'NASA',
    agencyName: 'National Aeronautics and Space Administration',
    agencyFlag: '🇺🇸',
    title: 'NASA Worldview',
    category: 'Earth',
    description: 'An interactive environment for visually exploring NASA satellite imagery and environmental observations in near real-time, powered by the Global Imagery Browse Services (GIBS).',
    officialUrl: 'https://worldview.earthdata.nasa.gov/index.html',
    apiDocsUrl: 'https://gibs.earthdata.nasa.gov/docs/wmts-api/',
    apiEndpoint: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi',
    keyInstruments: ['MODIS True Color', 'VIIRS Corrected Reflectance', 'AIRS Surface Temp', 'SMAP Soil Moisture'],
    openLicense: true,
    highlightNotes: 'Over 1,000 global daily imagery layers updated within 3 hours of orbital observation.',
    sampleCurl: 'curl "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?service=WMTS&request=GetCapabilities"',
    samplePython: `# Access NASA GIBS WMTS tiles directly in Python or GIS
wmts_url = "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2026-05-15/250m/{z}/{y}/{x}.jpg"
print(f"WMTS Tile Stream URL: {wmts_url}")`,
  },

  // ----------------------------------------------------
  // NASA - Moon and Mars
  // ----------------------------------------------------
  {
    id: 'nasa-pds',
    agency: 'NASA',
    agencyName: 'National Aeronautics and Space Administration',
    agencyFlag: '🇺🇸',
    title: 'NASA Planetary Data System (PDS)',
    category: 'Moon and Mars',
    description: "NASA's long-term archive for planetary science data from NASA orbital, lander, and rover missions. It provides access to lunar and Martian mission observations spanning imagery, geoscience, atmospheres, plasma environments, cartography, and other measurements.",
    officialUrl: 'https://pds.nasa.gov/',
    apiDocsUrl: 'https://pds.nasa.gov/api/search/1/docs/',
    apiEndpoint: 'https://pds.nasa.gov/api/search/1/products',
    keyInstruments: ['MRO HiRISE', 'MRO CRISM', 'Mars 2020 Mastcam-Z', 'PIXL', 'SHARAD', 'MGS MOLA'],
    openLicense: true,
    highlightNotes: 'Primary repository for calibrated planetary surface, spectral, and subsurface radar sounding archives.',
    sampleCurl: 'curl "https://pds.nasa.gov/api/search/1/products?q=target_name:Mars%20AND%20instrument_name:CRISM&limit=5"',
    samplePython: `import requests

# Query NASA Planetary Data System for Mars Jezero Crater spectroscopy
url = "https://pds.nasa.gov/api/search/1/products"
headers = {"Accept": "application/json"}
params = {
    "q": 'target_name:Mars AND investigation_name:"Mars 2020"',
    "limit": 5
}
resp = requests.get(url, params=params, headers=headers)
print(f"PDS Products Returned: {resp.status_code}")`,
  },
  {
    id: 'nasa-lro-mission',
    agency: 'NASA',
    agencyName: 'National Aeronautics and Space Administration',
    agencyFlag: '🇺🇸',
    title: 'NASA Lunar Reconnaissance Orbiter (LRO)',
    category: 'Moon and Mars',
    description: 'LRO provides extensive observations of the lunar surface through instruments including LROC (Narrow/Wide Angle Cameras), LOLA (Laser Altimeter), Diviner (Lunar Radiometer), LEND, Mini-RF, and LAMP.',
    officialUrl: 'https://pds-geosciences.wustl.edu/missions/lro/',
    apiDocsUrl: 'https://pds-geosciences.wustl.edu/missions/lro/lola.htm',
    apiEndpoint: 'https://pds-geosciences.wustl.edu/lro/lro-l-lola-3-rdr-v1/lrolol_1xxx/',
    keyInstruments: ['LOLA DTM 118m/px', 'LROC NAC 0.5m/px', 'Mini-RF Radar', 'LEND Neutron Detector'],
    openLicense: true,
    highlightNotes: 'Sub-meter scale lunar topography and high-resolution crater morphology data crucial for lunar analog matching.',
    sampleCurl: 'curl -I "https://pds-geosciences.wustl.edu/missions/lro/"',
    samplePython: `# Download LOLA polar topography grids for Shackleton Crater
lola_base = "https://pds-geosciences.wustl.edu/lro/lro-l-lola-3-rdr-v1/"
print("Accessing Lunar Orbiter Laser Altimeter PDS node...")`,
  },
  {
    id: 'nasa-lro-diviner',
    agency: 'NASA',
    agencyName: 'National Aeronautics and Space Administration',
    agencyFlag: '🇺🇸',
    title: 'NASA LRO Diviner Lunar Data',
    category: 'Moon and Mars',
    description: 'Diviner maps lunar surface temperatures and provides especially useful products for studying the lunar poles. Its polar and resource products could be compared with extreme cold, ice-bearing, or other terrestrial environments.',
    officialUrl: 'https://pds-geosciences.wustl.edu/missions/lro/diviner.htm',
    apiDocsUrl: 'https://diviner.ucla.edu/',
    apiEndpoint: 'https://pds-geosciences.wustl.edu/lro/lro-l-dlre-4-rdr-v1/',
    keyInstruments: ['Diviner 9-channel Infrared Radiometer', 'Bolometric Temperature Channels', 'Rock Abundance Products'],
    openLicense: true,
    highlightNotes: 'Revealed extreme lunar polar cold traps down to 35 Kelvin (-238°C), essential for comparing with McMurdo Dry Valleys & Arctic analogs.',
    sampleCurl: 'curl -I "https://pds-geosciences.wustl.edu/missions/lro/diviner.htm"',
    samplePython: `# Reference Diviner thermal inertia and surface kinetic temperature
diviner_products = ["GDR_TEMP_CYCLES", "ROCK_ABUNDANCE", "POLAR_COLD_TRAP_VOLATILES"]
print(f"Available Diviner Scientific Datasets: {diviner_products}")`,
  },

  // ----------------------------------------------------
  // CSA (Canadian Space Agency)
  // ----------------------------------------------------
  {
    id: 'csa-rcm-data',
    agency: 'CSA',
    agencyName: 'Canadian Space Agency / Agence spatiale canadienne',
    agencyFlag: '🇨🇦',
    title: 'RADARSAT Constellation Mission (RCM) - Data',
    category: 'SAR Radar',
    description: "Canada's new generation of Earth observation satellites. RCM includes a trio of Earth observation satellites capable of scanning Earth day or night and in any weather conditions. Effective solutions for Maritime surveillance, Disaster management, and Ecosystem monitoring.",
    officialUrl: 'https://donnees-data.asc-csa.gc.ca/en/dataset/rcm',
    apiDocsUrl: 'https://www.asc-csa.gc.ca/eng/satellites/radarsat/radarsat-data.asp',
    keyInstruments: ['C-band SAR (Synthetic Aperture Radar)', 'Compact Polarimetry', 'AIS Ship Detection'],
    openLicense: true,
    highlightNotes: 'High-revisit C-band Synthetic Aperture Radar indispensable for monitoring permafrost stability, ice shelf dynamics, and polar terrestrial analog grounds.',
    sampleCurl: 'curl "https://donnees-data.asc-csa.gc.ca/api/v1/datasets/rcm"',
    samplePython: `# Access Canadian Space Agency open open-data catalog for RCM
csa_catalog = "https://donnees-data.asc-csa.gc.ca/en/dataset/rcm"
print(f"Querying CSA RCM C-Band SAR Repository: {csa_catalog}")`,
  },
  {
    id: 'csa-radarsat1-data',
    agency: 'CSA',
    agencyName: 'Canadian Space Agency / Agence spatiale canadienne',
    agencyFlag: '🇨🇦',
    title: 'RADARSAT-1 - Open Data Archive',
    category: 'SAR Radar',
    description: 'Launched in November 1995, RADARSAT-1 provided Canada and the world with an operational radar satellite system capable of timely delivery of large amounts of data. Equipped with a powerful synthetic aperture radar (SAR) instrument, it acquired images day or night through cloud cover, smoke, and haze. All data products in the archive have been released under an open license.',
    officialUrl: 'https://donnees-data.asc-csa.gc.ca/en/dataset/radarsat1',
    apiDocsUrl: 'https://donnees-data.asc-csa.gc.ca/en/dataset/radarsat1',
    keyInstruments: ['C-band Synthetic Aperture Radar (SAR)', 'Fine, Standard, and ScanSAR Beams'],
    openLicense: true,
    highlightNotes: 'Full historical baseline (1995–2013) spanning over 18 years of Earth radar backscatter observations under an open license.',
    sampleCurl: 'curl -I "https://donnees-data.asc-csa.gc.ca/en/dataset/radarsat1"',
    samplePython: `# Query CSA RADARSAT-1 historical SAR radar products
print("RADARSAT-1 Open Data Archive: Unrestricted global radar backscatter")`,
  },
  {
    id: 'csa-sar-tutorial',
    agency: 'CSA',
    agencyName: 'Canadian Space Agency / Agence spatiale canadienne',
    agencyFlag: '🇨🇦',
    title: 'Synthetic Aperture Radar (SAR) Python Tutorial',
    category: 'Open Science & Workflows',
    description: 'Official CSA tutorial demonstrating how to work with SAR imagery using Python and QGIS. It includes easy and practical steps for accessing, processing, calibrated speckle filtering, and visualizing Synthetic Aperture Radar data for Earth terrain analysis.',
    officialUrl: 'https://github.com/asc-csa/Synthetic_Aperture_Radar_Tutorial',
    apiDocsUrl: 'https://github.com/asc-csa/Synthetic_Aperture_Radar_Tutorial#readme',
    keyInstruments: ['Python GeoPandas', 'Rasterio', 'GDAL', 'QGIS Radar Toolboxes'],
    openLicense: true,
    highlightNotes: 'Hands-on Jupyter notebooks and scripts for analyzing planetary radar analogs, surface roughness, and dielectric soil properties.',
    sampleCurl: 'git clone https://github.com/asc-csa/Synthetic_Aperture_Radar_Tutorial.git',
    samplePython: `# Clone and execute CSA SAR processing workflow
# git clone https://github.com/asc-csa/Synthetic_Aperture_Radar_Tutorial.git
import rasterio
# Calibrated backscatter sigma0 processing for analog terrain roughness
print("CSA SAR Tutorial: Calibrated sigma0 backscatter analysis loaded.")`,
  },

  // ----------------------------------------------------
  // ESA (European Space Agency)
  // ----------------------------------------------------
  {
    id: 'esa-copernicus-dataspace',
    agency: 'ESA',
    agencyName: 'European Space Agency / Agence spatiale européenne',
    agencyFlag: '🇪🇺',
    title: 'Copernicus Data Space Ecosystem',
    category: 'Earth',
    description: 'Provides free and open access to Sentinel Earth-observation data covering land, oceans, and atmosphere, with tools for visualization, on-demand cloud processing, and direct API queries.',
    officialUrl: 'https://dataspace.copernicus.eu/',
    apiDocsUrl: 'https://documentation.dataspace.copernicus.eu/APIs.html',
    apiEndpoint: 'https://catalogue.dataspace.copernicus.eu/odata/v1/Products',
    keyInstruments: ['Sentinel-1 SAR C-band', 'Sentinel-2 Multispectral 10m', 'Sentinel-3 SLSTR/OLCI', 'Sentinel-5P TROPOMI'],
    openLicense: true,
    highlightNotes: 'High-frequency 10-meter optical and radar imagery for tracking yardang erosion, seasonal ice coverage, and mineralogical changes.',
    sampleCurl: 'curl "https://catalogue.dataspace.copernicus.eu/odata/v1/Products?$filter=contains(Name,%20\'S2A\')&$top=5"',
    samplePython: `import requests

# Query ESA Copernicus OData API for Sentinel-2 MSI analog granules
odata_url = "https://catalogue.dataspace.copernicus.eu/odata/v1/Products"
params = {
    "$filter": "Collection/Name eq 'SENTINEL-2' and OData.CSC.Intersects(area=geography'SRID=4326;POLYGON((-70.5 -25.0, -68.0 -25.0, -68.0 -23.0, -70.5 -23.0, -70.5 -25.0))')",
    "$top": 5
}
resp = requests.get(odata_url, params=params)
print("Copernicus Sentinel Products:", resp.status_code)`,
  },
  {
    id: 'esa-open-science-catalog',
    agency: 'ESA',
    agencyName: 'European Space Agency / Agence spatiale européenne',
    agencyFlag: '🇪🇺',
    title: 'ESA Open Science Catalog',
    category: 'Open Science & Workflows',
    description: 'A catalog of publicly available geoscience datasets, products, experiments, and workflows supported by the European Space Agency Open Earth Science program.',
    officialUrl: 'https://opensciencedata.esa.int/',
    apiDocsUrl: 'https://opensciencedata.esa.int/',
    keyInstruments: ['CryoSat-2', 'SMOS Soil Moisture', 'Swarm Geomagnetic', 'Biomass'],
    openLicense: true,
    highlightNotes: 'Curated scientific products, polar ice mass balances, and reproducible Earth observation processing pipelines.',
    sampleCurl: 'curl -I "https://opensciencedata.esa.int/"',
    samplePython: `# Explore ESA Open Science Catalog projects and workflows
catalog_url = "https://opensciencedata.esa.int/"
print(f"Connecting to ESA Open Science Catalog: {catalog_url}")`,
  },

  // ----------------------------------------------------
  // JAXA (Japan Aerospace Exploration Agency)
  // ----------------------------------------------------
  {
    id: 'jaxa-gportal',
    agency: 'JAXA',
    agencyName: 'Japan Aerospace Exploration Agency / 宇宙航空研究開発機構',
    agencyFlag: '🇯🇵',
    title: 'JAXA G-Portal',
    category: 'Earth',
    description: 'Provides Earth-observation products from JAXA satellite missions, searchable by variables such as precipitation, snow depth, vegetation index, soil moisture, sea surface temperature, and atmospheric gases.',
    officialUrl: 'https://gportal.jaxa.jp/gpr/index/index',
    apiDocsUrl: 'https://gportal.jaxa.jp/gpr/help/index',
    keyInstruments: ['GCOM-C (SGLI 250m Multispectral)', 'GCOM-W (AMSR2 Microwave Radiometer)', 'GPM/DPR (Dual-freq Precip Radar)', 'ALOS-2 PALSAR-2 (L-band SAR)'],
    openLicense: true,
    highlightNotes: 'Superior L-band SAR penetrate deep into hyper-arid sand sheets and microwave radiometry monitors sub-surface moisture.',
    sampleCurl: 'curl -I "https://gportal.jaxa.jp/gpr/index/index"',
    samplePython: `# Query JAXA G-Portal for precipitation and surface snow parameters
jaxa_portal = "https://gportal.jaxa.jp/gpr/index/index"
print(f"JAXA Global Environmental Observation Portal: {jaxa_portal}")`,
  },
];

// Helper to generate dynamic search URLs for a specific analog site
export function generateAnalogAgencyUrls(lat: number, lng: number, siteName: string) {
  const delta = 0.5;
  const minLat = (lat - delta).toFixed(3);
  const maxLat = (lat + delta).toFixed(3);
  const minLng = (lng - delta).toFixed(3);
  const maxLng = (lng + delta).toFixed(3);

  const encodedName = encodeURIComponent(siteName);

  return {
    nasaEarthdata: `https://search.earthdata.nasa.gov/search?q=${encodedName}&polygon=${minLng}%2C${minLat}%2C${maxLng}%2C${minLat}%2C${maxLng}%2C${maxLat}%2C${minLng}%2C${maxLat}%2C${minLng}%2C${minLat}`,
    nasaWorldview: `https://worldview.earthdata.nasa.gov/?v=${(lng - 3).toFixed(2)},${(lat - 3).toFixed(2)},${(lng + 3).toFixed(2)},${(lat + 3).toFixed(2)}&l=Reference_Labels_15m,Reference_Features_15m,Coastlines_15m,VIIRS_NOAA20_CorrectedReflectance_TrueColor,MODIS_Terra_CorrectedReflectance_TrueColor`,
    esaCopernicus: `https://browser.dataspace.copernicus.eu/?zoom=11&lat=${lat.toFixed(4)}&lng=${lng.toFixed(4)}&themeId=DEFAULT-THEME`,
    csaRadarsat: `https://donnees-data.asc-csa.gc.ca/en/dataset/rcm?query=${encodedName}`,
    csaSarTutorial: `https://github.com/asc-csa/Synthetic_Aperture_Radar_Tutorial`,
    jaxaGportal: `https://gportal.jaxa.jp/gpr/index/index?lat=${lat.toFixed(3)}&lon=${lng.toFixed(3)}`,
  };
}

// Helper to generate dynamic search URLs for a planetary target (Moon / Mars)
export function generatePlanetaryTargetAgencyUrls(targetPlanet: 'moon' | 'mars', targetName: string) {
  const encodedName = encodeURIComponent(targetName);

  if (targetPlanet === 'moon') {
    return {
      pdsArchive: `https://pds.nasa.gov/datasearch/subscription/search.jsp?target=Moon&instrument=LOLA&query=${encodedName}`,
      lroMission: `https://pds-geosciences.wustl.edu/missions/lro/`,
      lroDiviner: `https://pds-geosciences.wustl.edu/missions/lro/diviner.htm`,
      lrocQuickmap: `https://quickmap.lroc.asu.edu/?extent=${encodedName}`,
    };
  }

  return {
    pdsArchive: `https://pds.nasa.gov/datasearch/subscription/search.jsp?target=Mars&query=${encodedName}`,
    mroCrism: `https://pds-geosciences.wustl.edu/missions/mro/crism.htm`,
    mroHirise: `https://www.uahirise.org/results.php?keyword=${encodedName}`,
    mars2020: `https://pds-geosciences.wustl.edu/missions/mars2020/`,
  };
}
