import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Award } from 'lucide-react';
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

  const categories: CertificateCategory[] = ['programming', 'web-development', 'cloud', 'database', 'ai-ml', 'cybersecurity', 'other'];

  return (
    <>
      <SEO title="Certificates" description="My professional certifications" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeading title="Certifications" subtitle="Professional credentials I've earned" center />

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <button onClick={() => { setCategory(''); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!category ? 'bg-primary text-white' : 'bg-card border border-border text-muted hover:text-text'}`}>All</button>
          {categories.map((c) => (
            <button key={c} onClick={() => { setCategory(c); setPage(1); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${category === c ? 'bg-primary text-white' : 'bg-card border border-border text-muted hover:text-text'}`}>
              {c.replace(/-/g, ' ')}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}</div>
        ) : certs.length === 0 ? (
          <EmptyState icon={Award} title="No certificates found" description="Certificates will appear here once added." />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {certs.map((c, i) => (
                <motion.div key={c._id}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-md transition-all">
                  {c.certificateImage && (
                    <img src={c.certificateImage} alt={c.title} className="w-full h-32 object-contain rounded-lg mb-4 border border-border" />
                  )}
                  <h3 className="font-semibold text-text text-sm line-clamp-2 mb-1">{c.title}</h3>
                  <p className="text-xs text-primary mb-1">{c.issuer}</p>
                  <p className="text-xs text-muted mb-3">{formatDate(c.issueDate, 'month-year')}{c.expiryDate && ` — ${formatDate(c.expiryDate, 'month-year')}`}</p>
                  {c.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {c.skills.slice(0, 4).map((s) => <Badge key={s} size="sm">{s}</Badge>)}
                    </div>
                  )}
                  {c.credentialUrl && (
                    <a href={c.credentialUrl} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 text-xs text-primary hover:underline">
                      <ExternalLink className="w-3 h-3" /> Verify Certificate
                    </a>
                  )}
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