import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config/env';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import { logger } from '../utils/logger';

const generateToken = (id: string): string => {
  return jwt.sign({ id }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN as any });
};

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user || !(await user.comparePassword(password))) {
    logger.warn(`Failed login attempt for: ${email}`);
    return sendError(res, 'Invalid email or password', 401);
  }
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });
  const token = generateToken(user._id.toString());
  res.cookie('token', token, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  sendSuccess(res, {
    token,
    user: { id: user._id, email: user.email, role: user.role },
  }, 'Login successful');
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  sendSuccess(res, null, 'Logged out successfully');
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) return sendError(res, 'Not authenticated', 401);
  sendSuccess(res, { id: user._id, email: user.email, role: user.role, lastLogin: user.lastLogin });
});
