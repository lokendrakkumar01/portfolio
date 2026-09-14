import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { settingsApi } from '../api/settings.api';
import { getErrorMessage } from '../api/client';
import type { SiteSettings } from '../types';
import { INITIAL_SETTINGS, getCached, setCached } from '../data/initialPortfolioData';

export const SETTINGS_KEY = ['settings'] as const;

export const useSettings = () =>
  useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: async () => {
      const res = await settingsApi.get();
      if (res?.data) setCached('portfolio_settings', res.data);
      return res;
    },
    initialData: () => ({
      success: true,
      message: 'Cached',
      data: getCached('portfolio_settings', INITIAL_SETTINGS),
    }),
    staleTime: 10 * 60 * 1000,
  });

export const useUpdateSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SiteSettings>) => settingsApi.update(data),
    onSuccess: (res) => {
      if (res?.data) setCached('portfolio_settings', res.data);
      qc.invalidateQueries({ queryKey: SETTINGS_KEY });
      toast.success('Settings saved');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};
