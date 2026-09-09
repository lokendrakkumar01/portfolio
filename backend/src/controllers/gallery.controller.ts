import { Request, Response } from 'express';
import { Gallery } from '../models/Gallery';
import { sendSuccess, sendError, sendPaginatedSuccess } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import { getPaginationParams } from '../utils/pagination';
import { getStorageProvider } from '../services/storage/storage.factory';

export const getGalleries = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.query as Record<string, string>;
  const filter: any = {};
  if (!req.user) filter.published = true;
  if (category) filter.category = category;
  const { page, limit, skip } = getPaginationParams(req.query as Record<string, string>);
  const [items, total] = await Promise.all([
    Gallery.find(filter).sort({ displayOrder: 1, createdAt: -1 }).skip(skip).limit(limit),
    Gallery.countDocuments(filter),
  ]);
  sendPaginatedSuccess(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
});

export const getGallery = asyncHandler(async (req: Request, res: Response) => {
  const item = await Gallery.findById(req.params.id);
  if (!item) return sendError(res, 'Gallery item not found', 404);
  sendSuccess(res, item);
});

export const createGallery = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) return sendError(res, 'No image provided', 400);
  const storage = getStorageProvider();
  const result = await storage.upload(req.file.buffer, req.file.mimetype, { folder: 'portfolio/gallery' });
  const item = await Gallery.create({
    ...req.body,
    imageUrl: result.url,
    imagePublicId: result.publicId,
  });
  sendSuccess(res, item, 'Gallery item created', 201);
});

export const updateGallery = asyncHandler(async (req: Request, res: Response) => {
  const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return sendError(res, 'Gallery item not found', 404);
  sendSuccess(res, item, 'Gallery item updated');
});

export const deleteGallery = asyncHandler(async (req: Request, res: Response) => {
  const item = await Gallery.findByIdAndDelete(req.params.id);
  if (!item) return sendError(res, 'Gallery item not found', 404);
  try { await getStorageProvider().delete(item.imagePublicId); } catch {}
  sendSuccess(res, null, 'Gallery item deleted');
});

export const uploadBulkGallery = asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) return sendError(res, 'No files provided', 400);
  const storage = getStorageProvider();
  const items = await Promise.all(files.map(async (file) => {
    const result = await storage.upload(file.buffer, file.mimetype, { folder: 'portfolio/gallery' });
    return Gallery.create({
      title: file.originalname,
      imageUrl: result.url,
      imagePublicId: result.publicId,
      category: req.body.category || 'other',
    });
  }));
  sendSuccess(res, items, 'Bulk upload successful', 201);
});
