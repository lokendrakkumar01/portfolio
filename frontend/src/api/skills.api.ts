import { apiClient } from './client';
import type { ApiResponse, PaginatedResponse, Skill } from '../types';

export interface GetSkillsParams {
  category?: string;
  featured?: boolean;
  q?: string;
}

export const skillsApi = {
  getAll: (params: GetSkillsParams = {}) =>
    apiClient.get<ApiResponse<Skill[]>>('/skills', { params }).then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Skill>>(`/skills/${id}`).then((r) => r.data),

  create: (data: Partial<Skill>) =>
    apiClient.post<ApiResponse<Skill>>('/skills', data).then((r) => r.data),

  update: (id: string, data: Partial<Skill>) =>
    apiClient.put<ApiResponse<Skill>>(`/skills/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/skills/${id}`).then((r) => r.data),

  reorder: (items: Array<{ id: string; displayOrder: number }>) =>
    apiClient.put<ApiResponse<null>>('/skills/reorder', { items }).then((r) => r.data),
};

// suppress unused import warning
export type { PaginatedResponse };
