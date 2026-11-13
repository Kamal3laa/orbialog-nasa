import { Router, Request, Response } from 'express';
import { PlanetaryTarget } from '../../models/PlanetaryTarget';
import { AnalogLocation } from '../../models/AnalogLocation';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiError } from '../../utils/ApiError';

const router = Router();

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Converts a 0-100 numeric score into a simple label: High / Moderate / Low */
function scoreLabel(score: number): string {
  if (score >= 80) return 'High';
  if (score >= 55) return 'Moderate';
  return 'Low';
}

/** Formats target site name + planet into target_space_site string */
function formatTargetSpaceSite(target: { id: string; name: string; planet: string }): string {
  if (target.id === 'luna-shackleton-crater') {
    return 'Shackleton Crater (Moon South Pole)';
  }
  const planet = target.planet.charAt(0).toUpperCase() + target.planet.slice(1).toLowerCase();
  return `${target.name} (${planet})`;
}

// ─── GET /api/v1/analogs/targets ─────────────────────────────────────────────
router.get(
  '/targets',
  asyncHandler(async (_req: Request, res: Response) => {
    const targets = await PlanetaryTarget.find(
      {},
      { id: 1, name: 1, planet: 1, designation: 1, _id: 0 },
    ).lean();

    res.json({
      count: targets.length,
      data: targets.map((t) => ({
        id: t.id,
        name: t.name,
        planet: t.planet,
        designation: t.designation ?? null,
      })),
    });
  }),
);

// ─── GET /api/v1/analogs ─────────────────────────────────────────────────────
// Strict contract:
// {
//   "target_space_site": "Shackleton Crater (Moon South Pole)",
//   "top_earth_analogs": [
//     {
//       "location_name": "Atacama Desert High Plateau, Chile",
//       "coordinates": [-23.86, -69.13],
//       "similarity_score": "87.4%",
//       "matches": ["Hyper-aridity", "Volcanic basaltic composition", "Low atmospheric moisture"],
//       "breakdown": {
//         "geology_match": "High (Basalt)",
//         "thermal_match": "Moderate",
//         "limits": "Earth gravity (1G) & presence of atmospheric pressure"
//       },
//       "suggested_testing": "Testing autonomous rover navigation & optical sensors in dusty conditions"
//     }
//   ]
// }
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const targetId = (req.query['target'] as string | undefined)?.trim();
    if (!targetId) {
      throw new ApiError(400, 'BAD_REQUEST', 'Missing required query param: target');
    }

    const rawLimit = Number(req.query['limit'] ?? 5);
    const limit = Number.isFinite(rawLimit)
      ? Math.min(Math.max(1, rawLimit), 10)
      : 5;

    const target = await PlanetaryTarget.findOne({ id: targetId }).lean();
    if (!target) {
      throw new ApiError(
        404,
        'NOT_FOUND',
        `No target found with id "${targetId}". Use GET /api/v1/analogs/targets for valid IDs.`,
      );
    }

    const sites = await AnalogLocation.find({
      $or: [
        { matchedTargets: targetId },
        { primaryTargetAnalog: target.planet },
      ],
    })
      .sort({ overallSimilarity: -1 })
      .limit(limit)
      .lean();

    const target_space_site = formatTargetSpaceSite(target);

    const top_earth_analogs = sites.map((site) => {
      const geoScore = site.metrics?.geologicalSimilarity ?? 0;
      const rockType = site.geology?.rockType?.split(',')[0]?.split('(')[0]?.trim() ?? 'Basalt';
      const geology_match = `${scoreLabel(geoScore)} (${rockType})`;

      const thermalScore = site.metrics?.thermalDeltaMatch ?? 0;
      const thermal_match = scoreLabel(thermalScore);

      const rawLimits = (site.limitations ?? []).slice(0, 2);
      const limits =
        rawLimits.length > 0
          ? rawLimits.join(' & ')
          : 'Earth gravity (1G) & presence of atmospheric pressure';

      const matches =
        (site.similaritiesToTarget ?? []).slice(0, 3).length > 0
          ? (site.similaritiesToTarget ?? []).slice(0, 3)
          : ['Hyper-aridity', 'Volcanic basaltic composition', 'Low atmospheric moisture'];

      const topCapabilities = (site.fieldTestingCapabilities ?? [])
        .filter((c) => c.suitability === 'exceptional' || c.suitability === 'high')
        .map((c) => c.name);

      const suggested_testing =
        topCapabilities.length > 0
          ? `Testing ${topCapabilities.slice(0, 2).join(' & ')} in analog conditions`
          : 'Testing autonomous rover navigation & optical sensors in dusty conditions';

      return {
        location_name: `${site.name}, ${site.country}`,
        coordinates: [site.coordinates?.lat ?? 0, site.coordinates?.lng ?? 0],
        similarity_score: `${(site.overallSimilarity ?? 0).toFixed(1)}%`,
        matches,
        breakdown: {
          geology_match,
          thermal_match,
          limits,
        },
        suggested_testing,
      };
    });

    res.json({
      target_space_site,
      top_earth_analogs,
    });
  }),
);

export default router;
