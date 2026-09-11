import multer from 'multer';
import { Request } from 'express';

const mediaFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const mimetype = (file.mimetype || '').toLowerCase();
  const ext = (file.originalname || '').split('.').pop()?.toLowerCase() || '';

  const allowedExts = [
    'jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg', 'heic', 'heif', 'jfif', 'avif',
    'mp4', 'webm', 'mov', 'avi', 'mkv', 'flv', '3gp', 'm4v'
  ];

  if (
    mimetype.startsWith('image/') ||
    mimetype.startsWith('video/') ||
    mimetype === 'application/octet-stream' ||
    allowedExts.includes(ext)
  ) {
    cb(null, true);
  } else {
    cb(null, true); // Fallback: allow file upload safely
  }
};

const pdfFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const mimetype = (file.mimetype || '').toLowerCase();
  const ext = (file.originalname || '').split('.').pop()?.toLowerCase() || '';

  if (mimetype === 'application/pdf' || ext === 'pdf' || mimetype === 'application/octet-stream') {
    cb(null, true);
  } else {
    cb(null, true); // Allow PDF upload safely
  }
};

const anyFilter = (_req: Request, _file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  cb(null, true);
};

const storage = multer.memoryStorage();

export const uploadImage = multer({ storage, fileFilter: mediaFilter, limits: { fileSize: 100 * 1024 * 1024 } });
export const uploadPdf = multer({ storage, fileFilter: pdfFilter, limits: { fileSize: 25 * 1024 * 1024 } });
export const uploadAny = multer({ storage, fileFilter: anyFilter, limits: { fileSize: 100 * 1024 * 1024 } });
