/**
 * ESA Copernicus Data Space STAC API Route
 * Endpoint: /api/esa-stac
 * 
 * Queries Copernicus Data Space STAC catalog for Sentinel-2 L2A multispectral imagery
 * (Bottom-of-Atmosphere surface reflectance) over a given coordinate or bounding box.
 * Returns Cloud-Optimized GeoTIFF (COG) and True Color Image (TCI) URLs for NDVI,
 * vegetation indexing, and direct frontend rendering.
 * 
 * Official STAC: https://catalogue.dataspace.copernicus.eu/stac/search
 * Open COG Mirror: https://earth-search.aws.element84.com/v1/search
 */

export interface Sentinel2BandAssets {
  tci?: string;       // True Color Image (RGB) 10m
  b04?: string;       // Red Band (665 nm) - Crucial for NDVI
  b08?: string;       // Near-Infrared Band (842 nm) - Crucial for NDVI
  b02?: string;       // Blue Band (490 nm)
  b03?: string;       // Green Band (560 nm)
  aot?: string;       // Aerosol Optical Thickness
  thumbnail?: string; // Quicklook browse image
}

export interface Sentinel2Scene {
  id: string;
  tileId?: string;
  datetime: string;
  cloudCover: number;
  bbox: number[];
  geometry: any;
  platform?: string;
  // Official Copernicus Data Space Ecosystem (CDSE) download & node links
  copernicusAssets: Sentinel2BandAssets;
  // Public CORS-enabled Cloud-Optimized GeoTIFF (COG) URLs for direct browser rendering
  publicCogUrls: Sentinel2BandAssets;
  ndviReady: boolean;
  rawAssetsSummary?: Record<string, string>;
}

export interface EsaStacResponse {
  success: boolean;
  query: {
    coordinates?: { lat: number; lng: number };
    bbox: number[];
    datetime: string;
    maxCloudCover: number;
    limit: number;
  };
  totalFound: number;
  provider: 'copernicus-dataspace' | 'element84-earthsearch-fallback';
  scenes: Sentinel2Scene[];
  timestamp: string;
  error?: string;
}

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Content-Type': 'application/json',
};

// Handle CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

/**
 * Build bounding box from point coordinate
 */
function bboxFromPoint(lat: number, lng: number, radiusKm: number = 10): number[] {
  const latDelta = radiusKm / 111.0;
  const lonDelta = radiusKm / (111.0 * Math.cos((lat * Math.PI) / 180));

  return [
    parseFloat(Math.max(-180, lng - lonDelta).toFixed(4)),
    parseFloat(Math.max(-90, lat - latDelta).toFixed(4)),
    parseFloat(Math.min(180, lng + lonDelta).toFixed(4)),
    parseFloat(Math.min(90, lat + latDelta).toFixed(4)),
  ];
}

/**
 * Format default datetime range (past 90 days if not supplied)
 */
function getDefaultDateRange(): string {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 90);
  return `${start.toISOString().split('T')[0]}T00:00:00Z/${end.toISOString().split('T')[0]}T23:59:59Z`;
}

/**
 * Construct public S3 COG URLs for Sentinel-2 using MGRS tile ID and date
 * Format: https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/{utm}/{latBand}/{square}/{year}/{month}/{granuleId}/TCI.tif
 */
function constructPublicAwsCogUrls(sceneId: string, datetime: string): Sentinel2BandAssets {
  // Typical Sentinel-2 granule ID: S2A_MSIL2A_20240131T084201_N0510_R064_T35RPJ_20240131T114151
  // Or AWS format: S2A_35RPJ_20240131_0_L2A
  const dateObj = new Date(datetime);
  const year = dateObj.getUTCFullYear();
  const month = dateObj.getUTCMonth() + 1;

  // Extract MGRS tile from sceneId (e.g. T35RPJ -> utm=35, latBand=R, square=PJ)
  const mgrsMatch = sceneId.match(/T?(\d{2})([C-X])([A-Z]{2})/);
  if (!mgrsMatch) {
    return {};
  }

  const utm = mgrsMatch[1].replace(/^0/, '');
  const latBand = mgrsMatch[2];
  const square = mgrsMatch[3];
  const yyyymmdd = datetime.split('T')[0].replace(/-/g, '');
  const satellite = sceneId.startsWith('S2B') ? 'S2B' : 'S2A';
  
  const awsPrefix = `https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/${utm}/${latBand}/${square}/${year}/${month}/${satellite}_${mgrsMatch[1]}${latBand}${square}_${yyyymmdd}_0_L2A`;

  return {
    tci: `${awsPrefix}/TCI.tif`,
    b04: `${awsPrefix}/B04.tif`,
    b08: `${awsPrefix}/B08.tif`,
    b02: `${awsPrefix}/B02.tif`,
    b03: `${awsPrefix}/B03.tif`,
    aot: `${awsPrefix}/AOT.tif`,
    thumbnail: `${awsPrefix}/preview.jpg`,
  };
}

