import { Request, Response } from 'express';
import { Profile } from '../models/Profile';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import { getStorageProvider } from '../services/storage/storage.factory';

export const getProfile = asyncHandler(async (_req: Request, res: Response) => {
  const profile = await Profile.findOne().populate('resumeId', 'fileUrl fileName isCurrent');
  sendSuccess(res, profile);
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await Profile.findOne();
  if (!profile) {
    const newProfile = await Profile.create(req.body);
    return sendSuccess(res, newProfile, 'Profile created', 201);
  }
  Object.assign(profile, req.body);
  await profile.save();
  sendSuccess(res, profile, 'Profile updated');
});

export const uploadProfileImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) return sendError(res, 'No file uploaded', 400);
  const storage = getStorageProvider();
  const result = await storage.upload(req.file.buffer, req.file.mimetype, { folder: 'portfolio/profile' });
  const profile = await Profile.findOne();
  if (profile?.profileImagePublicId) {
    try { await storage.delete(profile.profileImagePublicId); } catch {}
  }
  const updated = await Profile.findOneAndUpdate(
    {},
    { profileImage: result.url, profileImagePublicId: result.publicId },
    { new: true, upsert: true }
  );
  sendSuccess(res, updated, 'Profile image uploaded');
});
