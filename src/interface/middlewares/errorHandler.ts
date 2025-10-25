import { Request, Response, NextFunction } from 'express';
import { ApiError, errorResponse } from '../../shared/errors/ApiError';
import { logger } from '../../shared/logger';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  const apiErr =
    err instanceof ApiError
      ? err
      : new ApiError(500, 'internal_error', err.message || 'Internal Server Error');
  if (apiErr.status >= 500) {
    logger.error({ err }, 'Unhandled error');
  }
  res
    .status(apiErr.status)
    .json({ data: null, meta: null, message: 'Error', error: errorResponse(apiErr) });
}
