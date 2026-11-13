import { Router, Request, Response } from 'express';
import { dbReady } from '../../db/connect';

const router = Router();

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
