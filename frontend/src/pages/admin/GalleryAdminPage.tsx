import { useState, useRef } from 'react';
import { Trash2, Upload, Sparkles, Filter, Image as ImageIcon, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Skeleton } from '../../components/ui/Skeleton';
import { Pagination } from '../../components/ui/Pagination';
import { useGallery, useBulkUploadGallery, useDeleteGalleryItem } from '../../hooks/useGallery';
import type { GalleryCategory, GalleryItem } from '../../types';
import toast from 'react-hot-toast';

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

export default function GalleryAdminPage() {
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<GalleryCategory | 'all'>('all');
  const [deleteItem, setDeleteItem] = useState<GalleryItem | null>(null);
  const [uploadCategory, setUploadCategory] = useState<GalleryCategory>('events');
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const fileRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, refetch } = useGallery({
    page,
    limit: 12,
    category: activeFilter === 'all' ? undefined : activeFilter,
  });

  const bulkUploadMutation = useBulkUploadGallery();
  const deleteMutation = useDeleteGalleryItem();

  const items = data?.data ?? [];
  const pagination = data?.pagination;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    bulkUploadMutation.mutate(
      { files, category: uploadCategory },
      {
        onSuccess: () => {
          if (fileRef.current) fileRef.current.value = '';
          refetch();
        },
        onError: () => {
          if (fileRef.current) fileRef.current.value = '';
        },
      }
    );
  };

  const handleImageError = (id: string) => {
    setBrokenImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/60 backdrop-blur-md p-6 rounded-3xl border border-border/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-text tracking-tight flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-primary" />
            Gallery Management
          </h1>
          <p className="text-muted text-xs font-semibold mt-1">
            {pagination?.total ?? 0} total photos stored in cloud database
          </p>
        </div>

        {/* Upload Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 bg-surface border border-border px-3 py-1.5 rounded-2xl">
            <span className="text-xs font-bold text-muted">Upload Category:</span>
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value as GalleryCategory)}
              className="bg-transparent text-xs font-extrabold text-primary focus:outline-none capitalize cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value} className="bg-surface text-text">
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <Button
            icon={<Upload className="w-4 h-4" />}
            loading={bulkUploadMutation.isPending}
            onClick={() => fileRef.current?.click()}
            className="shadow-lg shadow-primary/20"
          >
            Upload Photos
          </Button>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={handleUpload}
          />
        </div>
      </div>

      {/* Filter Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => {
            setActiveFilter('all');
            setPage(1);
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-extrabold tracking-wider uppercase transition-all ${
            activeFilter === 'all'
              ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
              : 'bg-card border border-border text-muted hover:text-text'
          }`}
        >
          All Photos
        </button>

        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => {
              setActiveFilter(c.value);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold tracking-wider uppercase transition-all whitespace-nowrap ${
              activeFilter === c.value
                ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                : 'bg-card border border-border text-muted hover:text-text'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Uploading Status Progress */}
      {bulkUploadMutation.isPending && (
        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 flex items-center gap-3 animate-pulse">
          <RefreshCw className="w-5 h-5 text-primary animate-spin" />
          <span className="text-xs font-bold text-primary">
            Uploading images to Cloud & syncing database... Please wait.
          </span>
        </div>
      )}

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No photos found"
          description={
            activeFilter === 'all'
              ? 'Upload your first gallery photos using the button above.'
              : `No photos uploaded in category "${activeFilter}".`
          }
          action={{ label: 'Upload Photos', onClick: () => fileRef.current?.click() }}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {items.map((img) => {
              const isBroken = brokenImages[img._id];

              return (
                <div
                  key={img._id}
                  className="group relative aspect-square overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300"
                >
                  {!isBroken ? (
                    <img
                      src={img.imageUrl}
                      alt={img.title}
                      loading="lazy"
                      onError={() => handleImageError(img._id)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-card text-muted p-2 text-center">
                      <ImageIcon className="w-8 h-8 opacity-40 mb-1" />
                      <span className="text-[10px] font-bold truncate max-w-full">
                        Image Unavailable
                      </span>
                    </div>
                  )}

                  {/* Dark overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black uppercase tracking-wider bg-primary/80 text-white px-2 py-0.5 rounded-full backdrop-blur-md">
                        {img.category}
                      </span>
                      <button
                        onClick={() => setDeleteItem(img)}
                        className="p-1.5 bg-error/90 hover:bg-error text-white rounded-xl transition-all shadow-md active:scale-95"
                        title="Delete image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-white text-xs font-bold truncate leading-tight drop-shadow">
                      {img.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="pt-4 flex justify-center">
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={() => {
          if (deleteItem) {
            deleteMutation.mutate(deleteItem._id, {
              onSuccess: () => setDeleteItem(null),
            });
          }
        }}
        loading={deleteMutation.isPending}
        title="Delete Photo?"
        description={`Are you sure you want to delete "${deleteItem?.title || 'this photo'}"? This will permanently remove it from the Cloud database.`}
      />
    </div>
  );
}