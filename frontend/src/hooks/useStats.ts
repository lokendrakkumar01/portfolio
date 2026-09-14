import { useQuery } from '@tanstack/react-query';
import { statsApi } from '../api/stats.api';
import { INITIAL_STATS, getCached, setCached } from '../data/initialPortfolioData';

export const STATS_KEY = ['stats'] as const;

export const useStats = () =>
  useQuery({
    queryKey: STATS_KEY,
    queryFn: async () => {
      const res = await statsApi.get();
      if (res?.data) setCached('portfolio_stats', res.data);
      return res;
    },
    initialData: () => ({
      success: true,
      message: 'Cached',
      data: getCached('portfolio_stats', INITIAL_STATS),
    }),
    staleTime: 5 * 60 * 1000,
  });

