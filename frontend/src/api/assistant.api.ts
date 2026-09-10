import { apiClient } from './client';
import type { ApiResponse } from '../types';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

interface ChatResponse {
  reply: string;
}

export const assistantApi = {
  chat: (message: string, history: ChatMessage[] = []) =>
    apiClient.post<ApiResponse<ChatResponse>>('/assistant/chat', { message, history }).then(r => r.data),
};
