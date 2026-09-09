import { apiClient } from './client';
import type { ApiResponse, SiteSettings } from '../types';

export const settingsApi = {
  get: () =>
    apiClient.get<ApiResponse<SiteSettings | null>>('/settings').then((r) => r.data),

  update: (data: Partial<SiteSettings>) =>
    apiClient.put<ApiResponse<SiteSettings>>('/settings', data).then((r) => r.data),
};
