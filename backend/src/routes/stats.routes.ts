import { Router } from 'express';
import { getStats } from '../controllers/stats.controller';
import { optionalAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', optionalAuth, getStats);

export default router;
