import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { PlanetaryTarget } from '../../models/PlanetaryTarget';
import { AnalogLocation } from '../../models/AnalogLocation';
import { ApiError } from '../../utils/ApiError';
import { calculateComparison } from './comparison.service';

const router = Router();

/**
 * GET /api/v1/comparison?target=<targetId>&analog=<analogId>
 *
 * Returns a full fidelity comparison object — same shape as the frontend's
 * calculateFidelityComparison() output.
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { target, analog } = req.query as Record<string, string>;

    if (!target || !analog) {
      throw ApiError.badRequest('Both `target` and `analog` query params are required');
    }

    const [targetDoc, analogDoc] = await Promise.all([
      PlanetaryTarget.findOne({ id: target }).lean(),
      AnalogLocation.findOne({ id: analog }).lean(),
    ]);

    if (!targetDoc) throw ApiError.notFound('PlanetaryTarget', target);
    if (!analogDoc) throw ApiError.notFound('AnalogLocation', analog);

    const result = calculateComparison(
      targetDoc.metrics as unknown as Record<string, number>,
      analogDoc.metrics as unknown as Record<string, number>,
      targetDoc.planet,
      targetDoc.id,
      analogDoc.id,
    );

    res.json({ data: result });
  }),
);

export default router;
