import { Request, Response } from 'express';
import { SocialLink } from '../models/SocialLink';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

export const getSocialLinks = asyncHandler(async (req: Request, res: Response) => {
  const filter: any = {};
  if (!req.user) filter.active = true;
  const items = await SocialLink.find(filter).sort({ displayOrder: 1 });
  sendSuccess(res, items);
});

export const createSocialLink = asyncHandler(async (req: Request, res: Response) => {
  const item = await SocialLink.create(req.body);
  sendSuccess(res, item, 'Social link created', 201);
});

export const updateSocialLink = asyncHandler(async (req: Request, res: Response) => {
  const item = await SocialLink.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return sendError(res, 'Social link not found', 404);
  sendSuccess(res, item, 'Social link updated');
});

export const deleteSocialLink = asyncHandler(async (req: Request, res: Response) => {
  const item = await SocialLink.findByIdAndDelete(req.params.id);
  if (!item) return sendError(res, 'Social link not found', 404);
  sendSuccess(res, null, 'Social link deleted');
});

export const reorderSocialLinks = asyncHandler(async (req: Request, res: Response) => {
  const { items } = req.body as { items: Array<{ id: string; displayOrder: number }> };
  await Promise.all(items.map(({ id, displayOrder }) =>
    SocialLink.findByIdAndUpdate(id, { displayOrder })
  ));
  sendSuccess(res, null, 'Social links reordered');
});
