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
    staleTime: 5 * 60 * 1000,
  });

export const useDeleteGalleryItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: galleryApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: [GALLERY_KEY] }); toast.success('Image deleted'); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

export const useUpdateGalleryItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<GalleryItem> }) => galleryApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [GALLERY_KEY] }); toast.success('Image updated'); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

export const useCreateGalleryItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data, file }: { data: Partial<GalleryItem>; file: File }) => galleryApi.create(data, file),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [GALLERY_KEY] }); toast.success('Image uploaded'); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};
