import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { PlanetaryTarget } from '../../models/PlanetaryTarget';
import { ApiError } from '../../utils/ApiError';

const router = Router();

/** GET /api/v1/targets  — optionally filter by ?planet=moon|mars */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { planet } = req.query;
    const filter: Record<string, unknown> = {};
    if (planet && (planet === 'moon' || planet === 'mars')) {
      filter.planet = planet;
    }
    const targets = await PlanetaryTarget.find(filter).lean();
    res.json({ data: targets });
  }),
);

/** GET /api/v1/targets/:id */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const target = await PlanetaryTarget.findOne({ id: req.params.id }).lean();
    if (!target) throw ApiError.notFound('PlanetaryTarget', String(req.params.id));
    res.json({ data: target });
  }),
);

export default router;
