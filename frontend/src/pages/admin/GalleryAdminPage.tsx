import { useState, useRef } from 'react';
import {
  Trash2, Upload, Eye, EyeOff, Star, Film, Image as ImageIcon,
  CheckCircle, RefreshCw, Video, Plus, ExternalLink, Pencil, LayoutGrid, Frame
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Modal } from '../../components/ui/Modal';
import { Skeleton } from '../../components/ui/Skeleton';
import { Input, Select } from '../../components/ui/Input';
import { Pagination } from '../../components/ui/Pagination';
import {
  useGallery,
  useBulkUploadGallery,
  useDeleteGalleryItem,
  useUpdateGalleryItem,
  useCreateGalleryItem
} from '../../hooks/useGallery';
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

const FRAME_OPTIONS = [
  { value: '1', label: '1 Column (Standard)' },
  { value: '2', label: '2 Columns (Medium Frame)' },
  { value: '3', label: '3 Columns (Large Frame)' },
  { value: '4', label: '4 Columns (Full Width Hero Frame)' },
];

const ASPECT_OPTIONS = [
  { value: 'square', label: 'Square (1:1)' },
  { value: 'video', label: 'Landscape Video (16:9)' },
  { value: 'portrait', label: 'Portrait (4:5)' },
  { value: 'wide', label: 'Wide Banner (21:9)' },
];

