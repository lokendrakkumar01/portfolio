import { useQuery } from '@tanstack/react-query';
import { statsApi } from '../api/stats.api';

export const STATS_KEY = ['stats'] as const;

export const useStats = () =>
  useQuery({ queryKey: STATS_KEY, queryFn: statsApi.get, staleTime: 2 * 60 * 1000 });
