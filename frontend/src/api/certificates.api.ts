import { apiClient } from './client';
import type { ApiResponse, PaginatedResponse, Certificate } from '../types';

export interface GetCertificatesParams {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  year?: number;
  featured?: boolean;
}

export const certificatesApi = {
  getAll: (params: GetCertificatesParams = {}) =>
    apiClient.get<PaginatedResponse<Certificate>>('/certificates', { params }).then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Certificate>>(`/certificates/${id}`).then((r) => r.data),

  create: (data: Partial<Certificate>) =>
    apiClient.post<ApiResponse<Certificate>>('/certificates', data).then((r) => r.data),

  update: (id: string, data: Partial<Certificate>) =>
    apiClient.put<ApiResponse<Certificate>>(`/certificates/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/certificates/${id}`).then((r) => r.data),

  uploadFiles: (id: string, image?: File, pdf?: File) => {
    const fd = new FormData();
    if (image) fd.append('image', image);
    if (pdf) fd.append('pdf', pdf);
    return apiClient
      .post<ApiResponse<Certificate>>(`/certificates/${id}/files`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
};
