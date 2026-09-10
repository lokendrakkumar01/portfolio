import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Facebook,
  Globe,
  Mail,
  ExternalLink,
  Code2,
  Terminal,
  Flame,
  Cpu,
  BarChart2,
  Zap,
  Database,
  Award,
  type LucideIcon,
} from 'lucide-react';

export const formatDate = (
  dateStr: string,
  format: 'long' | 'short' | 'year' | 'month-year' = 'long'
): string => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  if (format === 'year') return date.getFullYear().toString();
  if (format === 'month-year')
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  if (format === 'short')
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const formatDuration = (start: string, end?: string, current?: boolean): string => {
  const startDate = new Date(start);
  const endDate = current ? new Date() : end ? new Date(end) : new Date();
  const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    endDate.getMonth() -
    startDate.getMonth();
  if (months < 1) return 'Less than a month';
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''}`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return rem > 0 ? `${years} yr ${rem} mo` : `${years} year${years !== 1 ? 's' : ''}`;
};

export const getProficiencyLabel = (level: number): string => {
  const labels: Record<number, string> = {
    1: 'Beginner',
    2: 'Elementary',
    3: 'Intermediate',
    4: 'Advanced',
    5: 'Expert',
  };
  return labels[level] ?? 'Unknown';
};

export const getProficiencyColor = (level: number): string => {
  const colors: Record<number, string> = {
    1: 'bg-red-400',
    2: 'bg-orange-400',
    3: 'bg-yellow-400',
    4: 'bg-blue-500',
    5: 'bg-green-500',
  };
  return colors[level] ?? 'bg-gray-400';
};

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  x: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
  email: Mail,
  portfolio: Globe,
  leetcode: Code2,
  geeksforgeeks: Terminal,
  gfg: Terminal,
  codechef: Flame,
  hackerrank: Cpu,
  codeforces: BarChart2,
  hackerearth: Zap,
  kaggle: Database,
  interviewbit: Award,
};

export const getSocialIcon = (platform: string): LucideIcon =>
  SOCIAL_ICONS[platform.toLowerCase().replace(/\s+/g, '')] ?? ExternalLink;

export const truncate = (text: string, length: number): string =>
  text.length > length ? `${text.slice(0, length)}…` : text;

export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');

export const getEmploymentTypeLabel = (type: string): string => {
  const map: Record<string, string> = {
    'full-time': 'Full-time',
    'part-time': 'Part-time',
    internship: 'Internship',
    freelance: 'Freelance',
    volunteer: 'Volunteer',
    leadership: 'Leadership',
  };
  return map[type] ?? type;
};