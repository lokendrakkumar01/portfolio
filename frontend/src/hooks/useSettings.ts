import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { settingsApi } from '../api/settings.api';
import { getErrorMessage } from '../api/client';
import type { SiteSettings } from '../types';

export const SETTINGS_KEY = ['settings'] as const;

export const useSettings = () =>
  useQuery({ queryKey: SETTINGS_KEY, queryFn: settingsApi.get, staleTime: 10 * 60 * 1000 });

export const useUpdateSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SiteSettings>) => settingsApi.update(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: SETTINGS_KEY }); toast.success('Settings saved'); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};
