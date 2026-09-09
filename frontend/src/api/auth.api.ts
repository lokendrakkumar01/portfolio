import { apiClient } from './client';
import type { ApiResponse, AuthUser } from '../types';

interface LoginResponse {
  token: string;
  user: AuthUser;
}

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<ApiResponse<LoginResponse>>('/auth/login', { email, password }).then((r) => r.data),

  logout: () =>
    apiClient.get<ApiResponse<null>>('/auth/logout').then((r) => r.data),

  getMe: () =>
    apiClient.get<ApiResponse<AuthUser>>('/auth/me').then((r) => r.data),
};
