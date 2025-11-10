import { Request, Response, NextFunction } from 'express';
import { GetTeacherByIdHandler } from './GetTeacherByIdHandler';

export class GetTeacherByIdController {
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const handler = new GetTeacherByIdHandler();
      const teacher = await handler.execute({ id });
      if (!teacher) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
      res.json({
        data: teacher.props,
        meta: null,
        message: 'Teacher found',
      });
    } catch (e) {
      next(e);
    }
  }
}
