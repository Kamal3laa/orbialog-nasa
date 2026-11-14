/**
 * NASA Earthdata CMR (Common Metadata Repository) API Route
 * Endpoint: /api/nasa-cmr
 * 
 * Queries NASA CMR for DEM (SRTM 30m) and Aerosol Optical Depth (MODIS MCD19A2 / MOD04_L2)
 * datasets over a specified bounding box or coordinate coordinate radius.
 * 
 * NASA CMR API: https://cmr.earthdata.nasa.gov/search/granules.json
 */

export interface GranuleLink {
  rel: string;
  href: string;
  title?: string;
  type?: string;
  length?: string;
  inherited?: boolean;
}

export interface GranuleItem {
  id: string;
  title: string;
  producerGranuleId?: string;
  datasetId: string;
  collectionConceptId?: string;
  timeStart: string;
  timeEnd?: string;
  cloudCover?: number | null;
  sizeMb?: number;
  boundingBox?: number[]; // [minLon, minLat, maxLon, maxLat]
  downloadUrls: string[];
  s3Urls: string[];
  browseUrls: string[];
  metadataUrl?: string;
}

export interface CmrQueryResponse {
  success: boolean;
  query: {
    bbox: number[];
    datasetRequested: string;
    pageSize: number;
    temporal?: string;
  };
  results: {
    dem?: {
      collection: string;
      title: string;
      totalFound: number;
      granules: GranuleItem[];
    };
    aerosol?: {
      collection: string;
      title: string;
      totalFound: number;
      granules: GranuleItem[];
    };
  };
  timestamp: string;
  error?: string;
}

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Content-Type': 'application/json',
};

// Handle CORS preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

/**
 * Convert lat/lng + radius (km) to bounding box [minLon, minLat, maxLon, maxLat]
 */
function bboxFromPoint(lat: number, lng: number, radiusKm: number): number[] {
  const latDelta = radiusKm / 111.0;
  const lonDelta = radiusKm / (111.0 * Math.cos((lat * Math.PI) / 180));

  const minLat = Math.max(-90, lat - latDelta);
  const maxLat = Math.min(90, lat + latDelta);
  const minLon = Math.max(-180, lng - lonDelta);
  const maxLon = Math.min(180, lng + lonDelta);

  return [
    parseFloat(minLon.toFixed(4)),
    parseFloat(minLat.toFixed(4)),
    parseFloat(maxLon.toFixed(4)),
    parseFloat(maxLat.toFixed(4)),
  ];
}

/**
 * Parse NASA CMR Granule entry into normalized GranuleItem
 */
function parseCmrGranule(entry: any): GranuleItem {
  const links: GranuleLink[] = entry.links || [];
  
  // Extract direct data download links (exclude inherited collection-level search links)
  const downloadUrls: string[] = [];
  const s3Urls: string[] = [];
  const browseUrls: string[] = [];
  let metadataUrl: string | undefined;

  for (const link of links) {
    const rel = link.rel || '';
    const href = link.href || '';

    // Direct download data links
    if (
      rel.includes('/data#') &&
      !link.inherited &&
      (href.startsWith('https://') || href.startsWith('http://'))
    ) {
      downloadUrls.push(href);
    }

    // Direct Cloud S3 access links
    if (rel.includes('/s3#') || href.startsWith('s3://')) {
      s3Urls.push(href);
    }

    // Browse and preview imagery links
    if (rel.includes('/browse#') && (href.endsWith('.jpg') || href.endsWith('.png') || href.endsWith('.jpeg'))) {
      browseUrls.push(href);
    }

    // Metadata links
    if (rel.includes('/metadata#') && !metadataUrl && href.includes('.xml')) {
      metadataUrl = href;
    }
  }

  // Parse bounding box from entry.boxes if available: "minLat minLon maxLat maxLon"
  let parsedBbox: number[] | undefined;
  if (entry.boxes && entry.boxes.length > 0) {
    const parts = entry.boxes[0].split(/\s+/).map(Number);
    if (parts.length === 4) {
      parsedBbox = [parts[1], parts[0], parts[3], parts[2]]; // [minLon, minLat, maxLon, maxLat]
    }
  }

  return {
    id: entry.id,
    title: entry.title || entry.producer_granule_id || 'Untitled Granule',
    producerGranuleId: entry.producer_granule_id,
    datasetId: entry.dataset_id || 'NASA Dataset',
    collectionConceptId: entry.collection_concept_id,
    timeStart: entry.time_start,
    timeEnd: entry.time_end,
    cloudCover: entry.cloud_cover !== undefined ? parseFloat(entry.cloud_cover) : null,
    sizeMb: entry.granule_size ? parseFloat(parseFloat(entry.granule_size).toFixed(2)) : undefined,
    boundingBox: parsedBbox,
    downloadUrls,
    s3Urls,
    browseUrls,
    metadataUrl,
  };
}

