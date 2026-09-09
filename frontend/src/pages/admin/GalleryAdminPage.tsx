import { useState, useRef } from 'react';
import { Trash2, Upload } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Skeleton } from '../../components/ui/Skeleton';
import { Select } from '../../components/ui/Input';
import { Pagination } from '../../components/ui/Pagination';
import { useGallery, useCreateGalleryItem, useDeleteGalleryItem } from '../../hooks/useGallery';
import type { GalleryCategory } from '../../types';
import toast from 'react-hot-toast';

const CATEGORIES: GalleryCategory[] = ['events','hackathons','college','projects','achievements','certificates','personal','other'];

export default function GalleryAdminPage() {
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState<GalleryCategory>('events');
  const fileRef = useRef<HTMLInputElement>(null);
  const { data, isLoading } = useGallery({ page, limit: 12 });
  const deleteItem = useDeleteGalleryItem();
  const createItem = useCreateGalleryItem();
  const items = data?.data ?? [];
  const pagination = data?.pagination;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        await createItem.mutateAsync({ data: { title: file.name.replace(/\.[^/.]+$/, ''), category }, file });
      }
      toast.success(`${files.length} image(s) uploaded`);
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-bold text-text">Gallery</h1><p className="text-muted text-sm">{pagination?.total ?? 0} total images</p></div>
        <div className="flex items-center gap-2">
          <select value={category} onChange={(e) => setCategory(e.target.value as GalleryCategory)}
            className="px-3 py-2 text-sm bg-card border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <Button icon={<Upload className="w-4 h-4" />} loading={uploading} onClick={() => fileRef.current?.click()}>Upload Images</Button>
          <input ref={fileRef} type="file" accept="image/*" multiple className="sr-only" onChange={handleUpload} />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-xl" />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState title="No gallery images yet" description="Upload photos to start building your gallery." action={{ label: 'Upload Images', onClick: () => fileRef.current?.click() }} />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map((img) => (
              <div key={img._id} className="relative group aspect-square overflow-hidden rounded-xl border border-border">
                <img src={img.imageUrl} alt={img.title} loading="lazy" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                <button onClick={() => setDeleteId(img._id)}
                  className="absolute top-2 right-2 p-1.5 bg-error text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <p className="absolute bottom-0 left-0 right-0 p-2 text-white text-xs bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity line-clamp-1">{img.title}</p>
              </div>
            ))}
          </div>
          {pagination && <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />}
        </>
      )}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) deleteItem.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }}
        loading={deleteItem.isPending} title="Delete Image" description="This will permanently delete the image." />
    </div>
  );
}