/**
 * Comparison service — Phase 4/5
 *
 * Pure function: computes fidelity similarity between a planetary target
 * and a terrestrial analog site using the same algorithm as the frontend's
 * calculateFidelityComparison() / overallSimilarity logic.
 *
 * Scoring rules (kept identical to frontend):
 *   similarity per dimension = max(0, 100 - |targetScore - analogScore|)
 *   Moon aeolianDynamics gets weight 0.3 (all others default 1.0)
 *   overallSimilarity = weighted average of all dimension similarities
 */

export interface DimensionResult {
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
  dimensions: DimensionResult[];
  dominantStrengths: string[];
  operationalRisks: string[];
}

/** Maps target metric keys → analog metric keys → human label */
const DIMENSION_MAP: {
  targetKey: string;
  analogKey: string;
  label: string;
}[] = [
  { targetKey: 'morphologyScore',    analogKey: 'geologicalSimilarity',  label: 'Geological Morphology' },
  { targetKey: 'roughnessIndex',     analogKey: 'terrainRoughness',      label: 'Terrain Roughness' },
  { targetKey: 'slopeVariance',      analogKey: 'slopeDistribution',     label: 'Slope Distribution' },
  { targetKey: 'thermalInertia',     analogKey: 'thermalDeltaMatch',     label: 'Thermal Delta Match' },
  { targetKey: 'mineralMatchIndex',  analogKey: 'granulometryMatch',     label: 'Granulometry Match' },
  { targetKey: 'mineralMatchIndex',  analogKey: 'spectralCorrespondence',label: 'Spectral Correspondence' },
  { targetKey: 'volatilePotential',  analogKey: 'volatilesAnalogy',      label: 'Volatiles Analogy' },
  // aeolianDynamics — no direct target key; we use roughnessIndex as proxy
  { targetKey: 'roughnessIndex',     analogKey: 'terrainRoughness',      label: 'Aeolian Dynamics' },
];

function statusFor(sim: number): DimensionResult['status'] {
  if (sim >= 80) return 'HIGH_FIDELITY';
  if (sim >= 55) return 'MODERATE_FIDELITY';
  return 'SIGNIFICANT_DISCREPANCY';
}

export function calculateComparison(
  targetMetrics: Record<string, number>,
  analogMetrics: Record<string, number>,
  planet: string,
  targetId: string,
  analogId: string,
): ComparisonResult {
  const isAeolianRow = (label: string) => label === 'Aeolian Dynamics';
  const isMoon = planet === 'moon';

  const dimensions: DimensionResult[] = DIMENSION_MAP.map((dim) => {
    const tScore = targetMetrics[dim.targetKey] ?? 50;
    const aScore = analogMetrics[dim.analogKey] ?? 50;
    const similarity = Math.max(0, 100 - Math.abs(tScore - aScore));
    const weight = isMoon && isAeolianRow(dim.label) ? 0.3 : 1.0;

    return {
      key: dim.analogKey,
      label: dim.label,
      targetScore: tScore,
      analogScore: aScore,
      similarity,
      weight,
      status: statusFor(similarity),
    };
  });

  // Weighted average
  const totalWeight = dimensions.reduce((s, d) => s + d.weight, 0);
  const weightedSum = dimensions.reduce((s, d) => s + d.similarity * d.weight, 0);
  const overallSimilarity = Math.round((weightedSum / totalWeight) * 10) / 10;

  const dominantStrengths = dimensions
    .filter((d) => d.status === 'HIGH_FIDELITY')
    .map((d) => d.label);

  const operationalRisks = dimensions
    .filter((d) => d.status === 'SIGNIFICANT_DISCREPANCY')
    .map((d) => d.label);

  return {
    targetId,
    analogId,
    overallSimilarity,
    fidelityClass: statusFor(overallSimilarity),
    dimensions,
    dominantStrengths,
    operationalRisks,
  };
}
