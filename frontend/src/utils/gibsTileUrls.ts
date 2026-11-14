/**
 * NASA Worldview / GIBS (Global Imagery Browse Services) Tile URL Utility
 * WMTS Capabilities: https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/1.0.0/WMTSCapabilities.xml
 * 
 * Provides production tile URL generators for NASA GIBS Web Mercator (EPSG:3857) layers
 * compatible with Leaflet, Mapbox GL JS, MapLibre, and OpenLayers.
 */

export type GibsLayerId =
  | 'BlueMarble_ShadedRelief_Bathymetry'
  | 'MODIS_Terra_CorrectedReflectance_TrueColor'
  | 'MODIS_Aqua_CorrectedReflectance_TrueColor'
  | 'VIIRS_SNPP_CorrectedReflectance_TrueColor'
  | 'MODIS_Terra_Aerosol'
  | 'AIRS_Dust_Score';

export interface GibsLayerConfig {
  layer: string;
  title: string;
  tileMatrixSet: string;
  format: 'jpeg' | 'png';
  maxZoom: number;
  minZoom: number;
  timeType: 'static' | 'daily' | 'subdaily';
  attribution: string;
}

export const GIBS_LAYER_CONFIGS: Record<GibsLayerId, GibsLayerConfig> = {
  BlueMarble_ShadedRelief_Bathymetry: {
    layer: 'BlueMarble_ShadedRelief_Bathymetry',
    title: 'NASA Blue Marble (Shaded Relief + Bathymetry)',
    tileMatrixSet: 'GoogleMapsCompatible_Level8',
    format: 'jpeg',
    minZoom: 1,
    maxZoom: 8, // 500m resolution
    timeType: 'static',
    attribution: 'Imagery © NASA EOSDIS GIBS / Blue Marble',
  },
  MODIS_Terra_CorrectedReflectance_TrueColor: {
    layer: 'MODIS_Terra_CorrectedReflectance_TrueColor',
    title: 'MODIS Terra True Color (250m Daily Surface Reflectance)',
    tileMatrixSet: 'GoogleMapsCompatible_Level9',
    format: 'jpeg',
    minZoom: 1,
    maxZoom: 9, // 250m resolution
    timeType: 'daily',
    attribution: 'Imagery © NASA Worldview / GIBS / Terra MODIS',
  },
  MODIS_Aqua_CorrectedReflectance_TrueColor: {
    layer: 'MODIS_Aqua_CorrectedReflectance_TrueColor',
    title: 'MODIS Aqua True Color (250m Afternoon Surface Reflectance)',
    tileMatrixSet: 'GoogleMapsCompatible_Level9',
    format: 'jpeg',
    minZoom: 1,
    maxZoom: 9,
    timeType: 'daily',
    attribution: 'Imagery © NASA Worldview / GIBS / Aqua MODIS',
  },
  VIIRS_SNPP_CorrectedReflectance_TrueColor: {
    layer: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
    title: 'Suomi NPP / VIIRS True Color (375m Surface Reflectance)',
    tileMatrixSet: 'GoogleMapsCompatible_Level9',
    format: 'jpeg',
    minZoom: 1,
    maxZoom: 9,
    timeType: 'daily',
    attribution: 'Imagery © NASA / NOAA Suomi NPP VIIRS',
  },
  MODIS_Terra_Aerosol: {
    layer: 'MODIS_Terra_Aerosol',
    title: 'MODIS Terra Aerosol Optical Depth',
    tileMatrixSet: 'GoogleMapsCompatible_Level6',
    format: 'png',
    minZoom: 1,
    maxZoom: 6,
    timeType: 'daily',
    attribution: 'Data © NASA EOSDIS / MODIS Aerosol',
  },
  AIRS_Dust_Score: {
    layer: 'AIRS_Dust_Score',
    title: 'AIRS / Aqua Dust Score (Infrared Sounder)',
    tileMatrixSet: 'GoogleMapsCompatible_Level6',
    format: 'png',
    minZoom: 1,
    maxZoom: 6,
    timeType: 'daily',
    attribution: 'Data © NASA JPL AIRS Science Team',
  },
};

export interface GibsTileOptions {
  /**
   * Date for temporal layers (YYYY-MM-DD). If omitted for daily layers,
   * defaults to yesterday (UTC) to guarantee full tile assembly.
   */
  date?: string;
  /**
   * Whether to include the round-robin subdomain placeholder `{s}` for Leaflet
   * (e.g. `gibs-{s}.earthdata.nasa.gov`), where subdomains are 'a', 'b', 'c'.
   * Set false for Mapbox GL / MapLibre.
   * Default: true.
   */
  useSubdomains?: boolean;
}

/**
 * Get standard yesterday date string (YYYY-MM-DD) in UTC
 */
export function getSafeGibsDate(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().split('T')[0];
}

/**
 * Generate production NASA GIBS WMTS Web Mercator (EPSG:3857) Tile URL Template
 * 
 * Leaflet format:
 *   https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/{Layer}/default/{Time}/{TileMatrixSet}/{z}/{y}/{x}.{format}
 * Mapbox GL format:
 *   https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/{Layer}/default/{Time}/{TileMatrixSet}/{z}/{y}/{x}.{format}
 */
export function getGibsTileUrl(
  layerId: GibsLayerId = 'BlueMarble_ShadedRelief_Bathymetry',
  options: GibsTileOptions = {}
): string {
  const config = GIBS_LAYER_CONFIGS[layerId] || GIBS_LAYER_CONFIGS.BlueMarble_ShadedRelief_Bathymetry;
  const useSubdomains = options.useSubdomains !== false;
  
  // Host
  const host = useSubdomains
    ? 'https://gibs-{s}.earthdata.nasa.gov'
    : 'https://gibs.earthdata.nasa.gov';

  // Time parameter
  let timeStr = 'default';
  if (config.timeType === 'daily') {
    timeStr = options.date || getSafeGibsDate();
  }

  return `${host}/wmts/epsg3857/best/${config.layer}/default/${timeStr}/${config.tileMatrixSet}/{z}/{y}/{x}.${config.format}`;
}

/**
 * Get Leaflet-compatible layer configuration object
 */
export function getGibsLeafletOptions(layerId: GibsLayerId, date?: string) {
  const config = GIBS_LAYER_CONFIGS[layerId] || GIBS_LAYER_CONFIGS.BlueMarble_ShadedRelief_Bathymetry;
  return {
    urlTemplate: getGibsTileUrl(layerId, { date, useSubdomains: true }),
    options: {
      subdomains: ['a', 'b', 'c'],
      minZoom: config.minZoom,
      maxZoom: config.maxZoom,
      attribution: config.attribution,
      tileSize: 256,
      noWrap: false,
    },
  };
}

/**
 * Pre-configured Leaflet-ready URL templates
 */
export const GIBS_PRESETS = {
  // Static global high-res bathymetry & shaded relief basemap
  blueMarbleUrl: getGibsTileUrl('BlueMarble_ShadedRelief_Bathymetry', { useSubdomains: true }),
  
  // Daily true-color corrected reflectance mosaic (MODIS Terra)
  modisTerraDailyUrl: (date?: string) =>
    getGibsTileUrl('MODIS_Terra_CorrectedReflectance_TrueColor', { date, useSubdomains: true }),
    
  // Suomi NPP ultra-clear true-color mosaic
  viirsTrueColorUrl: (date?: string) =>
    getGibsTileUrl('VIIRS_SNPP_CorrectedReflectance_TrueColor', { date, useSubdomains: true }),
};
