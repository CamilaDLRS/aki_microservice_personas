import { Request, Response, NextFunction } from 'express';
import { ClassRepository } from '../../../shared/Infrastructure/repositories/ClassRepository';
import { TeacherRepository } from '../../../shared/Infrastructure/repositories/TeacherRepository';
import { addTeacherToClass } from './AddTeacherToClassHandler';

const classRepo = new ClassRepository();
const teacherRepo = new TeacherRepository();

export class AddTeacherToClassController {
  async addTeacher(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.classId);
      await addTeacherToClass(classRepo, teacherRepo, id, req.body.teacher_id);
      const c = await classRepo.findById(id);
      res.status(201).json({
        data: c?.props || null,
        meta: null,
        message: 'Teacher added',
      });
    } catch (e) {
      next(e);
    }
  }
}
