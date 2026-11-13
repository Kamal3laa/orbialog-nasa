import { Router, Request, Response } from 'express';
import { PlanetaryTarget } from '../../models/PlanetaryTarget';
import { AnalogLocation } from '../../models/AnalogLocation';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiError } from '../../utils/ApiError';

const router = Router();

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Converts a 0-100 numeric score into a human-readable fidelity label. */
function scoreLabel(score: number): string {
  if (score >= 85) return 'Exceptional';
  if (score >= 70) return 'High';
  if (score >= 50) return 'Moderate';
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
// Lists all valid target IDs + rich metadata so frontend knows what to pass as ?target=
router.get(
  '/targets',
  asyncHandler(async (_req: Request, res: Response) => {
    const targets = await PlanetaryTarget.find(
      {},
      {
        id: 1,
        name: 1,
        planet: 1,
        designation: 1,
        surfaceType: 1,
        gravity: 1,
        temperatureRange: 1,
        _id: 0,
      },
    ).lean();

    res.json({
      count: targets.length,
      data: targets.map((t) => ({
        id: t.id,
        name: t.name,
        planet: planetLabel(t.planet),
        designation: t.designation ?? null,
        surface_type: t.surfaceType ?? null,
        gravity: t.gravity ?? null,
        temperature_range: t.temperatureRange ?? null,
      })),
    });
  }),
);

// ─── GET /api/v1/analogs ─────────────────────────────────────────────────────
// Comprehensive NASA Space Apps Analog Comparison Endpoint.
// Returns the exact JSON contract with full coverage of the 8 scientific domains:
// - Geology & Surface Materials
// - Terrain & Topography
// - Temperature & Environmental Extremes
// - Water or Ice (Volatiles)
// - Dust & Atmospheric Processes
// - Biology & Habitability
// - Caves or Subsurface Environments
// - Robotic & Human Exploration Testing
//
// Query params:
//   ?target=<targetId>   required — e.g. "luna-shackleton-crater" or "mars-jezero-crater"
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
    const sites = await AnalogLocation.find({
      $or: [
        { matchedTargets: targetId },
        { primaryTargetAnalog: target.planet },
      ],
    })
      .sort({ overallSimilarity: -1 })
      .limit(limit)
      .lean();

    // ── 4. Build comprehensive NASA-grade analog comparison response ──────
    const target_space_site = `${target.name} (${planetLabel(target.planet)})`;

    const top_earth_analogs = sites.map((site) => {
      // 1. Geology & Surface Materials
      const geoScore = site.metrics?.geologicalSimilarity ?? 0;
      const rockType = site.geology?.rockType?.split(',')[0]?.trim() ?? 'Unknown';
      const geology_match = `${scoreLabel(geoScore)} (${rockType})`;

      // 2. Temperature & Thermal Extremes
      const thermalScore = site.metrics?.thermalDeltaMatch ?? 0;
      const thermal_match = `${scoreLabel(thermalScore)} (Diurnal: ${site.environment?.diurnalRange || 'N/A'})`;

      // 3. Terrain & Topography
      const roughnessScore = site.metrics?.terrainRoughness ?? 0;
      const slopeScore = site.metrics?.slopeDistribution ?? 0;
      const avgTerrain = Math.round((roughnessScore + slopeScore) / 2);
      const terrain_topography_match = `${scoreLabel(avgTerrain)} (Roughness: ${roughnessScore}%, Slope profile: ${slopeScore}%)`;

      // 4. Water or Ice (Volatiles)
      const volatilesScore = site.metrics?.volatilesAnalogy ?? 0;
      const volatiles_ice_match = `${scoreLabel(volatilesScore)} (${volatilesScore}% volatile preservation analogy)`;

      // 5. Dust & Atmospheric Processes
      const granulometryScore = site.metrics?.granulometryMatch ?? 0;
      const dust_atmosphere_match = `${scoreLabel(granulometryScore)} (Granulometry: ${granulometryScore}%, Dust frequency: ${site.environment?.dustStormFrequency || 'N/A'})`;

      // 6. Biology & Habitability (Astrobiology)
      const astrobioEntry =
        site.scientificSignificance?.find((s) =>
          /astrobiolog|cyanobacteri|life|endolith|biosignature|organic|microb/i.test(s),
        ) ??
        (site.environment?.uvIrradiance
          ? `Extreme solar UV (${site.environment.uvIrradiance}) baseline for organic resilience`
          : 'Extreme aridity microbial survival limit');
      const biology_habitability = astrobioEntry;

      // 7. Caves & Subsurface Environments
      const isSubsurface =
        site.category === 'volcanic-basalt' ||
        site.category === 'sub-sea-level' ||
        /lava tube|cave|subsurface|groundwater|radar/i.test(
          `${site.summary} ${site.geology?.stratigraphy ?? ''}`,
        );
      const caves_subsurface = isSubsurface
        ? `High potential: ${site.geology?.stratigraphy?.slice(0, 90) || 'Subsurface stratigraphy & void detection'}`
        : 'Surface morphology focus; limited subterranean cavities';

      // 8. Exploration Conditions & Limitations
      const limits =
        (site.limitations ?? []).slice(0, 2).join('; ') ||
        'Standard Earth gravity (1G) and atmospheric pressure constraints apply';

      // Matches (top 3 key analogs)
      const matches = (site.similaritiesToTarget ?? []).slice(0, 3);

      // Suggested Field Testing (Robotic & Human Exploration)
      const suggested_testing =
        (site.fieldTestingCapabilities ?? [])
          .filter(
            (c) => c.suitability === 'exceptional' || c.suitability === 'high',
          )
          .map((c) => c.name)
          .join(', ') || 'General autonomous navigation & instrumentation calibration';

      return {
        location_name: `${site.name}, ${site.country}`,
        coordinates: [site.coordinates?.lat ?? 0, site.coordinates?.lng ?? 0],
        similarity_score: `${(site.overallSimilarity ?? 0).toFixed(1)}%`,
        matches,
        breakdown: {
          geology_match,
          thermal_match,
          terrain_topography_match,
          volatiles_ice_match,
          dust_atmosphere_match,
          biology_habitability,
          caves_subsurface,
          limits,
        },
        surface_materials: {
          rock_type: site.geology?.rockType ?? 'Not specified',
          regolith_analogy: site.geology?.regolithAnalogy ?? 'Not specified',
          key_minerals: (site.geology?.mineralogy ?? []).slice(0, 4),
        },
        environmental_conditions: {
          mean_annual_temp: site.environment?.meanAnnualTemp ?? 'N/A',
          diurnal_range: site.environment?.diurnalRange ?? 'N/A',
          annual_precipitation: site.environment?.annualPrecipitation ?? 'N/A',
          uv_irradiance: site.environment?.uvIrradiance ?? 'N/A',
          aridity_index: site.environment?.aridityIndex ?? 'N/A',
          dust_events: site.environment?.dustStormFrequency ?? 'N/A',
        },
        suggested_testing,
        imagery: {
          hero: site.imagery?.hero ?? null,
          satellite: site.imagery?.satellite ?? null,
          terrain: site.imagery?.terrain ?? null,
        },
      };
    });

    res.json({
      data: {
        target_space_site,
        target_overview: {
          planet: planetLabel(target.planet),
          gravity: target.gravity,
          atmospheric_pressure: target.pressure,
          surface_type: target.surfaceType,
          illumination: target.illumination,
          primary_features: target.primaryFeatures?.slice(0, 3) ?? [],
        },
        top_earth_analogs,
      },
    });
  }),
);

export default router;
