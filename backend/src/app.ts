import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import pinoHttp from 'pino-http';
import { v4 as uuidv4 } from 'uuid';

import { logger } from './utils/logger';
import { notFound, errorHandler } from './middleware/errorHandler';
import { CORS_ORIGINS_LIST } from './config/env';

import healthRouter from './modules/health/health.routes';
import targetsRouter from './modules/targets/targets.routes';
import sitesRouter from './modules/sites/sites.routes';
import disciplinesRouter from './modules/disciplines/disciplines.routes';
import methodologyRouter from './modules/methodology/methodology.routes';
import comparisonRouter from './modules/comparison/comparison.routes';
import sandboxRouter from './modules/sandbox/sandbox.routes';

const app = express();

// ── Security ─────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: CORS_ORIGINS_LIST,
    credentials: true,
  }),
);

// ── Request plumbing ─────────────────────────────────────────────────────────
app.use((req, _res, next) => {
  (req as express.Request & { id: string }).id = uuidv4();
  next();
});
app.use(pinoHttp({ logger }));
app.use(compression());
app.use(express.json({ limit: '100kb' }));

// ── Routes ───────────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.redirect('/api/v1');
});
app.use('/api/v1', healthRouter);
app.use('/api/v1/targets', targetsRouter);
app.use('/api/v1/sites', sitesRouter);
app.use('/api/v1/disciplines', disciplinesRouter);
app.use('/api/v1/methodology', methodologyRouter);
app.use('/api/v1/comparison', comparisonRouter);
app.use('/api/v1/sandbox', sandboxRouter);

// ── Fallthrough ───────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
