import { Router } from 'express';
import {
  getAchievements, getAchievement, createAchievement,
  updateAchievement, deleteAchievement
} from '../controllers/achievement.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createAchievementSchema, updateAchievementSchema } from '../validators/achievement.validator';

const router = Router();

router.get('/', getAchievements);
router.get('/:id', getAchievement);

router.post('/', protect, adminOnly, validate(createAchievementSchema), createAchievement);
router.put('/:id', protect, adminOnly, validate(updateAchievementSchema), updateAchievement);
router.delete('/:id', protect, adminOnly, deleteAchievement);

export default router;
