import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, ExternalLink } from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { SectionHeading } from '../../components/common/SectionHeading';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { Badge } from '../../components/ui/Badge';
import { useSkills } from '../../hooks/useSkills';
import { useSocialLinks } from '../../hooks/useSocialLinks';
import { getSocialIcon } from '../../utils/formatters';
import type { SkillCategory } from '../../types';

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  programming: 'Programming Languages',
  frontend: 'Frontend Development',
  backend: 'Backend & APIs',
  database: 'Databases & Storage',
  devops: 'DevOps & Cloud',
  tools: 'Tools & Utilities',
  other: 'Other Skills',
};

const PROFICIENCY_LABELS: Record<number, string> = {
  1: 'Beginner',
  2: 'Intermediate',
  3: 'Advanced',
  4: 'Expert',
  5: 'Master',
};

const TECH_ICONS: Record<string, string> = {
  react: '⚛️',
  reactjs: '⚛️',
  'react.js': '⚛️',
  node: '🟢',
  nodejs: '🟢',
  'node.js': '🟢',
  express: '🚀',
  expressjs: '🚀',
  'express.js': '🚀',
  mongodb: '🍃',
  mongo: '🍃',
  javascript: '🟨',
  js: '🟨',
  typescript: '🔷',
  ts: '🔷',
  html: '🌐',
  html5: '🌐',
  css: '🎨',
  css3: '🎨',
  c: '⚡',
  'c++': '💻',
  java: '☕',
  python: '🐍',
  sql: '🐬',
  mysql: '🐬',
  postgresql: '🐘',
  git: '🐙',
  github: '🐙',
  tailwind: '🌊',
  bootstrap: '💜',
  docker: '🐳',
  aws: '☁️',
};

const getSkillIcon = (name: string, customIcon?: string): string => {
  if (customIcon && customIcon.trim()) return customIcon;
  const key = name.toLowerCase().trim();
  return TECH_ICONS[key] || '⚡';
};

export default function SkillsPage() {
  const { data, isLoading } = useSkills();
  const { data: socialData } = useSocialLinks();
  const skills = data?.data ?? [];
  const socialLinks = (socialData?.data ?? []).filter((l) => l.active);

  const codingLinks = socialLinks.filter((l) =>
    ['leetcode', 'geeksforgeeks', 'gfg', 'codechef', 'hackerrank', 'codeforces', 'hackerearth', 'kaggle', 'interviewbit'].includes(
      l.platform.toLowerCase()
    )
  );

  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all');
  const categories = [...new Set(skills.map((s) => s.category))] as SkillCategory[];
  const filtered = activeCategory === 'all' ? skills : skills.filter((s) => s.category === activeCategory);

  return (
    <>
      <SEO title="Technical Skills & DSA" description="Technical skills, DSA platforms, and tools mastered by Lokendra Kumar" />

      {/* Stylish Header Banner */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8 bg-surface/30 border-b border-border/40 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative max-w-5xl mx-auto text-center space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold text-text tracking-tight"
          >
            Technical <span className="text-gradient">Arsenal & DSA</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted max-w-2xl mx-auto"
          >
            Technologies, frameworks, and coding platforms Lokendra Kumar uses to solve Data Structures & Algorithms challenges.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Category Tabs */}
        {categories.length > 0 && (
          <div className="flex gap-2.5 overflow-x-auto pb-2 justify-start sm:justify-center mb-12 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                activeCategory === 'all'
                  ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105'
                  : 'bg-card/80 border border-border/80 text-muted hover:text-text hover:border-primary/40'
              }`}
            >
              All Skills ({skills.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105'
                    : 'bg-card/80 border border-border/80 text-muted hover:text-text hover:border-primary/40'
                }`}
              >
                {CATEGORY_LABELS[cat] ?? cat}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-3xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No skills found" description="Skills will appear here once added." />
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filtered.map((skill, i) => {
                const icon = getSkillIcon(skill.name, skill.icon);
                const percent = skill.proficiency * 20;
                const label = PROFICIENCY_LABELS[skill.proficiency] || 'Advanced';

                const badgeStyle =
                  skill.proficiency === 5
                    ? 'bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-red-500/15 text-amber-400 border-amber-500/40 shadow-amber-500/20'
                    : skill.proficiency === 4
                    ? 'bg-gradient-to-r from-purple-500/15 via-fuchsia-500/15 to-pink-500/15 text-purple-300 border-purple-500/40 shadow-purple-500/20'
                    : skill.proficiency === 3
                    ? 'bg-gradient-to-r from-blue-500/15 via-cyan-500/15 to-sky-500/15 text-cyan-300 border-cyan-500/40 shadow-cyan-500/20'
                    : skill.proficiency === 2
                    ? 'bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-green-500/15 text-emerald-300 border-emerald-500/40 shadow-emerald-500/20'
                    : 'bg-gradient-to-r from-slate-500/15 to-gray-500/15 text-slate-300 border-slate-500/30';

                return (
                  <motion.div
                    key={skill._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.03, duration: 0.35 }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative bg-card/80 backdrop-blur-xl border border-border/80 hover:border-primary/60 transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-primary/10 rounded-3xl p-6 overflow-hidden flex flex-col justify-between cursor-default"
                  >
                    {/* Shimmer sweep animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

                    {/* Background Glow */}
                    <div className="absolute -right-8 -top-8 w-28 h-28 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/25 transition-colors duration-500 pointer-events-none" />

                    <div>
                      <div className="relative flex items-start justify-between gap-2 mb-4">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-12 h-12 rounded-2xl bg-surface border border-border/60 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 group-hover:border-primary/50 group-hover:shadow-md transition-all duration-300 flex-shrink-0">
                            {icon}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-extrabold text-text text-base group-hover:text-primary transition-colors truncate">
                              {skill.name}
                            </h3>
                            <span className={`inline-block text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border tracking-wider mt-1 ${badgeStyle}`}>
                              {label}
                            </span>
                          </div>
                        </div>
                        {skill.featured && (
                          <Badge variant="primary" size="sm" className="shadow-sm uppercase text-[9px] font-black tracking-wider flex-shrink-0">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="relative pt-2">
                      <div className="flex justify-between text-[11px] font-extrabold text-muted mb-1.5 px-0.5">
                        <span className="text-muted/70">Proficiency</span>
                        <span className="text-primary font-black">{percent}%</span>
                      </div>
                      <div className="w-full bg-surface border border-border/50 rounded-full h-2.5 overflow-hidden shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${percent}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
                          className="h-full rounded-full bg-gradient-to-r from-primary via-primary to-accent relative"
                        >
                          <div className="absolute inset-0 bg-white/20 w-full animate-pulse-slow" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Dedicated DSA & Competitive Programming Profiles Section */}
        {codingLinks.length > 0 && (
          <div className="mt-20 border-t border-border/50 pt-16">
            <SectionHeading
              title="Coding & DSA Practice Profiles"
              subtitle="Explore my problem-solving profiles across LeetCode, GeeksforGeeks, and competitive coding platforms"
              center
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-10">
              {codingLinks.map((l) => {
                const Icon = getSocialIcon(l.platform);
                return (
                  <a
                    key={l._id}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group bg-card/80 backdrop-blur-md border border-border/80 rounded-3xl p-5 hover:border-primary/60 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform flex-shrink-0">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-text text-base capitalize group-hover:text-primary transition-colors truncate">
                          {l.platform}
                        </h4>
                        <p className="text-xs text-muted truncate font-medium mt-0.5">
                          {l.username || 'View Profile'}
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}