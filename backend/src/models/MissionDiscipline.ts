import { Schema, model, Document } from 'mongoose';

export interface IMissionDiscipline extends Document {
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

const missionDisciplineSchema = new Schema<IMissionDiscipline>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: String,
    code: String,
    iconName: String,
    description: String,
    analogRequirements: [String],
    feasibleTests: [String],
    unfeasibleFactors: [String],
    recommendedLocations: [String],
    fieldInstrumentation: [String],
    validationMetrics: [String],
  },
  { timestamps: true, versionKey: false },
);

export const MissionDiscipline = model<IMissionDiscipline>('MissionDiscipline', missionDisciplineSchema);
