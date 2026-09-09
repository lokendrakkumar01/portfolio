import { Router } from 'express';
import { login, logout, getMe } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { loginLimiter } from '../middleware/rateLimiter.middleware';
import { validate } from '../middleware/validate.middleware';
import { loginSchema } from '../validators/auth.validator';

const router = Router();

router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;
