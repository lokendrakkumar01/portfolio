import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config/env';
import { sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

interface JwtPayload {
  id: string;
  role: string;
}

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return sendError(res, 'Not authorized. No token.', 401);
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    const user = await User.findById(decoded.id).select('+passwordHash');
    if (!user) {
      return sendError(res, 'User not found.', 401);
    }
    req.user = user;
    next();
  } catch {
    return sendError(res, 'Invalid or expired token.', 401);
  }
});

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return sendError(res, 'Access denied. Admin only.', 403);
  }
  next();
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    User.findById(decoded.id)
      .then((user) => {
        if (user) req.user = user;
        next();
      })
      .catch(() => next());
  } catch {
    next();
  }
};