export default function GalleryAdminPage() {
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<GalleryCategory | 'all'>('all');
  const [deleteItem, setDeleteItem] = useState<GalleryItem | null>(null);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  const [uploadCategory, setUploadCategory] = useState<GalleryCategory>('events');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoCategory, setVideoCategory] = useState<GalleryCategory>('events');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoGridSpan, setVideoGridSpan] = useState<number>(1);

  // Edit form states
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState<GalleryCategory>('events');
  const [editGridSpan, setEditGridSpan] = useState<number>(1);
  const [editAspectRatio, setEditAspectRatio] = useState<'square' | 'video' | 'portrait' | 'wide'>('square');
  const [editPublished, setEditPublished] = useState(true);
  const [editFeatured, setEditFeatured] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, refetch } = useGallery({
    page,
    limit: 12,
    category: activeFilter === 'all' ? undefined : activeFilter,
    published: 'all',
  });

  const bulkUploadMutation = useBulkUploadGallery();
  const createMutation = useCreateGalleryItem();
  const updateMutation = useUpdateGalleryItem();
  const deleteMutation = useDeleteGalleryItem();

  const items = data?.data ?? [];
  const pagination = data?.pagination;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleAddVideoUrl = () => {
    if (!videoUrl.trim() || !videoTitle.trim()) {
      toast.error('Please enter video title and URL');
      return;
    }

    createMutation.mutate(
      {
        data: {
          title: videoTitle,
          description: videoDescription,
          imageUrl: videoUrl,
          mediaType: 'video',
          category: videoCategory,
          gridSpan: Number(videoGridSpan),
          published: true,
        },
        file: new File([''], 'video_link.mp4', { type: 'video/mp4' }),
      },
      {
        onSuccess: () => {
          setShowVideoModal(false);
          setVideoTitle('');
          setVideoUrl('');
          setVideoDescription('');
          setVideoGridSpan(1);
          refetch();
        },
      }
    );
  };

  const openEditModal = (img: GalleryItem) => {
    setEditingItem(img);
    setEditTitle(img.title || '');
    setEditDescription(img.description || '');
    setEditCategory(img.category || 'events');
    setEditGridSpan(img.gridSpan || 1);
    setEditAspectRatio(img.aspectRatio || 'square');
    setEditPublished(img.published);
    setEditFeatured(img.featured);
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;

    updateMutation.mutate(
      {
        id: editingItem._id,
        data: {
          title: editTitle,
          description: editDescription,
          category: editCategory,
          gridSpan: Number(editGridSpan),
          aspectRatio: editAspectRatio,
          published: editPublished,
          featured: editFeatured,
        },
      },
      {
        onSuccess: () => {
          setEditingItem(null);
          refetch();
        },
      }
    );
  };

  const togglePublish = (img: GalleryItem) => {
    const nextPublished = !img.published;
    updateMutation.mutate(
      { id: img._id, data: { published: nextPublished } },
      {
        onSuccess: () => {
          toast.success(nextPublished ? 'Shown on portfolio' : 'Hidden from portfolio');
        },
      }
    );
  };

  const toggleFeatured = (img: GalleryItem) => {
    const nextFeatured = !img.featured;
    updateMutation.mutate(
      { id: img._id, data: { featured: nextFeatured } },
      {
        onSuccess: () => {
          toast.success(nextFeatured ? 'Marked as Featured' : 'Removed from Featured');
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/60 backdrop-blur-md p-6 rounded-3xl border border-border/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-text tracking-tight flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-primary" />
            Gallery & Video Studio
          </h1>
          <p className="text-muted text-xs font-semibold mt-1">
            {pagination?.total ?? 0} photos & videos. Customize titles, descriptions, and 1–4 column display frames.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-surface border border-border px-3 py-1.5 rounded-2xl">
            <span className="text-xs font-bold text-muted">Upload Category:</span>
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value as GalleryCategory)}
              className="bg-transparent text-xs font-extrabold text-primary focus:outline-none cursor-pointer"
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
            Upload Photos/Videos
          </Button>

          <Button
            variant="secondary"
            icon={<Video className="w-4 h-4 text-accent" />}
            onClick={() => setShowVideoModal(true)}
          >
            Add Video Link
          </Button>

          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*,.jpg,.jpeg,.png,.webp,.gif,.heic,.heif,.jfif,.mp4,.mov,.webm,.m4v,.3gp"
            multiple
            className="sr-only"
            onChange={handleFileUpload}
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
          All Items ({pagination?.total ?? 0})
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
            Uploading media files to cloud... Please wait.
          </span>
        </div>
      )}

      {/* Media Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-3xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No gallery items yet"
          description={
            activeFilter === 'all'
              ? 'Upload photos/videos or add video links to populate your gallery.'
              : `No items found in category "${activeFilter}".`
          }
          action={{ label: 'Upload Media', onClick: () => fileRef.current?.click() }}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((img) => {
              const isVideo = img.mediaType === 'video' || img.imageUrl.includes('.mp4') || img.imageUrl.includes('youtube') || img.imageUrl.includes('vimeo');
              const spanLabel = img.gridSpan && img.gridSpan > 1 ? `${img.gridSpan} Col Frame` : '1 Col Frame';

              return (
                <div
                  key={img._id}
                  className={`group relative bg-card border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${
                    img.published ? 'border-border/80 hover:border-primary/60' : 'border-error/40 bg-error/5'
                  }`}
                >
                  {/* Media View */}
                  <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                    {isVideo ? (
                      img.imageUrl.startsWith('http') && (img.imageUrl.includes('mp4') || img.imageUrl.includes('webm')) ? (
                        <video src={img.imageUrl} controls className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-card text-muted p-4 text-center">
                          <Film className="w-10 h-10 text-primary mb-2 animate-bounce" />
                          <span className="text-xs font-bold text-text truncate max-w-full">
                            Video Link
                          </span>
                          <a
                            href={img.imageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 text-[10px] text-primary font-bold flex items-center gap-1 hover:underline"
                          >
                            Open Link <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )
                    ) : (
                      <img
                        src={img.imageUrl}
                        alt={img.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}

                    {/* Category & Status Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none gap-2">
                      <div className="flex gap-1 items-center">
                        <span className="text-[9px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-white px-2.5 py-1 rounded-full border border-white/20">
                          {img.category} {isVideo && '• Video'}
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-wider bg-primary/80 backdrop-blur-md text-white px-2 py-0.5 rounded-full border border-white/20">
                          {spanLabel}
                        </span>
                      </div>

                      {img.published ? (
                        <span className="text-[9px] font-black uppercase tracking-wider bg-green-500/90 text-white px-2.5 py-1 rounded-full shadow">
                          🟢 Visible
                        </span>
                      ) : (
                        <span className="text-[9px] font-black uppercase tracking-wider bg-error/90 text-white px-2.5 py-1 rounded-full shadow">
                          🙈 Hidden
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                    <div>
                      <h3 className="font-extrabold text-text text-sm line-clamp-1">{img.title}</h3>
                      {img.description && (
                        <p className="text-xs text-muted line-clamp-2 mt-0.5 font-medium">{img.description}</p>
                      )}
                    </div>

                    {/* Toolbar: Edit, Show/Hide Toggle, Featured Toggle, Delete */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/60 gap-2">
                      {/* Show / Hide Toggle Button */}
                      <button
                        onClick={() => togglePublish(img)}
                        disabled={updateMutation.isPending}
                        className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all ${
                          img.published
                            ? 'bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20'
                            : 'bg-error/10 text-error border border-error/30 hover:bg-error/20'
                        }`}
                        title={img.published ? 'Click to hide from portfolio' : 'Click to show on portfolio'}
                      >
                        {img.published ? (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Showing</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => openEditModal(img)}
                        className="p-2 bg-surface hover:bg-primary/10 hover:text-primary rounded-xl border border-border text-text transition-colors"
                        title="Edit Title, Description & Frame Size"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      {/* Featured Toggle */}
                      <button
                        onClick={() => toggleFeatured(img)}
                        disabled={updateMutation.isPending}
                        className={`p-2 rounded-xl transition-all border ${
                          img.featured
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : 'bg-surface text-muted border-border hover:text-amber-400'
                        }`}
                        title={img.featured ? 'Featured' : 'Mark as Featured'}
                      >
                        <Star className={`w-4 h-4 ${img.featured ? 'fill-amber-400' : ''}`} />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => setDeleteItem(img)}
                        className="p-2 bg-card hover:bg-error/10 text-muted hover:text-error rounded-xl border border-border transition-colors"
                        title="Delete item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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

      {/* Edit Photo / Video Modal */}
      <Modal
        open={!!editingItem}
        onClose={() => setEditingItem(null)}
        title={`Edit ${editingItem?.mediaType === 'video' ? 'Video' : 'Photo'} Details`}
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Title / Name *"
            placeholder="e.g. Hackathon Demo Presentation"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold text-text mb-1">
              Description / About Photo or Video
            </label>
            <textarea
              rows={3}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Provide context or details about this photo/video..."
              className="w-full px-4 py-2.5 text-sm bg-surface border border-border rounded-xl text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              options={CATEGORIES}
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value as GalleryCategory)}
            />

            <Select
              label="Display Frame Size (Grid Columns)"
              options={FRAME_OPTIONS}
              value={String(editGridSpan)}
              onChange={(e) => setEditGridSpan(Number(e.target.value))}
            />
          </div>

          <Select
            label="Aspect Ratio Frame"
            options={ASPECT_OPTIONS}
            value={editAspectRatio}
            onChange={(e) => setEditAspectRatio(e.target.value as any)}
          />

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-text cursor-pointer">
              <input
                type="checkbox"
                checked={editPublished}
                onChange={(e) => setEditPublished(e.target.checked)}
                className="w-4 h-4 accent-primary rounded"
              />
              Show on Portfolio (Published)
            </label>

            <label className="flex items-center gap-2 text-sm font-semibold text-text cursor-pointer">
              <input
                type="checkbox"
                checked={editFeatured}
                onChange={(e) => setEditFeatured(e.target.checked)}
                className="w-4 h-4 accent-primary rounded"
              />
              Featured Media
            </label>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button variant="secondary" onClick={() => setEditingItem(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              loading={updateMutation.isPending}
              icon={<CheckCircle className="w-4 h-4" />}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Video Link Modal */}
      <Modal
        open={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        title="Add Video Link"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Video Title / Name *"
            placeholder="e.g. Hackathon Demo Video"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
          />

          <Input
            label="Video URL / Embed Link *"
            placeholder="e.g. https://www.youtube.com/watch?v=... or direct MP4 URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold text-text mb-1">
              About Video (Description)
            </label>
            <textarea
              rows={3}
              value={videoDescription}
              onChange={(e) => setVideoDescription(e.target.value)}
              placeholder="Tell visitors about this video..."
              className="w-full px-4 py-2.5 text-sm bg-surface border border-border rounded-xl text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              options={CATEGORIES}
              value={videoCategory}
              onChange={(e) => setVideoCategory(e.target.value as GalleryCategory)}
            />

            <Select
              label="Display Frame Size"
              options={FRAME_OPTIONS}
              value={String(videoGridSpan)}
              onChange={(e) => setVideoGridSpan(Number(e.target.value))}
            />
          </div>

          <div className="flex gap-3 justify-end pt-3 border-t border-border">
            <Button variant="secondary" onClick={() => setShowVideoModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddVideoUrl}
              loading={createMutation.isPending}
              icon={<Video className="w-4 h-4" />}
            >
              Add Video
            </Button>
          </div>
        </div>
      </Modal>

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
        title="Delete Photo/Video?"
        description={`Are you sure you want to delete "${deleteItem?.title || 'this item'}"?`}
      />
    </div>
  );
}