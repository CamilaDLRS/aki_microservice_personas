import { Request, Response, NextFunction } from 'express';
import { ClassRepository } from '../../../shared/Infrastructure/repositories/ClassRepository';
import { removeTeacherFromClass } from './RemoveTeacherFromClassHandler';

const classRepo = new ClassRepository();

export class RemoveTeacherFromClassController {
  async removeTeacher(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.classId);
      const teacherId = Number(req.params.teacherId || req.body.teacher_id);
      await removeTeacherFromClass(classRepo, id, teacherId);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
}
