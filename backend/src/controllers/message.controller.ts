import { Request, Response } from 'express';
import { ContactMessage } from '../models/ContactMessage';
import { sendSuccess, sendError, sendPaginatedSuccess } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import { getPaginationParams } from '../utils/pagination';

export const getMessages = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.query as Record<string, string>;
  const filter: any = {};
  if (status) filter.status = status;
  const { page, limit, skip } = getPaginationParams(req.query as Record<string, string>);
  const [items, total] = await Promise.all([
    ContactMessage.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ContactMessage.countDocuments(filter),
  ]);
  sendPaginatedSuccess(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
});

export const getMessage = asyncHandler(async (req: Request, res: Response) => {
  const item = await ContactMessage.findById(req.params.id);
  if (!item) return sendError(res, 'Message not found', 404);
  sendSuccess(res, item);
});

export const updateMessageStatus = asyncHandler(async (req: Request, res: Response) => {
  const item = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!item) return sendError(res, 'Message not found', 404);
  sendSuccess(res, item, 'Message status updated');
});

export const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
  const item = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!item) return sendError(res, 'Message not found', 404);
  sendSuccess(res, null, 'Message deleted');
});
