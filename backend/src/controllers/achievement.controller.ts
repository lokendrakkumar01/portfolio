import { Request, Response } from 'express';
import { Achievement } from '../models/Achievement';
import { sendSuccess, sendError, sendPaginatedSuccess } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import { getPaginationParams } from '../utils/pagination';

export const getAchievements = asyncHandler(async (req: Request, res: Response) => {
  const filter: any = {};
  if (!req.user) filter.published = true;
  const { page, limit, skip } = getPaginationParams(req.query as Record<string, string>);
  const [items, total] = await Promise.all([
    Achievement.find(filter).sort({ date: -1 }).skip(skip).limit(limit),
    Achievement.countDocuments(filter),
  ]);
  sendPaginatedSuccess(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
});

export const getAchievement = asyncHandler(async (req: Request, res: Response) => {
  const item = await Achievement.findById(req.params.id);
  if (!item) return sendError(res, 'Achievement not found', 404);
  sendSuccess(res, item);
});

export const createAchievement = asyncHandler(async (req: Request, res: Response) => {
  const item = await Achievement.create(req.body);
  sendSuccess(res, item, 'Achievement created', 201);
});

export const updateAchievement = asyncHandler(async (req: Request, res: Response) => {
  const item = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return sendError(res, 'Achievement not found', 404);
  sendSuccess(res, item, 'Achievement updated');
});

export const deleteAchievement = asyncHandler(async (req: Request, res: Response) => {
  const item = await Achievement.findByIdAndDelete(req.params.id);
  if (!item) return sendError(res, 'Achievement not found', 404);
  sendSuccess(res, null, 'Achievement deleted');
});
