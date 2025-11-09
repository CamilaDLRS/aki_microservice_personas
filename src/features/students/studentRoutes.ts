import { Router, Request, Response, NextFunction } from 'express';
import { z, ZodIssue } from 'zod';
import { createStudentSchema } from './createStudent/CreateStudentValidator';
import { updateStudentSchema } from './updateStudent/UpdateStudentValidator';
import { updateStudentDeviceSchema } from './updateStudentDevice/UpdateStudentDeviceValidator';
import { ListStudentsController } from './listStudents/ListStudentsController';
import { GetStudentByCpfController } from './getStudentByCpf/GetStudentByCpfController';
import { CreateStudentController } from './createStudent/CreateStudentController';
import { GetStudentByIdController } from './getStudentById/GetStudentByIdController';
import { UpdateStudentController } from './updateStudent/UpdateStudentController';
import { UpdateStudentDeviceController } from './updateStudentDevice/UpdateStudentDeviceController';
import { DeleteStudentController } from './deleteStudent/DeleteStudentController';
import { ApiError } from '../../shared/errors/ApiError';

const listStudentsController = new ListStudentsController();
const getStudentByCpfController = new GetStudentByCpfController();
const createStudentController = new CreateStudentController();
const getStudentByIdController = new GetStudentByIdController();
const updateStudentController = new UpdateStudentController();
const updateStudentDeviceController = new UpdateStudentDeviceController();
const deleteStudentController = new DeleteStudentController();

const router = Router();

function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details = result.error.issues.map((i: ZodIssue) => `${i.path.join('.')}: ${i.message}`);
      return next(new ApiError(400, 'validation_error', 'Invalid request body', details));
    }
    req.body = result.data;
    next();
  };
}

router.get('/', (req, res, next) => listStudentsController.list(req, res, next));
router.get('/cpf/:cpf', (req, res, next) => getStudentByCpfController.get(req, res, next));
router.post('/', validate(createStudentSchema), (req, res, next) =>
  createStudentController.create(req, res, next)
);
router.get('/:studentId', (req, res, next) => getStudentByIdController.get(req, res, next));
router.put('/:studentId', validate(updateStudentSchema), (req, res, next) =>
  updateStudentController.update(req, res, next)
);
router.put('/:studentId/device', validate(updateStudentDeviceSchema), (req, res, next) =>
  updateStudentDeviceController.updateDevice(req, res, next)
);
router.delete('/:studentId', (req, res, next) => deleteStudentController.delete(req, res, next));

export default router;
