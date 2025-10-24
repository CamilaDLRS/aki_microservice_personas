import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import yaml from 'yaml';
import swaggerUi from 'swagger-ui-express';
import { initSequelize, sequelize } from './infrastructure/config/sequelize';
import { logger } from './shared/logger';
import { errorHandler } from './interface/middlewares/errorHandler';
import { notFoundHandler } from './interface/middlewares/notFoundHandler';
import studentRoutes from './interface/routes/studentRoutes';
import teacherRoutes from './interface/routes/teacherRoutes';
import classRoutes from './interface/routes/classRoutes';
import adminRoutes from './interface/routes/adminRoutes';

const app = express();
app.use(express.json());

// Simple auth mock middleware
app.use((req, _res, next) => {
  // In future: verify JWT from API Gateway. For now, accept and attach mock user.
  (req as any).auth = { sub: 'mock-user', roles: ['admin'] };
  next();
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', version: process.env.npm_package_version });
});

// Database health endpoint
app.get('/health/db', async (_req, res) => {
  try {
    await sequelize.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// Serve OpenAPI YAML & Swagger UI
const openapiPath = path.join(process.cwd(), 'docs', 'personasSwagger.yaml');
if (fs.existsSync(openapiPath)) {
  const doc = yaml.parse(fs.readFileSync(openapiPath, 'utf-8'));
  app.get('/openapi', (_req, res) => res.type('application/yaml').send(fs.readFileSync(openapiPath, 'utf-8')));
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
