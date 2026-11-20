import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon, ZoomIn, Film, Play, ExternalLink } from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { PortfolioFilterButton } from '../../components/common/PortfolioFilterButton';
import { SectionHeading } from '../../components/common/SectionHeading';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { Pagination } from '../../components/ui/Pagination';
import { useGallery } from '../../hooks/useGallery';
import { VideoPlayer, getVideoThumbnail, isVideoUrl } from '../../components/common/VideoPlayer';
import { optimizeCloudinaryUrl } from '../../utils/formatters';
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
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'image' | 'video'>('all');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const { data, isLoading } = useGallery({
    page,
    limit: 16,
    category: category || undefined,
    mediaType: mediaTypeFilter === 'all' ? undefined : mediaTypeFilter,
    published: 'true',
  });

  const items = (data?.data ?? []).filter((i) => i.published !== false);

  const pagination = data?.pagination;

  const handleImageError = (id: string) => {
    setBrokenImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <>
      <SEO title="Gallery & Videos" description="Photos, videos, event memories, and hackathon highlights from Lokendra Kumar's journey" />

      {/* Header Banner */}
      <div className="skills-hero relative isolate overflow-hidden border-b border-border/50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="skills-grid-pattern absolute inset-0 -z-10" aria-hidden="true" />
        <div className="skills-orb skills-orb-one absolute -left-28 top-0 -z-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl sm:h-96 sm:w-96" aria-hidden="true" />
        <div className="skills-orb skills-orb-two absolute -right-24 bottom-0 -z-10 h-72 w-72 rounded-full bg-accent/15 blur-3xl sm:h-96 sm:w-96" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto text-center space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold text-text tracking-tight"
          >
            Visual <span className="text-gradient">Gallery & Videos</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted max-w-2xl mx-auto"
          >
            Photos, event videos, hackathons, and milestones from Lokendra Kumar's engineering journey.
          </motion.p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-8 space-y-5 rounded-3xl border border-border/70 bg-card/55 p-4 shadow-xl shadow-black/5 backdrop-blur-xl sm:mb-10 sm:p-5">
          <div>
            <p className="mb-2.5 text-[10px] font-black uppercase tracking-[0.16em] text-muted sm:text-xs">Choose your view</p>
            <div className="grid grid-cols-3 gap-2" aria-label="Filter gallery media type">
              <PortfolioFilterButton active={mediaTypeFilter === 'all'} onClick={() => { setMediaTypeFilter('all'); setPage(1); }} group="gallery-media" className="w-full px-2 sm:px-4">All media</PortfolioFilterButton>
              <PortfolioFilterButton active={mediaTypeFilter === 'image'} onClick={() => { setMediaTypeFilter('image'); setPage(1); }} group="gallery-media" className="w-full px-2 sm:px-4"><ImageIcon className="h-4 w-4" /><span className="truncate">Photos</span></PortfolioFilterButton>
              <PortfolioFilterButton active={mediaTypeFilter === 'video'} onClick={() => { setMediaTypeFilter('video'); setPage(1); }} group="gallery-media" className="w-full px-2 sm:px-4"><Film className="h-4 w-4" /><span className="truncate">Videos</span></PortfolioFilterButton>
            </div>
          </div>

          <div className="border-t border-border/60 pt-4">
            <p className="mb-2.5 text-[10px] font-black uppercase tracking-[0.16em] text-muted sm:text-xs">Browse moments</p>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap" aria-label="Filter gallery by category">
              <PortfolioFilterButton active={!category} onClick={() => { setCategory(''); setPage(1); }} group="gallery-category" className="w-full sm:w-auto">All categories</PortfolioFilterButton>
              {CATEGORIES.map(({ value, label }) => (
                <PortfolioFilterButton key={value} active={category === value} onClick={() => { setCategory(value); setPage(1); }} group="gallery-category" className="w-full sm:w-auto">{label}</PortfolioFilterButton>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-3 text-xs text-muted" aria-live="polite">
            <span>{pagination?.total ?? items.length} {((pagination?.total ?? items.length) === 1) ? 'moment' : 'moments'}{mediaTypeFilter === 'image' ? ' · photos' : mediaTypeFilter === 'video' ? ' · videos' : ''}</span>
            {(category || mediaTypeFilter !== 'all') && <button type="button" onClick={() => { setCategory(''); setMediaTypeFilter('all'); setPage(1); }} className="rounded-full px-3 py-1.5 font-bold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Reset filters</button>}
          </div>
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
            title="No gallery items found"
            description={
              category
                ? `No items found in category "${category}".`
                : 'Items uploaded and marked as "Show on Portfolio" in Admin will appear here live.'
            }
          />
        ) : (
          <>
            {/* Live Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-10">
              {items.map((img, i) => {
                const isVideo = img.mediaType === 'video' || isVideoUrl(img.imageUrl);
                const isBroken = brokenImages[img._id];

                const spanClass = img.gridSpan && img.gridSpan > 1
                  ? img.gridSpan === 4
                    ? 'col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4'
                    : img.gridSpan === 3
                    ? 'col-span-1 sm:col-span-2 md:col-span-3'
                    : 'col-span-1 sm:col-span-2'
                  : 'col-span-1';

                const aspectClass = img.aspectRatio === 'video'
                  ? 'aspect-video'
                  : img.aspectRatio === 'portrait'
                  ? 'aspect-[4/5]'
                  : img.aspectRatio === 'wide'
                  ? 'aspect-[21/9]'
                  : 'aspect-square';

                return (
                  <motion.button
                    key={img._id}
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.03 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => !isBroken && setActiveItem(img)}
                    className={`group relative ${spanClass} ${aspectClass} overflow-hidden rounded-3xl border border-border/80 bg-surface hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 text-left focus:outline-none`}
                  >
                    {isVideo ? (
                      <div className="w-full h-full bg-black relative flex items-center justify-center">
                        {getVideoThumbnail(img.imageUrl) ? (
                          <img
                            src={getVideoThumbnail(img.imageUrl)!}
                            alt={img.title}
                            loading={i < 4 ? 'eager' : 'lazy'}
                            decoding="async"
                            onError={() => handleImageError(img._id)}
                            className="w-full h-full object-cover"
                          />
                        ) : isBroken ? (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-card p-4 text-center">
                            <Film className="w-10 h-10 text-primary mb-2" />
                            <span className="text-xs font-bold text-text line-clamp-1">{img.title}</span>
                          </div>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-card p-4 text-center">
                            <Film className="w-10 h-10 text-primary mb-2 animate-bounce" />
                            <span className="text-xs font-bold text-text line-clamp-1">{img.title}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 fill-white ml-0.5" />
                          </div>
                        </div>
                      </div>
                    ) : !isBroken ? (
                      <img
                        src={optimizeCloudinaryUrl(img.imageUrl, 640)}
                        alt={img.title}
                        loading={i < 4 ? 'eager' : 'lazy'}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-4 pointer-events-none">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-primary text-white px-3 py-1 rounded-full shadow-sm">
                          {img.category} {isVideo && '• Video'}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                          {isVideo ? <Play className="w-4 h-4 fill-white" /> : <ZoomIn className="w-4 h-4" />}
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

      {/* Lightbox / Video Player Modal */}
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
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[90vh] bg-surface/90 border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Media Player */}
              <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] max-h-[70vh]">
                {activeItem.mediaType === 'video' || activeItem.imageUrl.includes('.mp4') || activeItem.imageUrl.includes('youtube') || activeItem.imageUrl.includes('vimeo') || activeItem.imageUrl.includes('/video/') ? (
                  <VideoPlayer url={activeItem.imageUrl} title={activeItem.title} autoPlay controls className="w-full h-full min-h-[350px]" />
                ) : (
                  <img
                    src={activeItem.imageUrl}
                    alt={activeItem.title}
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                )}
              </div>

              {/* Info Footer */}
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
                  Open Direct Link ↗
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
