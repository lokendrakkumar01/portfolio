import multer from 'multer';
import { Request } from 'express';

const mediaFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const mimetype = (file.mimetype || '').toLowerCase();
  const ext = (file.originalname || '').split('.').pop()?.toLowerCase() || '';

  const mimeByExtension: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp',
    gif: 'image/gif', bmp: 'image/bmp', heic: 'image/heic', heif: 'image/heif',
    jfif: 'image/jpeg', avif: 'image/avif', mp4: 'video/mp4', webm: 'video/webm',
    mov: 'video/quicktime', avi: 'video/x-msvideo', mkv: 'video/x-matroska',
    flv: 'video/x-flv', '3gp': 'video/3gpp', m4v: 'video/x-m4v',
  };
  const expectedMime = mimeByExtension[ext];

  if (expectedMime && (mimetype === expectedMime || mimetype === 'application/octet-stream')) {
    if (mimetype === 'application/octet-stream') file.mimetype = expectedMime;
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const pdfFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const mimetype = (file.mimetype || '').toLowerCase();
  const ext = (file.originalname || '').split('.').pop()?.toLowerCase() || '';

  if (ext === 'pdf' && (mimetype === 'application/pdf' || mimetype === 'application/octet-stream')) {
    if (mimetype === 'application/octet-stream') file.mimetype = 'application/pdf';
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const anyFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = (file.originalname || '').split('.').pop()?.toLowerCase() || '';
  if (ext === 'pdf') return pdfFilter(req, file, cb);
  return mediaFilter(req, file, cb);
};

const storage = multer.memoryStorage();

export const uploadImage = multer({ storage, fileFilter: mediaFilter, limits: { fileSize: 100 * 1024 * 1024 } });
export const uploadPdf = multer({ storage, fileFilter: pdfFilter, limits: { fileSize: 25 * 1024 * 1024 } });
export const uploadAny = multer({ storage, fileFilter: anyFilter, limits: { fileSize: 100 * 1024 * 1024 } });
