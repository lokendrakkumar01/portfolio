import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { updateSettingsSchema } from '../validators/settings.validator';

const router = Router();

router.get('/', getSettings);
router.put('/', protect, adminOnly, validate(updateSettingsSchema), updateSettings);

export default router;
