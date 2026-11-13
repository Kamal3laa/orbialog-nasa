import { Router, Request, Response } from 'express';
import { PlanetaryTarget } from '../../models/PlanetaryTarget';
import { AnalogLocation } from '../../models/AnalogLocation';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiError } from '../../utils/ApiError';

const router = Router();

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Converts a 0-100 numeric score into a human-readable label. */
function scoreLabel(score: number): string {
  if (score >= 80) return 'High';
  if (score >= 55) return 'Moderate';
  return 'Low';
}

/** Formats a planet string into the parenthetical display used in target_space_site. */
function planetLabel(planet: string): string {
  const map: Record<string, string> = {
    moon: 'Moon',
    mars: 'Mars',
    earth: 'Earth',
  };
  return map[planet.toLowerCase()] ?? planet;
}

// ─── GET /api/v1/analogs/targets ─────────────────────────────────────────────
// Lists all valid target IDs + names so the frontend knows what to pass as ?target=
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
        planet: planetLabel(t.planet),
        designation: t.designation ?? null,
      })),
    });
  }),
);

// ─── GET /api/v1/analogs ─────────────────────────────────────────────────────
// Returns the exact JSON contract the frontend expects:
//
//   {
//     "data": {
//       "target_space_site": "Shackleton Crater Rim (Moon)",
//       "top_earth_analogs": [ { location_name, coordinates, similarity_score,
//                                 matches, breakdown, suggested_testing } ]
//     }
//   }
//
// Query params:
//   ?target=<targetId>   required — e.g. "luna-shackleton-crater"
//   ?limit=<n>           optional — default 5, max 10
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    // ── 1. Validate query params ──────────────────────────────────────────
    const targetId = (req.query['target'] as string | undefined)?.trim();
    if (!targetId) {
      throw new ApiError(400, 'BAD_REQUEST', 'Missing required query param: target');
    }

    const rawLimit = Number(req.query['limit'] ?? 5);
    const limit = Number.isFinite(rawLimit)
      ? Math.min(Math.max(1, rawLimit), 10)
      : 5;

    // ── 2. Fetch the planetary target ─────────────────────────────────────
    const target = await PlanetaryTarget.findOne({ id: targetId }).lean();
    if (!target) {
      throw new ApiError(
        404,
        'NOT_FOUND',
        `No target found with id "${targetId}". Use GET /api/v1/analogs/targets for valid IDs.`,
      );
    }

    // ── 3. Fetch matching analog sites ────────────────────────────────────
    // Priority: sites whose matchedTargets array includes this targetId
    // Fallback: sites whose primaryTargetAnalog matches the target's planet
    const sites = await AnalogLocation.find({
      $or: [
        { matchedTargets: targetId },
        { primaryTargetAnalog: target.planet },
      ],
    })
      .sort({ overallSimilarity: -1 })
      .limit(limit)
      .lean();

    // ── 4. Build the response payload ─────────────────────────────────────
    const target_space_site = `${target.name} (${planetLabel(target.planet)})`;

    const top_earth_analogs = sites.map((site) => {
      // geology_match: score label + rock type in parentheses
      const geoScore = site.metrics?.geologicalSimilarity ?? 0;
      const rockType = site.geology?.rockType?.split(',')[0]?.trim() ?? 'Unknown';
      const geology_match = `${scoreLabel(geoScore)} (${rockType})`;

      // thermal_match: score label only
      const thermalScore = site.metrics?.thermalDeltaMatch ?? 0;
      const thermal_match = scoreLabel(thermalScore);

      // limits: join first two limitations into one sentence
      const limits =
        (site.limitations ?? []).slice(0, 2).join('; ') ||
        'Standard Earth-to-space constraints apply';

      // matches: top 3 similaritiesToTarget strings
      const matches = (site.similaritiesToTarget ?? []).slice(0, 3);

      // suggested_testing: exceptional/high capabilities only, joined
      const suggested_testing =
        (site.fieldTestingCapabilities ?? [])
          .filter(
            (c) => c.suitability === 'exceptional' || c.suitability === 'high',
          )
          .map((c) => c.name)
          .join(', ') || 'General field research applicable';

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
      data: {
        target_space_site,
        top_earth_analogs,
      },
    });
  }),
);

export default router;
