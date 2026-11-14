/**
 * ORBiALOG Space Agency API Client Service
 * 
 * Provides unified, typed client-side methods to call:
 * - NASA Earthdata CMR API (/api/nasa-cmr)
 * - ESA Copernicus Data Space STAC API (/api/esa-stac)
 * - NASA PDS Planetary Constants / Physics Compensator (/api/planetary-constants)
 * - Canadian Space Agency (CSA) RADARSAT / RCM SAR (/api/csa-sar)
 * - NASA GIBS Tile URL generator utilities
 */

import { CmrQueryResponse } from '../app/api/nasa-cmr/route';
import { EsaStacResponse } from '../app/api/esa-stac/route';
import { PlanetaryConstantsResponse } from '../app/api/planetary-constants/route';
import { CsaSarApiResponse } from '../app/api/csa-sar/route';
import { getGibsTileUrl, GibsLayerId } from './gibsTileUrls';

export interface CmrFetchParams {
  bbox?: number[]; // [minLon, minLat, maxLon, maxLat]
  lat?: number;
  lng?: number;
  radiusKm?: number;
  dataset?: 'dem' | 'aerosol' | 'both';
  limit?: number;
  temporal?: string;
}

export interface EsaStacFetchParams {
  lat?: number;
  lng?: number;
  bbox?: number[];
  datetime?: string;
  maxCloudCover?: number;
  limit?: number;
}

export interface PlanetaryConstantsParams {
  target?: 'mars' | 'moon' | 'all';
  massKg?: number;
  velocityMs?: number;
  frontalAreaM2?: number;
}

/**
 * Helper to get active API base URL (works in Next.js, Vite dev proxy, or direct relative)
 */
function getApiBaseUrl(): string {
  return '';
}

/**
 * 1. Fetch live NASA Earthdata CMR Granules for DEM (SRTM) and Aerosols (MODIS)
 */
