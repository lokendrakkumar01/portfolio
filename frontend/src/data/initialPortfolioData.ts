import type { Profile, SiteSettings, Stats, SocialLink, Resume, Skill, Project, PaginationMeta } from '../types';

export function getCached<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    return (parsed?.data !== undefined ? parsed.data : parsed) as T;
  } catch {
    return fallback;
  }
}

export function setCached<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore quota errors
  }
}

export function removeCached(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function clearPortfolioCache(prefix: string = 'portfolio_'): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch {
    // ignore
  }
}

export const INITIAL_PROFILE: Profile = {
  _id: '6aa1c2e5be35fb15574de19a',
  name: 'Lokendra kumar',
  username: 'johndoe',
  title: 'Cyber Security Analyst | Full Stack Developer (MERN)',
  tagline: 'Crafting digital experiences',
  shortBio: 'Cyber Security Analyst | Full Stack Developer (MERN) | Java & DSA | Building Secure & Scalable Applications',
  longBio: `I am Lokendra Kumar, a passionate and dedicated technology enthusiast with a strong interest in Software Development, Data Structures & Algorithms, and Cyber Security. I have hands-on experience with Full-Stack Development using modern web technologies and enjoy building secure, scalable, and user-friendly applications.

Currently, I am strengthening my programming and problem-solving skills through C Programming, Data Structures & Algorithms (DSA), and Design & Analysis of Algorithms (DAA). I continuously work on improving my coding skills, understanding core computer science concepts, and developing practical projects that solve real-world problems.

I am always eager to learn new technologies, take on challenging problems, and grow as a software developer while building impactful and reliable digital solutions.`,
  location: 'Lucknow',
  email: 'lokendrafranklin@gmail.com',
  phone: '9568804305',
  availability: 'available',
  profileImage: 'https://res.cloudinary.com/dc6yyzex4/image/upload/v1789045859/portfolio/profile/y7hpnilrjj5vycfuhs9k.jpg',
  profileImagePublicId: 'portfolio/profile/y7hpnilrjj5vycfuhs9k',
  createdAt: '2026-09-09T20:34:45.804Z',
  updatedAt: '2026-09-10T13:22:01.747Z',
};

export const INITIAL_SETTINGS: SiteSettings = {
  _id: '6aa1c2e5be35fb15574de19c',
  siteName: 'Lokendra Kumar',
  siteTitle: 'Lokendra Kumar | Portfolio',
  siteDescription: 'Portfolio of Lokendra Kumar - Cyber Security Analyst & Full Stack MERN Developer',
  primaryEmail: 'lokendrakumar4812@gmail.com',
  contactEnabled: true,
  maintenanceMode: false,
  createdAt: '2026-09-09T20:34:45.856Z',
  updatedAt: '2026-09-11T09:42:49.425Z',
};

export const INITIAL_STATS: Stats = {
  projects: 9,
  certificates: 6,
  achievements: 2,
  skills: 13,
  education: 3,
  experience: 1,
  gallery: 5,
  unreadMessages: 0,
};

export const INITIAL_RESUME: Resume = {
  _id: '6aa30fe1eb0842a2da922ad1',
  fileUrl: 'https://res.cloudinary.com/dc6yyzex4/raw/upload/v1789071328/portfolio/resume/y1nx4exi8d3wjaahfwjd',
  filePublicId: 'portfolio/resume/y1nx4exi8d3wjaahfwjd',
  fileName: 'Lokendra_Kumar_cv_6373.pdf',
  fileSize: 252304,
  version: 2,
  isCurrent: true,
  uploadedAt: '2026-09-10T20:15:29.222Z',
  createdAt: '2026-09-10T20:15:29.223Z',
  updatedAt: '2026-09-11T16:56:38.899Z',
};