/**
 * Parse Copernicus Data Space STAC Item
 */
function parseCopernicusFeature(feature: any): Sentinel2Scene {
  const assets = feature.assets || {};
  const props = feature.properties || {};

  const getAssetUrl = (keys: string[]): string | undefined => {
    for (const key of keys) {
      if (assets[key]) {
        // Prefer HTTPS alternate url if provided by CDSE
        return assets[key].alternate?.https?.href || assets[key].href;
      }
    }
    return undefined;
  };

  const copernicusAssets: Sentinel2BandAssets = {
    tci: getAssetUrl(['TCI_10m', 'visual', 'TCI_20m', 'TCI']),
    b04: getAssetUrl(['B04_10m', 'B04_20m', 'B04', 'red']),
    b08: getAssetUrl(['B08_10m', 'B08_20m', 'B08', 'nir']),
    b02: getAssetUrl(['B02_10m', 'B02', 'blue']),
    b03: getAssetUrl(['B03_10m', 'B03', 'green']),
    aot: getAssetUrl(['AOT_10m', 'AOT_20m', 'AOT']),
    thumbnail: getAssetUrl(['thumbnail', 'overview', 'quicklook']),
  };

  const publicCogs = constructPublicAwsCogUrls(feature.id, props.datetime || feature.id);

  // If public Cogs lacks thumbnail, fallback to Copernicus thumbnail
  if (!publicCogs.thumbnail && copernicusAssets.thumbnail) {
    publicCogs.thumbnail = copernicusAssets.thumbnail;
  }

  return {
    id: feature.id,
    tileId: props['s2:tile_id'] || props['mgrs:tile'] || feature.id.match(/T\d{2}[A-Z]{3}/)?.[0],
    datetime: props.datetime || props.start_datetime || new Date().toISOString(),
    cloudCover: typeof props['eo:cloud_cover'] === 'number' ? Math.round(props['eo:cloud_cover'] * 10) / 10 : 0,
    bbox: feature.bbox || [],
    geometry: feature.geometry,
    platform: props.platform || 'Sentinel-2',
    copernicusAssets,
    publicCogUrls: publicCogs,
    ndviReady: !!(copernicusAssets.b04 && copernicusAssets.b08) || !!(publicCogs.b04 && publicCogs.b08),
    rawAssetsSummary: Object.keys(assets).reduce((acc: any, k) => {
      acc[k] = assets[k].type || 'asset';
      return acc;
    }, {}),
  };
}

/**
 * Query primary Copernicus Data Space STAC catalog
 */
async function queryCopernicusStac(
  bbox: number[],
  datetime: string,
  limit: number = 4
): Promise<Sentinel2Scene[]> {
  const url = 'https://catalogue.dataspace.copernicus.eu/stac/search';
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/geo+json, application/json',
        'User-Agent': 'ORBiALOG-Space-App/1.0 (Copernicus-STAC-Client)',
      },
      body: JSON.stringify({
        collections: ['sentinel-2-l2a'],
        bbox,
        datetime,
        limit,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`Copernicus STAC responded with HTTP ${res.status}: ${errText.slice(0, 150)}`);
    }

    const data = await res.json();
    const features = data.features || [];
    return features.map(parseCopernicusFeature);
  } catch (err: any) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * Fallback to Element84 Earth Search STAC (Public Sentinel-2 L2A COGs)
 */
async function queryEarthSearchFallback(
  bbox: number[],
  datetime: string,
  limit: number = 4
): Promise<Sentinel2Scene[]> {
  const url = 'https://earth-search.aws.element84.com/v1/search';
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        collections: ['sentinel-2-l2a'],
        bbox,
        datetime,
        limit,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`EarthSearch STAC fallback HTTP ${res.status}`);
    }

    const data = await res.json();
    const features = data.features || [];

    return features.map((f: any) => {
      const assets = f.assets || {};
      const props = f.properties || {};

      const cogAssets: Sentinel2BandAssets = {
        tci: assets.visual?.href,
        b04: assets.red?.href,
        b08: assets.nir?.href,
        b02: assets.blue?.href,
        b03: assets.green?.href,
        aot: assets.aot?.href,
        thumbnail: assets.thumbnail?.href,
      };

      return {
        id: f.id,
        tileId: props['s2:mgrs_tile'] || f.id,
        datetime: props.datetime,
        cloudCover: typeof props['eo:cloud_cover'] === 'number' ? Math.round(props['eo:cloud_cover'] * 10) / 10 : 0,
        bbox: f.bbox,
        geometry: f.geometry,
        platform: props.platform || 'Sentinel-2',
        copernicusAssets: cogAssets,
        publicCogUrls: cogAssets,
        ndviReady: !!(cogAssets.b04 && cogAssets.b08),
      };
    });
  } catch (err: any) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * Core Request Handler
 */
