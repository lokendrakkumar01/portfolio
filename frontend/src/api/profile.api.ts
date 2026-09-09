import { apiClient } from './client';
import type { ApiResponse, Profile } from '../types';

export const profileApi = {
  get: () =>
    apiClient.get<ApiResponse<Profile | null>>('/profile').then((r) => r.data),

  update: (data: Partial<Profile>) =>
    apiClient.put<ApiResponse<Profile>>('/profile', data).then((r) => r.data),

  uploadImage: (file: File) => {
    const fd = new FormData();
    fd.append('image', file);
    return apiClient
      .post<ApiResponse<Profile>>('/profile/image', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
};
