import { Router, Request, Response, NextFunction } from 'express';
import { addStudentToClassValidator } from './addStudentToClass/AddStudentToClassValidator';
import { addTeacherToClassValidator } from './addTeacherToClass/AddTeacherToClassValidator';
import { createClassValidator } from './createClass/CreateClassValidator';
import { updateClassValidator } from './updateClass/UpdateClassValidator';
import { ZodSchema, ZodIssue } from 'zod';
import { CreateClassController } from './createClass/CreateClassController';
import { ListClassesController } from './listClasses/ListClassesController';
import { GetClassByIdController } from './getClassById/GetClassByIdController';
import { UpdateClassController } from './updateClass/UpdateClassController';
import { DeleteClassController } from './deleteClass/DeleteClassController';
import { AddStudentToClassController } from './addStudentToClass/AddStudentToClassController';
import { RemoveStudentFromClassController } from './removeStudentFromClass/RemoveStudentFromClassController';
import { AddTeacherToClassController } from './addTeacherToClass/AddTeacherToClassController';
import { RemoveTeacherFromClassController } from './removeTeacherFromClass/RemoveTeacherFromClassController';
import { ApiError } from '../../shared/errors/ApiError';

const createClassController = new CreateClassController();
const listClassesController = new ListClassesController();
const getClassByIdController = new GetClassByIdController();
const updateClassController = new UpdateClassController();
const deleteClassController = new DeleteClassController();
const addStudentToClassController = new AddStudentToClassController();
const removeStudentFromClassController = new RemoveStudentFromClassController();
const addTeacherToClassController = new AddTeacherToClassController();
const removeTeacherFromClassController = new RemoveTeacherFromClassController();

const router = Router();

function validate(schema: ZodSchema) {
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

router.get('/', (req, res, next) => listClassesController.list(req, res, next));
router.post('/', validate(createClassValidator), (req, res, next) =>
  createClassController.create(req, res, next)
);
router.get('/:classId', (req, res, next) => getClassByIdController.get(req, res, next));
router.put('/:classId', validate(updateClassValidator), (req, res, next) =>
  updateClassController.update(req, res, next)
);
router.delete('/:classId', (req, res, next) => deleteClassController.delete(req, res, next));

router.post('/:classId/students', validate(addStudentToClassValidator), (req, res, next) =>
  addStudentToClassController.addStudent(req, res, next)
);
router.delete('/:classId/students/:studentId', (req, res, next) =>
  removeStudentFromClassController.removeStudent(req, res, next)
);
router.post('/:classId/teachers', validate(addTeacherToClassValidator), (req, res, next) =>
  addTeacherToClassController.addTeacher(req, res, next)
);
router.delete('/:classId/teachers/:teacherId', (req, res, next) =>
  removeTeacherFromClassController.removeTeacher(req, res, next)
);

export default router;
