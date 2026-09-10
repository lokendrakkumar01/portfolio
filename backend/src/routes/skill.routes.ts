import { Router } from 'express';
import { getSkills, getSkill, createSkill, updateSkill, deleteSkill, reorderSkills } from '../controllers/skill.controller';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { skillSchema } from '../validators/skill.validator';
import { reorderSchema } from '../validators/common.validator';

const router = Router();

router.get('/', optionalAuth, getSkills);
router.post('/reorder', protect, adminOnly, validate(reorderSchema), reorderSkills);
router.get('/:id', optionalAuth, getSkill);
router.post('/', protect, adminOnly, validate(skillSchema), createSkill);
router.put('/:id', protect, adminOnly, validate(skillSchema.partial()), updateSkill);
router.delete('/:id', protect, adminOnly, deleteSkill);

export default router;
