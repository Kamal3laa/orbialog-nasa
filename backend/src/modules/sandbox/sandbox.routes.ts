import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../../utils/asyncHandler';
import { MissionDiscipline } from '../../models/MissionDiscipline';
import { ApiError } from '../../utils/ApiError';

const router = Router();

// Sandbox query body schema
const sandboxBodySchema = z.object({
  disciplineId: z.string().min(1),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

/**
 * POST /api/v1/sandbox/query
 *
 * Body: { disciplineId: string, lat: number, lng: number }
 *
 * Returns a simulated telemetry record matching what the frontend renders
 * in DataTelemetrySandbox today (the setTimeout fake is now replaced by this).
 */
router.post(
  '/query',
  asyncHandler(async (req, res) => {
    const parsed = sandboxBodySchema.safeParse(req.body);
    if (!parsed.success) {
      throw ApiError.unprocessable('Invalid sandbox query parameters', parsed.error.flatten().fieldErrors);
    }

    const { disciplineId, lat, lng } = parsed.data;

    const discipline = await MissionDiscipline.findOne({ id: disciplineId }).lean();
    if (!discipline) throw ApiError.notFound('MissionDiscipline', disciplineId);

    // Build the same response shape the frontend fakes today
    const responsePayload = {
      QUERY_TIMESTAMP_UTC: new Date().toISOString(),
      QUERY_LATITUDE: lat,
      QUERY_LONGITUDE: lng,
      DISCIPLINE_ID: disciplineId,
      DISCIPLINE_TITLE: discipline.title,
      SERVER_TELEMETRY: 'SIMULATED',   // stays honest until Phase 9 real NASA integration
      INTEGRATION_STATUS: 'DEMO_MODE',
      SAMPLE_RECORD: {
        feasibleTests: discipline.feasibleTests,
        fieldInstrumentation: discipline.fieldInstrumentation,
        validationMetrics: discipline.validationMetrics,
        analogRequirements: discipline.analogRequirements,
        recommendedLocations: discipline.recommendedLocations,
      },
    };

    res.json({ data: responsePayload });
  }),
);

export default router;
