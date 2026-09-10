import { Router } from 'express';
import { getResumes, getCurrentResume, uploadResume, setResumeCurrent, deleteResume } from '../controllers/resume.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';
import { uploadPdf } from '../middleware/upload.middleware';

const router = Router();

router.get('/', protect, adminOnly, getResumes);
router.get('/current', getCurrentResume);
router.post('/', protect, adminOnly, uploadPdf.single('file'), uploadResume);
router.put('/:id/current', protect, adminOnly, setResumeCurrent);
router.patch('/:id/current', protect, adminOnly, setResumeCurrent);
router.delete('/:id', protect, adminOnly, deleteResume);

export default router;
