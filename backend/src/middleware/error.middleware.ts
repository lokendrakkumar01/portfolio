import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { config } from '../config/env';

export const errorHandler = (
  err: Error & { statusCode?: number; code?: number; keyValue?: Record<string, string> },
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(`${req.method} ${req.path}:`, err.message);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors: unknown = undefined;

  // Zod validation error
  if (err instanceof ZodError) {
    statusCode = 422;
    message = 'Validation failed';
    errors = err.errors.map(e => ({ field: e.path.join('.'), message: e.message }));
  }

  // Mongoose duplicate key
  if (err.code === 11000 && err.keyValue) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  // Mongoose CastError (invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(config.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
};
