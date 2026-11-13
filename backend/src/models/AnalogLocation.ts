import { Schema, model, Document } from 'mongoose';

// Metric keys from the frontend AnalogLocation type
export interface IAnalogMetrics {
  geologicalSimilarity: number;
  terrainRoughness: number;
  slopeDistribution: number;
  thermalDeltaMatch: number;
  granulometryMatch: number;
  spectralCorrespondence: number;
  volatilesAnalogy: number;
}

export interface IAnalogLocation extends Document {
  id: string;
  name: string;
  region: string;
  country: string;
  flagCode: string;
  coordinates: { lat: number; lng: number; display: string };
  // GeoJSON point for 2dsphere queries — stored internally, not exposed directly
  location: { type: 'Point'; coordinates: [number, number] };
  elevationMeters: number;
  category: string;
  primaryTargetAnalog: 'moon' | 'mars';
  matchedTargets: string[];
  overallSimilarity: number;
  confidenceScore: number;
  climateType: string;
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
    type: string;
  }[];
  metrics: IAnalogMetrics;
  imagery: { hero: string; satellite: string; terrain: string };
  featuredEgypt?: boolean;
}

const analogLocationSchema = new Schema<IAnalogLocation>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    region: String,
    country: String,
    flagCode: String,
    coordinates: {
      lat: Number,
      lng: Number,
      display: String,
    },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    elevationMeters: Number,
    category: {
      type: String,
      enum: ['polar-desert', 'hyper-arid', 'volcanic-basalt', 'impact-crater', 'evaporite-sabkha', 'sub-sea-level'],
    },
    primaryTargetAnalog: { type: String, enum: ['moon', 'mars'] },
    matchedTargets: [String],
    overallSimilarity: { type: Number, min: 0, max: 100 },
    confidenceScore: { type: Number, min: 0, max: 100 },
    climateType: String,
    summary: String,
    geology: {
      rockType: String,
      mineralogy: [String],
      regolithAnalogy: String,
      aeolianFeatures: String,
      stratigraphy: String,
    },
    environment: {
      meanAnnualTemp: String,
      diurnalRange: String,
      annualPrecipitation: String,
      uvIrradiance: String,
      aridityIndex: String,
      dustStormFrequency: String,
    },
    scientificSignificance: [String],
    similaritiesToTarget: [String],
    limitations: [String],
    fieldTestingCapabilities: [
      {
        name: String,
        suitability: { type: String, enum: ['exceptional', 'high', 'moderate', 'low'] },
        notes: String,
        _id: false,
      },
    ],
    notableMissionsOrExpeditions: [
      {
        campaign: String,
        organization: String,
        year: String,
        scope: String,
        _id: false,
      },
    ],
    dataSources: [
      {
        title: String,
        agency: String,
        datasetId: String,
        type: String,
        _id: false,
      },
    ],
    metrics: {
      geologicalSimilarity: { type: Number, min: 0, max: 100 },
      terrainRoughness: { type: Number, min: 0, max: 100 },
      slopeDistribution: { type: Number, min: 0, max: 100 },
      thermalDeltaMatch: { type: Number, min: 0, max: 100 },
      granulometryMatch: { type: Number, min: 0, max: 100 },
      spectralCorrespondence: { type: Number, min: 0, max: 100 },
      volatilesAnalogy: { type: Number, min: 0, max: 100 },
    },
    imagery: {
      hero: String,
      satellite: String,
      terrain: String,
    },
    featuredEgypt: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

// 2dsphere index for geo queries; text index for search; compound indexes for filters
analogLocationSchema.index({ location: '2dsphere' });
analogLocationSchema.index({
  name: 'text',
  region: 'text',
  country: 'text',
  summary: 'text',
});
analogLocationSchema.index({ category: 1 });
analogLocationSchema.index({ primaryTargetAnalog: 1 });
analogLocationSchema.index({ featuredEgypt: 1 });
analogLocationSchema.index({ overallSimilarity: -1 });

export const AnalogLocation = model<IAnalogLocation>('AnalogLocation', analogLocationSchema);
