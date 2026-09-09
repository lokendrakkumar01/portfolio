import { Request, Response } from 'express';
import { Resume } from '../models/Resume';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import { getStorageProvider } from '../services/storage/storage.factory';

export const getResumes = asyncHandler(async (_req: Request, res: Response) => {
  const items = await Resume.find().sort({ version: -1 });
  sendSuccess(res, items);
});

export const getCurrentResume = asyncHandler(async (_req: Request, res: Response) => {
  const item = await Resume.findOne({ isCurrent: true });
  if (!item) return sendError(res, 'No resume found', 404);
  sendSuccess(res, item);
});

export const uploadResume = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) return sendError(res, 'No file provided', 400);
  const storage = getStorageProvider();
  const result = await storage.upload(req.file.buffer, req.file.mimetype, { folder: 'portfolio/resume' });
  const latest = await Resume.findOne().sort({ version: -1 });
  const version = latest ? latest.version + 1 : 1;
  await Resume.updateMany({}, { isCurrent: false });
  const item = await Resume.create({
    fileUrl: result.url,
    filePublicId: result.publicId,
    fileName: req.file.originalname,
    fileSize: req.file.size,
    version,
    isCurrent: true,
  });
  sendSuccess(res, item, 'Resume uploaded', 201);
});

export const deleteResume = asyncHandler(async (req: Request, res: Response) => {
  const item = await Resume.findByIdAndDelete(req.params.id);
  if (!item) return sendError(res, 'Resume not found', 404);
  try { await getStorageProvider().delete(item.filePublicId, 'raw'); } catch {}
  if (item.isCurrent) {
    const latest = await Resume.findOne().sort({ version: -1 });
    if (latest) {
      latest.isCurrent = true;
      await latest.save();
    }
  }
  sendSuccess(res, null, 'Resume deleted');
});
