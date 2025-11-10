import { Request, Response, NextFunction } from 'express';
import { UpdateClassHandler } from './UpdateClassHandler';
import { UpdateClassInput } from './UpdateClassModels';

export class UpdateClassController {
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.classId || req.params.id);
      const handler = new UpdateClassHandler();
      const c = await handler.execute(id, req.body as UpdateClassInput);
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
