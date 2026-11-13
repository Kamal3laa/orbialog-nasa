import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { AnalogLocation } from '../../models/AnalogLocation';
import { ApiError } from '../../utils/ApiError';

const router = Router();

/**
 * GET /api/v1/sites
 * Query params:
 *   planet   = all | moon | mars | egypt
 *   category = hyper-arid | polar-desert | volcanic-basalt | impact-crater | evaporite-sabkha | sub-sea-level
 *   q        = free-text search (regex across name, region, country, summary)
 *   minSimilarity = number (0-100)
 *   sort     = similarity | confidence | elevation | name  (default: similarity desc)
 *   page     = 1-based page number (default 1)
 *   limit    = items per page (default 20, max 50)
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const {
      planet,
      category,
      q,
      minSimilarity,
      sort = 'similarity',
      page = '1',
      limit = '20',
    } = req.query as Record<string, string>;

    const filter: Record<string, unknown> = {};

    // Planet / Egypt filter
    if (planet === 'moon') filter.primaryTargetAnalog = 'moon';
    else if (planet === 'mars') filter.primaryTargetAnalog = 'mars';
    else if (planet === 'egypt') filter.featuredEgypt = true;
    // 'all' or undefined → no planet filter

    if (category) filter.category = category;

    if (minSimilarity) {
      filter.overallSimilarity = { $gte: parseFloat(minSimilarity) };
    }

    // Free-text search: use case-insensitive regex across key fields
    // (safe: we escape the input before using it in a regex)
    if (q) {
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'i');
      filter.$or = [
        { name: regex },
        { region: regex },
        { country: regex },
        { summary: regex },
      ];
    }

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      similarity: { overallSimilarity: -1 },
      confidence: { confidenceScore: -1 },
      elevation: { elevationMeters: -1 },
      name: { name: 1 },
    };
    const sortStage = sortMap[sort] ?? sortMap['similarity'];

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [sites, total] = await Promise.all([
      AnalogLocation.find(filter).sort(sortStage).skip(skip).limit(limitNum).lean(),
      AnalogLocation.countDocuments(filter),
    ]);

    res.json({
      data: sites,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  }),
);

/** GET /api/v1/sites/:id */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const site = await AnalogLocation.findOne({ id: req.params.id }).lean();
    if (!site) throw ApiError.notFound('AnalogLocation', String(req.params.id));
    res.json({ data: site });
  }),
);

export default router;
