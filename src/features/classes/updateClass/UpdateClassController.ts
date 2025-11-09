import { Request, Response, NextFunction } from 'express';
import { ClassRepository } from '../../../shared/Infrastructure/repositories/ClassRepository';
import { updateClass } from './UpdateClassHandler';
import { UpdateClassInput } from './UpdateClassModels';

const classRepo = new ClassRepository();

export class UpdateClassController {
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.classId || req.params.id);
      const c = await updateClass(classRepo, id, req.body as UpdateClassInput);
      if (!c) {
        return res.status(404).json({ message: 'Class not found' });
      }
      res.json({
        data: c.props,
        meta: null,
        message: 'Class updated',
      });
    } catch (e) {
      next(e);
    }
  }
}
