import { Request, Response, NextFunction } from 'express';
import { ListStudentsHandler } from './ListStudentsHandler';

export class ListStudentsController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, size = 50 } = req.query;
      const handler = new ListStudentsHandler();
      const result = await handler.execute({ page: Number(page), size: Number(size) });
      res.json({
        data: result.items.map((i) => i.props),
        meta: result.meta,
        message: 'Students retrieved',
      });
    } catch (e) {
      next(e);
    }
  }
}
