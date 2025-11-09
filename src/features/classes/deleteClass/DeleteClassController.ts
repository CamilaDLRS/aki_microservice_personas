import { Request, Response, NextFunction } from 'express';
import { ClassRepository } from '../../../shared/Infrastructure/repositories/ClassRepository';
import { deleteClass } from './DeleteClassHandler';

const classRepo = new ClassRepository();

export class DeleteClassController {
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.classId || req.params.id);
      await deleteClass(classRepo, id);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
}
