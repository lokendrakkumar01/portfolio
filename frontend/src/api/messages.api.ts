import { apiClient } from './client';
import type { ApiResponse, PaginatedResponse, ContactMessage, MessageStatus } from '../types';

export const messagesApi = {
  getAll: (params: { page?: number; limit?: number; status?: MessageStatus } = {}) =>
    apiClient.get<PaginatedResponse<ContactMessage>>('/messages', { params }).then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<ApiResponse<ContactMessage>>(`/messages/${id}`).then((r) => r.data),

  updateStatus: (id: string, status: MessageStatus) =>
    apiClient.put<ApiResponse<ContactMessage>>(`/messages/${id}/status`, { status }).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/messages/${id}`).then((r) => r.data),
};
