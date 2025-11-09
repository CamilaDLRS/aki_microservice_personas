import { Request, Response, NextFunction } from 'express';
import { TeacherRepository } from '../../../shared/Infrastructure/repositories/TeacherRepository';
import { deleteTeacher } from './DeleteTeacherHandler';

const teacherRepo = new TeacherRepository();

export class DeleteTeacherController {
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await deleteTeacher(teacherRepo, { id });
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
}
