import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO } from '../../components/common/SEO';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { Badge } from '../../components/ui/Badge';
import { useSkills } from '../../hooks/useSkills';
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
  const skills = data?.data ?? [];
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all');
  const categories = [...new Set(skills.map((s) => s.category))] as SkillCategory[];
  const filtered = activeCategory === 'all' ? skills : skills.filter((s) => s.category === activeCategory);

  return (
    <>
      <SEO title="Technical Skills" description="Technical skills, languages, and tools mastered by Lokendra Kumar" />
      
      {/* Stylish Header Banner */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8 bg-surface/30 border-b border-border/40 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative max-w-5xl mx-auto text-center space-y-3">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold text-text tracking-tight"
          >
            Technical <span className="text-gradient">Arsenal</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted max-w-2xl mx-auto"
          >
            Technologies, frameworks, and programming languages Lokendra Kumar uses to build scalable software.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Category Tabs */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2.5 justify-center mb-12">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
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
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
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

                return (
                  <motion.div
                    key={skill._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.04 }}
                    className="group relative bg-card/80 backdrop-blur-md border border-border/80 hover:border-primary/60 transition-all duration-300 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 rounded-3xl p-6 overflow-hidden flex flex-col justify-between"
                  >
                    {/* Background Glow */}
                    <div className="absolute -right-8 -top-8 w-28 h-28 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/25 transition-colors duration-500 pointer-events-none" />

                    <div>
                      <div className="relative flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-surface border border-border/60 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 group-hover:border-primary/40 transition-all duration-300">
                            {icon}
                          </div>
                          <div>
                            <h3 className="font-extrabold text-text text-base group-hover:text-primary transition-colors">
                              {skill.name}
                            </h3>
                            <p className="text-xs text-muted font-semibold mt-0.5">{label}</p>
                          </div>
                        </div>
                        {skill.featured && (
                          <Badge variant="primary" size="sm" className="shadow-sm uppercase text-[10px] font-bold">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="relative pt-2">
                      <div className="flex justify-between text-[11px] font-bold text-muted mb-1.5 px-0.5">
                        <span className="text-muted/70">Proficiency</span>
                        <span className="text-primary font-extrabold">{percent}%</span>
                      </div>
                      <div className="w-full bg-surface border border-border/50 rounded-full h-2.5 overflow-hidden shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${percent}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.1, ease: 'easeOut' }}
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
      </div>
    </>
  );
}