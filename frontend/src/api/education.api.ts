import { apiClient } from './client';
import type { ApiResponse, Education } from '../types';

export const educationApi = {
  getAll: () =>
    apiClient.get<ApiResponse<Education[]>>('/education').then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Education>>(`/education/${id}`).then((r) => r.data),

  create: (data: Partial<Education>) =>
    apiClient.post<ApiResponse<Education>>('/education', data).then((r) => r.data),

  update: (id: string, data: Partial<Education>) =>
    apiClient.put<ApiResponse<Education>>(`/education/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/education/${id}`).then((r) => r.data),

  uploadLogo: (id: string, file: File) => {
    const fd = new FormData();
    fd.append('image', file);
    return apiClient
      .post<ApiResponse<Education>>(`/education/${id}/logo`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
};
