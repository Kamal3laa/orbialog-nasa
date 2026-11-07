import { AnalogSite, ComparisonDimension, PlanetaryTarget } from '../types';

export function calculateFidelityComparison(
  target: PlanetaryTarget,
  analog: AnalogSite
): {
  overallSimilarity: number;
  dimensions: ComparisonDimension[];
  dominantStrengths: string[];
  operationalRisks: string[];
} {
  // Derive synthetic target baseline scores from target characteristics
  const targetScores = {
    terrainRoughness: Math.round(target.rockAbundancePercent * 4.5 + 20),
    slopeVariance: Math.min(100, Math.round(target.slopeAvgDeg * 2.8 + 15)),
    thermalExtreme: target.planetId === 'Moon' ? 95 : 82,
    aeolianDynamics: target.planetId === 'Mars' ? 88 : 0, // No wind on Moon
    mineralMatch: 85,
    volatilePresence: target.waterVolatilesStatus.includes('Confirmed') ? 75 : 15,
    logisticsAccess: 10, // Extreme remote space
    opticalDustFactor: target.planetId === 'Mars' ? 85 : 30,
    geomechanicalStrength: 80,
  };

  const dimConfigs: { key: keyof typeof targetScores; label: string; desc: string }[] = [
    { key: 'terrainRoughness', label: 'Terrain Roughness & Boulders', desc: 'Distribution of surface rock fragments, block fields, and obstacle height clearance.' },
    { key: 'slopeVariance', label: 'Slope & Incline Gradients', desc: 'Average topographical angles, talus slopes, and cliff face gradients.' },
    { key: 'thermalExtreme', label: 'Thermal Range & Cycling', desc: 'Diurnal surface temperature swings and cryogenic/extreme heat stress.' },
    { key: 'aeolianDynamics', label: 'Aeolian & Wind Mechanics', desc: 'Wind-blown dust lofting, dune saltation, yardang erosion, and ventifact formation.' },
    { key: 'mineralMatch', label: 'Mineralogical & Chemical Match', desc: 'Spectroscopic match with planetary basalts, evaporites, phyllosilicates, or carbonates.' },
    { key: 'volatilePresence', label: 'Volatiles & Water Indicators', desc: 'Hydrated minerals, trapped structural water, brine crusts, or permafrost ice.' },
    { key: 'opticalDustFactor', label: 'Optical Dust Obscuration', desc: 'Atmospheric opacity, solar panel deposition rates, and vision-system sensor degradation.' },
    { key: 'geomechanicalStrength', label: 'Geomechanical Regolith Shear', desc: 'Bearing capacity, cohesion, and wheel sinkage in powdery or brittle surface crusts.' },
  ];

  let totalSim = 0;
  let weightSum = 0;

  const dimensions: ComparisonDimension[] = dimConfigs.map((cfg) => {
    const tVal = targetScores[cfg.key];
    const aVal = analog.metrics[cfg.key];

    // Compute difference percentage
    const diff = Math.abs(tVal - aVal);
    const similarity = Math.max(0, 100 - diff);

    let status: 'HIGH_FIDELITY' | 'MODERATE_FIDELITY' | 'SIGNIFICANT_DISCREPANCY';
    if (similarity >= 80) {
      status = 'HIGH_FIDELITY';
    } else if (similarity >= 55) {
      status = 'MODERATE_FIDELITY';
    } else {
      status = 'SIGNIFICANT_DISCREPANCY';
    }

    // Weight factor: aeolian is 0 on Moon, mineral match is high
    const weight = (target.planetId === 'Moon' && cfg.key === 'aeolianDynamics') ? 0.3 : 1.0;
    totalSim += similarity * weight;
    weightSum += weight;

    let scienceRationale = '';
    if (status === 'HIGH_FIDELITY') {
      scienceRationale = `High correlation between ${analog.name} and ${target.name}. Enables dependable hardware benchmarking.`;
    } else if (status === 'MODERATE_FIDELITY') {
      scienceRationale = `Moderate parity. Secondary mechanical factors require software scaling or offset compensation.`;
    } else {
      scienceRationale = `Discrepancy noted due to fundamental terrestrial environment differences (gravity/atmosphere/hydration).`;
    }

    return {
      key: cfg.key,
      label: cfg.label,
      description: cfg.desc,
      planetaryTargetScore: tVal,
      analogSiteScore: aVal,
      similarityPercentage: Math.round(similarity),
      fidelityStatus: status,
      scienceRationale,
    };
  });

  const overallSimilarity = Math.round(totalSim / weightSum);

  const dominantStrengths = dimensions
    .filter((d) => d.fidelityStatus === 'HIGH_FIDELITY')
    .map((d) => d.label);

  const operationalRisks = dimensions
    .filter((d) => d.fidelityStatus === 'SIGNIFICANT_DISCREPANCY')
    .map((d) => `${d.label} (Requires dynamic compensation)`);

  return {
    overallSimilarity,
    dimensions,
    dominantStrengths,
    operationalRisks,
  };
}

export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`;
}

export function calculateLightDelay(planet: 'Moon' | 'Mars'): { seconds: number; formatted: string } {
  if (planet === 'Moon') {
    return { seconds: 1.28, formatted: '1.28 sec (One-way light time)' };
  }
  // Mars average distance ~225 million km -> ~750 seconds (12.5 minutes)
  return { seconds: 750, formatted: '12m 30s (750.5 sec one-way)' };
}

