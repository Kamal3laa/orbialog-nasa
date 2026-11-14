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

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// ── Generic Safe Fetch with 5s Timeout and Error Handling ─────────────────────
async function safeFetch<T>(endpoint: string, fallback: T, options?: RequestInit): Promise<T> {
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
      console.warn(`[ORBiALOG API] Request to ${endpoint} returned status ${res.status}. Using fallback dataset.`);
      return fallback;
    }

    const json = await res.json();
    return (json.data ?? json) as T;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    // Graceful offline fallback: if server is unreachable, use local high-precision telemetry
    return fallback;
  }
}

// ── Unified API Service ─────────────────────────────────────────────────────
export const orbialogApi = {
  // 1. Health & Status (/health & /ready)
  async getHealth(): Promise<{ status: string; timestamp?: string }> {
    return safeFetch('/health', { status: 'offline' });
  },

  async getReady(): Promise<{ status: string; db?: string }> {
    return safeFetch('/ready', { status: 'offline' });
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

  // 4. S3 / S5: Earth Analog Sites (/sites & /sites/:id)
  async getSites(params?: {
    planet?: string;
    category?: string;
    country?: string;
    q?: string;
    minSimilarity?: number;
    sort?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: AnalogLocation[]; meta?: { total: number } }> {
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
    try {
      const res = await fetch(`${BASE_URL}/sites${qs}`);
      if (!res.ok) throw new Error('API offline');
      const json = await res.json();
      return { data: json.data || ANALOG_LOCATIONS, meta: json.meta };
    } catch {
      return { data: ANALOG_LOCATIONS, meta: { total: ANALOG_LOCATIONS.length } };
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
