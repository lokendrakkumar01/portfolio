import { Request, Response } from 'express';
import { Education } from '../models/Education';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

export const getEducations = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, unknown> = {};
  if (!req.user) filter.published = true;
  const items = await Education.find(filter).sort({ displayOrder: 1, startDate: -1 });
  sendSuccess(res, items);
});

export const getEducation = asyncHandler(async (req: Request, res: Response) => {
  const item = await Education.findById(req.params.id);
  if (!item) return sendError(res, 'Education not found', 404);
  sendSuccess(res, item);
});

export const createEducation = asyncHandler(async (req: Request, res: Response) => {
  const item = await Education.create(req.body);
  sendSuccess(res, item, 'Education created', 201);
});

export const updateEducation = asyncHandler(async (req: Request, res: Response) => {
  const item = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return sendError(res, 'Education not found', 404);
  sendSuccess(res, item, 'Education updated');
});

export const deleteEducation = asyncHandler(async (req: Request, res: Response) => {
  const item = await Education.findByIdAndDelete(req.params.id);
  if (!item) return sendError(res, 'Education not found', 404);
  sendSuccess(res, null, 'Education deleted');
});

export const reorderEducation = asyncHandler(async (req: Request, res: Response) => {
  const { items } = req.body as { items: Array<{ id: string; displayOrder: number }> };
  await Promise.all(items.map(({ id, displayOrder }) =>
    Education.findByIdAndUpdate(id, { displayOrder })
  ));
  sendSuccess(res, null, 'Education reordered');
});
