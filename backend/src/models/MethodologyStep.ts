import { Schema, model, Document } from 'mongoose';

export interface IMethodologyStep extends Document {
  stepNumber: number;
  stageName: string;
  title: string;
  formula?: string;
  formulaDesc?: string;
  description: string;
  inputs: string[];
  outputs: string[];
  dataSources: string[];
  standardConfidenceInterval: string;
}

const methodologyStepSchema = new Schema<IMethodologyStep>(
  {
    stepNumber: { type: Number, required: true, unique: true },
    stageName: String,
    title: { type: String, required: true },
    formula: String,
    formulaDesc: String,
    description: String,
    inputs: [String],
    outputs: [String],
    dataSources: [String],
    standardConfidenceInterval: String,
  },
  { timestamps: true, versionKey: false },
);

export const MethodologyStep = model<IMethodologyStep>('MethodologyStep', methodologyStepSchema);
