import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ExternalLink, Github } from 'lucide-react';
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
  const { data, isLoading } = useProjects({ page, limit: 9, q: q || undefined, category: category || undefined });
  const projects = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <>
      <SEO title="Projects" description="My portfolio of software projects" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeading title="My Projects" subtitle="A collection of things I've built" center />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search projects..."
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-card border border-border rounded-lg text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <select value={category} onChange={(e) => { setCategory(e.target.value as ProjectCategory | ''); setPage(1); }}
            className="px-4 py-2.5 text-sm bg-card border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">All Categories</option>
            {ALL_CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState title="No projects found" description="Try adjusting your search or filters." />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {projects.map((p, i) => (
                <motion.div key={p._id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <Link to={`/projects/${p.slug}`}
                    className="group block bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all h-full">
                    {p.coverImage ? (
                      <img src={p.coverImage} alt={p.title} loading="lazy" className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-44 bg-surface flex items-center justify-center">
                        <span className="text-5xl">💻</span>
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-text group-hover:text-primary transition-colors line-clamp-1">{p.title}</h3>
                        <Badge variant={p.status === 'completed' ? 'success' : 'warning'} size="sm">{p.status}</Badge>
                      </div>
                      <p className="text-sm text-muted mb-3 line-clamp-2">{p.shortDescription}</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {p.technologies.slice(0, 4).map((t) => <Badge key={t} variant="primary" size="sm">{t}</Badge>)}
                        {p.technologies.length > 4 && <Badge size="sm">+{p.technologies.length - 4}</Badge>}
                      </div>
                      <div className="flex gap-2">
                        {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-xs text-muted hover:text-text transition-colors">
                          <Github className="w-3.5 h-3.5" /> Code
                        </a>}
                        {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-xs text-muted hover:text-primary transition-colors">
                          <ExternalLink className="w-3.5 h-3.5" /> Live
                        </a>}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            {pagination && <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />}
          </>
        )}
      </div>
    </>
  );
}