export const INITIAL_SOCIAL_LINKS: SocialLink[] = [
  {
    _id: '6aa2a24733e0530ab0d4c7ee',
    platform: 'github',
    url: 'https://github.com/lokendrakkumar01',
    username: 'Lokendrakumar',
    active: true,
    displayOrder: 0,
    createdAt: '2026-09-10T12:27:51.018Z',
    updatedAt: '2026-09-10T12:27:51.018Z',
  },
  {
    _id: '6aa2a26733e0530ab0d4c7fb',
    platform: 'linkedin',
    url: 'https://linkedin.com/in/lokendrakumar13',
    username: 'Lokendrakumar',
    active: true,
    displayOrder: 1,
    createdAt: '2026-09-10T12:28:23.897Z',
    updatedAt: '2026-09-10T12:28:23.897Z',
  },
  {
    _id: '6aa2baf71d29313fca068e74',
    platform: 'leetcode',
    url: 'https://leetcode.com/u/Lokenndakumar/',
    username: 'Lokendrakumar',
    active: true,
    displayOrder: 2,
    createdAt: '2026-09-10T14:13:11.496Z',
    updatedAt: '2026-09-10T14:13:11.496Z',
  },
  {
    _id: '6aa307ddeb0842a2da922911',
    platform: 'geeksforgeeks',
    url: 'https://www.geeksforgeeks.org/profile/lokendrakumar12',
    username: 'Lokendra kumar',
    active: true,
    displayOrder: 3,
    createdAt: '2026-09-10T19:41:17.987Z',
    updatedAt: '2026-09-10T19:41:17.987Z',
  },
  {
    _id: '6aa3081beb0842a2da922915',
    platform: 'codechef',
    url: 'https://www.codechef.com/users/husk_cast_93',
    username: 'Lokendra Kumar',
    active: true,
    displayOrder: 4,
    createdAt: '2026-09-10T19:42:19.898Z',
    updatedAt: '2026-09-11T14:29:31.856Z',
  },
  {
    _id: '6aa4112df7509d0407e80544',
    platform: 'hackerrank',
    url: 'https://www.hackerrank.com/profile/lokendrafranklin',
    username: 'lokendrafranklin',
    active: true,
    displayOrder: 5,
    createdAt: '2026-09-11T14:33:17.965Z',
    updatedAt: '2026-09-11T14:33:17.965Z',
  },
  {
    _id: '6aa2b7ef3270ae45fda23b13',
    platform: 'instagram',
    url: 'https://www.instagram.com/loke_ndrakumar123/?__pwa=1#',
    username: 'Lokendra kumar',
    active: true,
    displayOrder: 6,
    createdAt: '2026-09-10T14:00:15.051Z',
    updatedAt: '2026-09-10T14:00:15.051Z',
  },
  {
    _id: '6aa2c5e11d29313fca069142',
    platform: 'youtube',
    url: 'https://youtube.com/@uaacademy9629?si=HUG86glFMG31Rg5w',
    username: 'Lokendra kumar',
    active: true,
    displayOrder: 7,
    createdAt: '2026-09-10T14:59:45.890Z',
    updatedAt: '2026-09-10T14:59:45.890Z',
  },
];

