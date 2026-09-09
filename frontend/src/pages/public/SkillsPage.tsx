import { useState } from 'react';
import { motion } from 'framer-motion';
import { SEO } from '../../components/common/SEO';
import { SectionHeading } from '../../components/common/SectionHeading';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { useSkills } from '../../hooks/useSkills';
import { getProficiencyLabel, getProficiencyColor } from '../../utils/formatters';
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

export default function SkillsPage() {
  const { data, isLoading } = useSkills();
  const skills = data?.data ?? [];
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all');
  const categories = [...new Set(skills.map((s) => s.category))] as SkillCategory[];
  const filtered = activeCategory === 'all' ? skills : skills.filter((s) => s.category === activeCategory);

  return (
    <>
      <SEO title="Skills" description="Technical skills and tools I work with" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeading title="Skills & Technologies" subtitle="Everything I can build with" center />
        
        {/* Filter tabs */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCategory === 'all' ? 'bg-primary text-white' : 'bg-card border border-border text-muted hover:text-text'}`}
            >All</button>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-primary text-white' : 'bg-card border border-border text-muted hover:text-text'}`}
              >{CATEGORY_LABELS[cat] ?? cat}</button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No skills found" description="Skills will appear here once added." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filtered.map((skill, i) => (
              <motion.div key={skill._id}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.03 }}
                className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 hover:shadow-md transition-all text-center">
                {skill.icon && <div className="text-3xl mb-2">{skill.icon}</div>}
                <h3 className="font-semibold text-text text-sm mb-1">{skill.name}</h3>
                <p className="text-xs text-muted mb-2">{getProficiencyLabel(skill.proficiency)}</p>
                <div className="w-full bg-border rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${getProficiencyColor(skill.proficiency)}`} style={{ width: `${skill.proficiency * 20}%` }} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}