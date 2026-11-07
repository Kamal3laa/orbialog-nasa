export type TargetPlanet = 'Earth' | 'Moon' | 'Mars';

export type AnalogCategory =
  | 'geological'
  | 'extreme-temp'
  | 'volcanic'
  | 'polar-ice'
  | 'arid-desert'
  | 'subsurface-cave'
  | 'dust-erosion';

export interface PlanetaryTarget {
  id: string;
  name: string;
  planetId: 'Moon' | 'Mars';
  coordinates: string;
  elevationM: number;
  geologicalType: string;
  missionRelevance: string;
  surfaceFeatures: string[];
  analogRequirements: string[];
  keyMinerals: string[];
  solarIllumination: string;
  temperatureRange: [number, number]; // [min, max] Celsius
  slopeAvgDeg: number;
  rockAbundancePercent: number;
  waterVolatilesStatus: string;
  matchedTerrestrialAnalogs: string[]; // IDs of analog sites
}

export interface PlanetaryBody {
  id: TargetPlanet;
  name: string;
  designation: string;
  radiusKm: number;
  gravityMs2: number;
  surfacePressureKPa: number;
  tempRangeC: [number, number];
  solarIrradianceWm2: number;
  radiationDoseMSvYr: number;
  atmosphereComposition: { element: string; percentage: number }[];
  analogFidelityNotes: string;
  primaryTargets: PlanetaryTarget[];
  orbitalPeriodDays: number;
  distanceFromEarthKm: string;
}

export interface DatasetSource {
  agency: 'NASA' | 'ESA' | 'USGS' | 'JAXA' | 'EGY-SPACE';
  mission: string;
  sensor: string;
  resolution: string;
  accessType: 'PUBLIC_ARCHIVE' | 'PDS_REST_API' | 'WORLDVIEW_WMTS' | 'SYNTHETIC_BENCHMARK';
  pdsDatasetId: string;
}

export interface InSituExperiment {
  title: string;
  objective: string;
  instrumentType: string;
  trlLevel: number; // Technology Readiness Level 1-9
  primaryRelevance: 'ROVER' | 'ASTRONAUT_EVA' | 'ISRU' | 'SAMPLE_CACHE' | 'DRILL_CORING';
}

export interface EnvironmentalMetrics {
  terrainRoughness: number;     // 0 - 100
  slopeVariance: number;        // 0 - 100
  thermalExtreme: number;       // 0 - 100
  aeolianDynamics: number;      // 0 - 100
  mineralMatch: number;         // 0 - 100
  volatilePresence: number;     // 0 - 100
  logisticsAccess: number;      // 0 - 100 (100 = easy base camp access)
  opticalDustFactor: number;    // 0 - 100
  geomechanicalStrength: number;// 0 - 100
}

export interface AnalogSite {
  id: string;
  name: string;
  tagline: string;
  region: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  elevationM: number;
  categories: AnalogCategory[];
  targetPlanets: ('Moon' | 'Mars')[];
  fidelityScore: number; // 0 - 100
  isEgyptianCandidate: boolean;
  status: 'VALIDATED_ANALOG' | 'CANDIDATE_UNDER_STUDY' | 'HISTORIC_TRAINING_GROUND';
  shortSummary: string;
  geologicalDescription: string;
  planetarySimilarity: string;
  criticalDiscrepancies: string[];
  testingApplications: string[];
  metrics: EnvironmentalMetrics;
  datasetSources: DatasetSource[];
  sampleExperiments: InSituExperiment[];
  matchedPlanetaryTargets: string[]; // PlanetaryTarget IDs
  heroImageGradient: string;
  fieldPhotosCount: number;
  recommendedSeason: string;
}

export interface ComparisonDimension {
  key: keyof EnvironmentalMetrics;
  label: string;
  description: string;
  planetaryTargetScore: number;
  analogSiteScore: number;
  similarityPercentage: number;
  fidelityStatus: 'HIGH_FIDELITY' | 'MODERATE_FIDELITY' | 'SIGNIFICANT_DISCREPANCY';
  scienceRationale: string;
}

export interface TestingDiscipline {
  id: string;
  title: string;
  code: string;
  description: string;
  earthReplicableScope: string[];
  planetaryLimitations: string[];
  suggestedSites: string[]; // Site IDs
  keyInstruments: string[];
  primaryRiskFactors: string[];
}

