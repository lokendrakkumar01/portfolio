import { apiClient } from './client';
import type { ApiResponse, Experience } from '../types';

export const experienceApi = {
  getAll: () =>
    apiClient.get<ApiResponse<Experience[]>>('/experience').then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Experience>>(`/experience/${id}`).then((r) => r.data),

  create: (data: Partial<Experience>) =>
    apiClient.post<ApiResponse<Experience>>('/experience', data).then((r) => r.data),

  update: (id: string, data: Partial<Experience>) =>
    apiClient.put<ApiResponse<Experience>>(`/experience/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/experience/${id}`).then((r) => r.data),

  uploadLogo: (id: string, file: File) => {
    const fd = new FormData();
    fd.append('image', file);
    return apiClient
      .post<ApiResponse<Experience>>(`/experience/${id}/logo`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
};
