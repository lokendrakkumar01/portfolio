import { apiClient } from './client';
import type { ApiResponse, SocialLink } from '../types';

export const socialLinksApi = {
  getAll: () =>
    apiClient.get<ApiResponse<SocialLink[]>>('/social-links').then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<ApiResponse<SocialLink>>(`/social-links/${id}`).then((r) => r.data),

  create: (data: Partial<SocialLink>) =>
    apiClient.post<ApiResponse<SocialLink>>('/social-links', data).then((r) => r.data),

  update: (id: string, data: Partial<SocialLink>) =>
    apiClient.put<ApiResponse<SocialLink>>(`/social-links/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/social-links/${id}`).then((r) => r.data),
};
