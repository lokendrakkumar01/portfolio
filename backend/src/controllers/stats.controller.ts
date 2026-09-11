import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';
import { Project } from '../models/Project';
import { Certificate } from '../models/Certificate';
import { Achievement } from '../models/Achievement';
import { Skill } from '../models/Skill';
import { Education } from '../models/Education';
import { Experience } from '../models/Experience';
import { Gallery } from '../models/Gallery';
import { ContactMessage } from '../models/ContactMessage';

export const getStats = asyncHandler(async (req: Request, res: Response) => {
  const isAdmin = !!req.user;
  if (!isAdmin) {
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  }
  const filter = isAdmin ? {} : { published: true };

  const [projects, certificates, achievements, skills, education, experience, gallery, messages] = await Promise.all([
    Project.countDocuments(filter),
    Certificate.countDocuments(filter),
    Achievement.countDocuments(filter),
    Skill.countDocuments(isAdmin ? {} : { published: true }),
    Education.countDocuments(filter),
    Experience.countDocuments(filter),
    Gallery.countDocuments(filter),
    isAdmin ? ContactMessage.countDocuments({ status: 'unread' }) : Promise.resolve(0),
  ]);

  sendSuccess(res, { projects, certificates, achievements, skills, education, experience, gallery, unreadMessages: messages });
});
