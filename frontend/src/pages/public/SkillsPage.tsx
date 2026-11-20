import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Code2, Search, Sparkles } from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { CategoryIcon, SkillCard, SKILL_CATEGORY_LABELS } from '../../components/skills/SkillCard';
import { useSkills } from '../../hooks/useSkills';
import { useSocialLinks } from '../../hooks/useSocialLinks';
import { getSocialIcon } from '../../utils/formatters';
import type { Skill, SkillCategory } from '../../types';

const CATEGORY_ORDER: SkillCategory[] = ['programming', 'frontend', 'backend', 'database', 'devops', 'tools', 'other'];

export default function SkillsPage() {
  const { data, isLoading } = useSkills();
  const { data: socialData } = useSocialLinks();
  const reduceMotion = useReducedMotion();
  const skills = (data?.data ?? []).filter((skill) => skill.published !== false);
  const socialLinks = (socialData?.data ?? []).filter((link) => link.active);
  const codingLinks = socialLinks.filter((link) =>
    ['leetcode', 'geeksforgeeks', 'gfg', 'codechef', 'hackerrank', 'codeforces', 'hackerearth', 'kaggle', 'interviewbit'].includes(link.platform.toLowerCase())
  );

  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all');
  const [search, setSearch] = useState('');

  const availableCategories = CATEGORY_ORDER.filter((category) => skills.some((skill) => skill.category === category));
  const filteredSkills = useMemo(() => {
    const query = search.trim().toLowerCase();
    return skills.filter((skill) =>
      (activeCategory === 'all' || skill.category === activeCategory) &&
      (!query || skill.name.toLowerCase().includes(query))
    );
  }, [skills, activeCategory, search]);
  const groupedSkills = CATEGORY_ORDER
    .map((category) => ({ category, items: filteredSkills.filter((skill) => skill.category === category) }))
    .filter((group) => group.items.length > 0);
  const average = skills.length
    ? Math.round(skills.reduce((total, skill) => total + skill.proficiency * 20, 0) / skills.length)
    : 0;

  return (
    <>
      <SEO title="Technical Skills & DSA" description="Technical skills, DSA platforms, and tools used by Lokendra Kumar" />

      <header className="skills-hero relative isolate overflow-hidden border-b border-border/50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="skills-grid-pattern absolute inset-0 -z-10" aria-hidden="true" />
        <div className="skills-orb skills-orb-one absolute -left-28 top-0 -z-10 h-72 w-72 rounded-full bg-primary/25 blur-3xl sm:h-96 sm:w-96" aria-hidden="true" />
        <div className="skills-orb skills-orb-two absolute -right-24 bottom-0 -z-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl sm:h-96 sm:w-96" aria-hidden="true" />

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.55 }}
          className="mx-auto max-w-7xl"
        >
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-card/60 px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary shadow-lg shadow-primary/5 backdrop-blur-xl sm:text-xs">
              <Sparkles className="h-4 w-4" /> Tech stack & capabilities
            </div>
            <h1 className="text-3xl font-black leading-tight tracking-tight text-text sm:text-5xl lg:text-6xl">
              Skills built for <span className="text-gradient">what&apos;s next.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted sm:text-lg">
              A practical toolkit for designing, building, and shipping thoughtful digital products.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-2 sm:mt-12 sm:gap-4">
            {[
              { label: 'Technologies', value: skills.length },
              { label: 'Specialties', value: availableCategories.length },
              { label: 'Avg. proficiency', value: `${average}%` },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-border/70 bg-card/60 px-2 py-3 text-center shadow-lg shadow-black/5 backdrop-blur-xl sm:rounded-3xl sm:px-5 sm:py-4">
                <motion.div
                  key={String(stat.value)}
                  initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-lg font-black tabular-nums text-text sm:text-2xl"
                >{stat.value}</motion.div>
                <div className="mt-1 text-[9px] font-bold leading-tight text-muted sm:text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </header>

      <main className="relative mx-auto w-full max-w-7xl overflow-x-clip px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="pointer-events-none absolute left-1/3 top-28 -z-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" aria-hidden="true" />

        <div className="mb-8 rounded-3xl border border-border/70 bg-card/60 p-4 shadow-lg shadow-black/5 backdrop-blur-xl sm:p-5">
          <label htmlFor="skill-search" className="sr-only">Search skills</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              id="skill-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search technologies..."
              className="w-full rounded-2xl border border-border/80 bg-surface/80 py-3 pl-11 pr-4 text-sm text-text outline-none transition placeholder:text-muted/80 focus:border-primary/60 focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap" aria-label="Filter skills by category">
            <FilterButton active={activeCategory === 'all'} onClick={() => setActiveCategory('all')} label="All skills" count={skills.length} />
            {availableCategories.map((category) => (
              <FilterButton
                key={category}
                active={activeCategory === category}
                onClick={() => setActiveCategory(category)}
                label={SKILL_CATEGORY_LABELS[category]}
                count={skills.filter((skill) => skill.category === category).length}
              />
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="h-36 rounded-2xl" />)}
          </div>
        ) : filteredSkills.length === 0 ? (
          <EmptyState title={search ? 'No matching skills' : 'No skills found'} description={search ? 'Try another name or category.' : 'Skills will appear here once added.'} />
        ) : (
          <div className="space-y-10 sm:space-y-14">
            <AnimatePresence>
              {groupedSkills.map(({ category, items }, groupIndex) => (
                <motion.section
                  key={`${category}-${activeCategory}-${search}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: reduceMotion ? 0 : 0.3, delay: reduceMotion ? 0 : groupIndex * 0.04 }}
                  aria-labelledby={`skill-category-${category}`}
                >
                  <div className="mb-4 flex min-w-0 items-center gap-3 sm:mb-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-gradient-to-br from-primary/15 to-accent/15 text-primary shadow-inner sm:h-11 sm:w-11 sm:rounded-2xl">
                      <CategoryIcon category={category} />
                    </div>
                    <div className="min-w-0">
                      <h2 id={`skill-category-${category}`} className="text-sm font-black leading-tight text-text sm:text-lg">
                        {SKILL_CATEGORY_LABELS[category]}
                      </h2>
                      <p className="mt-0.5 text-[10px] font-medium text-muted sm:text-xs">{items.length} {items.length === 1 ? 'technology' : 'technologies'}</p>
                    </div>
                    <div className="h-px min-w-3 flex-1 bg-gradient-to-r from-primary/50 via-accent/25 to-transparent" aria-hidden="true" />
                    <span className="shrink-0 rounded-full border border-border/70 bg-card px-2.5 py-1 text-[10px] font-black tabular-nums text-muted sm:px-3 sm:text-xs">{items.length}</span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                    {items.map((skill, index) => <SkillCard key={skill._id} skill={skill} index={index} />)}
                  </div>
                </motion.section>
              ))}
            </AnimatePresence>
          </div>
        )}

        {codingLinks.length > 0 && (
          <section className="mt-16 border-t border-border/60 pt-12 sm:mt-20 sm:pt-16" aria-labelledby="coding-profiles-heading">
            <div className="mx-auto mb-8 max-w-xl text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 text-accent"><Code2 className="h-5 w-5" /></div>
              <h2 id="coding-profiles-heading" className="text-xl font-black text-text sm:text-2xl">Coding & DSA profiles</h2>
              <p className="mt-2 text-sm leading-6 text-muted">Problem-solving practice across coding platforms.</p>
            </div>
            <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {codingLinks.map((link) => {
                const Icon = getSocialIcon(link.platform);
                return (
                  <a key={link._id} href={link.url} target="_blank" rel="noreferrer" className="group flex min-w-0 items-center gap-3 rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm backdrop-blur-lg transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105"><Icon className="h-5 w-5" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-extrabold capitalize text-text">{link.platform}</span>
                      <span className="mt-0.5 block truncate text-xs text-muted">{link.username || 'View profile'}</span>
                    </span>
                    <span aria-hidden="true" className="text-muted transition-colors group-hover:text-primary">↗</span>
                  </a>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

function FilterButton({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex min-w-0 items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-[10px] font-extrabold transition-all sm:w-auto sm:justify-center sm:rounded-full sm:px-4 sm:text-xs ${active ? 'border-primary bg-primary text-white shadow-md shadow-primary/20' : 'border-border/70 bg-surface/70 text-muted hover:border-primary/40 hover:text-text'}`}
    >
      <span className="min-w-0 truncate">{label}</span>
      <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] tabular-nums ${active ? 'bg-white/20 text-white' : 'bg-card text-muted'}`}>{count}</span>
    </button>
  );
}
