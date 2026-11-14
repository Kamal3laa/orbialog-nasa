/**
 * Comparison service — Phase 4/5
 *
 * Computes fidelity similarity between a planetary target and a terrestrial
 * analog site using COSINE SIMILARITY on L2-normalised feature vectors.
 *
 * Why cosine similarity instead of `100 - |a - b|`:
 *   - `100 - |a - b|` has no statistical meaning: a 20-point gap on "roughness"
 *     is treated the same as a 20-point gap on "volatiles", regardless of
 *     whether those numbers are on the same scale or correlated.
 *   - Cosine similarity measures the ANGLE between two vectors in feature space.
 *     It is insensitive to magnitude differences and focuses on the pattern
 *     across all dimensions simultaneously.
 *   - Both vectors are L2-normalised first so each dimension contributes
 *     proportionally, then per-axis weights can be applied to emphasise
 *     mission-critical features (e.g. down-weight aeolian dynamics for Moon).
 *   - Score = 100 × (cosine_similarity + 1) / 2  → maps [-1, 1] into [0, 100].
 *
 * Note: Until real raster-computed metrics replace the seed data, all scores
 * derived from this function carry source: "curated" (hand-typed inputs).
 * They will be replaced by source: "computed" values after the Earth Engine
 * pipeline is integrated (see orbialog-real-data-plan.md).
 */

export interface DimensionResult {
  key: string;
  label: string;
  targetScore: number;
  analogScore: number;
  similarity: number;    // 0–100, cosine-derived per dimension pair
  weight: number;
  status: 'HIGH_FIDELITY' | 'MODERATE_FIDELITY' | 'SIGNIFICANT_DISCREPANCY';
}

export interface ComparisonResult {
  targetId: string;
  analogId: string;
  overallSimilarity: number;        // 0–100, cosine similarity of full weighted vectors
  fidelityClass: 'HIGH_FIDELITY' | 'MODERATE_FIDELITY' | 'SIGNIFICANT_DISCREPANCY';
  dimensions: DimensionResult[];
  dominantStrengths: string[];
  operationalRisks: string[];
  _metricNote: string;              // explains the scoring method to API consumers
}

/** Maps target metric keys → analog metric keys → human label */
const DIMENSION_MAP: {
  targetKey: string;
  analogKey: string;
  label: string;
}[] = [
  { targetKey: 'morphologyScore',    analogKey: 'geologicalSimilarity',   label: 'Geological Morphology' },
  { targetKey: 'roughnessIndex',     analogKey: 'terrainRoughness',       label: 'Terrain Roughness' },
  { targetKey: 'slopeVariance',      analogKey: 'slopeDistribution',      label: 'Slope Distribution' },
  { targetKey: 'thermalInertia',     analogKey: 'thermalDeltaMatch',      label: 'Thermal Delta Match' },
  { targetKey: 'mineralMatchIndex',  analogKey: 'granulometryMatch',      label: 'Granulometry Match' },
  { targetKey: 'mineralMatchIndex',  analogKey: 'spectralCorrespondence', label: 'Spectral Correspondence' },
  { targetKey: 'volatilePotential',  analogKey: 'volatilesAnalogy',       label: 'Volatiles Analogy' },
  { targetKey: 'roughnessIndex',     analogKey: 'terrainRoughness',       label: 'Aeolian Dynamics' },
];

function statusFor(sim: number): DimensionResult['status'] {
  if (sim >= 80) return 'HIGH_FIDELITY';
  if (sim >= 55) return 'MODERATE_FIDELITY';
  return 'SIGNIFICANT_DISCREPANCY';
}

/** L2 norm of a numeric array. Returns 1 if zero to avoid division by zero. */
function l2norm(v: number[]): number {
  const n = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
  return n === 0 ? 1 : n;
}

/**
 * Cosine similarity between two vectors (already same-length, pre-weighted).
 * Returns a value in [-1, 1].
 */
function cosine(a: number[], b: number[]): number {
  const dot = a.reduce((s, ai, i) => s + ai * (b[i] ?? 0), 0);
  return dot / (l2norm(a) * l2norm(b));
}

/** Maps cosine similarity ∈ [-1, 1] → [0, 100] */
function cosineToPercent(c: number): number {
  return Math.round(((c + 1) / 2) * 1000) / 10; // 1 d.p.
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

  // ── Build weighted feature vectors ───────────────────────────────────────
  const targetVec: number[] = [];
  const analogVec: number[] = [];
  const weights: number[] = [];

  const dimensions: DimensionResult[] = DIMENSION_MAP.map((dim) => {
    const tScore = targetMetrics[dim.targetKey] ?? 50;
    const aScore = analogMetrics[dim.analogKey] ?? 50;
    const weight = isMoon && isAeolianRow(dim.label) ? 0.3 : 1.0;

    targetVec.push(tScore * weight);
    analogVec.push(aScore * weight);
    weights.push(weight);

    // Per-dimension cosine: treat the two scalars as 1-D vectors
    // cos([t], [a]) = sign(t*a) — not meaningful for single values.
    // Instead we use a Gaussian proximity score for per-row display only.
    // The overall score uses the full multi-dimensional cosine below.
    const diff = Math.abs(tScore - aScore);
    const proximity = Math.round(100 * Math.exp(-0.5 * (diff / 25) ** 2) * 10) / 10;

    return {
      key: dim.analogKey,
      label: dim.label,
      targetScore: tScore,
      analogScore: aScore,
      similarity: proximity,
      weight,
      status: statusFor(proximity),
    };
  });

  // ── Overall: cosine similarity of full weighted vectors ───────────────────
  const c = cosine(targetVec, analogVec);
  const overallSimilarity = cosineToPercent(c);

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
    _metricNote:
      'Overall similarity = cosine similarity of L2-normalised, mission-weighted feature vectors ' +
      '(mapped from [-1,1] to [0,100]). Per-dimension values use Gaussian proximity ' +
      '(σ=25 pts). Input metrics are currently hand-curated; will be replaced by ' +
      'raster-computed values (source: computed) after Earth Engine pipeline integration.',
  };
}
