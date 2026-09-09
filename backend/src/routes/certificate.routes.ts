import { Router } from 'express';
import {
  getCertificates, getCertificate, createCertificate,
  updateCertificate, deleteCertificate
} from '../controllers/certificate.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createCertificateSchema, updateCertificateSchema } from '../validators/certificate.validator';

const router = Router();

router.get('/', getCertificates);
router.get('/:id', getCertificate);

router.post('/', protect, adminOnly, validate(createCertificateSchema), createCertificate);
router.put('/:id', protect, adminOnly, validate(updateCertificateSchema), updateCertificate);
router.delete('/:id', protect, adminOnly, deleteCertificate);

export default router;
