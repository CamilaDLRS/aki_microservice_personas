import { Request, Response, NextFunction } from 'express';
import { DeleteStudentHandler } from './DeleteStudentHandler';

export class DeleteStudentController {
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const handler = new DeleteStudentHandler();
      await handler.execute(id);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
}
