import { apiClient } from './client';
import type { ApiResponse } from '../types';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const contactApi = {
  submit: (data: ContactFormData) =>
    apiClient.post<ApiResponse<null>>('/contact', data).then((r) => r.data),
};
