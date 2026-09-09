import { apiClient } from './client';
import type { ApiResponse, PaginatedResponse, Project } from '../types';

export interface GetProjectsParams {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  status?: string;
  featured?: boolean;
}

export const projectsApi = {
  getAll: (params: GetProjectsParams = {}) =>
    apiClient.get<PaginatedResponse<Project>>('/projects', { params }).then((r) => r.data),

  getBySlug: (slug: string) =>
    apiClient.get<ApiResponse<Project>>(`/projects/slug/${slug}`).then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Project>>(`/projects/${id}`).then((r) => r.data),

  create: (data: Partial<Project>) =>
    apiClient.post<ApiResponse<Project>>('/projects', data).then((r) => r.data),

  update: (id: string, data: Partial<Project>) =>
    apiClient.put<ApiResponse<Project>>(`/projects/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/projects/${id}`).then((r) => r.data),

  uploadCover: (id: string, file: File) => {
    const fd = new FormData();
    fd.append('image', file);
    return apiClient
      .post<ApiResponse<Project>>(`/projects/${id}/cover`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },

  addScreenshot: (id: string, file: File, caption?: string) => {
    const fd = new FormData();
    fd.append('image', file);
    if (caption) fd.append('caption', caption);
    return apiClient
      .post<ApiResponse<Project>>(`/projects/${id}/screenshots`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },

  deleteScreenshot: (projectId: string, screenshotId: string) =>
    apiClient
      .delete<ApiResponse<Project>>(`/projects/${projectId}/screenshots/${screenshotId}`)
      .then((r) => r.data),
};
