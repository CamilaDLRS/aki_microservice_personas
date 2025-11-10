import { Request, Response, NextFunction } from 'express';
import { DeleteTeacherHandler } from './DeleteTeacherHandler';

export class DeleteTeacherController {
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const handler = new DeleteTeacherHandler();
      await handler.execute({ id });
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
}
