import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon, ZoomIn, Calendar, Tag } from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { SectionHeading } from '../../components/common/SectionHeading';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { Pagination } from '../../components/ui/Pagination';
import { useGallery } from '../../hooks/useGallery';
import type { GalleryCategory, GalleryItem } from '../../types';

const CATEGORIES: { value: GalleryCategory; label: string }[] = [
  { value: 'events', label: 'Events' },
  { value: 'hackathons', label: 'Hackathons' },
  { value: 'college', label: 'College' },
  { value: 'projects', label: 'Projects' },
  { value: 'achievements', label: 'Achievements' },
  { value: 'certificates', label: 'Certificates' },
  { value: 'personal', label: 'Personal' },
  { value: 'other', label: 'Other' },
];

export default function GalleryPage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<GalleryCategory | ''>('');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const { data, isLoading } = useGallery({
    page,
    limit: 16,
    category: category || undefined,
  });

  const items = data?.data ?? [];
  const pagination = data?.pagination;

  const handleImageError = (id: string) => {
    setBrokenImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <>
      <SEO title="Gallery" description="Moments, achievements, hackathons, and memories from Lokendra Kumar's journey" />

      {/* Header Banner */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8 bg-surface/30 border-b border-border/40 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative max-w-5xl mx-auto text-center space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold text-text tracking-tight"
          >
            Visual <span className="text-gradient">Gallery & Highlights</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted max-w-2xl mx-auto"
          >
            A collection of photos, event memories, hackathons, and milestones from Lokendra Kumar's software engineering journey.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter Tabs */}
        <div className="flex gap-2 justify-start sm:justify-center overflow-x-auto pb-4 mb-10 scrollbar-none">
          <button
            onClick={() => {
              setCategory('');
              setPage(1);
            }}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              !category
                ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105'
                : 'bg-card/80 border border-border/80 text-muted hover:text-text hover:border-primary/40'
            }`}
          >
            All Photos
          </button>

          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => {
                setCategory(c.value);
                setPage(1);
              }}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                category === c.value
                  ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105'
                  : 'bg-card/80 border border-border/80 text-muted hover:text-text hover:border-primary/40'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-3xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title="No gallery photos yet"
            description={
              category
                ? `No photos found in category "${category}".`
                : 'Gallery photos uploaded in Admin will appear here live.'
            }
          />
        ) : (
          <>
            {/* Live Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-10">
              {items.map((img, i) => {
                const isBroken = brokenImages[img._id];

                return (
                  <motion.button
                    key={img._id}
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.03 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => !isBroken && setActiveItem(img)}
                    className="group relative aspect-square overflow-hidden rounded-3xl border border-border/80 bg-surface hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 text-left focus:outline-none"
                  >
                    {!isBroken ? (
                      <img
                        src={img.imageUrl}
                        alt={img.title}
                        loading="lazy"
                        decoding="async"
                        onError={() => handleImageError(img._id)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-card text-muted p-4 text-center">
                        <ImageIcon className="w-10 h-10 opacity-40 mb-2" />
                        <span className="text-xs font-bold">Image Unavailable</span>
                      </div>
                    )}

                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-primary text-white px-3 py-1 rounded-full shadow-sm">
                          {img.category}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                          <ZoomIn className="w-4 h-4" />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-white text-sm font-extrabold line-clamp-2 leading-snug drop-shadow-md">
                          {img.title}
                        </h3>
                        {img.description && (
                          <p className="text-white/80 text-xs line-clamp-1 mt-1 font-medium">
                            {img.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center pt-6">
                <Pagination
                  page={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
            onClick={() => setActiveItem(null)}
          >
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-5 right-5 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-10 border border-white/20 active:scale-95"
              aria-label="Close image"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[90vh] bg-surface/90 border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Image View */}
              <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] max-h-[70vh]">
                <img
                  src={activeItem.imageUrl}
                  alt={activeItem.title}
                  className="max-w-full max-h-[70vh] object-contain"
                />
              </div>

              {/* Image Info Footer */}
              <div className="p-5 bg-card border-t border-border flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-primary/10 border border-primary/30 text-primary px-3 py-0.5 rounded-full">
                      {activeItem.category}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-text">{activeItem.title}</h3>
                  {activeItem.description && (
                    <p className="text-xs text-muted mt-1 font-medium max-w-xl">{activeItem.description}</p>
                  )}
                </div>

                <button
                  onClick={() => window.open(activeItem.imageUrl, '_blank')}
                  className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-2xl hover:opacity-90 transition-all shadow-md"
                >
                  View Full Image ↗
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}