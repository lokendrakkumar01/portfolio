import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { config } from '../config/env';
import { Profile } from '../models/Profile';
import { Skill } from '../models/Skill';
import { Project } from '../models/Project';
import { Experience } from '../models/Experience';
import { Gallery } from '../models/Gallery';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

const getPortfolioData = async () => {
  const [profile, skills, projects, experiences, gallery] = await Promise.all([
    Profile.findOne().lean(),
    Skill.find({ published: true }).lean(),
    Project.find({ published: true }).select('title shortDescription technologies category status').lean(),
    Experience.find({ published: true }).select('company position startDate endDate current').lean(),
    Gallery.find({ published: true }).select('title description category mediaType featured createdAt').sort({ createdAt: -1 }).lean(),
  ]);
  return { profile, skills, projects, experiences, gallery };
};

const buildSystemContext = (data: any): string => {
  const { profile, skills, projects, experiences, gallery = [] } = data;
  const photoCount = gallery.filter((g: any) => g.mediaType === 'image').length;
  const videoCount = gallery.filter((g: any) => g.mediaType === 'video').length;
  const latestMedia = gallery.slice(0, 5).map((g: any) => `${g.title || 'Untitled'} (${g.mediaType}, ${g.category})`).join(', ');

  return `You are an AI Assistant for Lokendra Kumar's Developer Portfolio.
Name: Lokendra Kumar
Title: ${profile?.title || 'Full-Stack Developer & Software Engineer'}
Bio: ${profile?.shortBio || 'Building modern, performant, and scalable web applications.'}
Location: ${profile?.location || 'India'}
Email: ${profile?.email || 'lokendrafranklin@gmail.com'}

Key Skills: ${skills.map((s: any) => s.name).join(', ') || 'React.js, Node.js, Express.js, MongoDB, Java, HTML/CSS'}

Projects: ${projects.map((p: any) => `${p.title} (${p.category}): ${p.shortDescription}`).join('; ') || 'Habit Tracker, ZUNO Social Media Platform'}

Experience & Education: ${experiences.map((e: any) => `${e.position} at ${e.company}`).join('; ') || 'Software Development'}

Gallery & Media: ${gallery.length} published items (${photoCount} photos, ${videoCount} videos). Latest uploaded media: ${latestMedia || 'None'}.

Your Goal: Assist recruiters, clients, and visitors. Explain Lokendra's expertise, showcase his projects, gallery photos/videos, and guide them to navigate to specific sections (/projects, /skills, /gallery, /certificates, /about, /contact). Be concise (2-3 sentences max), professional, and friendly. Always refer to him as Lokendra Kumar.`;
};

const generateSmartFallback = (query: string, data: any): string => {
  const q = query.toLowerCase();
  const name = data.profile?.name || 'Lokendra Kumar';
  const title = data.profile?.title || 'Full-Stack Developer & Software Engineer';

  if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('namaste')) {
    return `Hello! 👋 I'm the AI Assistant for ${name}'s portfolio. I can answer questions about his software engineering experience, projects, gallery photos/videos, skills, or help you contact him!`;
  }

  if (q.includes('gallery') || q.includes('photo') || q.includes('video') || q.includes('picture') || q.includes('media')) {
    const galleryItems = data.gallery || [];
    const photos = galleryItems.filter((g: any) => g.mediaType === 'image').length;
    const videos = galleryItems.filter((g: any) => g.mediaType === 'video').length;
    return `${name}'s Portfolio features a dynamic Gallery with ${photos} photos and ${videos} videos showcasing events, hackathons, and projects! You can view them on the Gallery page (/gallery) or Home Page showcase.`;
  }

  if (q.includes('lokendra') || q.includes('who') || q.includes('about') || q.includes('bio') || q.includes('profile')) {
    return `${name} is a ${title}. He specializes in building modern full-stack web applications with React, Node.js, and MongoDB. You can learn more on his About page (/about)!`;
  }

  if (q.includes('project') || q.includes('work') || q.includes('app') || q.includes('built') || q.includes('portfolio')) {
    const projectList = data.projects.slice(0, 3).map((p: any) => p.title).join(', ') || 'Habit Tracker, ZUNO';
    return `${name} has engineered full-stack applications including ${projectList}. Check out all project demos on the Projects page (/projects)!`;
  }

  if (q.includes('skill') || q.includes('tech') || q.includes('stack') || q.includes('react') || q.includes('node') || q.includes('java')) {
    const topSkills = data.skills.slice(0, 6).map((s: any) => s.name).join(', ') || 'React, Node.js, Express, MongoDB, Java, HTML/CSS';
    return `${name}'s technical arsenal includes ${topSkills}. You can view his full proficiency chart on the Skills page (/skills)!`;
  }

  if (q.includes('certificat') || q.includes('degree') || q.includes('course') || q.includes('nptl') || q.includes('ui/ux')) {
    return `${name} holds professional certifications in UI/UX Design, Cyber Security, and Java Programming (NPTEL). View verified certificates on the Certificates page (/certificates)!`;
  }

  if (q.includes('contact') || q.includes('hire') || q.includes('email') || q.includes('reach') || q.includes('message')) {
    return `You can connect with ${name} directly via email at ${data.profile?.email || 'lokendrafranklin@gmail.com'} or send a message on the Contact page (/contact)!`;
  }

  return `${name} is a ${title} skilled in React, Node.js, Express, and MongoDB. Feel free to explore his Projects (/projects), Skills (/skills), Certificates (/certificates), or Contact him (/contact)!`;
};

export const chatWithAssistant = asyncHandler(async (req: Request, res: Response) => {
  const { message, history } = req.body;
  if (!message || typeof message !== 'string') {
    return sendSuccess(res, { reply: "Hi! How can I assist you with Lokendra Kumar's portfolio today?" });
  }

  const data = await getPortfolioData();
  const trimmedKey = config.GEMINI_API_KEY?.trim();

  if (!trimmedKey || trimmedKey.length < 10) {
    const fallbackReply = generateSmartFallback(message, data);
    return sendSuccess(res, { reply: fallbackReply }, 'Response generated');
  }

  try {
    const ai = new GoogleGenAI({ apiKey: trimmedKey });
    const systemInstruction = buildSystemContext(data);

    const chatHistory = (history ?? []).slice(-8).map((h: { role: string; text: string }) => ({
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

    const reply = response.text || generateSmartFallback(message, data);
    sendSuccess(res, { reply }, 'Response generated');
  } catch (error: any) {
    console.warn('Gemini API call failed, using intelligent fallback:', error?.message);
    const fallbackReply = generateSmartFallback(message, data);
    sendSuccess(res, { reply: fallbackReply }, 'Response generated via fallback');
  }
});
