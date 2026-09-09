import { Router } from 'express';
import { getExperiences, getExperience, createExperience, updateExperience, deleteExperience, reorderExperience } from '../controllers/experience.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { experienceSchema } from '../validators/experience.validator';
import { reorderSchema } from '../validators/common.validator';

const router = Router();

router.get('/', getExperiences);
router.post('/reorder', protect, adminOnly, validate(reorderSchema), reorderExperience);
router.get('/:id', getExperience);
router.post('/', protect, adminOnly, validate(experienceSchema), createExperience);
router.put('/:id', protect, adminOnly, validate(experienceSchema.partial()), updateExperience);
router.delete('/:id', protect, adminOnly, deleteExperience);

export default router;
