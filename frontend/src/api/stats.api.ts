import { apiClient } from './client';
import type { ApiResponse, Stats } from '../types';

export const statsApi = {
  get: () =>
    apiClient.get<ApiResponse<Stats>>('/stats').then((r) => r.data),
};
