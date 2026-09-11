import multer from 'multer';
import { Request } from 'express';

const mediaFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WEBP, GIF images and MP4, WEBM, MOV videos are allowed'));
  }
};

const pdfFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'));
  }
};

const anyFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  cb(null, true);
};

const storage = multer.memoryStorage();

export const uploadImage = multer({ storage, fileFilter: mediaFilter, limits: { fileSize: 100 * 1024 * 1024 } });
export const uploadPdf = multer({ storage, fileFilter: pdfFilter, limits: { fileSize: 25 * 1024 * 1024 } });
export const uploadAny = multer({ storage, fileFilter: anyFilter, limits: { fileSize: 100 * 1024 * 1024 } });
