import { Request, Response } from 'express';
import { Gallery } from '../models/Gallery';
import { sendSuccess, sendError, sendPaginatedSuccess } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import { getPaginationParams } from '../utils/pagination';
import { getStorageProvider } from '../services/storage/storage.factory';

export const getGalleries = asyncHandler(async (req: Request, res: Response) => {
  const { category, featured, published } = req.query as Record<string, string>;
  const filter: any = {};

  // Default behavior: ONLY return published items (published === true) for public portfolio.
  // If published === 'all' (passed by Admin panel), return both published and hidden items.
  if (published === 'all') {
    // Admin viewing all items - no filter on published
  } else if (published === 'false') {
    filter.published = false;
  } else {
    // Public portfolio view (default): return ONLY published items
    filter.published = true;
  }

  if (category && category.trim() && category.trim() !== 'all') {
    filter.category = category.trim();
  }
  if (featured === 'true') filter.featured = true;

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
  let imageUrl = req.body.imageUrl || '';
  let imagePublicId = '';
  let mediaType = req.body.mediaType || 'image';

  if (req.file) {
    const storage = getStorageProvider();
    const result = await storage.upload(req.file.buffer, req.file.mimetype, { folder: 'portfolio/gallery' });
    imageUrl = result.url;
    imagePublicId = result.publicId;
    if (req.file.mimetype.startsWith('video/')) {
      mediaType = 'video';
    }
  }

  if (!imageUrl) {
    return sendError(res, 'No image or video provided', 400);
  }

  const item = await Gallery.create({
    title: req.body.title || (req.file ? req.file.originalname.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') : 'Gallery Item'),
    description: req.body.description || '',
    category: req.body.category || 'events',
    imageUrl,
    imagePublicId,
    mediaType,
    published: req.body.published !== undefined ? req.body.published === 'true' || req.body.published === true : true,
    featured: req.body.featured === 'true' || req.body.featured === true,
  });

  sendSuccess(res, item, 'Gallery item created', 201);
});

export const updateGallery = asyncHandler(async (req: Request, res: Response) => {
  const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return sendError(res, 'Gallery item not found', 404);
  sendSuccess(res, item, 'Gallery item updated');
});

export const deleteGallery = asyncHandler(async (req: Request, res: Response) => {
  const item = await Gallery.findById(req.params.id);
  if (!item) return sendError(res, 'Gallery item not found', 404);

  // Permanently delete from MongoDB Database
  await Gallery.findByIdAndDelete(req.params.id);

  // Clean up Cloudinary / Local file storage
  try {
    const storage = getStorageProvider();
    let publicId = item.imagePublicId;
    let resourceType: 'image' | 'video' | 'raw' = item.mediaType === 'video' ? 'video' : 'image';

    if (!publicId && item.imageUrl && item.imageUrl.includes('cloudinary.com')) {
      if (item.imageUrl.includes('/video/upload/')) {
        resourceType = 'video';
      }
      const parts = item.imageUrl.split('/upload/');
      if (parts.length > 1) {
        let afterUpload = parts[1];
        afterUpload = afterUpload.replace(/^v\d+\//, '');
        publicId = afterUpload.replace(/\.[^/.]+$/, '');
      }
    }

    if (publicId) {
      console.log(`🗑️ Deleting Cloudinary asset: publicId=${publicId}, resourceType=${resourceType}`);
      await storage.delete(publicId, resourceType);
    } else if (item.imageUrl && item.imageUrl.includes('/uploads/')) {
      const filename = item.imageUrl.split('/uploads/').pop();
      if (filename) {
        await storage.delete(filename);
      }
    }
  } catch (err) {
    console.error('⚠️ File deletion cleanup error:', err);
  }

  sendSuccess(res, null, 'Gallery item deleted permanently from database and Cloudinary storage');
});

export const uploadBulkGallery = asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) return sendError(res, 'No files provided', 400);
  const storage = getStorageProvider();
  const category = req.body.category || 'events';

  const items = await Promise.all(
    files.map(async (file) => {
      const result = await storage.upload(file.buffer, file.mimetype, { folder: 'portfolio/gallery' });
      const cleanTitle = file.originalname.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const mediaType = file.mimetype.startsWith('video/') ? 'video' : 'image';
      return Gallery.create({
        title: cleanTitle,
        imageUrl: result.url,
        imagePublicId: result.publicId,
        mediaType,
        category,
        published: true,
        featured: false,
      });
    })
  );
  sendSuccess(res, items, 'Bulk upload successful', 201);
});
