import { Request, Response } from 'express';
import { Project } from '../models/Project';
import { sendSuccess, sendError, sendPaginatedSuccess } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import { getPaginationParams } from '../utils/pagination';
import { getStorageProvider } from '../services/storage/storage.factory';
import { slugify } from '../utils/slugify';

export const getProjects = asyncHandler(async (req: Request, res: Response) => {
  const { q, category, status, featured } = req.query as Record<string, string>;
  const filter: any = {};
  if (!req.user) filter.published = true;
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (featured === 'true') filter.featured = true;
  if (featured === 'false') filter.featured = false;
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { shortDescription: { $regex: q, $options: 'i' } },
      { technologies: { $regex: q, $options: 'i' } },
    ];
  }
  const { page, limit, skip } = getPaginationParams(req.query as Record<string, string>);
  const [items, total] = await Promise.all([
    Project.find(filter).sort({ displayOrder: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
    Project.countDocuments(filter),
  ]);
  sendPaginatedSuccess(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
});

export const getProject = asyncHandler(async (req: Request, res: Response) => {
  const item = await Project.findById(req.params.id).lean();
  if (!item) return sendError(res, 'Project not found', 404);
  sendSuccess(res, item);
});

export const getProjectBySlug = asyncHandler(async (req: Request, res: Response) => {
  const filter: any = { slug: req.params.slug };
  if (!req.user) filter.published = true;
  const item = await Project.findOne(filter).lean();
  if (!item) return sendError(res, 'Project not found', 404);
  sendSuccess(res, item);
});

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  let baseSlug = slugify(req.body.title || 'project');
  let slug = baseSlug;
  let counter = 1;
  while (await Project.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  const item = await Project.create({ ...req.body, slug });
  sendSuccess(res, item, 'Project created', 201);
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  if (req.body.title) {
    let baseSlug = slugify(req.body.title);
    let slug = baseSlug;
    let counter = 1;
    while (await Project.findOne({ slug, _id: { $ne: req.params.id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    req.body.slug = slug;
  }
  const item = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return sendError(res, 'Project not found', 404);
  sendSuccess(res, item, 'Project updated');
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const item = await Project.findByIdAndDelete(req.params.id);
  if (!item) return sendError(res, 'Project not found', 404);
  sendSuccess(res, null, 'Project deleted');
});

export const uploadCoverImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) return sendError(res, 'No file uploaded', 400);
  const storage = getStorageProvider();
  const result = await storage.upload(req.file.buffer, req.file.mimetype, { folder: 'portfolio/projects' });
  const item = await Project.findById(req.params.id);
  if (!item) return sendError(res, 'Project not found', 404);
  if (item.coverImagePublicId) {
    try { await storage.delete(item.coverImagePublicId); } catch {}
  }
  item.coverImage = result.url;
  item.coverImagePublicId = result.publicId;
  await item.save();
  sendSuccess(res, item, 'Cover image uploaded');
});

export const addScreenshot = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) return sendError(res, 'No file uploaded', 400);
  const storage = getStorageProvider();
  const result = await storage.upload(req.file.buffer, req.file.mimetype, { folder: 'portfolio/projects/screenshots' });
  const item = await Project.findById(req.params.id);
  if (!item) return sendError(res, 'Project not found', 404);
  item.screenshots.push({ url: result.url, publicId: result.publicId, caption: req.body.caption, order: req.body.order || 0 });
  await item.save();
  sendSuccess(res, item, 'Screenshot added');
});

export const deleteScreenshot = asyncHandler(async (req: Request, res: Response) => {
  const item = await Project.findById(req.params.id);
  if (!item) return sendError(res, 'Project not found', 404);
  const screenshot = item.screenshots.find(s => s._id?.toString() === req.params.screenshotId);
  if (!screenshot) return sendError(res, 'Screenshot not found', 404);
  try { await getStorageProvider().delete(screenshot.publicId); } catch {}
  item.screenshots = item.screenshots.filter(s => s._id?.toString() !== req.params.screenshotId) as any;
  await item.save();
  sendSuccess(res, item, 'Screenshot deleted');
});
