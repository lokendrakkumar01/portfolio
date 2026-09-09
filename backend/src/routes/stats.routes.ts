import { Router } from 'express';
import { getStats } from '../controllers/stats.controller';

const router = Router();

// Allow public to see basic stats, admin sees more
// We will conditionally check req.user in controller without throwing error if not logged in
import { protect } from '../middleware/auth.middleware';

// Use a custom middleware just to attach user without failing if no token
const optionalAuth = (req: any, res: any, next: any) => {
  protect(req, res, (err: any) => {
    // ignore error and proceed
    next();
  });
};

router.get('/', optionalAuth, getStats);

export default router;
