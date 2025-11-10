import { Request, Response, NextFunction } from 'express';
import { CreateTeacherHandler } from './CreateTeacherHandler';
import { CreateTeacherInput } from './CreateTeacherModels';

export class CreateTeacherController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const handler = new CreateTeacherHandler();
      const teacher = await handler.execute(req.body as CreateTeacherInput);
      res.status(201).json({
        data: teacher.props,
        meta: null,
        message: 'Teacher created',
      });
    } catch (e) {
      next(e);
    }
  }
}
