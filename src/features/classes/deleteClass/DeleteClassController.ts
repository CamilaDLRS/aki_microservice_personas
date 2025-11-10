import { Request, Response, NextFunction } from 'express';
import { DeleteClassHandler } from './DeleteClassHandler';

export class DeleteClassController {
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.classId || req.params.id);
      const handler = new DeleteClassHandler();
      await handler.execute(id);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
}
