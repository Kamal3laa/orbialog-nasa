import { PlanetaryTarget, AnalogLocation, MissionApplicationDomain, MethodologyStep } from '../types';
import { PLANETARY_TARGETS } from '../data/planetaryTargets';
import { ANALOG_LOCATIONS } from '../data/analogLocations';
import { MISSION_APPLICATION_DOMAINS } from '../data/missionApplications';
import { METHODOLOGY_STEPS } from '../data/methodologyData';

const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export interface ComparisonDimension {
  key: string;
  label: string;
  targetScore: number;
  analogScore: number;
  similarity: number;
  weight: number;
  status: 'HIGH_FIDELITY' | 'MODERATE_FIDELITY' | 'SIGNIFICANT_DISCREPANCY';
}

export interface ComparisonResult {
  targetId: string;
  analogId: string;
  overallSimilarity: number;
  fidelityClass: 'HIGH_FIDELITY' | 'MODERATE_FIDELITY' | 'SIGNIFICANT_DISCREPANCY';
  dimensions: ComparisonDimension[];
  dominantStrengths: string[];
  operationalRisks: string[];
  _metricNote?: string;
}

export interface TopEarthAnalogMatch {
  location_name: string;
  coordinates: [number, number];
  similarity_score: string;
  matches: string[];
  breakdown: {
    geology_match: string;
    thermal_match: string;
    limits: string;
  };
  suggested_testing: string;
}

export interface AnalogMatchResponse {
  target_space_site: string;
  top_earth_analogs: TopEarthAnalogMatch[];
}

export interface AnalogTargetSummary {
  id: string;
  name: string;
  planet: string;
  designation?: string | null;
}

export interface SandboxQueryResult {
  QUERY_TIMESTAMP_UTC: string;
  QUERY_LATITUDE: number;
  QUERY_LONGITUDE: number;
  DISCIPLINE_ID: string;
  DISCIPLINE_TITLE: string;
  SERVER_TELEMETRY: string;
  INTEGRATION_STATUS: string;
  SAMPLE_RECORD: {
    feasibleTests?: string[];
    fieldInstrumentation?: string[];
    validationMetrics?: string[];
    analogRequirements?: Record<string, string | number>;
    recommendedLocations?: string[];
  };
}

export interface ApiPaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface SitesResponse {
  data: AnalogLocation[];
  meta: ApiPaginationMeta;
  isLive: boolean;
  error?: string;
}

export interface ApiResponse<T> {
  data: T | null;
  isLive: boolean;
  error?: string;
  statusCode?: number;
}

// ── State Management for API Consumer ────────────────────────────────────────
let _isDemoMode = false;
let _isLiveApiConnected = false;

