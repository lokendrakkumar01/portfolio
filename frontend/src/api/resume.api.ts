import { apiClient } from './client';
import type { ApiResponse, Resume } from '../types';

export const resumeApi = {
  getAll: () =>
    apiClient.get<ApiResponse<Resume[]>>('/resume').then((r) => r.data),

  getCurrent: () =>
    apiClient.get<ApiResponse<Resume | null>>('/resume/current').then((r) => r.data),

  upload: (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return apiClient
      .post<ApiResponse<Resume>>('/resume', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },

  setCurrent: (id: string) =>
    apiClient.put<ApiResponse<Resume>>(`/resume/${id}/current`).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/resume/${id}`).then((r) => r.data),
};
