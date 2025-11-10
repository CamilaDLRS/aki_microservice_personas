import { Request, Response, NextFunction } from 'express';
import { RemoveStudentFromClassHandler } from './RemoveStudentFromClassHandler';

export class RemoveStudentFromClassController {
  async removeStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.classId);
      const studentId = Number(req.params.studentId || req.body.student_id);
      const handler = new RemoveStudentFromClassHandler();
      await handler.execute(id, studentId);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
}
