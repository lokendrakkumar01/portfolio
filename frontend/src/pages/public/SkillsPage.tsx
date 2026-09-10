import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO } from '../../components/common/SEO';
import { SectionHeading } from '../../components/common/SectionHeading';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { Badge } from '../../components/ui/Badge';
import { useSkills } from '../../hooks/useSkills';
import type { SkillCategory } from '../../types';

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  programming: 'Programming Languages',
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Databases',
  devops: 'DevOps & Cloud',
  tools: 'Tools & Software',
  other: 'Other',
};

const PROFICIENCY_LABELS: Record<number, string> = {
  1: 'Beginner',
  2: 'Intermediate',
  3: 'Advanced',
  4: 'Expert',
  5: 'Master',
};

export default function SkillsPage() {
  const { data, isLoading } = useSkills();
  const skills = data?.data ?? [];
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all');
  const categories = [...new Set(skills.map((s) => s.category))] as SkillCategory[];
  const filtered = activeCategory === 'all' ? skills : skills.filter((s) => s.category === activeCategory);

  return (
    <>
      <SEO title="Skills" description="Technical skills and tools I work with" />
      
      {/* Stylish Header Banner */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8 bg-surface/30 border-b border-border/40 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-4"
          >
            Technical Arsenal
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted max-w-2xl mx-auto"
          >
            A comprehensive overview of my technical skills, tools, and technologies I use to build modern digital experiences.
          </motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter tabs */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${activeCategory === 'all' ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105' : 'bg-card/80 border border-border text-muted hover:text-text hover:bg-surface'}`}
            >All Skills</button>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${activeCategory === cat ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105' : 'bg-card/80 border border-border text-muted hover:text-text hover:bg-surface'}`}
              >{CATEGORY_LABELS[cat] ?? cat}</button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No skills found" description="Skills will appear here once added." />
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filtered.map((skill, i) => (
                <motion.div key={skill._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                  animate={{ opacity: 1, scale: 1, y: 0 }} 
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ delay: i * 0.04 }}
                  className="group relative bg-card/80 backdrop-blur-md border border-border hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 rounded-2xl p-5 overflow-hidden"
                >
                  {/* Subtle Background Glow */}
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors duration-500" />
                  
                  <div className="relative flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-surface/80 border border-border/50 flex items-center justify-center text-2xl shadow-inner group-hover:border-primary/30 group-hover:text-primary transition-colors">
                        {skill.icon ? skill.icon : '⚡'}
                      </div>
                      <div>
                        <h3 className="font-bold text-text text-base">{skill.name}</h3>
                        <p className="text-xs text-muted font-medium mt-0.5">{PROFICIENCY_LABELS[skill.proficiency] || 'Familiar'}</p>
                      </div>
                    </div>
                    {skill.featured && <Badge variant="primary" size="sm" className="shadow-sm">Featured</Badge>}
                  </div>

                  <div className="relative">
                    <div className="flex justify-between text-[10px] font-bold text-muted mb-1.5 px-0.5">
                      <span>0%</span>
                      <span className="text-primary">{skill.proficiency * 20}%</span>
                    </div>
                    <div className="w-full bg-surface border border-border/50 rounded-full h-2 overflow-hidden shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency * 20}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent relative"
                      >
                        <div className="absolute inset-0 bg-white/20 w-full animate-pulse-slow" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </>
  );
}