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
}

export interface ApiFetchResult<T> {
  data: T;
  isLive: boolean;
  status: 'live' | 'fallback';
  statusCode?: number;
  error?: string;
}

// ── Connection State Tracking ───────────────────────────────────────────────
let _isLiveApiConnected = false;

// ── Generic Safe Fetch with 6s Timeout and Error Handling ─────────────────────
async function safeFetchWithMeta<T>(
  endpoint: string,
  fallback: T,
  options?: RequestInit,
): Promise<ApiFetchResult<T>> {
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
      console.warn(`[ORBiALOG API] Endpoint ${endpoint} returned status ${res.status}. Falling back to calibrated local data.`);
      return {
        data: fallback,
        isLive: false,
        status: 'fallback',
        statusCode: res.status,
        error: `Server responded with ${res.status}`,
      };
    }

    const json = await res.json();
    _isLiveApiConnected = true;
    console.info(`[ORBiALOG API] Live response received from ${endpoint}`);
    return {
      data: (json.data ?? json) as T,
      isLive: true,
      status: 'live',
      statusCode: res.status,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    _isLiveApiConnected = false;
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[ORBiALOG API] Network error calling ${endpoint} (${msg}). Operating in FALLBACK mode.`);
    return {
      data: fallback,
      isLive: false,
      status: 'fallback',
      error: msg,
    };
  }
}

async function safeFetch<T>(endpoint: string, fallback: T, options?: RequestInit): Promise<T> {
  const res = await safeFetchWithMeta<T>(endpoint, fallback, options);
  return res.data;
}

// ── Unified API Service ─────────────────────────────────────────────────────
export const orbialogApi = {
  isLiveConnected(): boolean {
    return _isLiveApiConnected;
  },

  // 1. Health & Status (/health & /ready)
  async getHealth(): Promise<{ status: string; timestamp?: string; isLive: boolean }> {
    const res = await safeFetchWithMeta<{ status: string; timestamp?: string }>('/health', { status: 'offline' });
    return {
      status: res.isLive && res.data.status === 'ok' ? 'ok' : 'offline',
      timestamp: res.data.timestamp,
      isLive: res.isLive,
    };
  },

  async getReady(): Promise<{ status: string; db?: string; isLive: boolean }> {
    const res = await safeFetchWithMeta<{ status: string; db?: string }>('/ready', { status: 'offline' });
    return {
      status: res.isLive && res.data.status === 'ready' ? 'ready' : 'offline',
      db: res.data.db,
      isLive: res.isLive,
    };
  },

  // 2. S1 / S2: Planetary Targets (/targets & /targets/:id)
  async getTargets(planet?: 'moon' | 'mars'): Promise<PlanetaryTarget[]> {
    const query = planet ? `?planet=${planet}` : '';
    const filteredFallback = planet
      ? PLANETARY_TARGETS.filter((t) => t.planet === planet)
      : PLANETARY_TARGETS;
    return safeFetch<PlanetaryTarget[]>(`/targets${query}`, filteredFallback);
  },

  async getTargetById(id: string): Promise<PlanetaryTarget | undefined> {
    const fallback = PLANETARY_TARGETS.find((t) => t.id === id);
    return safeFetch<PlanetaryTarget | undefined>(`/targets/${id}`, fallback);
  },

  // 3. S1 / S2 / S3: Analog Matcher (/analogs & /analogs/targets)
  async getAnalogMatches(targetId: string, limit = 5): Promise<AnalogMatchResponse | null> {
    return safeFetch<AnalogMatchResponse | null>(
      `/analogs?target=${encodeURIComponent(targetId)}&limit=${limit}`,
      null,
    );
  },

  async getAnalogsTargetList(): Promise<AnalogTargetSummary[]> {
    const fallback: AnalogTargetSummary[] = PLANETARY_TARGETS.map((t) => ({
      id: t.id,
      name: t.name,
      planet: t.planet,
      designation: t.designation || null,
    }));
    return safeFetch<AnalogTargetSummary[]>('/analogs/targets', fallback);
  },

  // 4. S3 / S5: Earth Analog Sites with Server-Side Pagination (/sites & /sites/:id)
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
    if (params?.planet && params.planet !== 'all') searchParams.set('planet', params.planet);
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

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
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
      _isLiveApiConnected = false;
      console.warn(`[ORBiALOG API] GET /sites unavailable (${err instanceof Error ? err.message : 'offline'}). Using fallback dataset.`);

      // Compute matching offline fallback with consistent filtering and pagination
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
      if (params?.country) {
        filtered = filtered.filter((l) => l.country?.toLowerCase() === params.country?.toLowerCase());
      }
      if (params?.q) {
        const qLower = params.q.toLowerCase();
        filtered = filtered.filter(
          (l) =>
            l.name.toLowerCase().includes(qLower) ||
            l.country.toLowerCase().includes(qLower) ||
            l.summary.toLowerCase().includes(qLower) ||
            l.geology?.rockType?.toLowerCase().includes(qLower),
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
        meta: {
          total,
          page: pageNum,
          limit: limitNum,
          pages,
        },
        isLive: false,
      };
    }
  },

  async getSiteById(id: string): Promise<AnalogLocation | undefined> {
    const fallback = ANALOG_LOCATIONS.find((a) => a.id === id);
    return safeFetch<AnalogLocation | undefined>(`/sites/${id}`, fallback);
  },

  // 5. S4: Comparison Engine (/comparison?target=:id&analog=:id)
  async getComparison(targetId: string, analogId: string): Promise<ComparisonResult | null> {
    return safeFetch<ComparisonResult | null>(
      `/comparison?target=${encodeURIComponent(targetId)}&analog=${encodeURIComponent(analogId)}`,
      null,
    );
  },

  // 6. S6: Mission Disciplines (/disciplines & /disciplines/:id)
  async getDisciplines(): Promise<MissionApplicationDomain[]> {
    return safeFetch<MissionApplicationDomain[]>('/disciplines', MISSION_APPLICATION_DOMAINS);
  },

  async getDisciplineById(id: string): Promise<MissionApplicationDomain | undefined> {
    const fallback = MISSION_APPLICATION_DOMAINS.find((d) => d.id === id);
    return safeFetch<MissionApplicationDomain | undefined>(`/disciplines/${id}`, fallback);
  },

  // 7. S7: Methodology (/methodology)
  async getMethodology(): Promise<MethodologyStep[]> {
    return safeFetch<MethodologyStep[]>('/methodology', METHODOLOGY_STEPS);
  },

  // 8. S7: Telemetry Sandbox Query (POST /sandbox/query)
  async querySandbox(payload: {
    disciplineId: string;
    lat: number;
    lng: number;
  }): Promise<SandboxQueryResult | null> {
    return safeFetch<SandboxQueryResult | null>(
      '/sandbox/query',
      null,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    );
  },
};
