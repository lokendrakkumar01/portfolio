import { Router } from 'express';
import {
  getProjects, getProject, getProjectBySlug, createProject,
  updateProject, deleteProject, uploadCoverImage, addScreenshot, deleteScreenshot
} from '../controllers/project.controller';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.middleware';
import { uploadImage } from '../middleware/upload.middleware';
import { validate } from '../middleware/validate.middleware';
import { createProjectSchema, updateProjectSchema } from '../validators/project.validator';

const router = Router();

router.get('/', optionalAuth, getProjects);
router.get('/slug/:slug', optionalAuth, getProjectBySlug);
router.get('/:id', optionalAuth, getProject);

router.post('/', protect, adminOnly, validate(createProjectSchema), createProject);
router.put('/:id', protect, adminOnly, validate(updateProjectSchema), updateProject);
router.delete('/:id', protect, adminOnly, deleteProject);
router.post('/:id/cover', protect, adminOnly, uploadImage.single('image'), uploadCoverImage);
router.post('/:id/screenshots', protect, adminOnly, uploadImage.single('image'), addScreenshot);
router.delete('/:id/screenshots/:screenshotId', protect, adminOnly, deleteScreenshot);

export default router;
