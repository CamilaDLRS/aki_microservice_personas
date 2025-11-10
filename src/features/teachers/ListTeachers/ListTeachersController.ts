import { Request, Response, NextFunction } from 'express';
import { ListTeachersHandler } from './ListTeachersHandler';

export class ListTeachersController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, size = 50 } = req.query;
      const handler = new ListTeachersHandler();
      const result = await handler.execute({ page: Number(page), size: Number(size) });
      res.json({
        data: result.items.map((i) => i.props),
        meta: result.meta,
        message: 'Teachers retrieved',
      });
    } catch (e) {
      next(e);
    }
  }
}
