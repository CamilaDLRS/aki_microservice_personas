import { Request, Response, NextFunction } from 'express';
import { ClassRepository } from '../../../shared/Infrastructure/repositories/ClassRepository';
import { createClass } from './CreateClassHandler';

const classRepo = new ClassRepository();

export class CreateClassController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const c = await createClass(classRepo, req.body);
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
