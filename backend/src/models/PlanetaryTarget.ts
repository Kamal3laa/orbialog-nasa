import { Schema, model, Document } from 'mongoose';

// ── Planetary Target ─────────────────────────────────────────────────────────
export interface IPlanetaryTarget extends Document {
  id: string;        // kept as the original string id from frontend data
  planet: 'moon' | 'mars';
  name: string;
  designation: string;
  coordinates: string;
  latitude: number;
  longitude: number;
  elevation: string;
  temperatureRange: { min: number; max: number; unit: string };
  illumination: string;
  pressure: string;
  gravity: string;
  surfaceType: string;
  geologicalContext: string;
  primaryFeatures: string[];
  keyObjectives: string[];
  recommendedAnalogs: string[];  // analog location ids
  primaryDatasets: {
    name: string;
    mission: string;
    instrument: string;
    resolution: string;
    linkTitle: string;
  }[];
  imagery: { overview: string; elevationMap: string; spectralOverlay: string };
  metrics: {
    morphologyScore: number;
    roughnessIndex: number;
    slopeVariance: number;
    thermalInertia: number;
    mineralMatchIndex: number;
    volatilePotential: number;
  };
}

const planetaryTargetSchema = new Schema<IPlanetaryTarget>(
  {
    id: { type: String, required: true, unique: true },
    planet: { type: String, enum: ['moon', 'mars'], required: true },
    name: { type: String, required: true },
    designation: { type: String, required: true },
    coordinates: String,
    latitude: Number,
    longitude: Number,
    elevation: String,
    temperatureRange: {
      min: Number,
      max: Number,
      unit: String,
    },
    illumination: String,
    pressure: String,
    gravity: String,
    surfaceType: String,
    geologicalContext: String,
    primaryFeatures: [String],
    keyObjectives: [String],
    recommendedAnalogs: [String],
    primaryDatasets: [
      {
        name: String,
        mission: String,
        instrument: String,
        resolution: String,
        linkTitle: String,
        _id: false,
      },
    ],
    imagery: {
      overview: String,
      elevationMap: String,
      spectralOverlay: String,
    },
    metrics: {
      morphologyScore: Number,
      roughnessIndex: Number,
      slopeVariance: Number,
      thermalInertia: Number,
      mineralMatchIndex: Number,
      volatilePotential: Number,
    },
  },
  { timestamps: true, versionKey: false },
);

// Index for fast filtering by planet
planetaryTargetSchema.index({ planet: 1 });

export const PlanetaryTarget = model<IPlanetaryTarget>('PlanetaryTarget', planetaryTargetSchema);
