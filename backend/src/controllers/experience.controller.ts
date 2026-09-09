import { Request, Response } from 'express';
import { Experience } from '../models/Experience';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

export const getExperiences = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, unknown> = {};
  if (!req.user) filter.published = true;
  const items = await Experience.find(filter).sort({ displayOrder: 1, startDate: -1 });
  sendSuccess(res, items);
});

export const getExperience = asyncHandler(async (req: Request, res: Response) => {
  const item = await Experience.findById(req.params.id);
  if (!item) return sendError(res, 'Experience not found', 404);
  sendSuccess(res, item);
});

export const createExperience = asyncHandler(async (req: Request, res: Response) => {
  const item = await Experience.create(req.body);
  sendSuccess(res, item, 'Experience created', 201);
});

export const updateExperience = asyncHandler(async (req: Request, res: Response) => {
  const item = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return sendError(res, 'Experience not found', 404);
  sendSuccess(res, item, 'Experience updated');
});

export const deleteExperience = asyncHandler(async (req: Request, res: Response) => {
  const item = await Experience.findByIdAndDelete(req.params.id);
  if (!item) return sendError(res, 'Experience not found', 404);
  sendSuccess(res, null, 'Experience deleted');
});

export const reorderExperience = asyncHandler(async (req: Request, res: Response) => {
  const { items } = req.body as { items: Array<{ id: string; displayOrder: number }> };
  await Promise.all(items.map(({ id, displayOrder }) =>
    Experience.findByIdAndUpdate(id, { displayOrder })
  ));
  sendSuccess(res, null, 'Experience reordered');
});
