import { Router } from 'express';
import { getEducations, getEducation, createEducation, updateEducation, deleteEducation, reorderEducation } from '../controllers/education.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { educationSchema } from '../validators/education.validator';
import { reorderSchema } from '../validators/common.validator';

const router = Router();

router.get('/', getEducations);
router.post('/reorder', protect, adminOnly, validate(reorderSchema), reorderEducation);
router.get('/:id', getEducation);
router.post('/', protect, adminOnly, validate(educationSchema), createEducation);
router.put('/:id', protect, adminOnly, validate(educationSchema.partial()), updateEducation);
router.delete('/:id', protect, adminOnly, deleteEducation);

export default router;
