import { Request, Response, NextFunction } from 'express';
import { ClassRepository } from '../../../shared/Infrastructure/repositories/ClassRepository';
import { removeStudentFromClass } from './RemoveStudentFromClassHandler';

const classRepo = new ClassRepository();

export class RemoveStudentFromClassController {
  async removeStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.classId);
      const studentId = Number(req.params.studentId || req.body.student_id);
      await removeStudentFromClass(classRepo, id, studentId);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
}
