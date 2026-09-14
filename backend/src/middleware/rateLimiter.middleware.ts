import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: { success: false, message: 'Too many login attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 15,
  message: { success: false, message: 'Too many contact requests. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 500,
  message: { success: false, message: 'Too many uploads. Try again later.' },
  skip: (req) => !!(req.headers.authorization?.startsWith('Bearer ') || req.cookies?.token),
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000, // 10,000 requests per 15 minutes
  message: { success: false, message: 'Too many requests. Please try again in a few moments.' },
  skip: (req) =>
    req.method === 'OPTIONS' ||
    !!(req.headers.authorization?.startsWith('Bearer ') || req.cookies?.token),
  standardHeaders: true,
  legacyHeaders: false,
});
