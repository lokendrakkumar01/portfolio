import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Award, Calendar, CheckCircle2, ShieldCheck } from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { SectionHeading } from '../../components/common/SectionHeading';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { Pagination } from '../../components/ui/Pagination';
import { useCertificates } from '../../hooks/useCertificates';
import { formatDate } from '../../utils/formatters';
import type { CertificateCategory } from '../../types';

export default function CertificatesPage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<CertificateCategory | ''>('');
  const { data, isLoading } = useCertificates({ page, limit: 12, category: category || undefined });
  const certs = data?.data ?? [];
  const pagination = data?.pagination;

  const categories: { value: CertificateCategory | ''; label: string }[] = [
    { value: '', label: 'All Certificates' },
    { value: 'programming', label: 'Programming' },
    { value: 'web-development', label: 'Web Dev' },
    { value: 'cloud', label: 'Cloud' },
    { value: 'database', label: 'Database' },
    { value: 'ai-ml', label: 'AI & ML' },
    { value: 'cybersecurity', label: 'Cybersecurity' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <>
      <SEO title="Certificates" description="Professional certifications earned by Lokendra Kumar" />
      
      {/* Header Banner */}
      <div className="relative py-16 px-4 sm:px-6 lg:px-8 bg-surface/30 border-b border-border/40 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative max-w-5xl mx-auto text-center space-y-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2"
          >
            <ShieldCheck className="w-4 h-4" /> Verified Credentials
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-text tracking-tight"
          >
            Professional <span className="text-gradient">Certifications</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-muted text-base sm:text-lg max-w-2xl mx-auto"
          >
            Validated technical expertise, industry courses, and academic achievements.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 justify-start sm:justify-center mb-12 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => { setCategory(c.value); setPage(1); }}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                category === c.value
                  ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105'
                  : 'bg-card/80 border border-border/80 text-muted hover:text-text hover:border-primary/40'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-52 rounded-3xl" />
            ))}
          </div>
        ) : certs.length === 0 ? (
          <EmptyState icon={Award} title="No certificates found" description="No certifications listed under this category." />
        ) : (
          <>
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <AnimatePresence>
                {certs.map((c, i) => (
                  <motion.div
                    key={c._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="group bg-card/80 backdrop-blur-md border border-border/80 rounded-3xl p-6 hover:border-primary/60 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform">
                          {c.certificateImage ? (
                            <img src={c.certificateImage} alt={c.title} className="w-full h-full object-cover rounded-2xl" />
                          ) : (
                            <Award className="w-6 h-6 text-primary" />
                          )}
                        </div>
                        <Badge variant="primary" size="sm" className="uppercase tracking-wider font-bold">
                          {c.category.replace(/-/g, ' ')}
                        </Badge>
                      </div>

                      <h3 className="font-extrabold text-text text-lg group-hover:text-primary transition-colors line-clamp-2 mb-2">
                        {c.title}
                      </h3>

                      <p className="text-sm font-semibold text-primary/90 mb-3 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                        <span>{c.issuer}</span>
                      </p>

                      <div className="flex items-center gap-1.5 text-xs text-muted mb-4">
                        <Calendar className="w-3.5 h-3.5 text-primary/70" />
                        <span>Issued: {formatDate(c.issueDate, 'month-year')}</span>
                        {c.expiryDate && <span>· Expires: {formatDate(c.expiryDate, 'month-year')}</span>}
                      </div>

                      {c.description && (
                        <p className="text-xs text-muted line-clamp-2 leading-relaxed mb-4">
                          {c.description}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 pt-4 border-t border-border/50">
                      {c.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {c.skills.slice(0, 4).map((s) => (
                            <span key={s} className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-surface text-muted border border-border">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}

                      {c.credentialUrl && (
                        <a
                          href={c.credentialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 px-4 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all duration-200"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Verify Certificate
                        </a>
                      )}
                    </div>
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