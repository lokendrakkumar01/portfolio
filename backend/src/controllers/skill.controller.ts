import { Request, Response } from 'express';
import { Skill } from '../models/Skill';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

export const getSkills = asyncHandler(async (req: Request, res: Response) => {
  const { category, featured, q } = req.query as Record<string, string>;
  const filter: Record<string, unknown> = {};
  if (!req.user) filter.published = true;
  if (category) filter.category = category;
  if (featured === 'true') filter.featured = true;
  if (q) filter.name = { $regex: q, $options: 'i' };
  const skills = await Skill.find(filter).sort({ displayOrder: 1, name: 1 });
  sendSuccess(res, skills);
});

export const getSkill = asyncHandler(async (req: Request, res: Response) => {
  const skill = await Skill.findById(req.params.id);
  if (!skill) return sendError(res, 'Skill not found', 404);
  sendSuccess(res, skill);
});

export const createSkill = asyncHandler(async (req: Request, res: Response) => {
  const skill = await Skill.create(req.body);
  sendSuccess(res, skill, 'Skill created', 201);
});

export const updateSkill = asyncHandler(async (req: Request, res: Response) => {
  const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!skill) return sendError(res, 'Skill not found', 404);
  sendSuccess(res, skill, 'Skill updated');
});

export const deleteSkill = asyncHandler(async (req: Request, res: Response) => {
  const skill = await Skill.findByIdAndDelete(req.params.id);
  if (!skill) return sendError(res, 'Skill not found', 404);
  sendSuccess(res, null, 'Skill deleted');
});

export const reorderSkills = asyncHandler(async (req: Request, res: Response) => {
  const { items } = req.body as { items: Array<{ id: string; displayOrder: number }> };
  await Promise.all(items.map(({ id, displayOrder }) =>
    Skill.findByIdAndUpdate(id, { displayOrder })
  ));
  sendSuccess(res, null, 'Skills reordered');
});