async function handleEsaStacRequest(req: Request): Promise<Response> {
  try {
    let bbox: number[] | null = null;
    let lat: number | null = null;
    let lng: number | null = null;
    let datetime: string = getDefaultDateRange();
    let maxCloudCover = 40;
    let limit = 4;

    if (req.method === 'GET') {
      const url = new URL(req.url);
      const bboxParam = url.searchParams.get('bbox');
      const latParam = url.searchParams.get('lat');
      const lngParam = url.searchParams.get('lng');
      const radiusParam = url.searchParams.get('radiusKm');
      const dateParam = url.searchParams.get('datetime') || url.searchParams.get('date');
      const cloudParam = url.searchParams.get('maxCloudCover') || url.searchParams.get('cloudCover');
      const limitParam = url.searchParams.get('limit');

      if (bboxParam) {
        const parts = bboxParam.split(',').map((s) => parseFloat(s.trim()));
        if (parts.length === 4 && parts.every((n) => !isNaN(n))) {
          bbox = parts;
        }
      } else if (latParam && lngParam) {
        lat = parseFloat(latParam);
        lng = parseFloat(lngParam);
        const radius = radiusParam ? parseFloat(radiusParam) : 15;
        if (!isNaN(lat) && !isNaN(lng)) {
          bbox = bboxFromPoint(lat, lng, radius);
        }
      }

      if (dateParam) {
        datetime = dateParam.includes('/') ? dateParam : `${dateParam}T00:00:00Z/${dateParam}T23:59:59Z`;
      }

      if (cloudParam) {
        const parsedCloud = parseFloat(cloudParam);
        if (!isNaN(parsedCloud)) maxCloudCover = parsedCloud;
      }

      if (limitParam) {
        const parsedLimit = parseInt(limitParam, 10);
        if (!isNaN(parsedLimit) && parsedLimit > 0) limit = Math.min(parsedLimit, 20);
      }
    } else if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      if (Array.isArray(body.bbox) && body.bbox.length === 4) {
        bbox = body.bbox.map(Number);
      } else if (typeof body.lat === 'number' && typeof body.lng === 'number') {
        lat = body.lat;
        lng = body.lng;
        bbox = bboxFromPoint(body.lat, body.lng, body.radiusKm || 15);
      }

      if (typeof body.datetime === 'string') {
        datetime = body.datetime;
      }

      if (typeof body.maxCloudCover === 'number') {
        maxCloudCover = body.maxCloudCover;
      }

      if (typeof body.limit === 'number') {
        limit = Math.min(Math.max(1, body.limit), 20);
      }
    }

    // Default to Egypt White Desert analog coordinates if none provided
    if (!bbox) {
      lat = 27.38;
      lng = 28.16;
      bbox = bboxFromPoint(lat, lng, 15);
    }

    let scenes: Sentinel2Scene[] = [];
    let provider: 'copernicus-dataspace' | 'element84-earthsearch-fallback' = 'copernicus-dataspace';

    // 1. Try official ESA Copernicus Data Space STAC
    try {
      scenes = await queryCopernicusStac(bbox, datetime, limit);
    } catch (copernicusError: any) {
      console.warn('Copernicus Data Space STAC query failed, falling back to Element84 Open COG STAC:', copernicusError.message);
      
      // 2. Fallback to Element84 Open COG STAC
      try {
        scenes = await queryEarthSearchFallback(bbox, datetime, limit);
        provider = 'element84-earthsearch-fallback';
      } catch (fallbackError: any) {
        throw new Error(
          `Both Copernicus STAC (${copernicusError.message}) and EarthSearch fallback (${fallbackError.message}) failed.`
        );
      }
    }

    // Filter scenes by maximum cloud cover threshold
    const filteredScenes = scenes.filter((scene) => scene.cloudCover <= maxCloudCover);
    const finalScenes = filteredScenes.length > 0 ? filteredScenes : scenes.slice(0, 2);

    const responsePayload: EsaStacResponse = {
      success: true,
      query: {
        coordinates: lat !== null && lng !== null ? { lat, lng } : undefined,
        bbox,
        datetime,
        maxCloudCover,
        limit,
      },
      totalFound: finalScenes.length,
      provider,
      scenes: finalScenes,
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(responsePayload), {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal error querying ESA Copernicus STAC API',
        timestamp: new Date().toISOString(),
      }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function GET(request: Request) {
  return handleEsaStacRequest(request);
}

export async function POST(request: Request) {
  return handleEsaStacRequest(request);
}
