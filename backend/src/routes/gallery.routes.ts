import { Router } from 'express';
import {
  getGalleries, getGallery, createGallery,
  updateGallery, deleteGallery, uploadBulkGallery
} from '../controllers/gallery.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';
import { uploadImage } from '../middleware/upload.middleware';
import { validate } from '../middleware/validate.middleware';
import { updateGallerySchema } from '../validators/gallery.validator';

const router = Router();

router.get('/', getGalleries);
router.get('/:id', getGallery);

router.post('/', protect, adminOnly, uploadImage.single('image'), createGallery);
router.post('/bulk', protect, adminOnly, uploadImage.array('images', 10), uploadBulkGallery);
router.put('/:id', protect, adminOnly, validate(updateGallerySchema), updateGallery);
router.delete('/:id', protect, adminOnly, deleteGallery);

export default router;
