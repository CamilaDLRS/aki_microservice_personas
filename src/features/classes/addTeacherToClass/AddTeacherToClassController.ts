import { Request, Response, NextFunction } from 'express';
import { AddTeacherToClassHandler } from './AddTeacherToClassHandler';

export class AddTeacherToClassController {
  async addTeacher(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.classId);
      const handler = new AddTeacherToClassHandler();
      await handler.execute(id, req.body.teacher_id);
      res.status(201).json({
        data: null,
        meta: null,
        message: 'Teacher added',
      });
    } catch (e) {
      next(e);
    }
  }
}
