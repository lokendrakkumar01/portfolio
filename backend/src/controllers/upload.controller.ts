import { Request, Response } from 'express';
import { File } from '../models/File';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import { getStorageProvider } from '../services/storage/storage.factory';

export const uploadFile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) return sendError(res, 'No file provided', 400);
  const storage = getStorageProvider();
  const category = req.file.mimetype === 'application/pdf' ? 'pdf' : req.file.mimetype.startsWith('image/') ? 'image' : 'other';
  const result = await storage.upload(req.file.buffer, req.file.mimetype, { folder: 'portfolio/general' });
  const item = await File.create({
    originalName: req.file.originalname,
    storageName: result.publicId.split('/').pop() || result.publicId,
    url: result.url,
    publicId: result.publicId,
    mimeType: req.file.mimetype,
    size: req.file.size,
    category,
    uploadedBy: req.user!._id,
  });
  sendSuccess(res, item, 'File uploaded', 201);
});
