import { Schema, model, Document } from 'mongoose';

export interface IAnalogMatch extends Document {
  targetId: string;
  analogId: string;
  locationName: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  similarity: number;
  mahalanobisD2: number;
  worstFeature: string;
  breakdown: {
    geologyMatch: string;
    thermalMatch: string;
    limits: string;
  };
  matches: string[];
  suggestedTesting: string;
  source: 'computed' | 'curated';
  provenance: {
    dataset: string;
    version: string;
    computedAt: Date;
  };
}

const analogMatchSchema = new Schema<IAnalogMatch>(
  {
    targetId: { type: String, required: true, index: true },
    analogId: { type: String, required: true },
    locationName: { type: String, required: true },
    country: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    similarity: { type: Number, required: true },
    mahalanobisD2: { type: Number, required: true },
    worstFeature: { type: String, required: true },
    breakdown: {
      geologyMatch: { type: String, required: true },
      thermalMatch: { type: String, required: true },
      limits: { type: String, required: true },
    },
    matches: [String],
    suggestedTesting: { type: String, required: true },
    source: {
      type: String,
      enum: ['computed', 'curated'],
      default: 'computed',
    },
    provenance: {
      dataset: { type: String, required: true },
      version: { type: String, required: true },
      computedAt: { type: Date, default: Date.now },
    },
  },
  { timestamps: true, versionKey: false },
);

// Precomputed match queries index
analogMatchSchema.index({ targetId: 1, similarity: -1 });
analogMatchSchema.index({ targetId: 1, analogId: 1 }, { unique: true });

export const AnalogMatch = model<IAnalogMatch>('AnalogMatch', analogMatchSchema);
