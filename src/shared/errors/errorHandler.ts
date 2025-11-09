import { NextFunction, Request, Response } from 'express';
import { logger } from '../logger';
import { ApiError } from './ApiError';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }

  logger.error(err);

  return res.status(500).json({ message: 'Internal server error' });
};
