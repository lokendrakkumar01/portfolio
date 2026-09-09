import { Router } from 'express';
import { getProfile, updateProfile, uploadProfileImage } from '../controllers/profile.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { updateProfileSchema } from '../validators/profile.validator';
import { uploadImage } from '../middleware/upload.middleware';

const router = Router();

router.get('/', getProfile);
router.put('/', protect, adminOnly, validate(updateProfileSchema), updateProfile);
router.post('/image', protect, adminOnly, uploadImage.single('image'), uploadProfileImage);

export default router;
