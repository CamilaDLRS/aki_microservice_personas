import { Request, Response, NextFunction } from 'express';

export function notFoundHandler(_req: Request, res: Response, _next: NextFunction) {
  res.status(404).json({
    data: null,
    meta: null,
    message: 'Not Found',
    error: { code: 'not_found', message: 'Resource not found', details: [] },
  });
}
