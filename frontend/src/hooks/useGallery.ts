import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { galleryApi, type GetGalleryParams } from '../api/gallery.api';
import { getErrorMessage } from '../api/client';
import type { GalleryItem } from '../types';

export const GALLERY_KEY = 'gallery';

export const useGallery = (params: GetGalleryParams = {}) =>
  useQuery({
    queryKey: [GALLERY_KEY, params],
    queryFn: () => galleryApi.getAll(params),
    staleTime: 30 * 1000,
  });

export const useDeleteGalleryItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: galleryApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [GALLERY_KEY] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Image deleted successfully');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

export const useUpdateGalleryItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<GalleryItem> }) => galleryApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: [GALLERY_KEY] });
      const previousData = qc.getQueriesData({ queryKey: [GALLERY_KEY] });
      qc.setQueriesData({ queryKey: [GALLERY_KEY] }, (old: any) => {
        if (!old) return old;
        if (Array.isArray(old)) {
          return old.map((item: GalleryItem) => (item._id === id ? { ...item, ...data } : item));
        }
        if (old.data && Array.isArray(old.data)) {
          return {
            ...old,
            data: old.data.map((item: GalleryItem) => (item._id === id ? { ...item, ...data } : item)),
          };
        }
        return old;
      });
      return { previousData };
    },
    onError: (err, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          qc.setQueryData(queryKey, data);
        });
      }
      toast.error(getErrorMessage(err));
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: [GALLERY_KEY] });
      qc.invalidateQueries({ queryKey: ['stats'] });
    },
  });
};

export const useCreateGalleryItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data, file }: { data: Partial<GalleryItem>; file?: File }) => galleryApi.create(data, file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [GALLERY_KEY] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Gallery item created successfully');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

export const useBulkUploadGallery = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ files, category }: { files: File[]; category: string }) =>
      galleryApi.bulkUpload(files, category),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: [GALLERY_KEY] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      toast.success(`${res.data?.length ?? 'Images'} uploaded successfully`);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};
