// ORBiALOG Scientific Type Definitions
// NASA Space Apps Challenge 2026

export type PlanetId = 'moon' | 'mars';

export interface PlanetaryTarget {
  id: string;
  planet: PlanetId;
  name: string;
  designation: string;
  coordinates: string;
  latitude: number;
  longitude: number;
  elevation: string;
  temperatureRange: {
    min: number; // Kelvin or Celsius
    max: number;
    unit: 'K' | '°C';
  };
  illumination: string;
  pressure: string;
  gravity: string;
  surfaceType: string;
  geologicalContext: string;
  primaryFeatures: string[];
  keyObjectives: string[];
  recommendedAnalogs: string[];
  primaryDatasets: {
    name: string;
    mission: string;
    instrument: string;
    resolution: string;
    linkTitle: string;
  }[];
  imagery: {
    overview: string;
    elevationMap: string;
    spectralOverlay: string;
  };
  metrics: {
    morphologyScore: number;
    roughnessIndex: number;
    slopeVariance: number;
    thermalInertia: number;
    mineralMatchIndex: number;
    volatilePotential: number;
  };
}

export type AnalogCategory = 
  | 'polar-desert' 
  | 'hyper-arid' 
  | 'volcanic-basalt' 
  | 'impact-crater' 
  | 'evaporite-sabkha' 
  | 'sub-sea-level';

export interface AnalogLocation {
  id: string;
  name: string;
  region: string;
  country: string;
  flagCode: string;
  coordinates: {
    lat: number;
    lng: number;
    display: string;
  };
  elevationMeters: number;
  category: AnalogCategory;
  primaryTargetAnalog: PlanetId;
  matchedTargets: string[]; // target ids
  overallSimilarity: number; // 0-100%
  confidenceScore: number; // 0-100%
  climateType: string; // Köppen classification
  summary: string;
  geology: {
    rockType: string;
    mineralogy: string[];
    regolithAnalogy: string;
    aeolianFeatures: string;
    stratigraphy: string;
  };
  environment: {
    meanAnnualTemp: string;
    diurnalRange: string;
    annualPrecipitation: string;
    uvIrradiance: string;
    aridityIndex: string;
    dustStormFrequency: string;
  };
  scientificSignificance: string[];
  similaritiesToTarget: string[];
  limitations: string[];
  fieldTestingCapabilities: {
    name: string;
    suitability: 'exceptional' | 'high' | 'moderate' | 'low';
    notes: string;
  }[];
  notableMissionsOrExpeditions: {
    campaign: string;
    organization: string;
    year: string;
    scope: string;
  }[];
  dataSources: {
    title: string;
    agency: string;
    datasetId: string;
    type: 'In-situ' | 'Orbital Multispectral' | 'DEM Radar' | 'Peer Reviewed Paper';
  }[];
  metrics: {
    geologicalSimilarity: number;
    terrainRoughness: number;
    slopeDistribution: number;
    thermalDeltaMatch: number;
    granulometryMatch: number;
    spectralCorrespondence: number;
    volatilesAnalogy: number;
  };
  imagery: {
    hero: string;
    satellite: string;
    terrain: string;
  };
  continent?: 'North America' | 'South America' | 'Polar / Arctic' | 'Africa' | 'Europe' | 'Oceania' | 'Asia';
  featuredEgypt?: boolean;
}

export interface FilterState {
  searchQuery: string;
  planetFilter: 'all' | 'moon' | 'mars';
  categories: AnalogCategory[];
  minSimilarity: number;
  elevationRange: [number, number]; // [min, max] in meters
  regionFilter?: string;
  onlyHighFidelity?: boolean;
  sortBy: 'similarity' | 'elevation' | 'confidence' | 'name';
}

export interface MissionApplicationDomain {
  id: string;
  title: string;
  subtitle: string;
  code: string;
  iconName: string;
  description: string;
  analogRequirements: string[];
  feasibleTests: string[];
  unfeasibleFactors: string[];
  recommendedLocations: string[];
  fieldInstrumentation: string[];
  validationMetrics: string[];
}

export interface MethodologyStep {
  stepNumber: number;
  title: string;
  stageName: string;
  formula?: string;
  formulaDesc?: string;
  description: string;
  inputs: string[];
  outputs: string[];
  dataSources: string[];
  standardConfidenceInterval: string;
}

export type ActiveScreen = 
  | 'landing' 
  | 'targets' 
  | 'discovery' 
  | 'comparison' 
  | 'profile' 
  | 'applications' 
  | 'methodology';

