import { Request, Response, NextFunction } from 'express';

import { GetClassByIdFullHandler } from './GetClassByIdFullHandler';

export class GetClassByIdController {
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.classId || req.params.id);
      const handler = new GetClassByIdFullHandler();
      const payload = await handler.execute(id);
      res.json({
        data: payload,
        meta: null,
        message: 'Class found',
      });
    } catch (e) {
      next(e);
    }
  }
}