/**
 * Fetch granules from NASA CMR API for a given collection and bounding box
 */
async function fetchGranulesFromCmr(
  shortName: string,
  bbox: number[], // [minLon, minLat, maxLon, maxLat]
  pageSize: number = 5,
  temporal?: string
): Promise<{ collection: string; title: string; totalFound: number; granules: GranuleItem[] }> {
  // Format CMR bounding_box param: lower_left_lon,lower_left_lat,upper_right_lon,upper_right_lat
  const bboxParam = `${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]}`;
  
  const cmrUrl = new URL('https://cmr.earthdata.nasa.gov/search/granules.json');
  cmrUrl.searchParams.set('short_name', shortName);
  cmrUrl.searchParams.set('bounding_box', bboxParam);
  cmrUrl.searchParams.set('page_size', pageSize.toString());
  cmrUrl.searchParams.set('sort_key', '-start_date');

  if (temporal) {
    cmrUrl.searchParams.set('temporal', temporal);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

  try {
    const res = await fetch(cmrUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ORBiALOG-NASA-SpaceApps/1.0 (Terra-Lunar-Analog-Engine)',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`NASA CMR responded with HTTP ${res.status}: ${errText.slice(0, 150)}`);
    }

    const data = await res.json();
    const entries = data.feed?.entry || [];
    const totalFound = parseInt(res.headers.get('cmr-hits') || entries.length.toString(), 10);
    const granules = entries.map(parseCmrGranule);

    return {
      collection: shortName,
      title: entries[0]?.dataset_id || shortName,
      totalFound: isNaN(totalFound) ? entries.length : totalFound,
      granules,
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error(`NASA CMR request timed out after 12s for collection ${shortName}`);
    }
    throw err;
  }
}

/**
 * Core handler supporting both GET and POST
 */
async function handleCmrRequest(req: Request): Promise<Response> {
  try {
    let bbox: number[] | null = null;
    let datasetType: 'dem' | 'aerosol' | 'both' = 'both';
    let pageSize = 5;
    let temporal: string | undefined;

    if (req.method === 'GET') {
      const url = new URL(req.url);
      const bboxParam = url.searchParams.get('bbox');
      const latParam = url.searchParams.get('lat');
      const lngParam = url.searchParams.get('lng');
      const radiusParam = url.searchParams.get('radiusKm') || url.searchParams.get('radius');
      const datasetParam = url.searchParams.get('dataset');
      const limitParam = url.searchParams.get('pageSize') || url.searchParams.get('limit');
      const temporalParam = url.searchParams.get('temporal');

      if (bboxParam) {
        const parts = bboxParam.split(',').map((s) => parseFloat(s.trim()));
        if (parts.length === 4 && parts.every((n) => !isNaN(n))) {
          bbox = parts;
        }
      } else if (latParam && lngParam) {
        const lat = parseFloat(latParam);
        const lng = parseFloat(lngParam);
        const radius = radiusParam ? parseFloat(radiusParam) : 25; // default 25km radius
        if (!isNaN(lat) && !isNaN(lng)) {
          bbox = bboxFromPoint(lat, lng, radius);
        }
      }

      if (datasetParam === 'dem' || datasetParam === 'aerosol' || datasetParam === 'both') {
        datasetType = datasetParam;
      }

      if (limitParam) {
        const parsedLimit = parseInt(limitParam, 10);
        if (!isNaN(parsedLimit) && parsedLimit > 0) {
          pageSize = Math.min(parsedLimit, 25);
        }
      }

      if (temporalParam) {
        temporal = temporalParam;
      }
    } else if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      if (Array.isArray(body.bbox) && body.bbox.length === 4) {
        bbox = body.bbox.map(Number);
      } else if (typeof body.lat === 'number' && typeof body.lng === 'number') {
        bbox = bboxFromPoint(body.lat, body.lng, body.radiusKm || 25);
      }

      if (['dem', 'aerosol', 'both'].includes(body.dataset)) {
        datasetType = body.dataset;
      }

      if (typeof body.pageSize === 'number') {
        pageSize = Math.min(Math.max(1, body.pageSize), 25);
      }

      if (typeof body.temporal === 'string') {
        temporal = body.temporal;
      }
    }

    // Default fallback bbox if none provided (defaults to Egypt White Desert analog: 28.16°E, 27.38°N)
    if (!bbox) {
      bbox = bboxFromPoint(27.38, 28.16, 30);
    }

    // Validate bounding box bounds
    const [minLon, minLat, maxLon, maxLat] = bbox;
    if (minLon < -180 || maxLon > 180 || minLat < -90 || maxLat > 90 || minLon > maxLon || minLat > maxLat) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Invalid bounding box coordinates: [${bbox.join(', ')}]. Must be [minLon, minLat, maxLon, maxLat] within [-180, -90, 180, 90].`,
        }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Fetch collections in parallel
    const queries: Promise<any>[] = [];

    // 1. DEM (SRTM Global 1-arc-second / 30m)
    if (datasetType === 'dem' || datasetType === 'both') {
      queries.push(
        fetchGranulesFromCmr('SRTMGL1', bbox, pageSize).catch((err) => ({
          collection: 'SRTMGL1',
          title: 'NASA Shuttle Radar Topography Mission Global 1 arc second V003',
          totalFound: 0,
          granules: [],
          error: err.message,
        }))
      );
    }

    // 2. Aerosol (MODIS MCD19A2 MAIAC Land Aerosol Optical Depth 1km)
    if (datasetType === 'aerosol' || datasetType === 'both') {
      queries.push(
        fetchGranulesFromCmr('MCD19A2', bbox, pageSize, temporal).catch((err) => ({
          collection: 'MCD19A2',
          title: 'MODIS/Terra+Aqua Land Aerosol Optical Depth Daily 1km SIN Grid V061',
          totalFound: 0,
          granules: [],
          error: err.message,
        }))
      );
    }

    const queryResults = await Promise.all(queries);

    const responsePayload: CmrQueryResponse = {
      success: true,
      query: {
        bbox,
        datasetRequested: datasetType,
        pageSize,
        temporal,
      },
      results: {},
      timestamp: new Date().toISOString(),
    };

    let resultIndex = 0;
    if (datasetType === 'dem' || datasetType === 'both') {
      responsePayload.results.dem = queryResults[resultIndex++];
    }
    if (datasetType === 'aerosol' || datasetType === 'both') {
      responsePayload.results.aerosol = queryResults[resultIndex++];
    }

    return new Response(JSON.stringify(responsePayload), {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal error querying NASA Earthdata CMR API',
        timestamp: new Date().toISOString(),
      }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function GET(request: Request) {
  return handleCmrRequest(request);
}

export async function POST(request: Request) {
  return handleCmrRequest(request);
}
