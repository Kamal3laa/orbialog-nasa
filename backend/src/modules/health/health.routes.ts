import { Router, Request, Response } from 'express';
import { dbReady } from '../../db/connect';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({
    data: {
      name: 'ORBiALOG Planetary Analog API',
      version: 'v1',
      status: 'operational',
      endpoints: {
        health: '/api/v1/health',
        ready: '/api/v1/ready',
        targets: '/api/v1/targets (filter: ?planet=moon|mars)',
        sites: '/api/v1/sites (filter: ?planet=egypt|moon|mars, ?q=search, ?category=)',
        disciplines: '/api/v1/disciplines',
        methodology: '/api/v1/methodology',
        comparison: '/api/v1/comparison?target=:targetId&analog=:siteId',
        sandboxQuery: 'POST /api/v1/sandbox/query',
      },
    },
  });
});

router.get('/health', (_req: Request, res: Response) => {
  res.json({ data: { status: 'ok', timestamp: new Date().toISOString() } });
});

router.get('/ready', (_req: Request, res: Response) => {
  if (dbReady()) {
    res.json({ data: { status: 'ready', db: 'connected' } });
  } else {
    res.status(503).json({ error: { code: 'NOT_READY', message: 'Database not connected' } });
  }
});

export default router;
