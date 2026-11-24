import { Router } from 'express';
import { deleteVisitorSession, deleteVisitorSessions, getVisitorSessions, recordVisitorPageView } from '../controllers/analytics.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { visitorAnalyticsLimiter } from '../middleware/rateLimiter.middleware';
import { visitorPageViewSchema } from '../validators/analytics.validator';

const router = Router();

// Collection is consent-gated in the client, schema-limited, and stores no IP address.
router.post('/collect', visitorAnalyticsLimiter, validate(visitorPageViewSchema), recordVisitorPageView);

// All read and delete access to visitor records is restricted to authenticated administrators.
router.use(protect, adminOnly);
router.get('/', getVisitorSessions);
router.delete('/', deleteVisitorSessions);
router.delete('/:id', deleteVisitorSession);

export default router;
