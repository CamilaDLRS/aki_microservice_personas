import { Request, Response, NextFunction } from 'express';
import { RemoveTeacherFromClassHandler } from './RemoveTeacherFromClassHandler';

export class RemoveTeacherFromClassController {
  async removeTeacher(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.classId);
      const teacherId = Number(req.params.teacherId || req.body.teacher_id);
      const handler = new RemoveTeacherFromClassHandler();
      await handler.execute(id, teacherId);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
}
