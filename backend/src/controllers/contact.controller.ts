import { Request, Response } from 'express';
import { ContactMessage } from '../models/ContactMessage';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

export const submitContact = asyncHandler(async (req: Request, res: Response) => {
  const item = await ContactMessage.create({
    ...req.body,
    ipAddress: req.ip || req.socket.remoteAddress,
  });
  sendSuccess(res, item, 'Message sent successfully', 201);
});
