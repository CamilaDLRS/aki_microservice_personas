import { Router, Request, Response, NextFunction } from 'express';
import { z, ZodIssue } from 'zod';
import { ApiError } from '../../shared/errors/ApiError';
import { createTeacherValidator } from './CreateTeacher/CreateTeacherValidator';
import { updateTeacherValidator } from './UpdateTeacher/UpdateTeacherValidator';
import { recoverPasswordValidator } from './RecoverPassword/RecoverPasswordValidator';
import { loginValidator } from './Login/LoginValidator';
import { ListTeachersController } from './ListTeachers/ListTeachersController';
import { CreateTeacherController } from './CreateTeacher/CreateTeacherController';
import { GetTeacherByIdController } from './GetTeacherById/GetTeacherByIdController';
import { UpdateTeacherController } from './UpdateTeacher/UpdateTeacherController';
import { DeleteTeacherController } from './DeleteTeacher/DeleteTeacherController';
import { RecoverPasswordController } from './RecoverPassword/RecoverPasswordController';
import { LoginController } from './Login/LoginController';

const listTeachersController = new ListTeachersController();
const createTeacherController = new CreateTeacherController();
const getTeacherByIdController = new GetTeacherByIdController();
const updateTeacherController = new UpdateTeacherController();
const deleteTeacherController = new DeleteTeacherController();
const recoverPasswordController = new RecoverPasswordController();
const loginController = new LoginController();

const router = Router();

function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const r = schema.safeParse(req.body);
    if (!r.success) {
      const details = r.error.issues.map((i: ZodIssue) => `${i.path.join('.')}: ${i.message}`);
      return next(new ApiError(400, 'validation_error', 'Invalid request body', details));
    }
    req.body = r.data;
    next();
  };
}

router.get('/', (req, res, next) => listTeachersController.list(req, res, next));
router.post('/', validate(createTeacherValidator), (req, res, next) =>
  createTeacherController.create(req, res, next)
);
router.get('/:teacherId', (req, res, next) => getTeacherByIdController.get(req, res, next));
router.put('/:teacherId', validate(updateTeacherValidator), (req, res, next) =>
  updateTeacherController.update(req, res, next)
);
router.delete('/:teacherId', (req, res, next) => deleteTeacherController.delete(req, res, next));
router.post('/recover-password', validate(recoverPasswordValidator), (req, res, next) =>
  recoverPasswordController.recover(req, res, next)
);
router.post('/login', validate(loginValidator), (req, res, next) =>
  loginController.login(req, res, next)
);

export default router;
