import { Router } from 'express';
import { getSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink, reorderSocialLinks } from '../controllers/socialLink.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { socialLinkSchema } from '../validators/socialLink.validator';
import { reorderSchema } from '../validators/common.validator';

const router = Router();

router.get('/', getSocialLinks);
router.post('/reorder', protect, adminOnly, validate(reorderSchema), reorderSocialLinks);
router.post('/', protect, adminOnly, validate(socialLinkSchema), createSocialLink);
router.put('/:id', protect, adminOnly, validate(socialLinkSchema.partial()), updateSocialLink);
router.delete('/:id', protect, adminOnly, deleteSocialLink);

export default router;
