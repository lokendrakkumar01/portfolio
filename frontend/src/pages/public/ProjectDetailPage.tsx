import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, Calendar, Globe } from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { useProject } from '../../hooks/useProjects';
import { formatDate } from '../../utils/formatters';

export default function ProjectDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const { data, isLoading, isError } = useProject(slug);
  const project = data?.data;

  if (isLoading) return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
      <Skeleton className="h-80 w-full rounded-2xl" />
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
  if (isError || !project) return (
    <div className="py-20">
      <EmptyState title="Project not found" description="The project you're looking for doesn't exist." action={{ label: 'Back to Projects', onClick: () => history.back() }} />
    </div>
  );

  return (
    <>
      <SEO title={project.title} description={project.shortDescription} image={project.coverImage} type="article" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>

        {project.coverImage && (
          <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={project.coverImage} alt={project.title}
            className="w-full h-72 sm:h-96 object-cover rounded-2xl mb-8 border border-border" />
        )}

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-text">{project.title}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant={project.status === 'completed' ? 'success' : 'warning'}>{project.status}</Badge>
                <Badge>{project.category}</Badge>
                {project.featured && <Badge variant="primary">Featured</Badge>}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 flex-shrink-0">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm bg-card border border-border rounded-lg hover:border-primary transition-colors text-text">
                  <Github className="w-4 h-4" /> Code
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm bg-primary text-white rounded-lg hover:opacity-90 transition-opacity">
                  <ExternalLink className="w-4 h-4" /> Live Demo
                </a>
              )}
            </div>
          </div>

          {(project.startDate || project.endDate) && (
            <div className="flex items-center gap-1 text-sm text-muted mb-6">
              <Calendar className="w-4 h-4" />
              {project.startDate && formatDate(project.startDate, 'month-year')}
              {project.endDate && ` — ${formatDate(project.endDate, 'month-year')}`}
            </div>
          )}

          <p className="text-muted leading-relaxed mb-6">{project.description}</p>

          {project.technologies.length > 0 && (
            <div className="mb-6">
              <h2 className="font-semibold text-text mb-3">Technologies Used</h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((t) => <Badge key={t} variant="primary">{t}</Badge>)}
              </div>
            </div>
          )}

          {project.features.length > 0 && (
            <div className="mb-6">
              <h2 className="font-semibold text-text mb-3">Key Features</h2>
              <ul className="space-y-2">
                {project.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted">
                    <span className="text-primary mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.screenshots.length > 0 && (
            <div>
              <h2 className="font-semibold text-text mb-4">Screenshots</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.screenshots.map((s) => (
                  <div key={s._id} className="rounded-xl overflow-hidden border border-border">
                    <img src={s.url} alt={s.caption ?? project.title} loading="lazy" className="w-full object-cover" />
                    {s.caption && <p className="text-xs text-center text-muted py-2">{s.caption}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}