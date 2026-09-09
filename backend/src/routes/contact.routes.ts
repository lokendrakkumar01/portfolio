import { Router } from 'express';
import { submitContact } from '../controllers/contact.controller';
import { validate } from '../middleware/validate.middleware';
import { contactSchema } from '../validators/contact.validator';
import { contactLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

router.post('/', contactLimiter, validate(contactSchema), submitContact);

export default router;
