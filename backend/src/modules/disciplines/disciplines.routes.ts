import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { MissionDiscipline } from '../../models/MissionDiscipline';
import { ApiError } from '../../utils/ApiError';

const router = Router();

/** GET /api/v1/disciplines */
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const disciplines = await MissionDiscipline.find().lean();
    res.json({ data: disciplines });
  }),
);

/** GET /api/v1/disciplines/:id */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const discipline = await MissionDiscipline.findOne({ id: req.params.id }).lean();
    if (!discipline) throw ApiError.notFound('MissionDiscipline', String(req.params.id));
    res.json({ data: discipline });
  }),
);

export default router;
