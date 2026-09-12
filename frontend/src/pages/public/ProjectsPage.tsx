import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ExternalLink, Github, FolderGit2 } from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { SectionHeading } from '../../components/common/SectionHeading';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { Pagination } from '../../components/ui/Pagination';
import { useProjects } from '../../hooks/useProjects';
import type { ProjectCategory } from '../../types';

const CATEGORY_LABELS: Partial<Record<ProjectCategory, string>> = {
  web: 'Web', mobile: 'Mobile', 'ai-ml': 'AI / ML', backend: 'Backend',
  'open-source': 'Open Source', academic: 'Academic', hackathon: 'Hackathon', other: 'Other',
};
const ALL_CATEGORIES = Object.entries(CATEGORY_LABELS) as [ProjectCategory, string][];

export default function ProjectsPage() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState<ProjectCategory | ''>('');
  const [level, setLevel] = useState<string>('');
  const { data, isLoading } = useProjects({ page, limit: 9, q: q || undefined, category: category || undefined, level: level || undefined });
  const rawProjects = data?.data ?? [];
  
  // Sort projects: Advanced (1) -> Medium (2) -> Basic (3)
  const projects = [...rawProjects].sort((a, b) => {
    const getRank = (c?: string) => (c === 'advanced' ? 1 : c === 'basic' ? 3 : 2);
    return getRank(a.complexity) - getRank(b.complexity);
  });
  
  const pagination = data?.pagination;

  return (
    <>
      <SEO title="Projects" description="My portfolio of software projects" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeading title="My Projects" subtitle="A collection of things I've built" center />

        {/* Modern Filters */}
        <div className="flex flex-col gap-4 mb-10">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => { setCategory(''); setPage(1); }}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${category === '' ? 'bg-primary text-white shadow-md' : 'bg-surface border border-border hover:bg-surface/80 text-muted hover:text-text'}`}
            >All</button>
            {ALL_CATEGORIES.slice(0, 4).map(([v, l]) => (
              <button key={v} onClick={() => { setCategory(v); setPage(1); }}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${category === v ? 'bg-primary text-white shadow-md' : 'bg-surface border border-border hover:bg-surface/80 text-muted hover:text-text'}`}
              >{l}</button>
            ))}
            {ALL_CATEGORIES.slice(4).map(([v, l]) => (
              <button key={v} onClick={() => { setCategory(v); setPage(1); }}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${category === v ? 'bg-primary text-white shadow-md' : 'bg-surface border border-border hover:bg-surface/80 text-muted hover:text-text'}`}
              >{l}</button>
            ))}
          </div>

          {/* Level filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none mt-2">
            {([['', 'All Levels'], ['advanced', '🚀 Advanced'], ['medium', '⚡ Medium'], ['basic', '📝 Basic']] as [string, string][]).map(([v, l]) => (
              <button key={v} onClick={() => { setLevel(v); setPage(1); }}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  level === v ? 'bg-accent text-white shadow-md' : 'bg-surface border border-border hover:bg-surface/80 text-muted hover:text-text'
                }`}>{l}</button>
            ))}
          </div>
          
          <div className="relative w-full md:w-72 self-end">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search projects..."
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-surface border border-border hover:border-primary/50 rounded-full text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-inner" />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState icon={FolderGit2} title="No projects found" description="Try adjusting your search or filters." />
        ) : (
          <>
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <AnimatePresence>
                {projects.map((p, i) => (
                  <motion.div key={p._id}
                    layout
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }}
                    className="group"
                  >
                    <Link to={`/projects/${p.slug}`}
                      className="block bg-card/80 backdrop-blur-sm border border-border rounded-3xl overflow-hidden hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 transition-all duration-500 h-full flex flex-col relative"
                    >
                      {/* Image Container with Gradient Overlay */}
                      <div className="relative w-full h-56 overflow-hidden bg-surface">
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent z-10" />
                        {p.coverImage ? (
                          <img src={p.coverImage} alt={p.title} loading={i < 3 ? 'eager' : 'lazy'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted/30 group-hover:scale-110 transition-transform duration-700">
                            <FolderGit2 className="w-20 h-20" />
                          </div>
                        )}
                        
                        {/* Complexity Badge Over Image */}
                        <div className="absolute top-4 left-4 z-20">
                          {p.complexity && p.complexity !== 'medium' && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider ${
                              p.complexity === 'advanced' ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-muted/10 text-muted border border-border'
                            }`}>
                              {p.complexity === 'advanced' ? '🚀 ADVANCED' : '📝 BASIC'}
                            </span>
                          )}
                        </div>

                        {/* Status Badge Over Image */}
                        <div className="absolute top-4 right-4 z-20">
                          <Badge variant={p.status === 'completed' ? 'success' : p.status === 'archived' ? 'error' : 'warning'} className="shadow-lg backdrop-blur-md bg-opacity-90">
                            {p.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col justify-between relative z-20 -mt-6 bg-card rounded-t-3xl border-t border-border/50">
                        <div>
                          <h3 className="font-extrabold text-xl text-text group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all mb-2">{p.title}</h3>
                          <p className="text-sm text-muted mb-5 line-clamp-2 leading-relaxed">{p.shortDescription}</p>
                        </div>
                        
                        <div>
                          <div className="flex flex-wrap gap-2 mb-6">
                            {p.technologies.slice(0, 3).map((t) => (
                              <span key={t} className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase bg-primary/10 text-primary border border-primary/20">{t}</span>
                            ))}
                            {p.technologies.length > 3 && <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase bg-surface text-muted border border-border">+{p.technologies.length - 3}</span>}
                          </div>
                          
                          {/* Quick Links Footer */}
                          <div className="flex items-center gap-3 pt-4 border-t border-border/60">
                            {p.githubUrl && (
                              <a href={p.githubUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1.5 text-xs font-semibold text-text hover:text-primary transition-colors bg-surface px-3 py-1.5 rounded-lg border border-border hover:border-primary/30">
                                <Github className="w-4 h-4" /> Source
                              </a>
                            )}
                            {p.liveUrl && (
                              <a href={p.liveUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary/90 transition-colors px-3 py-1.5 rounded-lg shadow-md shadow-primary/20">
                                <ExternalLink className="w-4 h-4" /> Live Demo
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            {pagination && <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />}
          </>
        )}
      </div>
    </>
  );
}