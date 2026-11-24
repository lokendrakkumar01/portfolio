import { apiClient } from './client';

export type VisitorCategory = 'Mobile' | 'Tablet' | 'Desktop';

export interface VisitorPageView {
  path: string;
  referrer?: string;
  visitedAt: string;
}

export interface VisitorSession {
  _id: string;
  visitorId: string;
  sessionId: string;
  brand: string;
  model: string;
  modelIdentifier?: string;
  category: VisitorCategory;
  os: string;
  osVersion: string;
  browser: string;
  browserVersion: string;
  platform: string;
  approximateLocation: string;
  screenWidth?: number;
  screenHeight?: number;
  viewportWidth?: number;
  viewportHeight?: number;
  language: string;
  pageViews: VisitorPageView[];
  pageViewCount: number;
  firstVisitedAt: string;
  lastVisitedAt: string;
}

export interface VisitorFilters {
  brand?: string;
  category?: VisitorCategory | '';
  os?: string;
  browser?: string;
  page?: number;
  limit?: number;
}

export interface VisitorSessionsResult {
  items: VisitorSession[];
  filters: { brands: string[]; operatingSystems: string[]; browsers: string[] };
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export const analyticsApi = {
  list: (params: VisitorFilters) =>
    apiClient.get<{ success: boolean; message: string; data: VisitorSessionsResult }>('/analytics', { params }).then((response) => response.data),
};

export interface VisitorCollection {
  visitorId: string;
  sessionId: string;
  path: string;
  referrer: string;
  language: string;
  screenWidth?: number;
  screenHeight?: number;
  viewportWidth?: number;
  viewportHeight?: number;
  clientHints: {
    platform?: string;
    platformVersion?: string;
    model?: string;
    mobile?: boolean;
    brands?: Array<{ brand: string; version: string }>;
  };
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api/v1';

export async function collectVisitorPageView(data: VisitorCollection) {
  try {
    await fetch(`${API_BASE_URL}/analytics/collect`, {
      method: 'POST',
      credentials: 'omit',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      keepalive: true,
    });
  } catch {
    // Analytics is best-effort and must never interfere with portfolio navigation.
  }
}
