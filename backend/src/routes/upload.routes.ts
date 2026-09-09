import { Router } from 'express';
import { uploadFile } from '../controllers/upload.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';
import { uploadAny } from '../middleware/upload.middleware';

const router = Router();

router.post('/', protect, adminOnly, uploadAny.single('file'), uploadFile);

export default router;
