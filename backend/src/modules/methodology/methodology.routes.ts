import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { MethodologyStep } from '../../models/MethodologyStep';

const router = Router();

/** GET /api/v1/methodology  — returns steps ordered by stepNumber */
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const steps = await MethodologyStep.find().sort({ stepNumber: 1 }).lean();
    res.json({ data: steps });
  }),
);

export default router;
