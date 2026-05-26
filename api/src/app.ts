import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './env';
import { router } from './routes';
import { errorMiddleware } from './middlewares/error.middleware';

export function createApp(): Application {
  const app = express();

  // ── Security & parsing ──────────────────────────────────
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  if (env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }

  // ── Health probes ───────────────────────────────────────
  app.get('/ready', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.get('/health', async (_req, res) => {
    const { prisma } = await import('./repositories/prisma');
    const start = Date.now();
    let dbStatus: 'up' | 'down' = 'up';

    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'down';
    }

    const status = dbStatus === 'up' ? 'healthy' : 'unhealthy';
    res.status(dbStatus === 'down' ? 503 : 200).json({
      status,
      timestamp: new Date().toISOString(),
      responseTime: `${Date.now() - start}ms`,
      services: [{ name: 'database', status: dbStatus, critical: true }],
    });
  });

  // ── API routes ──────────────────────────────────────────
  app.use('/api/v1', router);

  // ── 404 handler ─────────────────────────────────────────
  app.use((_req, res) => {
    res.status(404).json({ success: false, error: 'NOT_FOUND' });
  });

  // ── Error handler ───────────────────────────────────────
  app.use(errorMiddleware);

  return app;
}
