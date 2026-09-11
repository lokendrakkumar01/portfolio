import { apiClient } from './client';
import type { ApiResponse, PaginatedResponse, GalleryItem } from '../types';

export interface GetGalleryParams {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  published?: 'true' | 'false' | 'all';
}

export const galleryApi = {
  getAll: (params: GetGalleryParams = {}) =>
    apiClient.get<PaginatedResponse<GalleryItem>>('/gallery', { params }).then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<ApiResponse<GalleryItem>>(`/gallery/${id}`).then((r) => r.data),

  create: (data: Partial<GalleryItem>, file?: File) => {
    const fd = new FormData();
    if (file) {
      fd.append('image', file);
    }
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, String(v));
    });
    return apiClient
      .post<ApiResponse<GalleryItem>>('/gallery', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 300000, // 5 minutes timeout for large video/photo uploads
      })
      .then((r) => r.data);
  },

  update: (id: string, data: Partial<GalleryItem>) =>
    apiClient.put<ApiResponse<GalleryItem>>(`/gallery/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/gallery/${id}`).then((r) => r.data),

  bulkUpload: (files: File[], category: string) => {
    const fd = new FormData();
    files.forEach((f) => fd.append('images', f));
    fd.append('category', category);
    return apiClient
      .post<ApiResponse<GalleryItem[]>>('/gallery/bulk', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 300000, // 5 minutes timeout for bulk video/photo uploads
      })
      .then((r) => r.data);
  },
};
