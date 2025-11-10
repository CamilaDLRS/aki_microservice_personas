import { Request, Response, NextFunction } from 'express';
import { CreateClassHandler } from './CreateClassHandler';

export class CreateClassController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const handler = new CreateClassHandler();
      const c = await handler.execute(req.body);
      res.status(201).json({
        data: c.props,
        meta: null,
        message: 'Class created',
      });
    } catch (e) {
      next(e);
    }
  }
}
