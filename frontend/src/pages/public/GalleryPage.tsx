import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { SectionHeading } from '../../components/common/SectionHeading';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { Pagination } from '../../components/ui/Pagination';
import { useGallery } from '../../hooks/useGallery';
import type { GalleryCategory } from '../../types';

const CATEGORIES: GalleryCategory[] = ['events', 'hackathons', 'college', 'projects', 'achievements', 'certificates', 'personal', 'other'];

export default function GalleryPage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<GalleryCategory | ''>('');
  const [lightbox, setLightbox] = useState<string | null>(null);
  const { data, isLoading } = useGallery({ page, limit: 16, category: category || undefined });
  const items = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <>
      <SEO title="Gallery" description="Photos and memories from my journey" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeading title="Gallery" subtitle="Moments from my journey" center />
        
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <button onClick={() => { setCategory(''); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!category ? 'bg-primary text-white' : 'bg-card border border-border text-muted hover:text-text'}`}>All</button>
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => { setCategory(c); setPage(1); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${category === c ? 'bg-primary text-white' : 'bg-card border border-border text-muted hover:text-text'}`}>
              {c}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-square" />)}
          </div>
        ) : items.length === 0 ? (
          <EmptyState title="No photos yet" description="Gallery will appear here once images are added." />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
              {items.map((img, i) => (
                <motion.button key={img._id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  onClick={() => setLightbox(img.imageUrl)}
                  className="aspect-square overflow-hidden rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all group">
                  <img src={img.imageUrl} alt={img.title} loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </motion.button>
              ))}
            </div>
            {pagination && <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />}
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 p-2 text-white hover:text-gray-300 transition-colors" onClick={() => setLightbox(null)}>
            <X className="w-6 h-6" />
          </button>
          <img src={lightbox} alt="Full size" className="max-w-full max-h-full object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}