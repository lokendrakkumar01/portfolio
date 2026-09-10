import { Request, Response } from 'express';
import { Certificate } from '../models/Certificate';
import { sendSuccess, sendError, sendPaginatedSuccess } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import { getPaginationParams } from '../utils/pagination';

export const getCertificates = asyncHandler(async (req: Request, res: Response) => {
  const { q, category, featured } = req.query as Record<string, string>;
  const filter: any = {};
  if (!req.user) filter.published = true;
  if (category) filter.category = category;
  if (featured === 'true') filter.featured = true;
  if (featured === 'false') filter.featured = false;
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { issuer: { $regex: q, $options: 'i' } },
    ];
  }
  const { page, limit, skip } = getPaginationParams(req.query as Record<string, string>);
  const [items, total] = await Promise.all([
    Certificate.find(filter).sort({ displayOrder: 1, issueDate: -1 }).skip(skip).limit(limit),
    Certificate.countDocuments(filter),
  ]);
  sendPaginatedSuccess(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
});

export const getCertificate = asyncHandler(async (req: Request, res: Response) => {
  const item = await Certificate.findById(req.params.id);
  if (!item) return sendError(res, 'Certificate not found', 404);
  sendSuccess(res, item);
});

export const createCertificate = asyncHandler(async (req: Request, res: Response) => {
  const item = await Certificate.create(req.body);
  sendSuccess(res, item, 'Certificate created', 201);
});

export const updateCertificate = asyncHandler(async (req: Request, res: Response) => {
  const item = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return sendError(res, 'Certificate not found', 404);
  sendSuccess(res, item, 'Certificate updated');
});

export const deleteCertificate = asyncHandler(async (req: Request, res: Response) => {
  const item = await Certificate.findByIdAndDelete(req.params.id);
  if (!item) return sendError(res, 'Certificate not found', 404);
  sendSuccess(res, null, 'Certificate deleted');
});
