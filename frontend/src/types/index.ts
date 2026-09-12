// ─── API Response Wrappers ───────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: PaginationMeta;
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  email: string;
  role: 'admin';
  lastLogin?: string;
}

// ─── Profile ─────────────────────────────────────────────────────────────────
export interface Profile {
  _id: string;
  name: string;
  username: string;
  title: string;
  tagline: string;
  shortBio: string;
  longBio: string;
  profileImage?: string;
  profileImagePublicId?: string;
  location: string;
  email: string;
  phone?: string;
  availability: 'available' | 'busy' | 'not-looking';
  resumeId?: Resume;
  createdAt: string;
  updatedAt: string;
}

// ─── Skill ───────────────────────────────────────────────────────────────────
export type SkillCategory = 'programming' | 'frontend' | 'backend' | 'database' | 'devops' | 'tools' | 'other';

export interface Skill {
  _id: string;
  name: string;
  category: SkillCategory;
  icon?: string;
  proficiency: 1 | 2 | 3 | 4 | 5;
  displayOrder: number;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Education ───────────────────────────────────────────────────────────────
export interface Education {
  _id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  grade?: string;
  description?: string;
  logo?: string;
  location?: string;
  displayOrder: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Experience ──────────────────────────────────────────────────────────────
export type EmploymentType = 'full-time' | 'part-time' | 'internship' | 'freelance' | 'volunteer' | 'leadership';

export interface Experience {
  _id: string;
  company: string;
  position: string;
  employmentType: EmploymentType;
  location?: string;
  remote: boolean;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  responsibilities: string[];
  technologies: string[];
  companyLogo?: string;
  companyUrl?: string;
  displayOrder: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Project ─────────────────────────────────────────────────────────────────
export type ProjectCategory = 'web' | 'mobile' | 'ai-ml' | 'backend' | 'open-source' | 'academic' | 'hackathon' | 'other';
export type ProjectStatus = 'completed' | 'in-progress' | 'archived';

export interface ProjectScreenshot {
  _id?: string;
  url: string;
  publicId: string;
  caption?: string;
  order: number;
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  problem?: string;
  solution?: string;
  features: string[];
  technologies: string[];
  category: ProjectCategory;
  coverImage?: string;
  coverImagePublicId?: string;
  screenshots: ProjectScreenshot[];
  githubUrl?: string;
  liveUrl?: string;
  videoUrl?: string;
  documentationUrl?: string;
  complexity?: 'advanced' | 'medium' | 'basic';
  featured: boolean;
  status: ProjectStatus;
  published: boolean;
  startDate?: string;
  endDate?: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Certificate ─────────────────────────────────────────────────────────────
export type CertificateCategory = 'programming' | 'web-development' | 'cloud' | 'database' | 'ai-ml' | 'cybersecurity' | 'other';

export interface Certificate {
  _id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  verificationUrl?: string;
  certificateImage?: string;
  certificatePdf?: string;
  description?: string;
  skills: string[];
  category: CertificateCategory;
  featured: boolean;
  published: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Achievement ─────────────────────────────────────────────────────────────
export type AchievementCategory = 'hackathon' | 'competition' | 'award' | 'leadership' | 'academic' | 'technical' | 'event' | 'other';

export interface Achievement {
  _id: string;
  title: string;
  organization: string;
  event?: string;
  date: string;
  category: AchievementCategory;
  description?: string;
  rank?: string;
  position?: string;
  image?: string;
  certificate?: string;
  verificationUrl?: string;
  featured: boolean;
  published: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Gallery ─────────────────────────────────────────────────────────────────
export type GalleryCategory = 'events' | 'hackathons' | 'college' | 'projects' | 'achievements' | 'certificates' | 'personal' | 'other';

export interface GalleryItem {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  imagePublicId: string;
  mediaType?: 'image' | 'video';
  category: GalleryCategory;
  gridSpan?: number;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'wide';
  date?: string;
  location?: string;
  featured: boolean;
  published: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Resume ──────────────────────────────────────────────────────────────────
export interface Resume {
  _id: string;
  fileUrl: string;
  filePublicId: string;
  fileName: string;
  fileSize: number;
  version: number;
  isCurrent: boolean;
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Social Link ─────────────────────────────────────────────────────────────
export interface SocialLink {
  _id: string;
  platform: string;
  url: string;
  username?: string;
  icon?: string;
  active: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Contact Message ─────────────────────────────────────────────────────────
export type MessageStatus = 'unread' | 'read' | 'archived';

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  ipAddress?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Site Settings ───────────────────────────────────────────────────────────
export interface SiteSettings {
  _id: string;
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  favicon?: string;
  logo?: string;
  primaryEmail: string;
  contactEnabled: boolean;
  maintenanceMode: boolean;
  socialPreviewImage?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Stats ───────────────────────────────────────────────────────────────────
export interface Stats {
  projects: number;
  certificates: number;
  achievements: number;
  skills: number;
  education: number;
  experience: number;
  gallery: number;
  unreadMessages: number;
}