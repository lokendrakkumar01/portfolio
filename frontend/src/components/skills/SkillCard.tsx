import { motion, useReducedMotion } from 'framer-motion';
import { Cloud, Code2, Database, Layers3, PanelsTopLeft, ServerCog, Wrench } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { getProficiencyLabel } from '../../utils/formatters';
import type { Skill, SkillCategory } from '../../types';

const TECH_ICONS: Record<string, string> = {
  react: '⚛️', reactjs: '⚛️', 'react.js': '⚛️', node: '🟢', nodejs: '🟢', 'node.js': '🟢',
  express: '🚀', expressjs: '🚀', 'express.js': '🚀', mongodb: '🍃', mongo: '🍃',
  javascript: '🟨', js: '🟨', typescript: '🔷', ts: '🔷', html: '🌐', html5: '🌐',
  css: '🎨', css3: '🎨', c: '⚡', 'c++': '💻', java: '☕', python: '🐍', sql: '🐬',
  mysql: '🐬', postgresql: '🐘', git: '🐙', github: '🐙', tailwind: '🌊', bootstrap: '💜', docker: '🐳', aws: '☁️',
};

const LEVEL_STYLES: Record<number, string> = {
  1: 'border-slate-400/30 bg-slate-400/10 text-slate-500 dark:text-slate-300',
  2: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-700 dark:text-emerald-300',
  3: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-700 dark:text-cyan-300',
  4: 'border-violet-400/30 bg-violet-400/10 text-violet-700 dark:text-violet-300',
  5: 'border-amber-400/30 bg-amber-400/10 text-amber-700 dark:text-amber-300',
};

export const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  programming: 'Programming Languages',
  frontend: 'Frontend Development',
  backend: 'Backend & APIs',
  database: 'Databases & Storage',
  devops: 'DevOps & Cloud',
  tools: 'Tools & Utilities',
  other: 'Other Skills',
};

interface SkillCardProps {
  skill: Skill;
  index?: number;
  compact?: boolean;
}

export function SkillCard({ skill, index = 0, compact = false }: SkillCardProps) {
  const reduceMotion = useReducedMotion();
  const percent = skill.proficiency * 20;
  const icon = skill.icon?.trim() || TECH_ICONS[skill.name.toLowerCase().trim()] || '✳';

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      whileHover={reduceMotion ? undefined : { y: -5 }}
      transition={{ duration: reduceMotion ? 0 : 0.35, delay: reduceMotion ? 0 : Math.min(index % 8, 7) * 0.045 }}
      className={`skill-card group relative flex min-w-0 flex-col justify-between overflow-hidden rounded-2xl bg-card/90 shadow-sm backdrop-blur-xl transition-shadow hover:shadow-xl hover:shadow-primary/10 ${compact ? 'p-3 sm:p-4' : 'p-3 sm:p-5'}`}
    >
      <div className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition-colors group-hover:bg-accent/20" />

      <div className="relative flex min-w-0 items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-surface text-xl shadow-inner transition-transform group-hover:scale-105 sm:h-12 sm:w-12 sm:text-2xl" aria-hidden="true">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="min-h-5 truncate text-sm font-extrabold leading-tight text-text transition-colors group-hover:text-primary sm:text-base" title={skill.name}>
            {skill.name}
          </h3>
          <div className="mt-1 flex min-w-0 flex-wrap items-center gap-1.5">
            <span className={`inline-flex w-fit max-w-full shrink-0 whitespace-nowrap rounded-full border px-1.5 py-1 text-center text-[8px] font-black uppercase leading-tight tracking-normal sm:px-2 sm:py-0.5 sm:text-[10px] sm:tracking-wider ${LEVEL_STYLES[skill.proficiency] ?? LEVEL_STYLES[1]}`}>
              {getProficiencyLabel(skill.proficiency)}
            </span>
            {skill.featured && !compact && <Badge variant="primary" size="sm" className="shrink-0 text-[8px] sm:text-[9px]">Featured</Badge>}
          </div>
        </div>
      </div>

      <div className="relative mt-5">
        <div className="mb-2 flex items-center justify-between gap-2 text-[10px] font-bold text-muted sm:text-xs">
          <span>Proficiency</span>
          <span className="font-black tabular-nums text-primary">{percent}%</span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full border border-border/60 bg-surface shadow-inner"
          role="progressbar"
          aria-label={`${skill.name} proficiency`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <motion.div
            initial={reduceMotion ? false : { width: 0 }}
            whileInView={{ width: `${percent}%` }}
            viewport={{ once: true }}
            transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.12, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-primary via-sky-400 to-accent"
          />
        </div>
      </div>
    </motion.article>
  );
}

export function CategoryIcon({ category }: { category: SkillCategory }) {
  const common = { className: 'h-5 w-5', 'aria-hidden': true as const };
  switch (category) {
    case 'programming': return <Code2 {...common} />;
    case 'frontend': return <PanelsTopLeft {...common} />;
    case 'backend': return <ServerCog {...common} />;
    case 'database': return <Database {...common} />;
    case 'devops': return <Cloud {...common} />;
    case 'tools': return <Wrench {...common} />;
    default: return <Layers3 {...common} />;
  }
}
