import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import yaml from 'yaml';
import swaggerUi from 'swagger-ui-express';
import { initSequelize, sequelize } from './shared/Infrastructure/config/sequelize';
import { logger } from './shared/logger';
import { errorHandler } from './shared/errors/errorHandler';
import { notFoundHandler } from './shared/errors/notFoundHandler';
import studentRoutes from './features/students/studentRoutes';
import teacherRoutes from './features/teachers/teacherRoutes';
import classRoutes from './features/classes/classRoutes';
import adminRoutes from './features/admin/adminRoutes';

const app = express();
app.use(express.json());

// Simple auth mock middleware
import { Request, Response, NextFunction } from 'express';
// ...
app.use((req: Request, res: Response, next: NextFunction) => {
  // In future: verify JWT from API Gateway. For now, accept and attach mock user.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req as any).auth = { sub: 'mock-user', roles: ['admin'] };
  next();
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', version: process.env.npm_package_version });
});

// Database health endpoint
app.get('/health/db', async (req: Request, res: Response) => {
  try {
    await sequelize.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (e: unknown) {
    res.status(500).json({ status: 'error', message: (e as Error).message });
  }
});

// Serve OpenAPI YAML & Swagger UI
const openapiPath = path.join(process.cwd(), 'docs', 'personasSwagger.yaml');
if (fs.existsSync(openapiPath)) {
  const doc = yaml.parse(fs.readFileSync(openapiPath, 'utf-8'));
  app.get('/openapi', (req: Request, res: Response) => {
    res.type('application/yaml').send(fs.readFileSync(openapiPath, 'utf-8'));
  });
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(doc));
}

app.use('/students', studentRoutes);
app.use('/teachers', teacherRoutes);
app.use('/classes', classRoutes);
app.use('/admin', adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT || 3000;

(async () => {
  try {
    await initSequelize();
    app.listen(port, () => {
      logger.info(`Personas service listening on port ${port}`);
    });
  } catch (err) {
    logger.error({ err }, 'Failed to start personas service');
    process.exit(1);
  }
})();

export default app;
