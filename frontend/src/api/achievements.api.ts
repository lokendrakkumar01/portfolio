import { apiClient } from './client';
import type { ApiResponse, PaginatedResponse, Achievement } from '../types';

export interface GetAchievementsParams {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  featured?: boolean;
}

export const achievementsApi = {
  getAll: (params: GetAchievementsParams = {}) =>
    apiClient.get<PaginatedResponse<Achievement>>('/achievements', { params }).then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Achievement>>(`/achievements/${id}`).then((r) => r.data),

  create: (data: Partial<Achievement>) =>
    apiClient.post<ApiResponse<Achievement>>('/achievements', data).then((r) => r.data),

  update: (id: string, data: Partial<Achievement>) =>
    apiClient.put<ApiResponse<Achievement>>(`/achievements/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/achievements/${id}`).then((r) => r.data),

  uploadImage: (id: string, file: File) => {
    const fd = new FormData();
    fd.append('image', file);
    return apiClient
      .post<ApiResponse<Achievement>>(`/achievements/${id}/image`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
};
