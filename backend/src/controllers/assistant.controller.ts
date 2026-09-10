import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { config } from '../config/env';
import { Profile } from '../models/Profile';
import { Skill } from '../models/Skill';
import { Project } from '../models/Project';
import { Experience } from '../models/Experience';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

const getPortfolioContext = async (): Promise<string> => {
  const [profile, skills, projects, experiences] = await Promise.all([
    Profile.findOne().lean(),
    Skill.find({ published: true }).lean(),
    Project.find({ published: true }).select('title shortDescription technologies category status').lean(),
    Experience.find({ published: true }).select('company position startDate endDate current').lean(),
  ]);

  return `You are an AI assistant for ${profile?.name ?? 'a developer'}'s portfolio website.
Profile: ${profile?.name ?? 'Developer'}, ${profile?.title ?? 'Software Engineer'}
Bio: ${profile?.shortBio ?? 'A passionate developer'}
Location: ${profile?.location ?? 'Not specified'}
Email: ${profile?.email ?? 'Not specified'}

Skills: ${skills.map(s => s.name).join(', ') || 'Not specified'}

Projects: ${projects.map(p => `${p.title} (${p.category}, ${p.status}) - ${p.shortDescription}`).join('; ') || 'None listed'}

Experience: ${experiences.map(e => `${e.position} at ${e.company}${e.current ? ' (Current)' : ''}`).join('; ') || 'None listed'}

Respond helpfully about this developer's work, skills, and experience. Keep responses concise (2-3 sentences max). Be friendly and professional. If asked about something not in the portfolio data, politely say you can only discuss the developer's portfolio.`;
};

let cachedContext: string | null = null;
let contextExpiry = 0;

const getContext = async (): Promise<string> => {
  if (cachedContext && Date.now() < contextExpiry) return cachedContext;
  cachedContext = await getPortfolioContext();
  contextExpiry = Date.now() + 5 * 60 * 1000; // 5 min cache
  return cachedContext;
};

export const chatWithAssistant = asyncHandler(async (req: Request, res: Response) => {
  const { message, history } = req.body;
  if (!message || typeof message !== 'string') {
    return sendError(res, 'Message is required', 400);
  }

  if (!config.GEMINI_API_KEY) {
    return sendError(res, 'AI assistant is not configured', 503);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });
    const systemInstruction = await getContext();

    const chatHistory = (history ?? []).slice(-10).map((h: { role: string; text: string }) => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        ...chatHistory,
        { role: 'user', parts: [{ text: message }] },
      ],
      config: {
        systemInstruction,
        maxOutputTokens: 300,
        temperature: 0.7,
      },
    });

    const reply = response.text ?? 'Sorry, I could not generate a response.';
    sendSuccess(res, { reply }, 'Response generated');
  } catch (error: any) {
    console.error('Gemini API error:', error?.message);
    sendError(res, 'Failed to generate response. Please try again.', 500);
  }
});
