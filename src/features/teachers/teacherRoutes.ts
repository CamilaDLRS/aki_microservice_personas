import { Router, Request, Response, NextFunction } from 'express';
import { z, ZodIssue } from 'zod';
import { ApiError } from '../../shared/errors/ApiError';
import { createTeacherValidator } from './createTeacher/CreateTeacherValidator';
import { updateTeacherValidator } from './updateTeacher/UpdateTeacherValidator';
import { recoverPasswordValidator } from './recoverPassword/RecoverPasswordValidator';
import { loginValidator } from './login/LoginValidator';
import { ListTeachersController } from './listTeachers/ListTeachersController';
import { CreateTeacherController } from './createTeacher/CreateTeacherController';
import { GetTeacherByIdController } from './getTeacherById/GetTeacherByIdController';
import { UpdateTeacherController } from './updateTeacher/UpdateTeacherController';
import { DeleteTeacherController } from './deleteTeacher/DeleteTeacherController';
import { RecoverPasswordController } from './recoverPassword/RecoverPasswordController';
import { LoginController } from './login/LoginController';

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