export const INITIAL_SKILLS: Skill[] = [
  { _id: '6aa59b273059ec280a8b240e', name: 'React.js', category: 'frontend', icon: '⚛️', proficiency: 4, featured: true, displayOrder: 0, published: true, createdAt: '', updatedAt: '' },
  { _id: '6aa1c2e5be35fb15574de1a3', name: 'Node.js', category: 'backend', icon: '🟢', proficiency: 4, featured: true, displayOrder: 1, published: true, createdAt: '', updatedAt: '' },
  { _id: '6aa1c2e5be35fb15574de1a9', name: 'Express.js', category: 'backend', icon: '🚂', proficiency: 4, featured: true, displayOrder: 2, published: true, createdAt: '', updatedAt: '' },
  { _id: '6aa24ca4d97d7209a81c4295', name: 'MongoDB', category: 'database', icon: '🍃', proficiency: 4, featured: true, displayOrder: 3, published: true, createdAt: '', updatedAt: '' },
  { _id: '6aa2a88f6e6a832827c482b4', name: 'JAVA', category: 'programming', icon: '☕', proficiency: 3, featured: true, displayOrder: 4, published: true, createdAt: '', updatedAt: '' },
  { _id: '6aa1c2e5be35fb15574de19e', name: 'C', category: 'programming', icon: '🔷', proficiency: 4, featured: true, displayOrder: 5, published: true, createdAt: '', updatedAt: '' },
  { _id: '6aa2c2951d29313fca069035', name: 'JavaScript', category: 'frontend', icon: '💛', proficiency: 4, featured: true, displayOrder: 6, published: true, createdAt: '', updatedAt: '' },
  { _id: '6aa1c2e5be35fb15574de1a6', name: 'HTML', category: 'frontend', icon: '🌐', proficiency: 4, featured: true, displayOrder: 7, published: true, createdAt: '', updatedAt: '' },
  { _id: '6aa1c2e5be35fb15574de1a5', name: 'CSS', category: 'frontend', icon: '🎨', proficiency: 3, featured: true, displayOrder: 8, published: true, createdAt: '', updatedAt: '' },
  { _id: '6aa2a8726e6a832827c482ad', name: 'MySQL', category: 'database', icon: '🐬', proficiency: 3, featured: true, displayOrder: 9, published: true, createdAt: '', updatedAt: '' },
  { _id: '6aa2c2c81d29313fca06904f', name: 'Git', category: 'tools', icon: '🔧', proficiency: 3, featured: true, displayOrder: 10, published: true, createdAt: '', updatedAt: '' },
  { _id: '6aa2c2bc1d29313fca069042', name: 'GitHub', category: 'tools', icon: '🐙', proficiency: 4, featured: true, displayOrder: 11, published: true, createdAt: '', updatedAt: '' },
  { _id: '6aa2c2e31d29313fca06905c', name: 'ChatGPT / AI', category: 'tools', icon: '🤖', proficiency: 4, featured: true, displayOrder: 12, published: true, createdAt: '', updatedAt: '' },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    _id: '6aa64ca777feb70832f46069',
    title: 'LokuResume AI',
    slug: 'lokuresume-ai',
    shortDescription: 'AI-Powered Resume Builder and optimizer',
    description: 'An intelligent AI-powered resume builder that analyzes job descriptions, formats modern resumes, and provides real-time scoring.',
    category: 'web',
    status: 'completed',
    coverImage: 'https://res.cloudinary.com/dc6yyzex4/image/upload/v1789283496/portfolio/projects/jqwdjwnrjbbddrwlpgv2.jpg',
    complexity: 'advanced',
    startDate: '2025-09-01T00:00:00.000Z',
    githubUrl: 'https://github.com/lokendrakkumar01/LokuResume-AI',
    liveUrl: 'https://lokuresume-ai-008k.onrender.com',
    featured: true,
    published: true,
    displayOrder: 0,
    screenshots: [],
    features: ['AI Resume Analysis', 'Real-time ATS Scoring', 'Custom PDF Export'],
    technologies: ['React.js', 'FastAPI', 'Python', 'MongoDB', 'AI API'],
    createdAt: '2026-09-13T07:12:00.000Z',
    updatedAt: '2026-09-13T07:12:00.000Z',
  },
  {
    _id: '6aa52b2d81e3e9eceddd6110',
    title: 'ColorVerse',
    slug: 'colorverse',
    shortDescription: 'Full-Stack Gaming & Wallet Platform',
    description: 'Interactive gaming platform featuring real-time socket events, wallet integration with Razorpay, and secure JWT authentication.',
    category: 'web',
    status: 'completed',
    coverImage: 'https://res.cloudinary.com/dc6yyzex4/image/upload/v1789209391/portfolio/projects/qzy1nh7ffstzssbdmpty.jpg',
    complexity: 'advanced',
    githubUrl: 'https://github.com/lokendrakkumar01/colorverse',
    liveUrl: 'https://colorverse-4mkw.onrender.com/',
    featured: true,
    published: true,
    displayOrder: 1,
    screenshots: [],
    features: ['Real-time Socket.IO', 'Wallet Integration', 'Razorpay Payment Gateway'],
    technologies: ['React.js Vite', 'Node.js', 'Express.js', 'MongoDB', 'Socket.io', 'Razorpay'],
    createdAt: '2026-09-12T10:36:00.000Z',
    updatedAt: '2026-09-12T10:36:00.000Z',
  },
  {
    _id: '6aa2bcb51d29313fca068ee2',
    title: 'AgroConnect',
    slug: 'agroconnect',
    shortDescription: 'Smart farm-to-buyer marketplace connecting farmers directly with buyers.',
    description: 'A platform built for hackathons to eliminate middlemen in agriculture and ensure transparent pricing for farmers.',
    category: 'hackathon',
    status: 'in-progress',
    coverImage: 'https://res.cloudinary.com/dc6yyzex4/image/upload/v1789050039/portfolio/projects/jtm9r3aed43bh6erwt5k.jpg',
    complexity: 'advanced',
    startDate: '2026-09-09T00:00:00.000Z',
    githubUrl: 'https://github.com/lokendrakkumar01/KisanDirect',
    liveUrl: 'https://agroconnect-on1t.onrender.com',
    featured: true,
    published: true,
    displayOrder: 2,
    screenshots: [],
    features: ['Direct Marketplace', 'Price Discovery', 'Order Tracking'],
    technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST API'],
    createdAt: '2026-09-10T14:20:00.000Z',
    updatedAt: '2026-09-10T14:20:00.000Z',
  },
  {
    _id: '6aa2575dd97d7209a81c43c7',
    title: 'Habit tracker',
    slug: 'habit-tracker',
    shortDescription: 'Productivity and habit tracking web application',
    description: 'Track daily habits, visualize streak statistics, and build long-term consistency with personalized reminders.',
    category: 'web',
    status: 'completed',
    coverImage: 'https://res.cloudinary.com/dc6yyzex4/image/upload/v1789046742/portfolio/projects/l5myvcseixkprlsr0isl.jpg',
    complexity: 'advanced',
    githubUrl: 'https://github.com/lokendrakkumar01/habit-tracker',
    liveUrl: 'https://habit-tracker-j1e6.onrender.com/',
    featured: true,
    published: true,
    displayOrder: 3,
    screenshots: [],
    features: ['Streak Tracking', 'Weekly Analytics', 'Category Filtering'],
    technologies: ['React.js', 'Node.js', 'MongoDB', 'Express.js'],
    createdAt: '2026-09-10T07:08:00.000Z',
    updatedAt: '2026-09-10T07:08:00.000Z',
  },
  {
    _id: '6aa25699d97d7209a81c43a3',
    title: 'ZUNO',
    slug: 'zuno',
    shortDescription: 'Modern social media networking platform',
    description: 'Social networking platform supporting user profiles, media sharing, posts, real-time engagement and interactions.',
    category: 'web',
    status: 'completed',
    coverImage: 'https://res.cloudinary.com/dc6yyzex4/image/upload/v1789046931/portfolio/projects/ffzu3m87nrz1zmapyhc2.jpg',
    complexity: 'advanced',
    startDate: '2024-08-01T00:00:00.000Z',
    githubUrl: 'https://github.com/lokendrakkumar01/zuno',
    liveUrl: 'https://zuno-3irv.onrender.com',
    featured: true,
    published: true,
    displayOrder: 4,
    screenshots: [],
    features: ['Feed & Posts', 'User Profiles', 'Media Uploads'],
    technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose'],
    createdAt: '2026-09-10T07:05:00.000Z',
    updatedAt: '2026-09-10T07:05:00.000Z',
  },
  {
    _id: '6aa648d377feb70832f46045',
    title: 'E-Kaward',
    slug: 'e-kaward',
    shortDescription: 'E-Waste Management & Recycling Platform',
    description: 'Eco-conscious platform facilitating safe disposal, pickup scheduling, and rewards for electronic waste recycling.',
    category: 'web',
    status: 'in-progress',
    coverImage: 'https://res.cloudinary.com/dc6yyzex4/image/upload/v1789282517/portfolio/projects/xhdxo0zgmtxrfihcmc0i.jpg',
    complexity: 'medium',
    githubUrl: 'https://github.com/lokendrakkumar01/E-Kabad',
    liveUrl: 'https://e-kabad-isxn.onrender.com',
    featured: true,
    published: true,
    displayOrder: 5,
    screenshots: [],
    features: ['Recycle Scheduling', 'Drop-off Locators', 'Impact Metric Tracking'],
    technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB'],
    createdAt: '2026-09-13T06:56:00.000Z',
    updatedAt: '2026-09-13T06:56:00.000Z',
  },
  {
    _id: '6aa545eb680604cfe1305f72',
    title: 'MyNotes',
    slug: 'mynotes',
    shortDescription: 'Universal Academic Notes Platform',
    description: 'Universal notes and study material sharing platform with cloud document storage.',
    category: 'other',
    status: 'completed',
    coverImage: 'https://res.cloudinary.com/dc6yyzex4/image/upload/v1789217695/portfolio/projects/oz4wzna2wxgaured5b6e.jpg',
    complexity: 'medium',
    githubUrl: 'https://github.com/lokendrakkumar01/mynotes',
    liveUrl: 'https://mynotes-5jj4.onrender.com',
    featured: false,
    published: true,
    displayOrder: 6,
    screenshots: [],
    features: ['Document Preview', 'Search & Tagging', 'PDF Downloads'],
    technologies: ['HTML', 'CSS', 'JavaScript', 'React.js', 'Node.js', 'Express.js', 'MongoDB'],
    createdAt: '2026-09-12T12:54:00.000Z',
    updatedAt: '2026-09-12T12:54:00.000Z',
  },
  {
    _id: '6aa5310981e3e9eceddd61fb',
    title: 'NovaChat',
    slug: 'novachat',
    shortDescription: 'Full-Stack Social Messaging Platform',
    description: 'Real-time chatting and social messaging application with direct messaging, group chat, and rich media attachment support.',
    category: 'other',
    status: 'in-progress',
    coverImage: 'https://res.cloudinary.com/dc6yyzex4/image/upload/v1789210891/portfolio/projects/noqdsfguls7ohoyhgct3.jpg',
    complexity: 'medium',
    githubUrl: 'https://github.com/lokendrakkumar01/Novachat',
    liveUrl: 'https://novachat-1-1ghr.onrender.com',
    featured: false,
    published: true,
    displayOrder: 7,
    screenshots: [],
    features: ['Real-time Messaging', 'Online Status', 'Media Sharing'],
    technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Socket.IO', 'Cloudinary'],
    createdAt: '2026-09-12T11:01:00.000Z',
    updatedAt: '2026-09-12T11:01:00.000Z',
  },
  {
    _id: '6aa5448c680604cfe1305f4e',
    title: 'NovaCalc',
    slug: 'novacalc',
    shortDescription: 'Advanced Scientific & Graphing Calculator',
    description: 'Comprehensive scientific calculator supporting advanced mathematical functions, trigonometry, and graphing capabilities.',
    category: 'academic',
    status: 'completed',
    coverImage: 'https://res.cloudinary.com/dc6yyzex4/image/upload/v1789215886/portfolio/projects/cskclivfeco8omxiblod.jpg',
    complexity: 'basic',
    githubUrl: 'https://github.com/lokendrakkumar01/Scientific-calculator',
    liveUrl: 'https://lokendrakkumar01.github.io/Scientific-calculator/',
    featured: false,
    published: true,
    displayOrder: 8,
    screenshots: [],
    features: ['Scientific Functions', 'Calculation History', 'Interactive Graphing'],
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    createdAt: '2026-09-12T12:24:00.000Z',
    updatedAt: '2026-09-12T12:24:00.000Z',
  },
];

export const INITIAL_PAGINATION: PaginationMeta = {
  page: 1,
  limit: 9,
  total: 9,
  totalPages: 1,
};
