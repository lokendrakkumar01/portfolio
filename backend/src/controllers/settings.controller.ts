import { Request, Response } from 'express';
import { SiteSettings } from '../models/SiteSettings';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

export const getSettings = asyncHandler(async (_req: Request, res: Response) => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  sendSuccess(res, settings);
});

export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
  const settings = await SiteSettings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
  sendSuccess(res, settings, 'Settings updated');
});
