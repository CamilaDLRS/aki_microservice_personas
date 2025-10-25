import { Router } from 'express';
import { StudentController } from '../controllers/StudentController';
import { z } from 'zod';
import { ApiError } from '../../shared/errors/ApiError';

const controller = new StudentController();
const router = Router();

const createSchema = z.object({
  cpf: z.string().length(11),
  full_name: z.string().min(2),
  device_id: z.string().optional().nullable(),
});

const updateSchema = z.object({
  full_name: z.string().min(2).optional(),
  device_id: z.string().optional().nullable(),
});

const deviceSchema = z.object({
  device_id: z.string().min(3),
});

function validate(schema: z.ZodSchema<any>) {
  return (req: any, _res: any, next: any) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
      return next(new ApiError(400, 'validation_error', 'Invalid request body', details));
    }
    req.body = result.data;
    next();
  };
}

router.get('/', (req, res, next) => controller.list(req, res, next));
router.post('/', validate(createSchema), (req, res, next) => controller.create(req, res, next));
router.get('/:studentId', (req, res, next) => controller.get(req, res, next));
router.put('/:studentId', validate(updateSchema), (req, res, next) =>
  controller.update(req, res, next)
);
router.put('/:studentId/device', validate(deviceSchema), (req, res, next) =>
  controller.updateDevice(req, res, next)
);
router.delete('/:studentId', (req, res, next) => controller.delete(req, res, next));

export default router;