async function executeApiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<{ data: T | null; isLive: boolean; error?: string; statusCode?: number }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      _isLiveApiConnected = false;
      const errorMsg = `HTTP ${res.status}: ${res.statusText || 'Backend Error'}`;
      console.warn(`[ORBiALOG API Consumer] Endpoint ${endpoint} returned ${errorMsg}`);
      return { data: null, isLive: false, error: errorMsg, statusCode: res.status };
    }

    const json = await res.json();
    _isLiveApiConnected = true;
    console.info(`[ORBiALOG API Consumer] Received live data from ${endpoint}`);
    return {
      data: (json.data !== undefined ? json.data : json) as T,
      isLive: true,
      statusCode: res.status,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    _isLiveApiConnected = false;
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[ORBiALOG API Consumer] Network error connecting to ${endpoint}: ${msg}`);
    return { data: null, isLive: false, error: msg };
  }
}

// ── STRICT API CONSUMER SERVICE ──────────────────────────────────────────────
export const orbialogApi = {
  getBaseUrl(): string {
    return BASE_URL;
  },

  isLiveConnected(): boolean {
    return _isLiveApiConnected;
  },

  isDemoModeActive(): boolean {
    return _isDemoMode;
  },

  setDemoMode(enabled: boolean): void {
    _isDemoMode = enabled;
  },

  // 1. Health & Readiness (GET /health & GET /ready)
  async getHealth(): Promise<{ status: string; timestamp?: string; isLive: boolean }> {
    const res = await executeApiRequest<{ status: string; timestamp?: string }>('/health');
    if (res.isLive && res.data?.status === 'ok') {
      return { status: 'ok', timestamp: res.data.timestamp, isLive: true };
    }
    if (_isDemoMode) {
      return { status: 'demo', isLive: false };
    }
    return { status: 'offline', isLive: false };
  },

  async getReady(): Promise<{ status: string; db?: string; isLive: boolean }> {
    const res = await executeApiRequest<{ status: string; db?: string }>('/ready');
    if (res.isLive && res.data?.status === 'ready') {
      return { status: 'ready', db: res.data.db, isLive: true };
    }
    return { status: 'not_ready', isLive: false };
  },

  // 2. Planetary Targets (GET /targets & GET /targets/:id)
  async getTargets(planet?: 'moon' | 'mars'): Promise<ApiResponse<PlanetaryTarget[]>> {
    const query = planet ? `?planet=${planet}` : '';
    const res = await executeApiRequest<PlanetaryTarget[]>(`/targets${query}`);
    if (res.data) {
      return { data: res.data, isLive: true };
    }
    if (_isDemoMode) {
      const fallback = planet ? PLANETARY_TARGETS.filter((t) => t.planet === planet) : PLANETARY_TARGETS;
      return { data: fallback, isLive: false };
    }
    return { data: null, isLive: false, error: res.error };
  },

  async getTargetById(id: string): Promise<ApiResponse<PlanetaryTarget>> {
    const res = await executeApiRequest<PlanetaryTarget>(`/targets/${id}`);
    if (res.data) {
      return { data: res.data, isLive: true };
    }
    if (_isDemoMode) {
      const fallback = PLANETARY_TARGETS.find((t) => t.id === id) || null;
      return { data: fallback, isLive: false };
    }
    return { data: null, isLive: false, error: res.error };
  },

  // 3. Analog Matcher (GET /analogs & GET /analogs/targets)
  async getAnalogMatches(targetId: string, limit = 5): Promise<ApiResponse<AnalogMatchResponse>> {
    const res = await executeApiRequest<AnalogMatchResponse>(
      `/analogs?target=${encodeURIComponent(targetId)}&limit=${limit}`,
    );
    if (res.data) {
      return { data: res.data, isLive: true };
    }
    return { data: null, isLive: false, error: res.error };
  },

  async getAnalogsTargetList(): Promise<ApiResponse<AnalogTargetSummary[]>> {
    const res = await executeApiRequest<AnalogTargetSummary[]>('/analogs/targets');
    if (res.data) {
      return { data: res.data, isLive: true };
    }
    return { data: null, isLive: false, error: res.error };
  },

  // 4. Earth Analog Sites with Server-Side Pagination (GET /sites & GET /sites/:id)
  async getSites(params?: {
    planet?: string;
    category?: string;
    country?: string;
    q?: string;
    minSimilarity?: number;
    sort?: string;
    page?: number;
    limit?: number;
  }): Promise<SitesResponse> {
    const searchParams = new URLSearchParams();
    if (params?.planet && params.planet !== 'all') {
      if (params.planet === 'egypt') {
        searchParams.set('country', 'Egypt');
      } else {
        searchParams.set('planet', params.planet);
      }
    }
    if (params?.category) searchParams.set('category', params.category);
    if (params?.country) searchParams.set('country', params.country);
    if (params?.q) searchParams.set('q', params.q);
    if (params?.minSimilarity) searchParams.set('minSimilarity', String(params.minSimilarity));
    if (params?.sort) searchParams.set('sort', params.sort);
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));

    const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const pageNum = Math.max(1, params?.page || 1);
    const limitNum = Math.min(50, Math.max(1, params?.limit || 10));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const res = await fetch(`${BASE_URL}/sites${qs}`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      _isLiveApiConnected = true;

      const total = json.meta?.total ?? json.data?.length ?? 0;
      const pages = json.meta?.pages ?? (Math.ceil(total / limitNum) || 1);

      return {
        data: json.data || [],
        meta: {
          total,
          page: json.meta?.page ?? pageNum,
          limit: json.meta?.limit ?? limitNum,
          pages,
        },
        isLive: true,
      };
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      _isLiveApiConnected = false;
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[ORBiALOG API Consumer] GET /sites failed (${msg})`);

      if (_isDemoMode) {
        let filtered = ANALOG_LOCATIONS;
        if (params?.planet && params.planet !== 'all') {
          filtered = filtered.filter((l) =>
            params.planet === 'egypt'
              ? l.country?.toLowerCase().includes('egypt')
              : l.primaryTargetAnalog === params.planet,
          );
        }
        if (params?.category) {
          filtered = filtered.filter((l) => l.category === params.category);
        }
        if (params?.q) {
          const qLower = params.q.toLowerCase();
          filtered = filtered.filter(
            (l) =>
              l.name.toLowerCase().includes(qLower) ||
              l.country.toLowerCase().includes(qLower) ||
              l.summary.toLowerCase().includes(qLower),
          );
        }
        if (params?.minSimilarity) {
          filtered = filtered.filter((l) => (l.overallSimilarity ?? 0) >= params.minSimilarity!);
        }

        const total = filtered.length;
        const pages = Math.ceil(total / limitNum) || 1;
        const skip = (pageNum - 1) * limitNum;
        const paginated = filtered.slice(skip, skip + limitNum);

        return {
          data: paginated,
          meta: { total, page: pageNum, limit: limitNum, pages },
          isLive: false,
        };
      }

      return {
        data: [],
        meta: { total: 0, page: pageNum, limit: limitNum, pages: 0 },
        isLive: false,
        error: msg,
      };
    }
  },

  async getSiteById(id: string): Promise<ApiResponse<AnalogLocation>> {
    const res = await executeApiRequest<AnalogLocation>(`/sites/${id}`);
    if (res.data) {
      return { data: res.data, isLive: true };
    }
    if (_isDemoMode) {
      const fallback = ANALOG_LOCATIONS.find((a) => a.id === id) || null;
      return { data: fallback, isLive: false };
    }
    return { data: null, isLive: false, error: res.error };
  },

  // 5. Comparison Engine (GET /comparison?target=:id&analog=:id)
  async getComparison(targetId: string, analogId: string): Promise<ApiResponse<ComparisonResult>> {
    const res = await executeApiRequest<ComparisonResult>(
      `/comparison?target=${encodeURIComponent(targetId)}&analog=${encodeURIComponent(analogId)}`,
    );
    if (res.data) {
      return { data: res.data, isLive: true };
    }
    return { data: null, isLive: false, error: res.error };
  },

  // 6. Mission Disciplines (GET /disciplines & GET /disciplines/:id)
  async getDisciplines(): Promise<ApiResponse<MissionApplicationDomain[]>> {
    const res = await executeApiRequest<MissionApplicationDomain[]>('/disciplines');
    if (res.data) {
      return { data: res.data, isLive: true };
    }
    if (_isDemoMode) {
      return { data: MISSION_APPLICATION_DOMAINS, isLive: false };
    }
    return { data: null, isLive: false, error: res.error };
  },

  async getDisciplineById(id: string): Promise<ApiResponse<MissionApplicationDomain>> {
    const res = await executeApiRequest<MissionApplicationDomain>(`/disciplines/${id}`);
    if (res.data) {
      return { data: res.data, isLive: true };
    }
    if (_isDemoMode) {
      const fallback = MISSION_APPLICATION_DOMAINS.find((d) => d.id === id) || null;
      return { data: fallback, isLive: false };
    }
    return { data: null, isLive: false, error: res.error };
  },

  // 7. Methodology (GET /methodology)
  async getMethodology(): Promise<ApiResponse<MethodologyStep[]>> {
    const res = await executeApiRequest<MethodologyStep[]>('/methodology');
    if (res.data) {
      return { data: res.data, isLive: true };
    }
    if (_isDemoMode) {
      return { data: METHODOLOGY_STEPS, isLive: false };
    }
    return { data: null, isLive: false, error: res.error };
  },

  // 8. Telemetry Sandbox Query (POST /sandbox/query)
  async querySandbox(payload: {
    disciplineId: string;
    lat: number;
    lng: number;
  }): Promise<ApiResponse<SandboxQueryResult>> {
    const res = await executeApiRequest<SandboxQueryResult>('/sandbox/query', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res;
  },
};