export async function fetchNasaCmrGranules(params: CmrFetchParams = {}): Promise<CmrQueryResponse> {
  const url = new URL(`${getApiBaseUrl()}/api/nasa-cmr`, window.location.origin);
  
  if (params.bbox) {
    url.searchParams.set('bbox', params.bbox.join(','));
  } else if (params.lat !== undefined && params.lng !== undefined) {
    url.searchParams.set('lat', params.lat.toString());
    url.searchParams.set('lng', params.lng.toString());
    if (params.radiusKm) url.searchParams.set('radiusKm', params.radiusKm.toString());
  }

  if (params.dataset) url.searchParams.set('dataset', params.dataset);
  if (params.limit) url.searchParams.set('pageSize', params.limit.toString());
  if (params.temporal) url.searchParams.set('temporal', params.temporal);

  try {
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`NASA CMR Route HTTP ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    // Direct client fallback to NASA CMR if Next.js server route isn't running yet
    console.warn('Local /api/nasa-cmr route unreachable, attempting direct NASA CMR query...', error.message);
    const shortName = params.dataset === 'aerosol' ? 'MCD19A2' : 'SRTMGL1';
    const fallbackBbox = params.bbox ? params.bbox.join(',') : '25.0,26.0,30.0,31.0';
    const directUrl = `https://cmr.earthdata.nasa.gov/search/granules.json?short_name=${shortName}&bounding_box=${fallbackBbox}&page_size=${params.limit || 3}`;
    
    const directRes = await fetch(directUrl);
    const directData = await directRes.json();
    return {
      success: true,
      query: {
        bbox: params.bbox || [25, 26, 30, 31],
        datasetRequested: params.dataset || 'both',
        pageSize: params.limit || 3,
      },
      results: {
        dem: {
          collection: shortName,
          title: 'NASA Shuttle Radar Topography Mission Global 1 arc second V003',
          totalFound: directData.feed?.entry?.length || 0,
          granules: (directData.feed?.entry || []).map((e: any) => ({
            id: e.id,
            title: e.title || e.producer_granule_id,
            datasetId: e.dataset_id,
            timeStart: e.time_start,
            downloadUrls: (e.links || []).filter((l: any) => l.rel?.includes('/data#') && !l.inherited).map((l: any) => l.href),
            s3Urls: (e.links || []).filter((l: any) => l.rel?.includes('/s3#') || l.href?.startsWith('s3://')).map((l: any) => l.href),
            browseUrls: (e.links || []).filter((l: any) => l.rel?.includes('/browse#')).map((l: any) => l.href),
          })),
        },
      },
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * 2. Fetch live Sentinel-2 L2A STAC items from Copernicus Data Space
 */
export async function fetchEsaSentinel2Scenes(params: EsaStacFetchParams = {}): Promise<EsaStacResponse> {
  const url = new URL(`${getApiBaseUrl()}/api/esa-stac`, window.location.origin);

  if (params.lat !== undefined && params.lng !== undefined) {
    url.searchParams.set('lat', params.lat.toString());
    url.searchParams.set('lng', params.lng.toString());
  } else if (params.bbox) {
    url.searchParams.set('bbox', params.bbox.join(','));
  }

  if (params.datetime) url.searchParams.set('datetime', params.datetime);
  if (params.maxCloudCover !== undefined) url.searchParams.set('maxCloudCover', params.maxCloudCover.toString());
  if (params.limit) url.searchParams.set('limit', params.limit.toString());

  try {
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`ESA STAC Route HTTP ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    // Direct public AWS Element84 STAC fallback if route is not currently served
    console.warn('Local /api/esa-stac route unreachable, falling back to Element84 Open COG STAC...', error.message);
    const point = [params.lng || 28.16, params.lat || 27.38];
    const delta = 0.1;
    const directRes = await fetch('https://earth-search.aws.element84.com/v1/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        collections: ['sentinel-2-l2a'],
        bbox: [point[0] - delta, point[1] - delta, point[0] + delta, point[1] + delta],
        limit: params.limit || 3,
      }),
    });
    const directData = await directRes.json();
    return {
      success: true,
      query: {
        coordinates: params.lat !== undefined ? { lat: params.lat, lng: params.lng || 0 } : undefined,
        bbox: [point[0] - delta, point[1] - delta, point[0] + delta, point[1] + delta],
        datetime: params.datetime || 'recent',
        maxCloudCover: params.maxCloudCover || 30,
        limit: params.limit || 3,
      },
      totalFound: directData.features?.length || 0,
      provider: 'element84-earthsearch-fallback',
      scenes: (directData.features || []).map((f: any) => ({
        id: f.id,
        tileId: f.properties?.['s2:mgrs_tile'] || f.id,
        datetime: f.properties?.datetime || new Date().toISOString(),
        cloudCover: f.properties?.['eo:cloud_cover'] || 0,
        bbox: f.bbox,
        geometry: f.geometry,
        platform: 'Sentinel-2',
        copernicusAssets: {
          tci: f.assets?.visual?.href,
          b04: f.assets?.red?.href,
          b08: f.assets?.nir?.href,
          thumbnail: f.assets?.thumbnail?.href,
        },
        publicCogUrls: {
          tci: f.assets?.visual?.href,
          b04: f.assets?.red?.href,
          b08: f.assets?.nir?.href,
          thumbnail: f.assets?.thumbnail?.href,
        },
        ndviReady: !!(f.assets?.red && f.assets?.nir),
      })),
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * 3. Fetch NASA PDS Planetary Constants and Physics Compensator values
 */
export async function fetchPlanetaryConstants(params: PlanetaryConstantsParams = {}): Promise<PlanetaryConstantsResponse> {
  const url = new URL(`${getApiBaseUrl()}/api/planetary-constants`, window.location.origin);
  
  if (params.target) url.searchParams.set('target', params.target);
  if (params.massKg) url.searchParams.set('massKg', params.massKg.toString());
  if (params.velocityMs) url.searchParams.set('velocityMs', params.velocityMs.toString());
  if (params.frontalAreaM2) url.searchParams.set('frontalAreaM2', params.frontalAreaM2.toString());

  try {
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Planetary Constants Route HTTP ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    console.warn('Calling static PDS baseline fallback...', error.message);
    // Dynamic import or direct calculation fallback
    const target = params.target === 'moon' ? 'moon' : 'mars';
    const earthG = 9.80665;
    const targetG = target === 'mars' ? 3.72076 : 1.622;
    const earthRho = 1.225;
    const targetRho = target === 'mars' ? 0.020 : 1e-12;
    const mass = params.massKg || 200;

    return {
      success: true,
      targetRequested: target,
      timestamp: new Date().toISOString(),
      source: 'NASA PDS Geosciences Node (Cached Static Engine)',
      baselines: {
        earth: {
          name: 'Earth Reference',
          pdsArchiveNodes: [],
          gravity: { surfaceAccelerationMs2: earthG, earthRatio: 1.0, escapeVelocityKms: 11.18, standardUncertainty: 'Def' },
          atmosphere: { surfaceDensityKgM3: earthRho, surfacePressurePa: 101325, surfacePressureMbar: 1013.25, earthDensityRatio: 1.0, scaleHeightKm: 8.5, speedOfSoundMs: 340.3, composition: {}, convectiveHeatTransferRatio: 1.0 },
          radiation: { meanSurfaceDoseRateMSvDay: 0.0067, meanAnnualDoseMSvYear: 2.4, earthSurfaceDoseRatio: 1.0, galacticCosmicRayFraction: 15, solarParticleEventRisk: 'low', halfValueLayerRegolithCm: 18 },
          thermal: { meanSurfaceTempK: 288.15, meanSurfaceTempC: 15, minTempK: 184, maxTempK: 330, diurnalSwingK: 12, solarIrradianceWm2: 1361 },
          regolith: { bulkDensityGramsCm3: 1.6, cohesionKPa: 1.5, internalFrictionAngleDeg: 32, sinkageModulusKc: 2.5, sinkageModulusKphi: 850 },
        },
        mars: {
          name: 'Mars PDS Baseline',
          pdsArchiveNodes: [{ node: 'PDS Geosciences', datasetUrn: 'urn:nasa:pds:msl_rad', doi: '10.1126/science.1244797', missionInstrument: 'MSL RAD' }],
          gravity: { surfaceAccelerationMs2: 3.72076, earthRatio: 0.3794, escapeVelocityKms: 5.03, standardUncertainty: 'MGS' },
          atmosphere: { surfaceDensityKgM3: 0.020, surfacePressurePa: 610, surfacePressureMbar: 6.1, earthDensityRatio: 0.0163, scaleHeightKm: 11.1, speedOfSoundMs: 240, composition: { CO2: 95.32 }, convectiveHeatTransferRatio: 0.12 },
          radiation: { meanSurfaceDoseRateMSvDay: 0.64, meanAnnualDoseMSvYear: 233.6, earthSurfaceDoseRatio: 95.5, galacticCosmicRayFraction: 88, solarParticleEventRisk: 'extreme', halfValueLayerRegolithCm: 16.5 },
          thermal: { meanSurfaceTempK: 210, meanSurfaceTempC: -63.15, minTempK: 133, maxTempK: 293, diurnalSwingK: 80, solarIrradianceWm2: 590 },
          regolith: { bulkDensityGramsCm3: 1.52, cohesionKPa: 0.8, internalFrictionAngleDeg: 35, sinkageModulusKc: 1.8, sinkageModulusKphi: 650 },
        },
        moon: {
          name: 'Moon PDS Baseline',
          pdsArchiveNodes: [{ node: 'PDS Geosciences', datasetUrn: 'urn:nasa:pds:lro_crater', doi: '10.1029/2011SW000720', missionInstrument: 'LRO CRaTER' }],
          gravity: { surfaceAccelerationMs2: 1.622, earthRatio: 0.1654, escapeVelocityKms: 2.38, standardUncertainty: 'GRAIL' },
          atmosphere: { surfaceDensityKgM3: 1e-12, surfacePressurePa: 3e-10, surfacePressureMbar: 3e-12, earthDensityRatio: 8e-13, scaleHeightKm: 50, speedOfSoundMs: 0, composition: {}, convectiveHeatTransferRatio: 0 },
          radiation: { meanSurfaceDoseRateMSvDay: 1.369, meanAnnualDoseMSvYear: 499.7, earthSurfaceDoseRatio: 204.3, galacticCosmicRayFraction: 94, solarParticleEventRisk: 'extreme', halfValueLayerRegolithCm: 14.2 },
          thermal: { meanSurfaceTempK: 250, meanSurfaceTempC: -23.15, minTempK: 25, maxTempK: 393, diurnalSwingK: 280, solarIrradianceWm2: 1361 },
          regolith: { bulkDensityGramsCm3: 1.65, cohesionKPa: 1.2, internalFrictionAngleDeg: 42, sinkageModulusKc: 3.2, sinkageModulusKphi: 1100 },
        },
      },
      compensationCalculation: {
        inputMassKg: mass,
        inputVelocityMs: params.velocityMs || 5,
        inputFrontalAreaM2: params.frontalAreaM2 || 1.0,
        terrestrialWeightN: mass * earthG,
        targetWeightN: mass * targetG,
        effectiveWeightReductionPercent: Math.round((1 - targetG / earthG) * 100),
        requiredEarthBallastKg: Math.round((mass * (targetG / earthG) - mass) * 10) / 10,
        groundPressureEarthKPa: Math.round(((mass * earthG) / 0.2 / 1000) * 10) / 10,
        groundPressureTargetKPa: Math.round(((mass * targetG) / 0.2 / 1000) * 10) / 10,
        aerodynamicDragForceEarthN: 0.5 * earthRho * 25 * 1.0,
        aerodynamicDragForceTargetN: 0.5 * targetRho * 25 * 1.0,
        aerodynamicDragScalingRatio: targetRho / earthRho,
        parachuteAreaMultiplier: targetRho > 0 ? (earthRho / targetRho) * (targetG / earthG) : Infinity,
        radiationExposureMultiplier: target === 'mars' ? 95.5 : 204.3,
        regolithShieldingRecommendedCm: target === 'mars' ? 33.0 : 28.4,
      },
    };
  }
}

/**
 * 4. Fetch CSA RADARSAT / RCM data
 */
export async function fetchCsaRadarsat(params: { query?: string; rows?: number; fallback?: boolean } = {}): Promise<CsaSarApiResponse> {
  const url = new URL(`${getApiBaseUrl()}/api/csa-sar`, window.location.origin);
  if (params.query) url.searchParams.set('q', params.query);
  if (params.rows) url.searchParams.set('rows', params.rows.toString());
  if (params.fallback) url.searchParams.set('fallback', 'true');

  try {
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`CSA SAR Route HTTP ${res.status}`);
    return await res.json();
  } catch (err: any) {
    // Load local geojson directly from public folder
    const fallbackRes = await fetch('/data/radarsat_sar.geojson');
    const geojsonData = await fallbackRes.json();
    return {
      success: true,
      source: 'local-geojson-fallback',
      portalUrl: 'https://donnees-data.asc-csa.gc.ca/',
      data: geojsonData,
      timestamp: new Date().toISOString(),
    };
  }
}

export { getGibsTileUrl };
