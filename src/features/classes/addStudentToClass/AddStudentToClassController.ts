import { Request, Response, NextFunction } from 'express';
import { AddStudentToClassHandler } from './AddStudentToClassHandler';

export class AddStudentToClassController {
  async addStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.classId);
      const handler = new AddStudentToClassHandler();
      await handler.execute(id, req.body.student_id);
      res.status(201).json({
        data: null,
        meta: null,
        message: 'Student added',
      });
    } catch (e) {
      next(e);
    }
  }
}
